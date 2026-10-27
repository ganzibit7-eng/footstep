import Photos from '../place-photos.js';
import Conditions from '../place-conditions.js';
import Evidence from '../place-evidence.js';
import {petHighlights} from './pet-highlights.mjs';
import {officialSource} from './detail-trust.mjs';
import {cardRecord,renderPlaceCard,esc} from './place-card.mjs';

// An editorial eligibility gate, never a popularity score or certification.
// Match the original identity and description through Evidence before using it.
export function curationEvidence(item,{now=Date.now()}={}){
 const record=Evidence.get(item),pet=Evidence.conditions(item),photo=Photos.get(item);
 const reasons=[];
 if(!record||!pet||!officialSource(record.source))reasons.push('공식 세부 동반 자료 부족');
 if(Evidence.caution(item))reasons.push('동반 안내 상충');
 if(!photo||!['Type1','Type3'].includes(photo.rightsType)||!photo.source||!photo.author||!photo.license||!photo.licenseUrl||photo.width<600||photo.height<400||photo.photoKind)reasons.push('선별용 실사진·이용 근거 부족');
 const checked=record?.petChecked||record?.checked||'',time=Date.parse(checked+'T00:00:00Z');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(checked)||!Number.isFinite(time)||new Date(time).toISOString().slice(0,10)!==checked||time>now||now-time>180*86400000)reasons.push('동반 자료 대조일 미상·180일 경과');
 const facts=petHighlights(Conditions.get(item),{kind:item.category});
 if(facts.length<2)reasons.push('명시적 핵심 동반 조건 2개 미만');
 return {eligible:!reasons.length,reasons,checked,facts:facts.slice(0,3),photo};
}
export function selectCurated(items,{now=Date.now(),limit=3}={}){
 const seen=new Set();
 return items.map(item=>({item,...curationEvidence(item,{now})})).filter(r=>r.eligible).sort((a,b)=>b.checked.localeCompare(a.checked)||a.item.name.localeCompare(b.item.name,'ko')||String(a.item.id).localeCompare(String(b.item.id))).filter(r=>{
  const identity=String(r.item.name).trim()+'\n'+String(r.item.address).trim();if(seen.has(identity))return false;seen.add(identity);return true;
 }).slice(0,limit);
}
export const curationCriteria='같은 장소로 연결된 공식 세부 동반 자료, 이용 근거가 있는 실제 사진(600×400px 이상), 공간·견종/크기·준비사항 중 2종류 이상 명시된 조건, 180일 이내 자료 대조일이 있는 곳을 소개합니다. 상충하는 안내가 있는 곳은 제외합니다. 자료 대조일이 최근인 순서, 같은 날짜는 이름순이며 유료 추천·인기순·현장 검증이 아닙니다. 당일 영업·출입 가능 여부와 나머지 조건은 방문 전에 확인해 주세요. 전체 목록의 장소는 제외하지 않습니다.';
export function curationSection(items,type,{target='hub-results',directory=false}={}){
 if(type.table!=='facilities')return '';
 const selected=selectCurated(items);if(!selected.length)return '';
 return '<section class="collection-curation" id="prepared-places" data-place-curation="quality11"'+(directory?' data-directory-curation':'')+' aria-label="자료로 살펴보는 장소"><div class="curation-heading"><p class="curation-eyebrow">방문 준비가 한결 쉬워지도록</p><h2>자료로 먼저 살펴볼 곳</h2><p>사진과 구체적인 동반 조건을 함께 비교해 보세요.</p><details class="curation-criteria"><summary>어떤 기준으로 골랐나요?</summary><p>'+curationCriteria+'</p></details><a class="curation-all" href="#'+target+'">전체 목록 보기 ↓</a></div><ul class="curation-cards">'+selected.map(r=>{
  const card={...cardRecord(r.item,type),facts:r.facts};
  return renderPlaceCard(card,{related:true,context:'동반 자료 대조 '+r.checked+' · 현장 확인 아님'}).replace('<li ','<li data-curation-item="'+esc(r.item.id)+'" ');
 }).join('')+'</ul></section>';
}
