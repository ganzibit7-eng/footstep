import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {refinePlaceDetail} from '../scripts/refine-place-details.mjs';

test('refinement preserves source facts, photographs, links and structured data',async()=>{
 for(const id of ['pub1788410835188_11_p7rain','kto_6d6aceb6-cad7-4287-9252-a2ac5156b5f4']){
  const before=(await readFile(new URL('./fixtures/place-detail-'+id+'.html',import.meta.url),'utf8')).replaceAll('\r\n','\n');
  const after=refinePlaceDetail(before);
  assert(after.includes('place-detail.css?v=20261018-gallery'));
  assert.equal(refinePlaceDetail(after),after,'idempotent on the next generation');
  assert.deepEqual([...after.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(x=>x[1]),[...before.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(x=>x[1]));
  const panel=before.match(/<section aria-label="반려견 동반 조건"[\s\S]*?<\/section>/)[0];assert(after.includes(panel),'verified and unknown conditions unchanged');
  const credits=before.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)[1];assert(after.includes(credits),'all credit and license text remains available');
  const destinations=new Set([...after.matchAll(/href="([^"]+)"/g)].map(x=>new URL(x[1].replaceAll("&amp;","&"),"https://balzaguk.com/").href));for(const match of before.matchAll(/href="([^"]+)"/g))assert(destinations.has(new URL(match[1].replaceAll("&amp;","&"),"https://balzaguk.com/").href),"destination retained: "+match[1]);
  assert.equal((after.match(/data-place-save=/g)||[]).length,1,'one visible bookmark action');
  assert(after.indexOf('<figure class="place-photo"')<after.indexOf('<div class="place-actions"'));
  assert(after.indexOf('<details class="place-directory"')>after.indexOf('</article>'));
 }
});
test('all published place pages use the new stylesheet without duplicate dock or heading',async()=>{
 let count=0;for(const dir of await readdir(new URL('../places/',import.meta.url),{withFileTypes:true})){
  if(!dir.isDirectory())continue;let html;try{html=await readFile(new URL('../places/'+dir.name+'/index.html',import.meta.url),'utf8');}catch(e){if(e.code==='ENOENT')continue;throw e;}
  if(!html.includes('reading-page place-detail-page'))continue;assert(html.includes('place-detail.css?v=20261018-gallery'),dir.name);
  assert.equal((html.match(/<h1>/g)||[]).length,1,dir.name);
  assert(!html.includes('class="place-dock"'),dir.name);count++;
 }assert(count>=3133);console.log('Place detail pages:',count);
});

test('home cards open native detail, with original Naver destinations available inside',async()=>{
 const home=await readFile(new URL('../index.html',import.meta.url),'utf8');
 const destinations=JSON.parse(await readFile(new URL('../data/place-external-links.json',import.meta.url),'utf8'));
 const cards=[...home.matchAll(/<article class="home-place-card"[^>]*>([\s\S]*?)<\/article>/g)];assert.equal(cards.length,20);
 for(const [,card] of cards){
  assert(!card.includes('map.naver.com'));
  const detail=card.match(/class="home-place-detail" href="([^\"]+)"/)[1];assert.match(detail,/^\/places\/[^/]+\/$/);
  assert.equal((card.match(/href="\/places\//g)||[]).length,1,'one keyboard destination per card');
  const page=await readFile(new URL('..'+detail+'index.html',import.meta.url),'utf8');
  const id=detail.split('/')[2];assert(page.includes(destinations[id].replaceAll('&','&amp;')));
  assert.equal((page.match(/class="place-naver-link"/g)||[]).length,1);
 }
});
