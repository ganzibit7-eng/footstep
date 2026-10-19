import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import {createHandler} from '../infrastructure/photo-delivery/worker.mjs';
import vm from 'node:vm';
import {validateManifest,planUpload,reserve,LIMITS} from '../infrastructure/photo-delivery/policy.mjs';
const key='assets/place-photos/kto-123.jpg',photo={bytes:1000,sha256:'a'.repeat(64),type:'image/jpeg'};
function setup(){let calls=0;const bucket={get:async()=>{calls++;return {size:1000,customMetadata:{sha256:photo.sha256},body:new ReadableStream({start(c){c.enqueue(new Uint8Array(1000));c.close();}})};},head:async()=>{calls++;return {size:1000,customMetadata:{sha256:photo.sha256}};}};return {handler:createHandler({[key]:photo}),env:{ENABLED:'true',IMAGES:bucket},calls:()=>calls};}
test('one allowed request consumes at most one read, including conditional GET and HEAD',async()=>{
 for(const method of ['GET','HEAD']){const s=setup(),r=await s.handler.fetch(new Request('https://photos.test/'+key,{method}),s.env);assert.equal(r.status,200);assert.equal(s.calls(),1);assert.equal(r.headers.get('content-type'),'image/jpeg');}
 const s=setup(),r=await s.handler.fetch(new Request('https://photos.test/'+key,{headers:{'If-None-Match':'"'+photo.sha256+'"'}}),s.env);assert.equal(r.status,304);assert.equal(s.calls(),1);
});
test('pause, unknown paths, query floods, ranges and writes never reach R2',async()=>{
 const s=setup();for(const [url,method,headers]of [['/'+key,'POST',{}],['/private.json','GET',{}],['/'+key+'?x=1','GET',{}],['/'+key,'GET',{Range:'bytes=0-9'}]]){const r=await s.handler.fetch(new Request('https://photos.test'+url,{method,headers}),s.env);assert(r.status>=400);}assert.equal(s.calls(),0);
 const r=await s.handler.fetch(new Request('https://photos.test/'+key),{...s.env,ENABLED:'false'});assert.equal(r.status,503);assert.equal(s.calls(),0);
});
test('storage failures and changed objects fail closed without a retry or fallback read',async()=>{
 for(const get of [async()=>{throw Error('quota');},async()=>null,async()=>({size:1,customMetadata:{sha256:'bad'}})]){let calls=0;const s=setup();s.env.IMAGES.get=async()=>{calls++;return get();};const r=await s.handler.fetch(new Request('https://photos.test/'+key),s.env);assert(r.status>=400);assert.equal(calls,1);}
});
const item={key,bytes:1000,sha256:photo.sha256,contentType:'image/jpeg',evidence:[{source:'https://api.visitkorea.or.kr/',original:'https://tong.visitkorea.or.kr/photo.jpg',licenseUrl:'https://www.data.go.kr/',noCrop:true}]};
test('uploads stop before the storage or operation budgets; keys cannot overwrite unrelated files',()=>{
 assert.equal(validateManifest({objects:[item]}).bytes,1000);
 assert.throws(()=>validateManifest({objects:[{...item,key:'../private.json'}]}));assert.throws(()=>validateManifest({objects:[item,item]}));
 assert.throws(()=>planUpload({objects:[item]},[{Key:'another-file',Size:LIMITS.bytes}]));
 assert.equal(planUpload({objects:[item]},[{Key:key,Size:1000}]).missing.length,0);
 for(const [kind,name]of [['A','classA'],['B','classB']]){const ledger={classA:0,classB:0};ledger[name]=LIMITS[name]-1;reserve(ledger,kind);assert.throws(()=>reserve(ledger,kind));assert.equal(ledger[name],LIMITS[name]);}
});
test('deployment stays paused until activation, with no direct public R2 configuration',()=>{
 const config=JSON.parse(fs.readFileSync(new URL('../infrastructure/photo-delivery/wrangler.json',import.meta.url)));assert.equal(config.vars.ENABLED,'false');assert.equal(config.r2_buckets.length,1);assert(!config.routes);assert(!config.durable_objects);assert(!config.kv_namespaces);assert.equal(config.observability.enabled,false);
});
test('unavailable photos do not retry requests or hide place information',()=>{
 let handler;const notes=[];const doc={baseURI:'https://balzaguk.com/',readyState:'complete',addEventListener(type,fn){if(type==='error')handler=fn;},querySelectorAll(){return [];},createElement(){return {style:{}};}};
 vm.runInNewContext(fs.readFileSync(new URL('../photo-display.js',import.meta.url),'utf8'),{document:doc,URL});
 const image={tagName:'IMG',dataset:{},style:{display:'block'},src:'https://balzaguk-place-photos.balzaguk-photo-delivery.workers.dev/assets/place-photos/kto-123.jpg',insertAdjacentElement(_,note){notes.push(note);}};
 handler({target:image});handler({target:image});assert.equal(notes.length,1);assert(image.hidden);assert.equal(image.style.display,'none');assert.match(notes[0].textContent,/장소 안내는 계속/);
 const course={...image,dataset:{},hidden:false,src:'https://balzaguk.com/assets/course-photos/c33.webp'};handler({target:course});assert.equal(course.hidden,false);assert.equal(notes.length,1);
});

test('individually restricted image URLs are denied before any R2 operation',async()=>{
 const {blockedPhotoKeys}=await import('../infrastructure/photo-delivery/blocked-photos.mjs');assert.equal(blockedPhotoKeys.length,91);
 for(const denied of blockedPhotoKeys){const s=setup();const manifest={[denied]:photo};const handler=createHandler(manifest);const r=await handler.fetch(new Request('https://photos.test/'+denied,{method:'HEAD'}),s.env);assert.equal(r.status,404,denied);assert.equal(s.calls(),0);}
});
