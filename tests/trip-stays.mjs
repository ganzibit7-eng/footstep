import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {tripStays,tripBooking,tripDisclosure} from '../scripts/trip-stays.mjs';
test('verified stay links retain partner tracking and clear disclosure on home and detail',()=>{
 const home=readFileSync('index.html','utf8');
 assert.equal(new Set(tripStays.map(x=>x.id)).size,tripStays.length);
 assert.equal(tripBooking('unknown'),'');
 for(const stay of tripStays){
  const url=new URL(stay.url);assert.equal(url.hostname,'kr.trip.com');assert.equal(url.protocol,'https:');
  for(const key of ['Allianceid','SID','trip_sub1','trip_sub3'])assert(url.searchParams.get(key));
  const detail=readFileSync(`places/${stay.id}/index.html`,'utf8');
  assert(detail.includes(stay.url.replaceAll('&','&amp;')));assert(detail.includes(tripDisclosure));assert(detail.includes('rel="sponsored noopener noreferrer"'));assert(detail.includes('체중 제한·추가요금'));
  const onHome=home.includes(`data-place-id="${stay.id}"`);if(onHome)assert(home.includes(stay.url.replaceAll('&','&amp;')));
  assert(detail.indexOf('trip-disclosure')<detail.indexOf('트립닷컴에서 객실 확인'));
  if(onHome)assert(home.includes(`href="/places/${stay.id}/"`));
 }
 const generator=readFileSync('scripts/generate-seo.mjs','utf8');assert(generator.includes('isPlace?tripBooking(item.id)'));assert(generator.includes('trip-stays.css?v=20261022'));
});
test('full stay audit distinguishes unlinked products and conflicting platform policies',()=>{
 const audit=JSON.parse(readFileSync('docs/trip-stays/audit-20261022.json','utf8'));
 assert.equal(audit.length,489);assert.equal(new Set(audit.map(x=>x.id)).size,489);
 assert.equal(audit.filter(x=>x.status==='connected').length,tripStays.length);
 for(const stay of tripStays){assert.equal(audit.find(x=>x.id===stay.id)?.status,'connected');assert(stay.checked&&stay.sourceAddress&&stay.bookingAddress);if(stay.bookingPetPolicy.startsWith('예약 플랫폼 동반 규정 미확인'))assert(tripBooking(stay.id).includes('동반 규정은 미확인입니다'));}
 for(const item of audit.filter(x=>x.status==='platform-policy-review'))assert.equal(tripBooking(item.id),'');
});
test('all ten home stays have a verified affiliate destination and their own source photo',()=>{
 const html=readFileSync('index.html','utf8');const section=html.slice(html.indexOf('<section id="home-stays"'),html.indexOf('<section id="walk-shopping"'));
 const cards=[...section.matchAll(/<article class="home-place-card" data-place-id="([^"]+)">([\s\S]*?)<\/article>/g)];assert.equal(cards.length,10);
 const urls=new Set();for(const[,id,card]of cards){const stay=tripStays.find(x=>x.id===id);assert(stay);assert(stay.bookingPetPolicy.startsWith('동반 가능'));assert(card.includes(stay.url.replaceAll('&','&amp;')));assert(card.includes('<img '));assert(card.includes('사진·자료 출처'));urls.add(stay.url);}assert.equal(urls.size,10);
});
