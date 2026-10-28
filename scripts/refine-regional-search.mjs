import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import Access from '../course-pet-access.js';
import {fragments,verifiedRoute} from './detail-editorial.mjs';
import {guidePhoto} from './route-evidence-guides.mjs';
import {generateRSS} from './generate-rss.mjs';
const SITE='https://balzaguk.com';
export const plans=[
 {slug:'seoul',label:'서울',ids:['c31','c133','c51'],topic:'도심 공원과 자락길 비교',intro:'서울숲·안산자락길·여의도 공원길을 비교해 보세요. 공식 안내 시간과 등록 거리, 실제로 제공되는 경로 자료의 범위를 나누어 확인합니다.',guides:['compare-dog-walk-courses','dog-walk-time'],faqs:[['서울의 공식 안내 시간이 실제 반려견 산책 기록인가요?','등록된 공식 안내 시간은 실제 반려견 동반 보행 기록이 아닙니다. 휴식과 반려견의 속도에 따라 달라집니다.'],['서울의 모든 코스에서 공식 GPX를 볼 수 있나요?','공식 안내가 연결된 것과 공식 GPX가 제공되는 것은 다릅니다. 비교표의 경로 구분과 상세의 자료 원문을 확인하세요.']]},
 {slug:'gyeonggi',label:'경기',ids:['c362','c397','c347'],topic:'포천·가평·여주의 호수와 강변',intro:'산정호수, 호명호수의 호반 구간, 여주 강천섬길을 비교합니다. 서로 다른 시·군에 있는 코스이므로 하나의 근거리 일정으로 연결하지 않습니다.',guides:['gyeonggi-lake-gpx-walks','yeoju-yeogang-gpx-walks'],faqs:[['호명호수의 짧은 표시 거리가 전체 둘레길인가요?','현재 항목은 경기 둘레길 가평 22코스의 호반 선택 구간입니다. 접근·왕복 거리나 전체 둘레길 거리와 구분하세요.'],['같은 경기 지역의 장소가 모두 산책길 근처인가요?','아닙니다. 포천·가평·여주는 서로 다른 시·군입니다. 아래 주변 장소는 개별 코스의 출발·등록 좌표를 기준으로 따로 표시합니다.']]},
 {slug:'incheon',label:'인천',ids:['c361','c432','pet_20261012c_37d64a6bc9ca'],topic:'둘레길과 반려동물놀이터 구분',intro:'계양산·월미산의 공식 GPX 코스와 인천대공원 반려동물놀이터 안내를 함께 살펴보세요. 산책 경로와 개별 시설의 입장 조건을 구분합니다.',guides:['incheon-gpx-dog-walks'],faqs:[['인천대공원 놀이터 안내가 공원 전체 산책 경로인가요?','개별 반려동물놀이터의 위치·입장 조건 안내입니다. 공원 전체의 경로나 반려견 출입 허용을 뜻하지 않습니다.'],['계양산과 월미산은 이어지는 한 코스인가요?','인천둘레길의 서로 다른 코스입니다. 각 GPX의 출발·종료 지점과 귀가 동선을 별도로 확인하세요.']]},
 {slug:'busan',label:'부산',ids:['c367','c394','pet_20261012_haeundae'],topic:'삼락 생태길과 절영 해안 구간',intro:'삼락 물억새길의 GPX, 절영해안의 제공 구간, 해운댕길 안내를 구분해 보세요. 같은 부산의 길이라도 코스 범위와 확인 가능한 이동 정보가 다릅니다.',guides:['compare-dog-walk-courses','dog-walk-checklist'],faqs:[['절영해안의 GPX 구간이 해안 산책로 전체인가요?','제공된 GPX 구간만 안내합니다. 상세의 경로 범위를 확인하고 전체 해안길의 거리로 해석하지 마세요.'],['해운댕길에도 검증된 전체 경로가 표시되나요?','공식 지정·동반 안내와 검증된 경로는 구분합니다. GPX가 확인되지 않은 항목에는 임의의 선이나 예상 완주 거리를 추가하지 않습니다.']]},
 {slug:'jeju',label:'제주',ids:['c395','c430','pet_20261012_hallim'],topic:'해안 GPX와 한림공원 동반 조건',intro:'송악산·닭머르해안길의 GPX 제공 범위와 한림공원의 반려견 체중 조건을 비교해 보세요. 개별 시설의 허용 조건을 제주 전체에 확대하지 않습니다.',guides:['compare-dog-walk-courses','dog-friendly-cafe-checklist'],faqs:[['한림공원에는 모든 크기의 반려견이 들어갈 수 있나요?','등록된 동반 자료는 7kg 이하를 안내합니다. 세부 출입 구역과 당일 운영 조건을 원문에서 다시 확인하세요.'],['제주 해안 GPX의 표시 거리에 접근·귀가 거리도 포함되나요?','제공된 구간의 등록 거리입니다. 접근·왕복·귀가 이동을 더한 거리로 안내하지 않으므로 경로 양 끝을 상세에서 확인하세요.']]}
];
const esc=v=>String(v??'').replace(/[ \t]+$/gm,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>String(s).replace(/<[^>]*>/g,' ').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replace(/\s+/g,' ').trim();
const inner=h=>h.slice(h.indexOf('>')+1,h.lastIndexOf('</'));
const facts=r=>r.facts.map(f=>`${f.label} ${f.value}`).join(' · ');
const known=f=>!/(?:미확인|상세 확인|방문 전 문의)/.test(f.value)&&/견종|동반|준비물|허용/.test(f.label);
function placeEntity(html,name){let result;const visit=o=>{if(o&&typeof o==='object'){if(o.geo&&o.name===name)result=o;for(const v of Object.values(o))visit(v);}};for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))visit(JSON.parse(m[1]));return result;}
function courseModel(row,html,routeMap){
 if(!html.includes('href="'+SITE+row.path+'"')||/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html))throw Error('Not a canonical published course: '+row.path);
 const id=row.path.split('/')[2],geo=placeEntity(html,row.name)?.geo,r=routeMap[id];let pet=null;
 // Reconstruct only the currently published route's data for the existing
 // identity/source/coordinate/signature guard; this never draws or joins paths.
 const routePath=r?.path??(r?.parts?r.parts.flat():null);
 for(const m of html.matchAll(/href="(https:[^"]+)"/g)){
  pet=Access.get({id,name:row.name,lat:geo?.latitude,lng:geo?.longitude,path:routePath,description:'공식안내: '+plain(m[1])});if(pet)break;
 }
 const route=verifiedRoute(id,html);
 const routeLabel=route?(route.segment?'공식 GPX 선택 구간':'공식 GPX 경로'):(r?.proposed?'제안 경로 · 검증 아님':'위치·공식 안내 · GPX 미확인');
 const address=plain(html.match(/<p class="detail-address">([\s\S]*?)<\/p>/)?.[1]||'위치는 상세 확인');
 return {row,id,pet,route,routeLabel,address,html};
}
function petText(pet){
 if(!pet)return '동반 세부 조건은 상세 원문에서 확인';
 if(Array.isArray(pet.conditions))return [...new Set(pet.conditions.flatMap(s=>s.match(/반려견\s*출입\s*가능(?:\([^)]*\))?/g)||[]))].join(' · ')||'공식 동반 문구 연결 · 허용 범위 원문 확인';
 const c=pet.conditions||{};return [c['동반구분'],c['동반가능동물']?.length<100?c['동반가능동물']:'견종·출입 제한 원문 확인',c['동반시 필요사항']].filter(Boolean).join(' · ');
}
function courseCards(models){return '<div class="region-course-grid">'+models.map(m=>`<article class="region-course-card" data-featured-id="${esc(m.id)}"><h3><a href="${m.row.path}">${esc(m.row.name)}</a></h3><p class="region-route-kind">${esc(m.routeLabel)}</p>${guidePhoto({id:m.id,name:m.row.name})}<div class="region-course-body"><p>${esc(facts(m.row))}</p><p>${esc(m.address)}</p><p>${esc(petText(m.pet))}</p><p class="region-proof-date">${m.pet?'동반 자료 대조 '+esc(m.pet.checkedDate||'미상'):'동반 자료 확인일은 원문 확인'} · 현장 방문일 아님</p>${m.pet?'<details><summary>동반 원문·출처 보기</summary><p>'+esc(Array.isArray(m.pet.conditions)?m.pet.conditions.join('\n'):Object.entries(m.pet.conditions||{}).map(([k,v])=>k+': '+v).join('\n'))+'</p><a href="'+esc(m.pet.source)+'" target="_blank" rel="noopener noreferrer">동반 자료 원문 ↗</a></details>':''}</div><a class="region-course-cta" href="${m.row.path}">경로·주변 장소 상세 보기 →</a></article>`).join('')+'</div>';}
function comparison(models){return '<div class="region-compare" role="region" aria-label="대표 코스 비교표" tabindex="0"><table><caption>선정 코스의 등록 정보 · 순위나 현장 답사 추천이 아닙니다</caption><thead><tr><th scope="col">코스</th><th scope="col">거리·시간</th><th scope="col">경로 자료</th><th scope="col">동반 조건</th></tr></thead><tbody>'+models.map(m=>'<tr><th scope="row"><a href="'+m.row.path+'">'+esc(m.row.name)+'</a></th><td>'+esc(facts(m.row))+'</td><td>'+esc(m.routeLabel)+'</td><td>'+esc(petText(m.pet))+'</td></tr>').join('')+'</tbody></table></div>';}
function sameCounty(address,card){const meta=plain(card.match(/<p class="premium-card-meta">([\s\S]*?)<\/p>/)?.[1]||'').split(' · ')[0];const norm=s=>s.replace('서울특별시','서울').replace(/(부산|인천)광역시/g,'$1').replace('경기도','경기').replace('제주특별자치도','제주');return meta&&norm(address).includes(norm(meta));}
function nearby(models,catalog){const selected=[],seen=new Set();for(const m of models){const pos=m.html.indexOf('id="detail-companions"');if(pos<0)continue;const start=m.html.lastIndexOf('<section',pos),section=fragments(m.html.slice(start))[0],ul=section?.match(/<ul class="premium-card-grid">([\s\S]*)<\/ul>/)?.[1];if(!ul)continue;for(const card of fragments(ul)){const target=card.match(/data-card-source="(\/places\/[^"/]+\/)"/)?.[1],place=catalog.get(target);if(!place||seen.has(target)||!place.facts?.some(known)||!sameCounty(m.address,card))continue;seen.add(target);selected.push({course:m.row.name,coursePath:m.row.path,path:target,card});break;}}return selected;}
function rewritePage(html,plan,models,near,guideTitles){
 html=html.replace(/<!--route-guide-links:start-->[\s\S]*?<!--route-guide-links:end-->/g,'');
 const title=`${plan.label} 강아지와 갈만한 곳 | ${plan.topic} | 발자국`,description=plan.intro+' 경로 자료와 반려견 동반 조건·사진 출처를 확인하고 코스 상세로 이동하세요.';
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/);if(!main)throw Error('Missing regional main');
 let blocks=fragments(main[1]);let courseList,placeList;const kept=[];
 for(const block of blocks){if(block.includes('data-regional-editorial='))continue;if(block.includes('class="region-all"')){const pieces=fragments(inner(block));courseList=pieces.find(p=>p.includes('강아지 산책 코스</h2>'));placeList=pieces.find(p=>p.includes('애견동반 장소</h2>'));continue;}if(/<h2>🐕 /.test(block)){courseList=block;continue;}if(/<h2>🏡 /.test(block)){placeList=block;continue;}kept.push(block);}
 if(!courseList||!placeList)throw Error('Regional catalogue sections missing: '+plan.slug);
 const feature='<section class="section region-editorial" data-regional-editorial="3"><h2>'+esc(plan.topic)+'</h2><p>'+esc(plan.intro)+'</p>'+comparison(models)+courseCards(models)+'<p>등록 거리와 시간은 실제 반려견 보행 기록과 다릅니다. 계단·경사·쉼터의 미확인은 없음으로 해석하지 마세요.</p></section>';
 const companions=near.length?'<section class="section" data-regional-editorial="3"><h2>선정 코스 출발점 주변에서 함께 보기</h2><p>기존 상세에 연결된 3km 이내 장소 중 같은 시·군·구와 구체 동반 문구가 확인된 자료입니다. 출발·등록 좌표 기준 직선 거리이며 실제 도보 거리·시간은 아닙니다.</p><div class="region-nearby-grid">'+near.map(n=>'<div><p class="region-nearby-origin"><a href="'+n.coursePath+'">'+esc(n.course)+'</a> 기준</p><ul class="premium-card-grid">'+n.card+'</ul></div>').join('')+'</div></section>':'';
 const guideLinks='<section class="section" data-regional-editorial="3"><h2>이 지역의 코스를 고를 때 함께 읽기</h2><ul class="region-guide-links">'+plan.guides.map(slug=>'<li><a href="/guides/'+slug+'/">'+esc(guideTitles.get(slug))+'</a></li>').join('')+'</ul></section>';
 const faq='<section class="section" data-regional-editorial="3"><h2>'+esc(plan.label)+' 산책 전 궁금한 점</h2>'+plan.faqs.map(([q,a])=>'<details class="region-faq"><summary>'+esc(q)+'</summary><p>'+esc(a)+'</p></details>').join('')+'</section>';
 const hero=kept.findIndex(b=>b.includes('class="hero"'));kept.splice(hero+1,0,feature,companions,guideLinks,'<details class="region-all"><summary>기존 지역 코스·장소 목록 더 살펴보기</summary>'+courseList+placeList+'</details>',faq);
 html=html.replace(main[1],kept.join('\n'));
 html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+esc(title)+'</title>');
 for(const attr of ['name="description"','property="og:description"','name="twitter:description"'])html=html.replace(new RegExp('(<meta '+attr+' content=")[^"]*'),(_,a)=>a+esc(description));
 for(const attr of ['property="og:title"','name="twitter:title"'])html=html.replace(new RegExp('(<meta '+attr+' content=")[^"]*'),(_,a)=>a+esc(title));
 html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/,(all,json)=>{const schemas=JSON.parse(json);for(const s of schemas){if(s['@type']==='CollectionPage'){s.name=title;s.description=description;}if(s['@type']==='FAQPage')s.mainEntity=plan.faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}));}return '<script type="application/ld+json">'+JSON.stringify(schemas).replaceAll('<','\\u003c')+'</script>';});
 if(!html.includes('/regional-search.css?'))html=html.replace('</head>','<link rel="stylesheet" href="/regional-search.css?v=20261028-regions3"></head>');
 html=html.replace(/(<body\b[^>]*class=")([^"]*)(")/,(_,a,classes,b)=>a+(classes.split(/\s+/).includes('regional-reading')?classes:classes+' regional-reading')+b);return html;
}
export async function reconcileHomeLabel(root,catalog){
 const read=async f=>JSON.parse(await readFile(path.join(root,f),'utf8')),manifest=await read('data/pet-care/manifest.json'),map=await read('data/pet-care/map-index.json'),counts=await read('data/place-count-summary.json');
 if(manifest.total!==map.total||map.rows.length!==manifest.total||manifest.regions.reduce((n,r)=>n+r.count,0)!==manifest.total||counts.professionalPlaces!==manifest.total||counts.facilities!==[...catalog.values()].filter(r=>r.kind==='facilities').length||counts.places!==counts.facilities+manifest.total-counts.overlap)throw Error('Public count evidence mismatch; do not guess');
 const file=path.join(root,'index.html'),before=await readFile(file,'utf8'),n=x=>x.toLocaleString('ko-KR');let after=before.replace(/(<a class="home-all-area-link" href="\/pet-care\/">[\s\S]*?<small>)[^<]*/,(_,a)=>a+'공개 전문업소 '+n(manifest.total)+'곳 ↗');
 after=after.replace(/<!--home-count-method:start-->[\s\S]*?<!--home-count-method:end-->/,'');
 const explanation='<!--home-count-method:start--><details class="home-count-method"><summary>장소 수 집계 기준</summary><p>전문업소 '+n(manifest.total)+'곳은 지도 위치가 확인된 공개 등록 자료입니다. 반려생활 장소 '+n(counts.places)+'곳은 동반장소 '+n(counts.facilities)+'곳과 전문업소를 합친 뒤 중복 가능 '+n(counts.overlap)+'곳을 제외한 집계입니다. 집계 기준일 '+esc(counts.checked)+'. 실제 영업·진료·예약 가능 여부는 업소에 확인해 주세요.</p></details><!--home-count-method:end-->';
 after=after.replace(/(<a class="home-all-area-link" href="\/pet-care\/">[\s\S]*?<\/a>)/,(_,a)=>a+explanation);
 if(after!==before)await writeFile(file,after,'utf8');return {changed:after!==before,professional:manifest.total,facilities:counts.facilities,overlap:counts.overlap,total:counts.places};
}
export async function refineRegionalSearch(root,{updateSitemap=true,refreshRSS=true}={}){
 const records=JSON.parse(await readFile(path.join(root,'assets/search-data/discover.json'),'utf8')),catalog=new Map(records.map(r=>[r.path,r]));
 const raw=await readFile(path.join(root,'course-routes.js'),'utf8'),start=raw.indexOf('const routes=')+13,routeMap=JSON.parse(raw.slice(start,raw.indexOf(';',start))),guideTitles=new Map(),result=[];const changed=[];
 for(const slug of new Set(plans.flatMap(p=>p.guides))){const html=await readFile(path.join(root,'guides',slug,'index.html'),'utf8');guideTitles.set(slug,plain(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]));}
 for(const plan of plans){const file=path.join(root,'with-dog',plan.slug,'index.html'),old=(await readFile(file,'utf8')).replace(/\r\n/g,'\n'),models=[];
  for(const id of plan.ids){const row=catalog.get('/courses/'+id+'/');if(!row||row.region!==plan.label)throw Error('Course region mismatch: '+id);const html=(await readFile(path.join(root,row.path.slice(1),'index.html'),'utf8')).replace(/\r\n/g,'\n');models.push(courseModel(row,html,routeMap));}
  const near=nearby(models,catalog),html=rewritePage(old,plan,models,near,guideTitles);if(html!==old){await writeFile(file,html,'utf8');changed.push('/with-dog/'+plan.slug+'/');}result.push({slug:plan.slug,courses:models.map(m=>({id:m.id,kind:m.routeLabel,petBound:Boolean(m.pet)})),nearby:near.map(n=>({course:n.course,path:n.path}))});
 }
 const counts=await reconcileHomeLabel(root,catalog);if(counts.changed)changed.push('/');
 if(updateSitemap&&changed.length){const file=path.join(root,'sitemap.xml');let xml=await readFile(file,'utf8');const day=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date());for(const url of changed){const key='<loc>'+SITE+url+'</loc>';xml=xml.replace(new RegExp('('+key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'<lastmod>)\\d{4}-\\d{2}-\\d{2}'),(_,a)=>a+day);}await writeFile(file,xml,'utf8');}
 if(refreshRSS)await generateRSS(root);return {changed,regions:result,counts};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))console.log(JSON.stringify(await refineRegionalSearch(path.resolve(import.meta.dirname,'..')),null,2));
