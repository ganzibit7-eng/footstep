import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {editorialDetail,separateProse,verifiedRoute,text} from '../scripts/detail-editorial.mjs';
import {refinePlaceDetail} from '../scripts/refine-place-details.mjs';
import {assertPreserved} from '../scripts/publish-detail-editorial.mjs';

test('tourism introduction is separated without losing decimal limits, exceptions or restrictions',()=>{
 const r=separateProse('커피와 케이크가 유명하다. 12.5kg 이하 반려견만 입장 가능하다. 테라스는 동반 불가. 가까운 바다를 볼 수 있다.');
 assert.equal(r.rules,'12.5kg 이하 반려견만 입장 가능하다. 테라스는 동반 불가.');
 assert.equal(r.intro,'커피와 케이크가 유명하다. 가까운 바다를 볼 수 있다.');
});

test('old generator fixtures retain metadata, sources, images, credits and remain idempotent',()=>{
 for(const id of ['pub1788410835188_11_p7rain','kto_6d6aceb6-cad7-4287-9252-a2ac5156b5f4']){
  const before=readFileSync('tests/fixtures/place-detail-'+id+'.html','utf8'),after=refinePlaceDetail(before);
  // Legacy refinement normalizes the home URL, so compare the editorial stage itself.
  assert(after.includes('data-detail-template="editorial-v3"'));
  assert.equal(editorialDetail(after),after);
  const metas=s=>[...s.matchAll(/<meta\b[^>]*>/g)].map(m=>m[0]);assert.deepEqual(metas(before),metas(after));
  for(const m of before.matchAll(/<dd[^>]*>([\s\S]*?)<\/dd>/g))if(!text(m[1]).startsWith('미확인'))for(const sentence of text(m[1]).split(/(?<=[.!?])\s+/))assert(text(after).includes(sentence));
 }
});

test('route preview accepts bound official GPX and never draws proposed or unbound geometry',()=>{
 const proposal=readFileSync('courses/c387/index.html','utf8'),gpx=readFileSync('courses/c397/index.html','utf8');
 assert.equal(verifiedRoute('c387',proposal),null);assert(!proposal.includes('id="detail-route-data"'));assert(proposal.includes('정확한 경로 미확인'));
 const route=verifiedRoute('c397',gpx);assert(route?.parts[0].length>=10);assert(gpx.includes('id="detail-route-data"'));
 assert.equal(verifiedRoute('c397',gpx.replaceAll('https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=a209ece5-af74-47bc-8430-4138adbab6cc','https://example.invalid/')),null);
 const home=readFileSync('index.html','utf8');assert(home.includes("routeRecord&&!routeRecord.proposed&&routeRecord.geometryProvider==='두루누비 공식 GPX'"));
});

test('every sitemap detail has one category template, valid assets, unique IDs and unchanged canonical URL',()=>{
 const sitemap=readFileSync('sitemap.xml','utf8'),published=new Set([...sitemap.matchAll(/<loc>https:\/\/balzaguk.com(\/(?:places|courses|bins|pet-care\/places)\/[^/]+\/)\s*<\/loc>/g)].map(m=>m[1]));
 for(const url of [...published]){const h=readFileSync('.'+url+'index.html','utf8');let isPlace=false;for(const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){let d=JSON.parse(m[1]);if((Array.isArray(d)?d:d['@graph']||[d]).some(x=>x['@type']==='Place'))isPlace=true;}if(!isPlace)published.delete(url);}
 const counts={},seen=new Set();
 for(const folder of ['places','courses','bins','pet-care/places'])for(const dir of readdirSync(folder,{withFileTypes:true})){
  if(!dir.isDirectory())continue;const url='/'+folder+'/'+dir.name+'/',file='.'+url+'index.html';if(!existsSync(file))continue;
  const html=readFileSync(file,'utf8');if(!html.includes('rel="canonical" href="https://balzaguk.com'+url+'"')||!html.includes('<article '))continue;
  assert(html.includes('data-detail-template="editorial-v3"'),url+' unapplied');assert(published.has(url),url+' absent from sitemap');seen.add(url);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,url);assert.equal((html.match(/data-detail-template=/g)||[]).length,1,url);
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,url+' duplicate IDs');
  for(const asset of ['detail-editorial.css?v=20261026-quality9','detail-editorial.js?v=20261026-quality3'])assert(html.includes(asset),url);
  const kind=html.match(/data-detail-kind="([^"]+)"/)[1];counts[kind]=(counts[kind]||0)+1;
  const article=html.slice(html.indexOf('<article'),html.indexOf('</article>'));
  if(article.includes('class="detail-gallery"'))assert(!article.includes('place-photo-missing'));
  assert(!html.includes('id="share-detail"'),url+' old duplicate share handler');
 }
 assert.deepEqual([...seen].sort(),[...published].sort());
 for(const kind of ['dining','stay','camping','park','retail','course','amenity','professional'])assert(counts[kind]>0,kind);
 assert.equal(counts.professional,JSON.parse(readFileSync('data/pet-care/manifest.json')).total);
 console.log('Editorial detail coverage:',JSON.stringify({total:seen.size,counts,unapplied:published.size-seen.size}));
});

test('cafe prose, lodging rules, attribution and affiliation remain in their appropriate sections',()=>{
 const cafe=readFileSync('places/kto_new_20261020_2875939/index.html','utf8'),stay=readFileSync('places/kto_082dfa14-8e57-49ab-9327-a5d0659dfe23/index.html','utf8');
 const conditions=cafe.slice(cafe.indexOf('id="detail-conditions"'),cafe.indexOf('id="detail-visit"'));
 assert(conditions.includes('1층은 반려동물 동반 입장이 가능하다.'));assert(!conditions.includes('몬스터페스츄리'));assert(cafe.includes('id="detail-about"'));
 const stayConditions=stay.slice(stay.indexOf('id="detail-conditions"'),stay.indexOf('id="detail-visit"'));assert(stayConditions.includes('12Kg이하'));assert(stayConditions.includes('광견병예방접종 증명서 필수'));assert(stayConditions.includes('추가요금 항목은 미확인'));
 assert(stay.indexOf('예약 실적에 따른 수수료')<stay.indexOf('트립닷컴에서 객실 확인'));
 assert.equal((stay.match(/data-place-save=/g)||[]).length,1);
 const script=readFileSync('detail-editorial.js','utf8'),css=readFileSync('detail-editorial.css','utf8');assert(script.includes("button.disabled=true"));assert(script.includes("error.name!=='AbortError'"));assert(script.includes('history.back()'));assert(css.includes('prefers-reduced-motion'));assert(css.includes('object-fit:contain'));
 assert(!readFileSync('index.html','utf8').includes('href="/detail-editorial.css'));
});

test('preservation guard catches accidental source, photo and metadata loss',()=>{
 const before='<meta name="description" content="original"><a href="https://source.example/">source</a><img src="/real.jpg"><script type="application/ld+json">{"name":"real"}</script>';
 assert.doesNotThrow(()=>assertPreserved(before,before,'fixture'));
 for(const after of [before.replace('content="original"','content="wrong"'),before.replace('href="https://source.example/"','href="https://elsewhere.example/"'),before.replace('src="/real.jpg"','src="/other.jpg"')])assert.throws(()=>assertPreserved(before,after,'fixture'));
});
