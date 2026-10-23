import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {refineDiscovery} from '../scripts/discovery-layout.mjs';
const require=createRequire(import.meta.url),{filter,ordered}=require('../place-search.js');

test('directory refinement preserves data, search controls, destinations and SEO',async()=>{
 const html=await readFile(new URL('../discover.html',import.meta.url),'utf8');
 assert.equal(refineDiscovery(html),html,'repeated generation is stable');
 const fixture='<!doctype html><head><link rel="canonical" href="https://balzaguk.com/discover.html"><script type="application/ld+json">{"@type":"CollectionPage"}</script></head><body class="reading-page"><a class="brand" href="/">발자국</a><nav aria-label="빠른 탐색"><a href="#places">장소</a></nav><section id="find-place"><form id="place-search"><label for="place-query">이름</label><input id="place-query" type="search"><label for="place-kind">종류</label><select id="place-kind"><option>전체</option></select><label for="place-region">지역</label><select id="place-region"></select><label for="place-category">업종</label><select id="place-category"></select></form><p id="place-count" role="status">안내</p></section><section id="with-dog-regions"></section><script id="place-data">[{"name":"미확인","conditions":"문의"}]</script></body>';
 const next=refineDiscovery(fixture);
 for(const pattern of [/<script[^>]*>[\s\S]*?<\/script>/g,/<link rel="canonical"[^>]*>/g])assert.deepEqual([...fixture.matchAll(pattern)].map(m=>m[0]),[...next.matchAll(pattern)].map(m=>m[0]));
 for(const id of ['query','kind','region','category'])assert.equal((next.match(new RegExp('id="place-'+id+'"','g'))||[]).length,1);
 assert.equal((next.match(/class="search-field"/g)||[]).length,4);assert(next.includes('href="#places"'));
 assert(next.includes('id="place-sort"'));assert.equal(refineDiscovery(next),next);
});

test('sorting preserves eligibility, stable source order and unknown conditions',()=>{
 const rows=[{name:'다',kind:'facilities',region:'서울',info:'주소 · 숙소',conditions:'미확인'},{name:'나',kind:'facilities',region:'서울',info:'주소 · 숙소',photo:{src:'/photo.jpg'}},{name:'가',kind:'courses',region:'서울',info:'산책'}];
 const original=structuredClone(rows),eligible=filter(rows,{kind:'facilities',category:'숙소'});
 assert.deepEqual(ordered(eligible,'photos').map(x=>x.name),['나','다']);
 assert.deepEqual(ordered(eligible,'name').map(x=>x.name),['나','다']);
 assert.deepEqual(ordered(eligible,'registered').map(x=>x.name),['다','나']);
 assert.deepEqual(rows,original);assert.equal(ordered(eligible,'photos')[1].conditions,'미확인');
});

test('shared reading theme cannot style home cards or administrator screens',async()=>{
 const css=await readFile(new URL('../internal-pages.css',import.meta.url),'utf8');
 assert(!/\.home-|#nearby-|#admin-|:root\s*\{|^body\s*\{/m.test(css));
 assert(css.includes('body.reading-page'));assert(css.includes('object-fit:contain'));
 const reading=await readFile(new URL('../readability.css',import.meta.url),'utf8');assert(reading.startsWith('@import url("/internal-pages.css?v=20261023-public")'));
 const generator=await readFile(new URL('../scripts/generate-seo.mjs',import.meta.url),'utf8');assert(generator.includes('refineDiscovery(refinePlaceDetail(html))'));
});
