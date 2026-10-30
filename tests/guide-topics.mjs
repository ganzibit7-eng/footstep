import test from 'node:test';
import assert from 'node:assert/strict';
import {guideDirectoryHTML} from '../scripts/guide-discovery.mjs';

const groups=[
 ['gyeonggi-lake-gpx-walks','incheon-gpx-dog-walks','yeoju-yeogang-gpx-walks'],
 ['compare-dog-walk-courses','dog-walk-distance','dog-walk-time','dog-walk-checklist'],
 ['summer-dog-walk','rainy-day-dog-walk','winter-dog-walk'],
 ['dog-friendly-cafe-checklist','dog-friendly-stay-checklist']
];
const examples=groups.flat().map(slug=>({slug,title:'안내 '+slug,description:'등록 자료와 확인사항 · '+slug}));

test('guide hub groups all published guides once, exposes discovery and keeps valid item list',()=>{
 const html=guideDirectoryHTML(examples);
 assert.equal((html.match(/<article>/g)||[]).length,12);
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 for(const [id,count] of [['regional-walks',3],['plan-a-walk',4],['weather-and-seasons',3],['dog-friendly-places',2]]){
  const match=html.match(new RegExp('<section class="topic" id="'+id+'"[^>]*>([\s\S]*?)</section>'));
  assert(match,'Missing topic '+id);
  assert.equal((match[1].match(/<article>/g)||[]).length,count);
  assert(html.includes('href="#'+id+'"'));
 }
 for(const row of examples)assert.equal(html.match(new RegExp('href="/guides/'+row.slug+'/"','g'))?.length,1);
 for(const target of ['/dog-walks/','/courses/themes/short-under-2km/','/courses/regions/gyeonggi/','/courses/regions/incheon/','/discover.html','/weekend/']){
  assert(html.includes('href="'+target+'"'),target);
 }
 assert(html.includes('<link rel="canonical" href="https://balzaguk.com/guides/">'));
 assert(html.includes('meta name="robots" content="index,follow"'));
 const structured=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/)[1]);
 assert.equal(structured.mainEntity.itemListElement.length,12);
 assert.deepEqual(structured.mainEntity.itemListElement.map(row=>row.position),Array.from({length:12},(_,i)=>i+1));
 assert(!/방문해 보니|절대 안전|무조건 동반/.test(html));
});

test('unclassified new guide appears instead of being silently omitted',()=>{
 const extra={slug:'future-topic',title:'향후 <안내>',description:'정보 & 확인'};
 const html=guideDirectoryHTML([...examples,extra]);
 assert(html.includes('id="more-guides"'));
 assert(html.includes('향후 &lt;안내&gt;'));
 assert(html.includes('정보 &amp; 확인'));
 assert.equal((html.match(/<article>/g)||[]).length,13);
});
