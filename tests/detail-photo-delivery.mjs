import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import Photos from '../place-photos.js';
import {createHandler} from '../infrastructure/photo-delivery/worker.mjs';
const key='assets/place-supplement/kto-123-0123456789ab.jpg';
const bytes=new Uint8Array(1024).fill(42),sha=createHash('sha256').update(bytes).digest('hex');
test('only verified gallery originals move to R2 without altering source bytes or cropping rights',()=>{
 const manifest=JSON.parse(gunzipSync(readFileSync('docs/detail-editorial-20261025/gallery-transfer.json.gz')));
 const proof=JSON.parse(gunzipSync(readFileSync('docs/detail-editorial-20261025/remote-verified.json.gz')));
 assert.equal(manifest.state,'remote-verified');assert.equal(manifest.objects.length,331);
 assert.equal(proof.objects.length,331);assert(proof.objects.every(p=>p.ok));assert(proof.samples.every(p=>p.ok));
 for(const p of manifest.objects){
  const original=readFileSync(p.key);assert.equal(original.length,p.bytes);assert.equal(createHash('sha256').update(original).digest('hex'),p.sha256);
  assert(p.evidence.every(x=>x.noCrop&&x.rightsType==='Type3'));
  assert.equal(Photos.url('/'+p.key),'https://balzaguk-place-photos.balzaguk-photo-delivery.workers.dev/'+p.key);
  assert(readFileSync('_config.yml','utf8').includes('  - '+p.key));
 }
 assert.equal(Photos.url('/assets/place-supplement/kto-1-0123456789ab.jpg'),'/assets/place-supplement/kto-1-0123456789ab.jpg');
});
function store(data=bytes){let reads=0;return {get reads(){return reads;},async head(){assert.fail('Strict original must be read and hashed even for HEAD');},async get(){reads++;return {size:data.length,body:new Response(data).body,arrayBuffer:async()=>data.slice().buffer};}};}
test('dashboard originals are SHA-256 verified with one read on GET, HEAD and conditional requests',async()=>{
 const worker=createHandler({[key]:{bytes:bytes.length,sha256:sha,type:'image/jpeg',digest:true}}),images=store();
 for(const method of ['GET','HEAD']){const before=images.reads,response=await worker.fetch(new Request('https://photos.example/'+key,{method}),{ENABLED:'true',IMAGES:images});assert.equal(response.status,200);assert.equal(images.reads,before+1);assert.equal(response.headers.get('etag'),'"'+sha+'"');assert.equal((await response.arrayBuffer()).byteLength,method==='GET'?1024:0);}
 const response=await worker.fetch(new Request('https://photos.example/'+key,{headers:{'If-None-Match':'"'+sha+'"'}}),{ENABLED:'true',IMAGES:images});assert.equal(response.status,304);
});
test('same-size tampering is rejected and oversized strict verification never reads R2',async()=>{
 const worker=createHandler({[key]:{bytes:bytes.length,sha256:sha,type:'image/jpeg',digest:true}}),changed=bytes.slice();changed[5]=0;
 const response=await worker.fetch(new Request('https://photos.example/'+key),{ENABLED:'true',IMAGES:store(changed)});assert.equal(response.status,503);
 const big=createHandler({[key]:{bytes:2_000_001,sha256:sha,type:'image/jpeg',digest:true}}),images=store();assert.equal((await big.fetch(new Request('https://photos.example/'+key),{ENABLED:'true',IMAGES:images})).status,503);assert.equal(images.reads,0);
});
