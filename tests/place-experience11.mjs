import test from 'node:test';import assert from 'node:assert/strict';import {petHighlights,hasSpecificPetCondition} from '../scripts/pet-highlights.mjs';import {nearbyEntries} from '../scripts/place-recommendations.mjs';import {reviewRecord} from '../scripts/audit-place-quality.mjs';import {readFileSync} from 'node:fs';
test('condition labels follow explicit meaning and one repeated scope is not two kinds of evidence',()=>{
 assert(!hasSpecificPetCondition({label:'허용 구역·제한',value:'식품안전나라 반려동물 동반 가능 업소 현황에 등록된 음식점입니다. 세부 구역·크기는 문의해 주세요.'}));
 assert(hasSpecificPetCondition({label:'견종·크기 조건',value:'소형견만 가능 · 세부 체중 기준 미확인'}));
 const rows=[{label:'견종·크기 조건',value:'갤러리동과 야외테라스만 출입 가능'},{label:'허용 구역·제한',value:'일부구역 동반가능'},{label:'필수 준비물',value:'미확인 · 방문 전 문의'}];
 const result=petHighlights(rows);assert.equal(result.length,1);assert.equal(result[0].label,'동반 가능한 공간');assert.equal(result[0].value,rows[0].value);
 assert.equal(petHighlights([{label:'견종·크기 조건',value:'반려동물 동반 가능'}]).length,0);
 assert(petHighlights([{label:'견종·크기 조건',value:'10kg 이하 소형견만 가능'},{label:'필수 준비물',value:'목줄 착용'}]).length===2);
});
test('nearby places retain municipal and coordinate boundaries, offer prepared choices and remove exact identity duplicates',()=>{
 const item={id:'home',name:'코스',address:'경기도 수원시 영통구 광교호수로',lat:37.28,lng:127.07};
 const near={id:'near',name:'주변 A',address:'경기도 수원시 영통구 가까운길',lat:37.281,lng:127.07},prepared={id:'prepared',name:'조건 B',address:'경기도 수원시 영통구 자료길',lat:37.29,lng:127.07},border={id:'border',name:'인접 C',address:'경기도 용인시 수지구 가까운길',lat:37.2801,lng:127.07};
 const result=nearbyEntries(item,[near,prepared,{...prepared,id:'duplicate'},border,{...prepared,id:'far',lat:38}],{priority:r=>r.id==='prepared'});assert.deepEqual(result.map(r=>r.other.id),['prepared','near','border']);assert(result.every(r=>r.km<=3));assert(!result.some(r=>'prepared' in r));
});
test('operator review identifies explicit public evidence gaps without treating professional registers as missing travel data',()=>{
 const h=readFileSync('places/mfds_a59aef2a7ff7185f83b6/index.html','utf8'),r=reviewRecord(h,'/places/example/');assert(r.issues.includes('재사용 가능 사진 미등록'));assert(r.issues.includes('세부 동반 자료 보완'));
 const v=readFileSync('pet-care/places/pc-seoul-31888dad3e7b570d/index.html','utf8');assert.deepEqual(reviewRecord(v,'/pet-care/places/example/').issues,[]);
});
test('single-photo source UI is merged while actual attribution remains and course display edits keep the full original',()=>{
 const h=readFileSync('places/kto_new_20261020_2930334/index.html','utf8');assert(!h.includes('class="detail-credit-reference"'));assert(h.includes('class="detail-credit-line"'));assert(h.includes('id="detail-gallery-sources"'));assert(h.includes('https://www.data.go.kr/data/15101578/openapi.do'));
 const course=readFileSync('courses/c397/index.html','utf8'),intro=course.match(/id="detail-about">([\s\S]*?)<\/section>/)[1];assert(intro.includes('선택한 구간을'));assert(!intro.includes('선택한 구간를'));assert(course.includes('등록 안내 원문'));assert(course.includes('선택한 구간를'));
 assert(course.includes('href="#detail-companions"'));assert(course.includes('id="detail-companions"'));assert(course.includes('출발·등록 좌표 기준 직선 거리'));
});

test('filtered discover links only to existing evidence collections of the exact regional/category scope',async()=>{
 const Search=(await import('../place-search.js')).default;
 const rows=[{region:'경기',category:'식당카페',path:'/places/regions/gyeonggi/cafes/'}];
 assert.equal(Search.curationDestination(rows,{region:'경기',category:'식당카페',kind:'facilities'}),rows[0]);
 assert.equal(Search.curationDestination(rows,{region:'서울',category:'식당카페'}),null);assert.equal(Search.curationDestination(rows,{region:'경기',category:'식당카페',kind:'courses'}),null);
 assert.equal(Search.curationDestination([{region:'',category:'',path:'https://example.invalid/'}],{}),null);
 const h=readFileSync('discover.html','utf8'),scopes=JSON.parse(h.match(/id="place-curation-scopes">([\s\S]*?)<\/script>/)[1]);assert(scopes.length>10);
 for(const scope of scopes){const file='.'+scope.path+'index.html',page=readFileSync(file,'utf8');assert(page.includes('id="prepared-places"'),scope.path);assert(page.includes('data-place-curation="quality11"'));}
 console.log('Live collection scopes',scopes.length);
});
