import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {directoryPhoto} from '../scripts/directory-data.mjs';import Media from '../card-media.js';
import {mapEntryAction} from '../scripts/detail-editorial.mjs';
const require=createRequire(import.meta.url),Search=require('../place-search.js');
const discover=()=>readFileSync('discover.html','utf8');
const records=()=>JSON.parse(discover().match(/id="place-data">([\s\S]*?)<\/script>/)[1]);

test('public search omits bookkeeping without changing photo rights or originals',()=>{
 const p={src:'/photo.jpg',author:'촬영자 이름',source:'https://source.example/',original:'https://source.example/original',license:'CC BY-ND 4.0',licenseUrl:'https://license.example/',changes:'크롭 금지',noCrop:true,width:900,height:600,checked:'2026-10-01',sha256:'hash',bytes:123,courses:{a:'다른 코스'}};
 const original=JSON.stringify(p),out=directoryPhoto(p);assert.equal(JSON.stringify(p),original);assert(!('sha256'in out));assert(!('courses'in out));
 for(const key of ['author','source','original','license','licenseUrl','changes','noCrop','width','height','checked'])assert.deepEqual(out[key],p[key]);
 assert.equal(Media.fit(out),'contain');
 const data=records();assert(data.length>4000);for(const r of data)if(r.photo){assert(!r.photo.sha256&&!r.photo.courses,r.path);assert(r.photo.source&&r.photo.author&&r.photo.licenseUrl,r.path);}
});

test('cached search retains every original multiword, category and source-condition result',()=>{
 const data=records(),states=['서울','목줄','캠핑','반려견','제주','수원','강원 숙소','이동장','산책','배변','없는장소검증98765'].flatMap(q=>[{q},{q,kind:'facilities'},{q,region:'서울'},{q,category:'식당카페'}]);
 const brute=(items,s)=>items.filter(i=>(!s.kind||i.kind===s.kind)&&(!s.region||i.region===s.region)&&(!s.category||Search.category(i)===s.category)&&(s.q||'').trim().toLocaleLowerCase('ko').split(/\s+/).filter(Boolean).every(w=>[i.name,i.region,i.info,i.conditions].join(' ').toLocaleLowerCase('ko').includes(w)));
 for(let pass=0;pass<2;pass++)for(const s of states)assert.deepEqual(Search.filter(data,s).map(r=>r.path),brute(data,s).map(r=>r.path));
 const mutable={name:'서울',region:'서울',info:'공원',conditions:'목줄'};assert.equal(Search.filter([mutable],{q:'목줄'}).length,1);mutable.conditions='이동장';assert.equal(Search.filter([mutable],{q:'목줄'}).length,0);assert.equal(Search.filter([mutable],{q:'이동장'}).length,1);
});

test('photo-free headers distinguish professional purposes and never imply a medical service for grooming',()=>{
 assert(Media.image(null,{category:'동물미용'}).includes('is-missing'));assert(Media.placeholder('동물미용').includes('data-placeholder-kind="grooming"'));assert(Media.placeholder('동물위탁관리').includes('data-placeholder-kind="care"'));assert(Media.placeholder('용품점').includes('data-placeholder-kind="retail"'));
 assert(!Media.professionalNote('동물미용').includes('진료'));assert(!Media.professionalNote('동물약국').includes('진료'));assert(Media.professionalNote('동물병원').includes('진료'));
});

test('all generated details separate notices, preserve useful actions and reject invalid display values',()=>{
 const files=execFileSync('git',['ls-files','-z','--','*.html'],{encoding:'utf8',maxBuffer:10000000}).split('\0').filter(f=>f&&!/^(?:docs|tests|admin)/.test(f));let details=0,notices=0,phone=0,missing=0;
 for(const file of files){const h=readFileSync(file,'utf8');if(!h.includes('data-detail-template="editorial-v3"')&&!h.includes('data-listing-template="quality3"'))continue;
  assert(!/>\s*(?:undefined|null|\[object Object\])\s*</.test(h),file);assert(!/NaN\s*(?:km|분)|\bkmkm\b/.test(h),file);
  if(h.includes('data-detail-template="editorial-v3"')){details++;assert(h.includes('detail-editorial.css?v=20261026-quality7'),file);for(const p of h.matchAll(/<p class="detail-unconfirmed">([\s\S]*?)<\/p>/g)){notices++;assert(/<strong>방문 전 문의<\/strong>\s+<span>[^<]+<\/span>/.test(p[1]),file+' joined notice');}
   const primary=h.match(/<div class="detail-actions-primary">([\s\S]*?)<\/div>/)?.[1];if(primary&&h.includes('>전화 문의</a>')){phone++;assert(primary.includes('href="tel:'),file+' hidden phone');}
  }
  for(const media of h.matchAll(/<div class="premium-card-media([^\"]*)">([\s\S]*?)(?=<\/div>)/g))if(media[2].includes('premium-placeholder')){missing++;assert(media[1].includes('is-missing'),file+' missing compact header');}
 }
 assert.equal(details,22317);assert(notices>1000);assert(phone>500);assert(missing>1000);console.log('Quality7 coverage:',JSON.stringify({details,notices,visiblePhoneActions:phone,compactMissingPhotos:missing}));
});

test('mobile layout is established before parsing search JSON, with no new dependency',()=>{
 const h=discover();assert(h.indexOf('data-directory-layout')>0);assert(h.indexOf('data-directory-layout')<h.indexOf('id="place-data"'));assert(h.includes('place-search.js?v=20261026-quality7'));assert(!h.includes('quality7-metrics.js'));
});

test('facility map links enter the existing map route without an intermediate home history entry',()=>{
 const source='<a class="place-action place-map" href="https://balzaguk.com/?facility=place123">지도</a>';
 assert(mapEntryAction(source).includes('?facility=place123#map'));
 for(const html of [source.replace('place-map','other-action'),source.replace('https://balzaguk.com/','https://other.example/'),source.replace('facility=place123','course=c387'),source.replace('place123"','place123#map"')])assert.equal(mapEntryAction(html),html);
 const page=readFileSync('places/kto_27ea733c-7e93-4f91-be36-33e0b1911a12/index.html','utf8');assert(/class="[^"]*place-map[^\"]*" href="https:\/\/balzaguk.com\/\?facility=[^\"]+#map"/.test(page));
});
