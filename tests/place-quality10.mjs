import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync,existsSync} from 'node:fs';import {createRequire} from 'node:module';
import {addressHTML,routeDistance,verifiedRoute} from '../scripts/detail-editorial.mjs';import {refineDiscovery} from '../scripts/discovery-layout.mjs';
const require=createRequire(import.meta.url),Media=require('../card-media.js'),Search=require('../place-search.js'),Analytics=require('../admin-analytics.js');
test('road and facility guidance split conservatively while the exact original stays accessible',()=>{
 const name='광교호수공원 반려견 놀이터',raw='경기도 수원시 영통구 광교호수로 214 광교호수공원시설 주차관리소 '+name+' · 공원관광';
 const a=Media.addressParts(raw,name);assert.equal(a.road,'경기도 수원시 영통구 광교호수로 214');assert.equal(a.detail,'광교호수공원시설 주차관리소');assert.equal(a.original,raw);assert(addressHTML(raw,name).includes(raw));
 const apartment='서울특별시 종로구 진흥로 439(구기동) 1층';assert.equal(Media.addressParts(apartment).detail,'(구기동) 1층');
 for(const value of ['서울 종로구 구기동 85-9','서울 강남구 테헤란로 ***','입구는 관리사무소에 문의','경기도 산책로 안쪽'])assert.equal(Media.addressParts(value).display,value);
 assert(!addressHTML('<script>alert(1)</script>').includes('<script>'));assert.equal(Media.address(raw,'경기도 수원시',name),'영통구 광교호수로 214');
});
test('optional condition filter includes photo-free facts and never treats unknown policies or operating hours as pet evidence',()=>{
 const base={kind:'facilities',name:'장소',info:'서울 · 식당카페',region:'서울'};
 const rows=[{...base,path:'/places/a/',facts:[{label:'필수 준비물',value:'목줄 착용'}]},{...base,path:'/places/b/',photo:{src:'/real.jpg'},facts:[{label:'견종·크기 조건',value:'미확인'}]},{...base,path:'/places/c/',facts:[{label:'운영시간',value:'09:00~18:00'}]},{...base,path:'/places/d/',facts:[{label:'허용 구역',value:'방문 전 문의'}]}];
 assert.deepEqual(Search.filter(rows,{pet:'known'}).map(r=>r.path),['/places/a/']);assert.equal(Search.filter(rows,{}).length,4);assert.equal(Search.companionKnown({...rows[0],kind:'courses'}),false);assert.equal(Search.companionKnown({...base,facts:[{label:'허용 구역',value:'한국관광공사 공식 소개에서 반려동물 동반 가능을 확인했습니다.'}]}),false);
 const real=require('./search-records.cjs')(),before=JSON.stringify(real),known=Search.filter(real,{kind:'facilities',pet:'known'});assert.equal(real.length,4619);assert(known.length>10);assert(known.some(r=>!r.photo));assert(known.every(Search.companionKnown));assert.equal(JSON.stringify(real),before);
 assert.equal(Search.ordered(rows,'conditions')[0],rows[0]);assert.equal(Search.ordered(rows,'photos')[0],rows[1]);assert.equal(Search.ordered(rows,'conditions').length,rows.length);
});
test('GPX measurement sums real parts but never invents a connection between disconnected parts',()=>{
 assert(Math.abs(routeDistance({parts:[[[37,127],[37,127.01]] ]})-.888)<.01);
 const a={parts:[[[37,127],[37,127.01]],[[38,128],[38,128.01]]]};assert(routeDistance(a)<2);
 const verified=verifiedRoute('c397',readFileSync('courses/c397/index.html','utf8'));assert(verified);assert(routeDistance(verified)>0);assert.equal(verifiedRoute('c387',readFileSync('courses/c387/index.html','utf8')),null);assert(readFileSync('courses/c387/index.html','utf8').includes('제안 경로 안내'));
});
test('search refinement keeps metadata and URLs and exposes one optional evidence filter',()=>{
 const h=readFileSync('discover.html','utf8'),next=refineDiscovery(h);assert.equal(refineDiscovery(next),next);assert.equal((next.match(/id="place-pet-known"/g)||[]).length,1);assert(next.includes('value="conditions"'));assert.deepEqual([...h.matchAll(/<meta\b[^>]*>/g)].map(m=>m[0]),[...next.matchAll(/<meta\b[^>]*>/g)].map(m=>m[0]));
});
test('analytics distinguishes measured zero, unknown denominators and unavailable conversions',()=>{
 assert.equal(Analytics.ratio(0,20),'0.0%');for(const pair of [[0,0],[null,5],[5,2],[-1,2],['bad',2]])assert.equal(Analytics.ratio(...pair),null);
 const h=Analytics.experienceHTML({automation_views:12,experience:{measured_views:20,measured_visitors:10,searches:4,search_visitors:2,detail_views:15}});assert(h.includes('20.0%'));assert(h.includes('75.0%'));assert(h.includes('미집계'));assert(h.includes('이탈'));assert(!h.includes('사람 인증 완료'));assert(Analytics.experienceHTML({}).includes('미집계'));assert.equal(Analytics.interestCount({measured_views:0,engaged_views:0}),'미집계');assert.equal(Analytics.interestCount({measured_views:10,engaged_views:0}),'0');assert.equal(Analytics.interestCount({measured_views:10,engaged_views:11}),'미집계');
});
test('all course details distinguish bound GPX measurements from unverified registered information',()=>{
 let count=0,gpx=0;
 for(const dir of readdirSync('courses',{withFileTypes:true})){if(!dir.isDirectory()||!existsSync('courses/'+dir.name+'/index.html'))continue;const html=readFileSync('courses/'+dir.name+'/index.html','utf8');if(!html.includes('data-detail-kind="course"'))continue;count++;
  const route=verifiedRoute(dir.name,html);if(route){gpx++;assert(html.includes('GPX 제공 구간 측정 거리'),dir.name);assert(html.includes('GPX 출발 좌표'),dir.name);assert(html.includes('GPX 도착 좌표'),dir.name);}else{assert(!html.includes('id="detail-route-data"'),dir.name);assert(html.includes('등록 참고 정보입니다'),dir.name);assert(html.includes('정확한 경로 미확인'),dir.name);}
 }
 assert.equal(count,412);assert(gpx>0);console.log('Course trust coverage:',{count,gpx,unverified:count-gpx});
});
