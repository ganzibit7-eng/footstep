import {readFile,writeFile} from 'node:fs/promises';
import Info from '../course-info.js';
import Addresses from '../course-addresses.js';
import Photos from '../course-photos.js';
import path from 'node:path';
import Access from '../course-pet-access.js';
import {verifiedRoute} from './detail-editorial.mjs';

const plans=[
 {slug:'gyeonggi-lake-gpx-walks',title:'경기 호수 산책길: 공식 GPX 전체 경로와 호반 구간 비교',description:'산정호수·청계호수·호명호수의 등록 거리, 공식 GPX와 선택 구간, 반려견 동반 자료를 비교합니다. 주차·계단·현장 통제는 별도로 확인하세요.',ids:['c362','c363','c397'],intro:'포천·가평의 호수 산책길을 비교해 보세요. 전체 경로와 호반 일부 구간을 구분해 거리·동반 조건을 함께 확인할 수 있습니다.'},
 {slug:'incheon-gpx-dog-walks',title:'인천 반려견 산책 코스: 계양산·월미산 GPX 자료 비교',description:'인천둘레길 계양산·월미산 코스의 공식 GPX, 등록 거리·난이도, 동반 자료 확인 방법을 정리했습니다. 평지 시간 추정과 실제 보행 시간을 구분하세요.',ids:['c361','c432'],intro:'계양산과 월미산의 인천둘레길을 비교해 보세요. 서로 다른 두 코스의 거리·난이도와 동반 조건을 확인할 수 있습니다.'},
 {slug:'yeoju-yeogang-gpx-walks',title:'여주 여강길 반려견 산책: 강천섬길부터 긴 코스까지 비교',description:'여주 여강길 옛나루터길·강천섬길·왕터쌀길·부처울습지길의 공식 GPX와 등록 거리·난이도를 비교합니다. 왕복·귀가와 동반 조건은 상세에서 확인하세요.',ids:['c347','c344','c426','c342'],intro:'여주의 여강길 코스를 거리와 동반 조건으로 비교해 보세요. 개별 GPX의 출발·종료 지점과 귀가 동선을 상세에서 확인할 수 있습니다.'}
];
export async function evidenceGuides(root,courses,{updatedAt='2026-10-28'}={}){
 const byId=new Map(courses.map(c=>[String(c.id),c])),guides=[];
 for(const plan of plans){
  const selected=[];
  for(const id of plan.ids){
   const item=byId.get(id);if(!item)continue;
   const pet=Access.get(item);if(!pet)continue;
   const html=await readFile(path.join(root,'courses',id,'index.html'),'utf8');
   const route=verifiedRoute(id,html);if(!route)continue;
   selected.push({id,item,pet,route});
  }
  if(selected.length<2)continue;
  const faqs=regionalFAQs(plan.slug,selected);
  guides.push({...plan,updatedAt,courseIDs:selected.map(s=>s.id),region:plan.slug==='incheon-gpx-dog-walks'?'incheon':'gyeonggi',faqs,bodyHTML:renderRouteComparison(selected),sections:[],tips:['공식 GPX의 전체 경로와 선택 구간을 구분','출발 위치와 돌아올 이동수단을 상세에서 확인','계단·경사·쉼터 미확인을 없음으로 해석하지 않기','자료 확인일과 당일 현장 상태를 구분'],links:selected.flatMap(({id,item,pet,route})=>[[item.name+' 상세','/courses/'+id+'/'],[item.name+' 경로 원문',route.source],...(pet.source!==route.source?[[item.name+' 동반 자료',pet.source]]:[])])});
 }
 return guides;
}

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function guidePhoto(item){
 const photo=Photos.get(item);if(!photo)return '<p>연결된 장소 사진 없음</p>';
 const date=photo.dateNote||(/^\d{4}-\d{2}-\d{2}$/.test(photo.date||'')?photo.date+' 촬영':'촬영 시기 미상');
 const credit=Photos.credit(photo).replace(esc(Photos.dateLabel(photo)),esc(date));
 return `<figure class="curated-course-photo"><img src="${esc(photo.src)}" alt="${esc(photo.place+' · '+date)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" style="display:block;width:100%;height:auto;object-fit:contain"><figcaption>${credit}</figcaption></figure>`;
}
export function regionalFAQs(slug,selected){
 if(slug==='gyeonggi-lake-gpx-walks')return [
  ['호명호수의 표시 거리가 짧은 이유는 무엇인가요?',selected.some(s=>s.id==='c397')?'호명호수 항목은 경기 둘레길 가평 22코스의 호반 선택 구간입니다. 표시 거리는 전체 둘레길이나 접근·왕복 거리와 다릅니다. 상세의 경로와 출발 위치를 확인하세요.':'각 항목의 전체 경로·선택 구간 표기를 확인하세요. 선택 구간 거리는 접근과 왕복 이동을 포함하지 않습니다.'],
  ['세 호수를 한 번에 이어 걷는 코스인가요?','포천과 가평에 있는 별도의 코스입니다. 비교표는 후보를 고르기 위한 자료이며 코스 사이의 이동 경로나 연결 산책길을 안내하지 않습니다.']
 ];
 if(slug==='incheon-gpx-dog-walks')return [
  ['계양산과 월미산을 이어 걷는 안내인가요?','두 곳은 인천둘레길의 서로 다른 코스입니다. 각 상세에서 개별 GPX의 출발·종료 지점과 귀가 동선을 확인하세요. 두 코스를 잇는 경로는 제공하지 않습니다.'],
  ['비교표의 시간이 산길 실제 소요 시간인가요?','공식 안내 시간이 없으면 등록 거리를 시속 4km로 환산한 평지 예상 시간을 표시합니다. 경사·휴식·반려견의 속도를 반영한 실제 보행 시간은 아닙니다.']
 ];
 return [
  ['여강길 중 짧은 코스와 긴 코스를 어떻게 구분하나요?','등록 거리 열을 먼저 비교하고 개별 GPX 범위를 확인하세요. 같은 여강길이라는 이름만으로 난이도나 완주 시간을 같게 보지 마세요.'],
  ['여강길 코스를 걸은 뒤 출발점으로 바로 돌아올 수 있나요?','순환·편도 및 귀가 교통편을 이 가이드에서 일괄 확정하지 않았습니다. 개별 경로의 양 끝과 당일 이동수단을 확인하세요. 비교표의 거리에 귀가·접근 거리를 더했다고 해석하지 마세요.']
 ];
}
export function renderRouteComparison(selected){
 const entries=selected.map(s=>({...s,time:Info.walkTime(s.item.description,s.item.distance),address:Addresses.get(s.item)}));
 const duration=t=>t.minutes?`${t.official?'공식 안내':'평지 예상'} ${t.minutes}분`:'시간 미확인';
 const extent=r=>r.segment?'공식 GPX 선택 구간':'공식 GPX 전체 경로';
 const rows=entries.map(({id,item,pet,route,time})=>`<tr><th scope="row"><a href="#stop-${esc(id)}">${esc(item.name)}</a></th><td>${esc(item.distance||'미확인')}</td><td>${esc(duration(time))}</td><td>${esc(item.diff||'미확인')}</td><td>${extent(route)}</td><td>${esc(pet.checkedDate||'확인일 미상')}</td></tr>`).join('');
 const stops=entries.map(({id,item,pet,route,time,address})=>{
  const conditions=pet.conditions||{},point=route.parts?.[0]?.[0];
  const start=address?`${address.point||'출발 지점'} · ${address.address}`:point?`공식 GPX 첫 좌표 · ${point[0].toFixed(5)}, ${point[1].toFixed(5)} (주소 미확인)`:'출발 위치 미확인';
  const restrictions=String(conditions['동반 관련 상세정보']||'').split(/\s*[-•]\s+(?=[가-힣])/u).map(s=>s.trim()).filter(Boolean);
  return `<section class="route-stop" id="stop-${esc(id)}" data-guide-course="${esc(id)}"><h2>${esc(item.name)}</h2><p class="route-extent">${extent(route)}${route.segment?' · '+esc(route.segment):''}</p><div class="route-stop-layout"><div class="route-photo">${guidePhoto(item)}</div><div><dl class="route-facts"><div><dt>등록 거리</dt><dd>${esc(item.distance||'미확인')}</dd></div><div><dt>${time.official?'공식 안내 시간':'평지 예상 시간'}</dt><dd>${time.minutes?esc(time.minutes)+'분':'미확인'}</dd></div><div><dt>등록 난이도</dt><dd>${esc(item.diff||'미확인')}</dd></div><div class="route-start"><dt>출발 위치</dt><dd>${esc(start)}</dd></div></dl><h3>반려견 동반 조건</h3><p>${esc(conditions['동반구분']||'출입 범위 미확인')}</p><p>${esc(conditions['동반가능동물']||'견종·크기 세부 조건 미확인')} · ${esc(conditions['동반시 필요사항']||'준비물 세부 조건 미확인')}</p>${restrictions.length?'<ul>'+restrictions.map(r=>'<li>'+esc(r)+'</li>').join('')+'</ul>':''}<p class="route-date">동반 자료 대조일 ${esc(pet.checkedDate||'미상')} · 현장 방문일이 아닙니다.</p><a class="route-detail-link" href="/courses/${esc(id)}/">경로·주변 장소 자세히 보기 →</a></div></div><details class="route-evidence"><summary>동반 조건 원문과 자료 확인</summary><dl>${Object.entries(conditions).map(([label,value])=>'<dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd>').join('')}</dl><p><a href="${esc(route.source)}" target="_blank" rel="noopener noreferrer">공식 GPX 원문</a> · <a href="${esc(pet.source)}" target="_blank" rel="noopener noreferrer">반려견 동반 자료 원문</a></p></details></section>`;
 }).join('');
 return `<section aria-labelledby="route-comparison"><h2 id="route-comparison">코스 한눈에 비교</h2><p>표를 좌우로 넘겨 비교하세요. 시간은 공식 안내 또는 시속 4km 기준 평지 예상치입니다.</p><div class="route-comparison-scroll" role="region" aria-label="코스별 거리·시간·GPX 비교표" tabindex="0"><table><caption>등록 정보와 동반 자료 대조일</caption><thead><tr><th scope="col">코스</th><th scope="col">거리</th><th scope="col">시간</th><th scope="col">난이도</th><th scope="col">경로 범위</th><th scope="col">자료 대조일</th></tr></thead><tbody>${rows}</tbody></table></div></section>${stops}<p class="route-limit">등록 거리는 게시된 참고 거리입니다. 예상 시간에는 휴식·경사를 반영하지 않았습니다. 계단·경사·쉼터·주차·당일 통제의 미확인은 없음이나 이용 가능을 뜻하지 않습니다. 출발점과 접근·왕복·귀가 동선을 상세에서 다시 확인하세요.</p>`;
}
export async function publishEvidenceLinks(root,guides){
 const targets=new Map();
 for(const guide of guides.filter(g=>g.courseIDs))for(const file of [...guide.courseIDs.map(id=>'courses/'+id+'/index.html'),'with-dog/'+guide.region+'/index.html']){
  if(!targets.has(file))targets.set(file,[]);targets.get(file).push(guide);
 }
 let changed=0;
 for(const [file,links] of targets){
  const target=path.join(root,file),html=await readFile(target,'utf8');
  const clean=html.replace(/<!--route-guide-links:start-->[\s\S]*?<!--route-guide-links:end-->/g,'');
  const section='<!--route-guide-links:start--><section class="detail-section section" aria-labelledby="route-reading-title"><h2 id="route-reading-title">관련 코스 비교 가이드</h2><ul>'+links.map(g=>'<li><a href="/guides/'+esc(g.slug)+'/">'+esc(g.title)+'</a></li>').join('')+'</ul></section><!--route-guide-links:end-->';
  if(!clean.includes('</main>'))throw new Error('Guide link target has no main: '+file);
  const next=clean.replace('</main>',section+'</main>');
  if(next!==html){await writeFile(target,next,'utf8');changed++;}
 }
 return {covered:targets.size,changed};
}
