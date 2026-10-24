const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),zlib=require('node:zlib'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const records=JSON.parse(fs.readFileSync(path.join(root,'place-evidence.js'),'utf8').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]),byId=new Map(records.map(r=>[r.id,r]));
const norm=s=>String(s||'').normalize('NFKC').replace(/주식회사|\(주\)|[\s()[\]·.,_\-]/g,'').toLowerCase();
const road=s=>String(s||'').match(/([가-힣A-Za-z0-9·]+(?:로|길))\s*(\d+(?:-\d+)?)/)?.slice(1).join(' ');
test('bulk catalogue matches retain nearby coordinates, exact street and a distinct matching name',()=>{
 const matches=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'docs/place-enrichment-20261018-batch2/source-matches.json.gz'))));assert.equal(matches.length,184);
 for(const {place,tour,meters} of matches){assert(meters<=100);assert(road(place.address));assert.equal(road(place.address),road(tour.addr1));const a=norm(place.name),b=norm(tour.title);assert(a===b||Math.min(a.length,b.length)>=4&&(a.includes(b)||b.includes(a)));const r=byId.get(place.id);assert(r);assert.equal(r.name,place.name);assert.equal(r.address,place.address);assert.equal(r.contentId,String(tour.contentId));}
});
test('published place counts match coverage while unrelated facilities remain unchanged',()=>{
 const summary=JSON.parse(fs.readFileSync(path.join(root,'docs/nationwide-expansion-20261020e/summary.json')));let photos=0,galleries=0,notes=0,total=0;
 for(const folder of fs.readdirSync(path.join(root,'places'),{withFileTypes:true})){if(!folder.isDirectory())continue;const file=path.join(root,'places',folder.name,'index.html');if(!fs.existsSync(file))continue;const html=fs.readFileSync(file,'utf8');if(!html.includes('reading-page place-detail-page'))continue;total++;if(html.includes('class="place-photo"'))photos++;if(html.includes('class="place-photo-gallery"'))galleries++;if(html.includes('class="place-official-notes"'))notes++;}
 assert.equal(total,JSON.parse(fs.readFileSync(path.join(root,'data/public-counts.json'))).facilities);assert.equal(photos,summary.photoPlaces);assert.equal(galleries,summary.galleryPlaces);assert.equal(notes,summary.tourNotes);assert.equal(summary.addedPhotos,6);assert.equal(summary.newPhotoPlaces,6);
});
test('legacy hotel breed ban and official muzzle rule remain explicitly unresolved',()=>{
 const r=byId.get('pub1788410826323_400_nefwex');assert(r.caution);assert.match(r.caution.excerpt,/기존 등록 안내:[\s\S]*맹견[\s\S]*입실 불가/);assert.match(r.caution.excerpt,/공식 관광 상세 자료:[\s\S]*입마개/);
 const Conditions=require('../place-conditions.js');assert.match(Conditions.summary(r),/재확인/);assert.match(Conditions.get(r)[1].value,/미확정/);
});
test('condition review dates follow evidence, not the date of adding a photo',()=>{
 const Conditions=require('../place-conditions.js'),now=Date.parse('2026-10-18T15:00:00+09:00');
 const fresh=records.find(r=>r.petChecked==='2026-10-18'),prior=records.find(r=>r.pet&&!r.petChecked&&r.checked==='2026-10-17');assert(fresh&&prior);
 assert.match(Conditions.freshness(fresh,now),/^2026-10-18/);assert.match(Conditions.freshness(prior,now),/^2026-10-17/);
 const stored=require('../place-evidence.js').get(fresh),before=stored.petChecked;try{stored.petChecked='2099-01-01';assert(!Conditions.freshness(fresh,now).includes('2099'));}finally{stored.petChecked=before;}
});
