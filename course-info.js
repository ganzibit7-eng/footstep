/* Public course facts. Source check means document review, not an on-site inspection. */
(function(root){
  'use strict';
  const SOURCES = {
    'gocamping.or.kr':'한국관광공사 고캠핑',
    'www.gocamping.or.kr':'한국관광공사 고캠핑',
    'gil.seoul.go.kr':'서울시',
    'www.durunubi.kr':'한국관광공사 두루누비',
    'durunubi.kr':'한국관광공사 두루누비',
    'korean.visitkorea.or.kr':'한국관광공사',
    'sjfmc.or.kr':'세종시설관리공단',
    'www.suwon.go.kr':'수원시',
    'www.visitbusan.net':'부산시 관광 안내',
    'visitbusan.net':'부산시 관광 안내'
  };
  function trustedURL(description,field,hosts){
    const match=String(description||'').match(new RegExp(field+':\\s*(https:\\/\\/[^\\s]+)','i'));
    if(!match)return '';
    try{const u=new URL(match[1]);return u.protocol==='https:'&&!u.username&&!u.password&&hosts.includes(u.hostname)?u.href:'';}catch{return '';}
  }
  function sourceURL(description){return trustedURL(description,'공식안내',Object.keys(SOURCES));}
  function mapURL(description){return sourceURL(description)?trustedURL(description,'공식지도',['map.seoul.go.kr']):'';}
  function checkedDate(description){
    if(!sourceURL(description))return '';
    const value=String(description||'').match(/확인일:\s*(\d{4}-\d{2}-\d{2})/)?.[1];
    if(!value)return '';
    const date=new Date(value+'T00:00:00Z');
    return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value?value:'';
  }
  function provider(description){const url=sourceURL(description);return url?SOURCES[new URL(url).hostname]:'';}
  function cleanDescription(description){
    const raw=String(description||'');
    return sourceURL(raw)?raw.replace(/\s*(?:·\s*)?(?:공식안내|확인일|공식소요|공식지도|위치출처):[\s\S]*$/,'').trim():raw;
  }
  function officialMinutes(description){
    if(!sourceURL(description))return null;
    const value=String(description||'').match(/공식소요:\s*(\d+)\s*분/)?.[1];
    const n=value?Number(value):null;
    return Number.isFinite(n)&&n>0&&n<=1440?n:null;
  }
  function walkTime(description,distance){
    const official=officialMinutes(description);
    if(official!==null)return {minutes:official,official:true};
    const raw=String(distance||'').toLowerCase().replaceAll(',','');
    const value=raw.match(/(\d+(?:\.\d+)?)/);
    const km=value?Number(value[1])*(raw.includes('m')&&!raw.includes('km')?0.001:1):null;
    return {minutes:Number.isFinite(km)&&km>0?Math.max(5,Math.round(km/4*60)):null,official:false};
  }
  function cardTitle(course){
    const original=String(course?.name||'이름 없는 코스').trim();
    // Display only: never mutate the canonical name used by search and photo matching.
    let title=original.replace(/^(?:서울특별시|서울|부산광역시|부산|대구광역시|대구|울산광역시|울산)\s+/, '');
    const partial=/\s*(?:\(공식 GPX 제공 구간\)|GPX (?:선택 )?구간)\s*$/.test(title);
    title=title.replace(/\s*(?:\(공식 GPX 제공 구간\)|GPX (?:선택 )?구간)\s*$/, '').replace(/보행로 산책 코스$/, '보행로');
    return {title:title||original,partial,extent:partial?'제공 구간 '+String(course.distance||'').trim():''};
  }
  const api=Object.freeze({sourceURL,mapURL,checkedDate,provider,cleanDescription,officialMinutes,walkTime,cardTitle});
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.CourseInfo=api;
})(typeof globalThis!=='undefined'?globalThis:this);
