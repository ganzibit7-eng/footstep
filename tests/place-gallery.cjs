const verifySource=require('./helpers/place-photo-source.cjs');
const verifyOriginal=require('./helpers/photo-original.cjs');
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),Evidence=require('../place-evidence.js'),Photos=require('../place-photos.js'),Conditions=require('../place-conditions.js');
const records=JSON.parse(fs.readFileSync(path.join(root,'place-evidence.js'),'utf8').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]);
const coverage=JSON.parse(fs.readFileSync(path.join(root,'docs/nationwide-expansion-20261020c/summary.json')));
test('all additional images preserve original file hash, source, rights, dimensions and identity',()=>{
 let count=0,places=0;for(const r of records){const photos=Photos.gallery(r);if(photos.length)places++;
  assert.equal(Photos.gallery({...r,address:r.address+' 다른 장소'}).length,0);
  const seen=new Set([r.photo?.sha256]);for(const p of photos){count++;assert(!seen.has(p.sha256),r.name+' duplicate picture');seen.add(p.sha256);assert(p.width>=150&&p.height>=150);assert(p.noCrop);verifySource(p);verifyOriginal(p);}
  if(photos.length){assert(Photos.figure(r).includes('place-photo-gallery'));assert(!Photos.figure(r,{compact:true}).includes('place-photo-gallery'),'map/list renders only one photo');assert(Photos.figure(r).includes('loading="lazy"'));}
 }assert.equal(count,coverage.galleryPhotos);assert.equal(places,coverage.galleryPlaces);
});
test('supplementary official pet notes remain identity-bound, escaped and qualified',()=>{
 let notes=0;for(const r of records){if(!r.tourNotes)continue;notes++;assert.equal(Evidence.notes({...r,description:r.description+' changed'}),null);const html=Conditions.panel(r);assert(html.includes('공식 소개의 동반 안내 더 보기'));assert(html.includes('당일 운영·허용 범위를 보장하지 않습니다'));assert(html.includes(r.tourNotes.checked));}
 assert.equal(notes,coverage.tourNotes);const conflict=records.find(r=>r.caution?.checked==='2026-10-18');assert(conflict);assert.match(Conditions.summary(conflict),/재확인/);assert.match(Conditions.panel(conflict),/role="note"/);
});
test('published details contain the gallery before actions and maintain mobile controls',()=>{
 const r=records.find(r=>r.gallery?.length>=2),html=fs.readFileSync(path.join(root,'places',r.id,'index.html'),'utf8');assert(html.includes('place-photo-gallery'));assert(html.indexOf('class="place-photo-gallery"')<html.indexOf('class="place-actions"'));assert.equal((html.match(/data-place-save=/g)||[]).length,1);assert(html.includes('place-naver-link'));assert(!html.includes('undefined'));assert(html.includes('place-detail.css?v=20261018-gallery'));
});
