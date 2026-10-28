import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {verifiedRoute} from '../scripts/detail-editorial.mjs';
import {evidenceGuides} from '../scripts/route-evidence-guides.mjs';
test('published guides point only to existing identity-bound official GPX details and keep partial-route context',()=>{
 const plans={ 'gyeonggi-lake-gpx-walks':['c362','c363','c397'],'incheon-gpx-dog-walks':['c361','c432'],'yeoju-yeogang-gpx-walks':['c347','c344','c426','c342']};
 const sitemap=readFileSync('sitemap.xml','utf8');
 for(const [slug,ids] of Object.entries(plans)){
  const file='guides/'+slug+'/index.html';assert(existsSync(file));const guide=readFileSync(file,'utf8');
  assert(sitemap.includes('https://balzaguk.com/guides/'+slug+'/'));
  for(const id of ids){
   const detail=readFileSync('courses/'+id+'/index.html','utf8'),route=verifiedRoute(id,detail);assert(route);
   assert(guide.includes('href="/courses/'+id+'/"'));
   assert(guide.includes(route.source.replaceAll('&','&amp;')));
   const name=detail.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1];assert(name&&guide.includes(name));
   if(route.segment)assert(guide.includes(route.segment));
  }
  assert(guide.includes('현장 방문일이 아닙니다'));assert(guide.includes('등록 거리'));assert(guide.includes('예상 시간'));
  assert(!/인기순 추천|방문해 보니|무조건 동반|주차 무료/.test(guide));
 }
});
test('no route guide is invented when the required identity-bound data is absent',async()=>{
 assert.deepEqual(await evidenceGuides('.',[]),[]);
 assert.deepEqual(await evidenceGuides('.',[{id:'c362',name:'다른 장소',path:null,lat:1,lng:2}]),[]);
});
