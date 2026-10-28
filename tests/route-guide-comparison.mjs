import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {renderRouteComparison,regionalFAQs,publishEvidenceLinks} from '../scripts/route-evidence-guides.mjs';

test('comparison distinguishes estimates, source dates, partial scope and missing address without inventing facts',()=>{
 const entry={id:'fixture',item:{id:'fixture',name:'가상 <검사> 코스',distance:'약 0.42km',diff:'보통'},pet:{checkedDate:'2026-10-10',source:'https://example.com/pet',conditions:{'동반시 필요사항':'목줄 착용','동반 관련 상세정보':'- 입마개 조건 확인 - 배변봉투 지참'}},route:{source:'https://example.com/gpx',segment:'부모 코스',parts:[[[37.5,127.1],[37.501,127.1]]]}};
 const html=renderRouteComparison([entry]);
 assert(html.includes('평지 예상 6분'));assert(html.includes('공식 GPX 선택 구간'));assert(html.includes('부모 코스'));
 assert(html.includes('37.50000, 127.10000 (주소 미확인)'));assert(html.includes('2026-10-10'));assert(html.includes('현장 방문일이 아닙니다'));
 assert(html.includes('가상 &lt;검사&gt; 코스'));assert(html.includes('<li>입마개 조건 확인</li>'));assert(html.includes('- 입마개 조건 확인 - 배변봉투 지참'));
 assert(html.includes('사진 없음'));assert(!html.includes('주차 무료'));
});
test('each region has distinct, content-specific questions',()=>{
 const all=['gyeonggi-lake-gpx-walks','incheon-gpx-dog-walks','yeoju-yeogang-gpx-walks'].flatMap(slug=>regionalFAQs(slug,[{id:'c397'}]));
 assert.equal(all.length,6);assert.equal(new Set(all.map(([q])=>q)).size,6);
});
test('course and regional backlinks are scoped and regeneration is idempotent',async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'route-guides-'));
 try{
  for(const dir of ['courses/c362','with-dog/gyeonggi']){await mkdir(path.join(root,dir),{recursive:true});await writeFile(path.join(root,dir,'index.html'),'<main><h1>Keep this page</h1></main>');}
  const guides=[{slug:'gyeonggi-lake-gpx-walks',title:'호수 비교',region:'gyeonggi',courseIDs:['c362']}];
  assert.deepEqual(await publishEvidenceLinks(root,guides),{covered:2,changed:2});
  assert.deepEqual(await publishEvidenceLinks(root,guides),{covered:2,changed:0});
  const html=await readFile(path.join(root,'courses/c362/index.html'),'utf8');
  assert(html.includes('Keep this page'));assert.equal((html.match(/route-guide-links:start/g)||[]).length,1);assert(!html.includes('incheon'));
 }finally{assert(path.resolve(root).startsWith(path.resolve(tmpdir())+path.sep+'route-guides-'));await rm(root,{recursive:true,force:true});}
});
test('published comparison facts, photographs, originals and FAQ match each corresponding course',async()=>{
 const plans={'gyeonggi-lake-gpx-walks':['c362','c363','c397'],'incheon-gpx-dog-walks':['c361','c432'],'yeoju-yeogang-gpx-walks':['c347','c344','c426','c342']};
 for(const [slug,ids] of Object.entries(plans)){
  const html=await readFile('guides/'+slug+'/index.html','utf8');
  assert(html.includes('/route-guides.css?v=20261028-compare2'));assert.equal((html.match(/data-guide-course=/g)||[]).length,ids.length);
  const schemas=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  for(const q of schemas.find(s=>s['@type']==='FAQPage').mainEntity){assert(html.includes(q.name));assert(html.includes(q.acceptedAnswer.text));}
  for(const id of ids){
   const detail=await readFile('courses/'+id+'/index.html','utf8');assert(detail.includes('/guides/'+slug+'/'));
   const stop=html.split('data-guide-course="'+id+'"')[1].split('</section>')[0];
   assert(stop.includes('출발 위치'));assert(stop.includes('동반 조건 원문과 자료 확인'));assert(stop.includes('/courses/'+id+'/'));
   const image=stop.match(/<img[^>]*src="([^"]+)"/)?.[1];if(image)assert(detail.includes(image),'photo belongs to this course');
  }
 }
});
