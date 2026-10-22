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
  for(const page of [home,detail]){assert(page.includes(stay.url.replaceAll('&','&amp;')));assert(page.includes(tripDisclosure));assert(page.includes('rel="sponsored noopener noreferrer"'));assert(page.includes('반려견 허용 객실·체중 제한·추가요금'));}
  assert(detail.indexOf('trip-disclosure')<detail.indexOf('트립닷컴에서 객실 확인'));
  assert(home.includes(`href="/places/${stay.id}/"`));
 }
 const generator=readFileSync('scripts/generate-seo.mjs','utf8');assert(generator.includes('isPlace?tripBooking(item.id)'));assert(generator.includes('trip-stays.css?v=20261022'));
});
