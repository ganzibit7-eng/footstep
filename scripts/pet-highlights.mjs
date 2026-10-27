import Presentation from '../place-presentation.js';
// Presentation labels can be misleading when an upstream 'size' field contains
// only a permitted room. Classify explicit words; keep the exact value/source.
export function petHighlights(rows,{kind='place',limit=3}={}){
 const groups=new Map();
 for(const row of Presentation.cardSummary(rows,{kind,limit:20})){
  const v=String(row.value||'').trim();
  if(row.derived||!v||/미확인|미확정|문의|상세 확인|확인 필요|재확인|고캠핑 공식|공식 허용|공식 소개|공식 관광 소개/.test(v))continue;
  let concept='',label='';
  if(/견종|크기|체중|허용 구역|동반 구역/.test(row.label)&&/소형견|중형견|대형견|맹견|견종|체중|크기|전\s*견종|모든 반려견|\d\s*(?:kg|㎏|cm)/i.test(v)){concept='size';label='견종·크기 조건';}
  else if(/허용 구역|동반 구역|견종|크기/.test(row.label)&&/구역|테라스|실내|실외|객실|사이트|로비|마당|야외|공용|입장|출입/.test(v)){concept='scope';label='동반 가능한 공간';}
  else if(/준비물|목줄|이동장/.test(row.label)&&/목줄|리드줄|이동장|켄넬|케이지|매너벨트|배변|입마개|접종|등록/.test(v)){concept='preparation';label='준비·준수사항';}
  if(!concept)continue;
  const previous=groups.get(concept);
  if(!previous||v.length>previous.value.length)groups.set(concept,{...row,label,value:v,concept});
 }
 const order=kind==='숙소'||kind==='stay'?['size','scope','preparation']:['scope','size','preparation'];
 return order.map(key=>groups.get(key)).filter(Boolean).slice(0,limit);
}
