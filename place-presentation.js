(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.PlacePresentation=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const unknown=value=>!value||/^(?:미확인|정보\s*없음|공개 연락처 미등록|-)\s*(?:[·.]|$)/.test(String(value));
 // A partition is lossless. Formatting never supplies a missing rule or drops an exception.
 function partition(source,cuts){
  const points=[0,...new Set(cuts.filter(n=>n>0&&n<source.length)),source.length].sort((a,b)=>a-b);
  const parts=points.slice(0,-1).map((start,i)=>({start,end:points[i+1],raw:source.slice(start,points[i+1])}));
  if(parts.map(p=>p.raw).join('')!==source)throw Error('Source partition changed');return parts;
 }
 function structure(value){
  const source=String(value||''),sites=[...source.matchAll(/[-•]?\s*(\d+\s*(?:[~～–-]\s*\d+)?번(?:\([^)]*\))?\s*[:：])/g)];
  if(sites.length>=2&&/사이트/.test(source)){
   const cuts=sites.map(m=>m.index);for(const m of source.matchAll(/[＊*](?=\s*[가-힣])/g))cuts.push(m.index);
   const parts=partition(source,cuts).map(p=>{const m=p.raw.match(/^[-•]?\s*(\d+\s*(?:[~～–-]\s*\d+)?번(?:\([^)]*\))?\s*)[:：]([\s\S]*)$/);return {...p,kind:m?'site':/^[＊*]/.test(p.raw)?'notice':'intro',label:m?.[1].trim(),body:m?.[2].trim()};});
   return {kind:'sites',source,parts};
  }
  const schedules=groupedTimes(source);if(schedules)return {kind:'schedules',source,parts:schedules};
  // Only explicit, top-level slash/newline separators are interpreted as separate items.
  let depth=0;const cuts=[];for(let i=0;i<source.length;i++){if(source[i]==='(')depth++;if(source[i]===')')depth=Math.max(0,depth-1);if(!depth&&(source[i]==='\n'||source[i]==='/'&&/\s/.test(source[i-1]||'')&&/\s/.test(source[i+1]||'')))cuts.push(i);}
  return {kind:cuts.length?'items':'text',source,parts:partition(source,cuts).map(p=>({...p,kind:'text'}))};
 }
 function times(value){
  const source=String(value||''),m=source.match(/^\s*[-·]?\s*(입실|체크인)\s*[:：]?\s*((?:[01]?\d|2[0-3]):[0-5]\d)\s*[-/·]\s*(퇴실|체크아웃)\s*[:：]?\s*((?:[01]?\d|2[0-3]):[0-5]\d)\s*$/);
  return m?{source,rows:[{label:'입실 시간',value:m[2]},{label:'퇴실 시간',value:m[4]}]}:null;
 }
 function visitRows(rows){return rows.flatMap(r=>r.label==='운영시간'&&times(r.value)?times(r.value).rows:[r]);}
 // A bracketed facility label must have a complete, unambiguous time pair.
 // Any unparsed text keeps the entire original field in its original form.
 function groupedTimes(source){
  const markers=[...source.matchAll(/\s*\[([^\[\]]+)\]/g)];if(!markers.length||source.slice(0,markers[0].index).trim())return null;
  const time='(?:[01]?\\d|2[0-3]):[0-5]\\d',range=time+'(?:\\s*[~～–]\\s*'+time+')?';
  const pattern=new RegExp('^\\s*[-·]?\\s*(?:입실(?:시간)?|체크인)\\s*[:：]?\\s*('+range+')\\s*[-/·]\\s*(?:퇴실(?:시간)?|체크아웃)\\s*[:：]?\\s*('+range+')\\s*$');
  const parts=partition(source,markers.map(m=>m.index));
  for(let i=0;i<parts.length;i++){const marker=markers[i],body=parts[i].raw.slice(marker[0].length),match=body.match(pattern);if(!match)return null;Object.assign(parts[i],{kind:'schedule',label:marker[1],checkin:match[1],checkout:match[2]});}
  return parts;
 }
 // Interpret only literal field labels at an explicit middle-dot/newline boundary.
 // Unlabelled prefixes stay visible as registration prose, never as an access rule.
 const labels={'운영':'운영시간','운영시간':'운영시간','주의':'방문·이용 안내','동반':'허용 구역·제한','동반 안내':'허용 구역·제한','동반안내':'허용 구역·제한','주소':'주소','전화':'문의처','문의':'문의처','주차':'주차'};
 function explicitFields(value){
  const source=String(value||''),matches=[...source.matchAll(/(?:^|\s*[·\n]\s*)(운영시간|운영|주의|동반\s*안내|동반|주소|전화|문의|주차)\s*[:：]\s*/g)];
  if(!matches.length)return {source,parts:[{raw:source,start:0,end:source.length,body:source}],labelled:false};
  const parts=partition(source,matches.map(m=>m.index)).map(p=>{
   const m=matches.find(m=>m.index===p.start);return {...p,label:m?labels[m[1].replace(/\s+/g,' ')]:null,body:m?p.raw.slice(m[0].length).trim():p.raw.trim()};
  });
  return {source,parts,labelled:true};
 }
 function fields(rows){return rows.flatMap(row=>{
  const result=explicitFields(row.value);if(!result.labelled)return [row];
  return result.parts.filter(p=>p.body).map(p=>({...row,label:p.label||'등록 안내',value:p.body,source:row.source||String(row.value)}));
 });}
 // Use complete short fields only. A longer rule is linked to its full detail,
 // never sliced at a character limit or reduced to an isolated positive phrase.
 function summary(rows,{kind='',caution=false,limit=3}={}){
  if(caution)return [{label:'방문 전 확인',value:'출처별 안내가 달라 동반 조건 재확인이 필요합니다.'}];
  const out=[],add=(label,value,source)=>{if(out.length<limit&&!out.some(x=>x.value===value))out.push({label,value,...(source?{source}:{} )});};
  const normalized=visitRows(fields(rows));
  for(const re of [/견종·크기|체중/,/허용 구역|출입|방문·이용 안내/,/필수 준비물|목줄|이동장/,/운영시간|입실|퇴실/,/주차/,/구비시설|주요시설/]){
   for(const r of normalized.filter(r=>re.test(r.label)&&!unknown(r.value))){
    const value=String(r.value).trim();if(structure(value).kind==='sites'){add('사이트별 조건','사이트 구간마다 허용 조건이 달라요. 상세에서 확인해 주세요.',value);break;}
    if(value.length<=86&&!/\n/.test(value)&&!out.some(x=>x.value===value)){add(r.label,value,r.source||value);break;}
   }
  }
  if(!out.length)add(kind==='professional'?'방문 전 확인':'동반 조건',kind==='professional'?'진료·이용 조건과 운영시간은 업소에 확인해 주세요.':'세부 동반 조건은 미확인입니다. 방문 전에 문의해 주세요.');
  return out;
 }
 // Compact preview facts are separate from the original/detail representation.
 // Never split an access rule into a positive claim and a hidden exception.
 const boilerplate='*반려견 동반 운영 정책은 현지 사정에 따라 변동 될 수 있습니다.';
 function cardSummary(rows,{kind='',caution=false,limit=3}={}){
  if(caution)return [{label:'동반 조건',value:'현재 동반 조건 재확인 필요',derived:'conflict'}];
  const normalized=visitRows(fields(rows)),out=[],seen=new Set();let petKnown=false,pendingRule=null;
  const add=(row,value,label=row.label,derived)=>{if(!value||out.length>=limit||seen.has(value))return;seen.add(value);out.push({label,value,source:row.source||row.value,...(derived?{derived}:{} )});};
  const clean=value=>String(value).replace(boilerplate,'').trim().replace(/^[-•]\s*/,'').replace(/[,，]\s*기타$/,'').trim();
  for(const pattern of [/견종·크기|체중|마릿수/,/허용 구역|출입|방문·이용 안내/,/필수 준비물|목줄|이동장/,/운영시간|입실|퇴실/,/주차/,/구비시설|주요시설|캠핑장 유형/]){
   for(const row of normalized.filter(r=>pattern.test(r.label)&&!unknown(r.value))){
    const value=clean(row.value),structured=structure(value),pet=/견종·크기|체중|마릿수|허용 구역|출입|방문·이용 안내|필수 준비물|목줄|이동장/.test(row.label);
    if(!value)continue;
    // These provider notes repeat another field; they are not verified zones.
    if(/^(?:고캠핑 공식 안내:|공식 관광 소개의|공식 허용 조건 기준)/.test(value))continue;
    if(structured.kind==='sites'){add(row,'사이트별 허용 기준 확인','사이트별 조건', 'sites');petKnown=true;break;}
    if(structured.kind==='schedules'){add(row,'시설별 입실·퇴실 시간 확인','이용 시간','schedules');break;}
    if(/운영시간/.test(row.label)&&(/입실|퇴실/.test(value)||/\[[^\]]+\]/.test(value))){add(row,'시설별 이용 시간은 상세 확인','이용 시간','complex-hours');break;}
    if(/구비시설|주요시설/.test(row.label)&&(value.length>48||value.split(/[,，]/).length>2)){
     // Comma-delimited facility names may be selected as examples. Do not
     // reinterpret slash-separated names or prose containing exceptions.
     const names=value.split(/[,，]\s*/).filter(Boolean);
     if(names.length>1&&names.every(v=>v.length<=32&&!/[.!?\n]|불가|제외|단,|경우/.test(v))){const selected=names.slice(0,2).join(' · ');if(selected.length<=48)add(row,selected,'시설 일부','facility-sample');}
     break;
    }
    if(value.length<=54&&!/\n/.test(value)&&!/\]\s*-|필수-/.test(value)){
     if(/허용 구역/.test(row.label)&&out.some(r=>/견종·크기|체중/.test(r.label)&&value.includes(r.value.split(' · ')[0])))continue;
     add(row,value,row.label,value!==String(row.value).trim()?'cleaned':undefined);if(pet)petKnown=true;break;
    }
    if(pet){pendingRule={label:'추가 동반 수칙',value:'상세 확인',source:row.source||row.value,derived:'full-rule'};petKnown=true;break;}
   }
  }
  if(pendingRule&&!out.some(r=>r.derived==='sites')){if(out.length>=limit)out.pop();out.push(pendingRule);}
  if(!petKnown&&kind!=='professional'){
   if(out.length>=limit)out.pop();out.unshift({label:'동반 조건',value:'세부 기준 미확인',derived:'unconfirmed'});
  }
  return out.slice(0,limit);
 }
 return Object.freeze({structure,times,groupedTimes,visitRows,explicitFields,fields,summary,cardSummary,unknown});
});
