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
  // Only explicit, top-level slash/newline separators are interpreted as separate items.
  let depth=0;const cuts=[];for(let i=0;i<source.length;i++){if(source[i]==='(')depth++;if(source[i]===')')depth=Math.max(0,depth-1);if(!depth&&(source[i]==='\n'||source[i]==='/'&&/\s/.test(source[i-1]||'')&&/\s/.test(source[i+1]||'')))cuts.push(i);}
  return {kind:cuts.length?'items':'text',source,parts:partition(source,cuts).map(p=>({...p,kind:'text'}))};
 }
 function times(value){
  const source=String(value||''),m=source.match(/^\s*[-·]?\s*(입실|체크인)\s*[:：]?\s*((?:[01]?\d|2[0-3]):[0-5]\d)\s*[-/·]\s*(퇴실|체크아웃)\s*[:：]?\s*((?:[01]?\d|2[0-3]):[0-5]\d)\s*$/);
  return m?{source,rows:[{label:'입실 시간',value:m[2]},{label:'퇴실 시간',value:m[4]}]}:null;
 }
 function visitRows(rows){return rows.flatMap(r=>r.label==='운영시간'&&times(r.value)?times(r.value).rows:[r]);}
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
 return Object.freeze({structure,times,visitRows,explicitFields,fields,summary,unknown});
});
