import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {refineWalkDirectory} from '../scripts/walk-directory.mjs';
const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8');
test('course counter opens the dedicated directory without changing its identity or count',async()=>{
 const home=await read('index.html'),counts=JSON.parse(await read('data/public-counts.json'));
 assert(home.includes('id="hero-stat-courses" href="/dog-walks/"'));assert.equal((home.match(/id="hero-stat-courses"/g)||[]).length,1);
 assert(home.includes('>'+counts.courses+'개</a>'));assert.equal((home.match(/class="home-region-arrow" aria-hidden="true"><svg/g)||[]).length,6);
});
test('walk directory preserves canonical, structured data, guides and all local destinations',async()=>{
 const page=await read('dog-walks/index.html'),counts=JSON.parse(await read('data/public-counts.json'));
 assert.equal(refineWalkDirectory(page,counts),page);assert(page.includes('rel="canonical" href="https://balzaguk.com/dog-walks/"'));
 assert.equal(JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@type'],'CollectionPage');
 assert(page.includes('data-walk-count>'+counts.courses+'</strong>'));assert(page.includes('href="/discover.html?kind=courses#find-place"'));
 assert(page.includes('/courses/regions/jeonnam/'));assert(page.includes('/guides/dog-walk-checklist/'));assert(!page.includes('noindex'));
 for(const [,href] of page.matchAll(/href="(\/[^"?#]*)(?:[?#][^"]*)?"/g))await access(new URL(href.slice(1)+(href.endsWith('/')?'index.html':''),root));
});
test('refinement keeps source scripts and fails safely if original sections change',()=>{
 const source='<html><head><link rel="canonical" href="https://balzaguk.com/dog-walks/"><script type="application/ld+json">{"@type":"CollectionPage"}</script></head><body><section><h2>지역</h2><a href="/courses/regions/seoul/">서울 강아지 산책로</a></section><section><h2>테마</h2><div class="links"><a href="/courses/themes/easy/">쉬운 코스</a></div></section><section><h2>비교 안내</h2><p>경로 확인 필요</p></section><section><h2>질문</h2><p>원문 보존</p></section><section><h2>준비</h2><a href="/guides/">가이드</a></section><script defer src="/traffic.js?v=test"></script></body></html>';
 const next=refineWalkDirectory(source,{courses:412,checked:'2026-10-25'});assert(next.includes('경로 확인 필요'));assert(next.includes('원문 보존'));assert(next.includes('<script defer src="/traffic.js?v=test"></script>'));
 assert.equal(refineWalkDirectory(next,{courses:412,checked:'2026-10-25'}),next);assert.throws(()=>refineWalkDirectory(source.replace('<section>','<aside>'),{courses:412,checked:'2026-10-25'}));
 assert.throws(()=>refineWalkDirectory(source,{courses:'412',checked:'2026-10-25'}));
});
