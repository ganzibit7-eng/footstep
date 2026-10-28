import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {plans,refineRegionalSearch} from '../scripts/refine-regional-search.mjs';
const read=f=>readFile(f,'utf8');
test('five existing regional pages retain canonical, old catalogue links and distinct visible FAQ',async()=>{
 const questions=[];
 for(const p of plans){
  const html=await read('with-dog/'+p.slug+'/index.html');
  assert(html.includes('href="https://balzaguk.com/with-dog/'+p.slug+'/"'));assert(!/content="[^"]*noindex/.test(html));
  assert(/<body[^>]*class="[^"]*\bregional-reading\b/.test(html));assert(html.includes('regional-search.css?v=20261028-regions3'));assert(html.includes('class="region-all"'));assert(html.includes('class="region-compare"'));
  assert.equal((html.match(/data-featured-id=/g)||[]).length,3);
  for(const id of p.ids)assert(html.includes('/courses/'+id+'/'));
  for(const slug of p.guides)assert(html.includes('href="/guides/'+slug+'/"'));
  for(const [q,a] of p.faqs){questions.push(q);assert(html.includes(q));assert(html.includes(a));}
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(schema.find(x=>x['@type']==='FAQPage').mainEntity.map(x=>x.name),p.faqs.map(x=>x[0]));
  for(const m of html.matchAll(/href="(\/(?!\/)[^"]+)"/g)){const u=new URL(m[1].replaceAll('&amp;','&'),'https://balzaguk.com');assert(existsSync('.'+u.pathname+(u.pathname.endsWith('/')?'index.html':'')),u.pathname);}
 }
 assert.equal(new Set(questions).size,10);
});
test('GPX scope and location guidance are not interchangeable and original conditions remain available',async()=>{
 const seoul=await read('with-dog/seoul/index.html'),jeju=await read('with-dog/jeju/index.html'),busan=await read('with-dog/busan/index.html');
 assert(seoul.includes('위치·공식 안내 · GPX 미확인'));
 assert(jeju.includes('7kg 이하 동반 가능'));assert(jeju.includes('공식 GPX 선택 구간'));assert(busan.includes('공식 GPX 선택 구간'));
 for(const p of plans){const html=await read('with-dog/'+p.slug+'/index.html');assert(html.includes('직선 거리'));assert(html.includes('실제 도보 거리·시간은 아닙니다'));assert(html.includes('현장 방문일 아님'));}
});
test('home professional label and total use the same published scope and preserve the archived notice',async()=>{
 const html=await read('index.html'),counts=JSON.parse(await read('data/place-count-summary.json')),manifest=JSON.parse(await read('data/pet-care/manifest.json'));
 const link=html.match(/<a class="home-all-area-link" href="\/pet-care\/">([\s\S]*?)<\/a>/)[1];
 assert(link.includes(manifest.total.toLocaleString('ko-KR')));assert(!link.includes('33,277'));
 assert.equal(counts.places,counts.facilities+manifest.total-counts.overlap);assert(html.includes('장소 수 집계 기준'));assert(html.includes('집계 기준일 '+counts.checked));
});
test('targeted regeneration is idempotent and does not regenerate professional pages',async()=>{
 const result=await refineRegionalSearch(process.cwd());assert.deepEqual(result.changed,[]);assert.equal(result.regions.length,5);assert.equal(result.counts.changed,false);
 const source=await read('scripts/refine-regional-search.mjs');assert(!source.includes('generatePetCare('));assert(!source.includes('generateProfessionalPages('));
 const workflow=await read('.github/workflows/generate-seo.yml');assert(workflow.includes('[regional-only]'));assert(workflow.includes('node scripts/refine-regional-search.mjs'));
});
