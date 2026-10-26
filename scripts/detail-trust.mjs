import Presentation from '../place-presentation.js';
const officialHosts=['data.go.kr','api.visitkorea.or.kr','korean.visitkorea.or.kr','gocamping.or.kr','localdata.go.kr','foodsafetykorea.go.kr','durunubi.kr','suwon.go.kr','seoul.go.kr','visitbusan.net'];
export function officialSource(href){try{const u=new URL(href);return u.protocol==='https:'&&!u.username&&!u.password&&officialHosts.some(h=>u.hostname===h||u.hostname.endsWith('.'+h));}catch{return false;}}
export function trustLabels(kind,rows=[],{links=[],dates=[],historical=false,now=Date.now(),conflict=false}={}){
 const labels=[];
 if(!['professional','amenity','course'].includes(kind)){
  const known=rows.some(r=>!Presentation.unknown(r.value)&&!/(?:미확인|미확정|확인 필요|재확인 필요)/.test(r.value));
  const unknown=rows.some(r=>Presentation.unknown(r.value)||/(?:미확인|미확정)/.test(r.value));
  labels.push(conflict?'동반 안내 상충 · 재확인 필요':known?(unknown?'동반 자료 · 일부 미확인':'동반 조건 자료 있음'):'세부 동반 조건 미확인');
 }
 if(links.some(officialSource))labels.push(kind==='professional'?'공공 등록 출처':'공식 출처 연결');
 const times=dates.flatMap(s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return [];const n=Date.parse(s+'T00:00:00Z');return Number.isFinite(n)&&n<=now&&new Date(n).toISOString().slice(0,10)===s?[n]:[];});
 if(historical)labels.push('과거 참고자료 포함');
 else if(!times.length)labels.push('자료 확인일 미상');
 else if(now-Math.max(...times)>180*86400000)labels.push('자료 대조 180일 경과');
 return labels.slice(0,3);
}
export const trustHTML=labels=>labels.length?'<div class="detail-trust" aria-label="정보 상태">'+labels.map(label=>'<span>'+label+'</span>').join(' ')+'</div>':'';
