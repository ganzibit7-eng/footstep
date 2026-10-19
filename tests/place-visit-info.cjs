const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),Evidence=require('../place-evidence.js'),Conditions=require('../place-conditions.js'),Photos=require('../place-photos.js');
const records=JSON.parse(fs.readFileSync(path.join(root,'place-evidence.js'),'utf8').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]);
const coverage=JSON.parse(fs.readFileSync(path.join(root,'docs/place-enrichment-20261019e/summary.json')));
test('official visit facts remain identity and description bound, with their own date and source',()=>{
 let visits=0,notes=0;for(const r of records){if(!r.visitInfo)continue;visits++;if(r.visitInfo.petNotes.length)notes++;
  assert.equal(Evidence.visit({...r,address:r.address+' 다른 주소'}),null);assert.equal(Evidence.visit({...r,description:r.description+' 변경'}),null);
  const info=Evidence.visit(r);assert.match(info.checked,/^2026-10-(18|19)$/);assert(info.source.startsWith('https://api.visitkorea.or.kr/'));assert(info.rows.length||info.petNotes.length);
  for(const row of info.rows){assert(['문의처','운영시간','쉬는 날','입실 시간','퇴실 시간','주차'].includes(row.label));assert(row.value.trim());}
  const html=Conditions.visitPanel(r);assert(html.includes('방문 전 운영시간·요금·동반 조건'));assert(html.includes('자료 조회 '+info.checked));assert.equal(Conditions.visitPanel({...r,description:'다른 설명'}),'');
 }assert.equal(visits,coverage.officialVisitPlaces);assert.equal(notes,coverage.officialPetNotesPlaces);
});
test('general visit notes never become confirmed breed, weight or indoor permissions',()=>{
 const r=records.find(r=>r.visitInfo&&r.pet),stored=Evidence.get(r),before=stored.visitInfo.petNotes;const rows=Conditions.get(r);
 try{stored.visitInfo.petNotes=['모든 반려견 입장 가능, 50kg, 객실 가능 <script>alert(1)</script>'];assert.deepEqual(Conditions.get(r),rows);const html=Conditions.visitPanel(r);assert(html.includes('&lt;script&gt;'));assert(!html.includes('<script>'));}finally{stored.visitInfo.petNotes=before;}
 const museum=records.find(r=>r.name==='하슬라아트월드');assert(museum);assert.equal(museum.petChecked,'2026-10-18');assert.match(Conditions.panel(museum),/레스토랑, 카페 이용 불가능/);assert.match(Conditions.panel(museum),/이동장/);
});
test('same official photograph at different supplied sizes is not duplicated within a place',()=>{
 for(const r of records){const seen=new Set();for(const p of [r.photo,...r.gallery||[]].filter(Boolean)){const id=p.photoKind?p.original:p.original?.match(/\/(\d+)_image[23]_1\./)?.[1];assert(id);assert(!seen.has(id),r.name+' repeats photo resource '+id);seen.add(id);assert(p.photoKind ? Photos.url(p)===p.src : p.src.startsWith('/assets/place-supplement/') ? /^\/assets\/place-supplement\/kto-\d+-[a-f0-9]{12}\.(jpg|png)$/.test(Photos.url(p)) : Photos.url(p).startsWith('https://balzaguk-place-photos.balzaguk-photo-delivery.workers.dev/'));}}
});
test('published pages expose the checked visit facts without leaking local cache paths',()=>{
 let count=0;for(const r of records){if(!r.visitInfo)continue;const html=fs.readFileSync(path.join(root,'places',r.id,'index.html'),'utf8');assert(html.includes('class="place-visit-info"'));assert(!html.includes('sourceFile'));assert(!html.includes('C:\\Users'));count++;}assert.equal(count,coverage.officialVisitPlaces);
});
