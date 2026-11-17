import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {tripStays,tripBooking} from '../scripts/trip-stays.mjs';
const require=createRequire(import.meta.url);
test('public HTML and the page generator omit monetized links',()=>{
 const pattern='Allianceid=|trip_sub[13]=|link\\.coupang\\.com|rel="sponsored|googlesyndication|https://([A-Za-z0-9-]+\\.)?kmong\\.com';
 const result=spawnSync('git',['grep','-n','-I','-E',pattern,'--','*.html',':!docs',':!database_sql'],{encoding:'utf8',maxBuffer:1024*1024});
 assert.equal(result.status,1,result.stdout||result.stderr);
 const generator=readFileSync('scripts/generate-seo.mjs','utf8');
 assert.doesNotMatch(generator,/tripBooking|trip-stays\.css|advertise\/index\.html/);
 for(const {id} of tripStays){
  const detail=readFileSync('places/'+id+'/index.html','utf8');
  assert(detail.includes('rel="canonical" href="https://balzaguk.com/places/'+id+'/"'),id);
  assert(detail.includes('place-map')&&detail.includes('place-save-note'),id);
  assert.doesNotMatch(detail,/trip-booking|trip-stays\.css/);
 }
});
test('full stay audit distinguishes unlinked products and conflicting platform policies',()=>{
 const audit=JSON.parse(readFileSync('docs/trip-stays/audit-20261022.json','utf8'));
 assert.equal(audit.length,489);assert.equal(new Set(audit.map(x=>x.id)).size,489);
 const heldIds=new Set([...JSON.parse(readFileSync('data/place-review-holds-20261107.json','utf8')).ids,...JSON.parse(readFileSync('data/pet-access-review-holds-20261111.json','utf8')).facilities]);assert.equal(audit.filter(x=>x.status==='connected'&&!heldIds.has(x.id)).length,tripStays.length);assert(tripStays.every(stay=>!heldIds.has(stay.id)));
 for(const stay of tripStays){assert.equal(audit.find(x=>x.id===stay.id)?.status,'connected');assert(stay.checked&&stay.sourceAddress&&stay.bookingAddress);if(stay.bookingPetPolicy.startsWith('예약 플랫폼 동반 규정 미확인'))assert(tripBooking(stay.id).includes('동반 규정은 미확인입니다'));}
 for(const item of audit.filter(x=>x.status==='platform-policy-review'))assert.equal(tripBooking(item.id),'');
});
test('all ten home stays keep their detail link and their own licensed photo',()=>{
 const html=readFileSync('index.html','utf8');const start=html.indexOf('<section id="home-stays"');assert(start>=0);
 const section=html.slice(start,html.indexOf('</section>',start));
 const cards=[...section.matchAll(/<article class="home-place-card" data-place-id="([^"]+)">([\s\S]*?)<\/article>/g)];assert.equal(cards.length,10);
 const catalogue=JSON.parse(readFileSync('place-evidence.js','utf8').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]);
 const photos=require('../place-photos.js');
 const urls=new Set();
 for(const[,id,card]of cards){
  const stay=tripStays.find(x=>x.id===id);
  assert(stay?.bookingPetPolicy.startsWith('동반 가능'),id);
  assert(card.includes('href="/places/'+id+'/"'),id);
  assert.doesNotMatch(card,/trip-booking|trip\.com/);
  const image=card.match(/<img[^>]*\bsrc="([^"]+)"[^>]*\bwidth="(\d+)"[^>]*\bheight="(\d+)"/);
  assert(image&&Math.abs(Number(image[2])/Number(image[3])-1.5)<.003,id+' full 3:2 frame');
  const record=catalogue.find(r=>r.id===id);
  const matched=[record?.photo,...record?.gallery||[]].find(p=>p&&photos.url(p)===image[1]&&p.width===Number(image[2])&&p.height===Number(image[3]));
  assert(matched?.noCrop&&matched.licenseUrl,id+' licensed source image');
  assert(card.includes('사진·자료 출처')&&card.includes(matched.licenseUrl),id+' photo attribution');
  urls.add(stay.url);
 }
 assert.equal(urls.size,10);
});
