import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {readFileSync} from 'node:fs';import vm from 'node:vm';
import {officialSource,trustLabels} from '../scripts/detail-trust.mjs';
const require=createRequire(import.meta.url),Photos=require('../place-photos.js');
test('evidence labels distinguish facts, unknown conditions, historic and dated source material',()=>{
 const now=Date.parse('2026-10-26'),facts=[{label:'허용 구역',value:'야외만 가능'},{label:'체중',value:'미확인'}];
 assert(officialSource('https://www.suwon.go.kr/a'));for(const src of ['http://suwon.go.kr','https://suwon.go.kr.evil.example','https://user:pw@suwon.go.kr/'])assert(!officialSource(src));
 assert(trustLabels('park',facts,{links:['https://www.suwon.go.kr/'],dates:['2026-10-20'],now}).includes('동반 자료 · 일부 미확인'));
 assert(trustLabels('stay',[],{dates:['2026-02-30','2099-01-01'],now}).includes('자료 확인일 미상'));
 assert(trustLabels('camping',facts,{dates:['2025-01-01'],now}).includes('자료 대조 180일 경과'));
 assert(trustLabels('park',facts,{historical:true,now}).includes('과거 참고자료 포함'));
 assert(trustLabels('stay',facts,{conflict:true,now})[0].includes('재확인 필요'));
 assert(!trustLabels('professional',facts,{now}).join('').includes('동반 조건'));
 assert(!trustLabels('park',facts,{now}).join('').includes('현장 검증'));
});
test('map photo credit uses the actual venue type without changing source metadata',()=>{
 const p={source:'https://source.example',author:'원 작가',licenseUrl:'https://license.example',placeCaption:'장소 참고사진 · 메뉴·시설 사진은 반려견의 해당 시설 출입 허용을 뜻하지 않습니다.',dateNote:'촬영일 미상',changes:'원본 비율 유지'};
 const before=JSON.stringify(p);assert(!Photos.credit(p,'공원관광').includes('메뉴'));assert(Photos.credit(p,'식당카페').includes('메뉴'));assert(Photos.credit(p,'공원관광').includes('원 작가'));assert.equal(JSON.stringify(p),before);
});
test('ordinary public-page visits check worker updates without forcing a reload',async()=>{
 const script=readFileSync('public-update.js','utf8');let calls=[];vm.runInNewContext(script,{navigator:{serviceWorker:{register:(url,options)=>{calls.push({url,options});return Promise.resolve({});}}},document:{readyState:'complete'},window:{}});assert.equal(calls.length,1);assert.equal(calls[0].options.updateViaCache,'none');assert(!/location\.reload|controllerchange/.test(script));
});
test('navigation revalidates HTTP cache and keeps exact offline fallback while excluding private data',async()=>{
 const handlers={},requests=[],stored=new Map();let offline=false;
 const context={URL,Response,self:{location:{href:'https://balzaguk.com/sw.js',origin:'https://balzaguk.com'},addEventListener:(k,v)=>handlers[k]=v,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>({add:async()=>{},put:async(req,v)=>stored.set(req.url,v),match:async req=>stored.get(typeof req==='string'?req:req.url)}),keys:async()=>[]},fetch:async(req,options)=>{requests.push({req,options});if(offline)throw Error('offline');return {ok:true,clone(){return this;}};}};
 vm.runInNewContext(readFileSync('sw.js','utf8'),context);const invoke=(url,mode)=>{let result;handlers.fetch({request:{method:'GET',url,mode},respondWith:v=>result=v,waitUntil:()=>{}});return result;};
 const url='https://balzaguk.com/discover.html?q=서울';await invoke(url,'navigate');assert.equal(requests[0].options.cache,'no-cache');offline=true;assert((await invoke(url,'navigate')).ok);assert.equal(invoke('https://example.supabase.co/rest/v1/walk_records','cors'),undefined);
});
test('image failure fallback remains local to venue media and keeps credits and frame size',()=>{
 let onError,inserted;const note={style:{},setAttribute(){}};const image={tagName:'IMG',dataset:{},src:'https://balzaguk.com/assets/photo.jpg',style:{},closest:()=>({}),getBoundingClientRect:()=>({height:210}),insertAdjacentElement:(_,n)=>inserted=n};
 const document={baseURI:'https://balzaguk.com/',readyState:'complete',addEventListener:(_,fn)=>onError=fn,querySelectorAll:()=>[] ,createElement:()=>note};vm.runInNewContext(readFileSync('photo-display.js','utf8'),{document,URL});onError({target:image});assert.equal(inserted,note);assert.equal(note.style.minHeight,'210px');assert(image.hidden);assert(note.textContent.includes('장소 안내'));onError({target:image});assert.equal(image.dataset.photoUnavailable,'true');
});
