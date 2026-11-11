import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {execFileSync} from 'node:child_process';import {createRequire} from 'node:module';import {correctionAssets,correctionButton} from '../scripts/correction-entry.mjs';
const require=createRequire(import.meta.url),Form=require('../correction-request.js'),Admin=require('../admin-corrections.js');
const shared=fs.readFileSync('supabase/functions/_shared/security.js','utf8'),entry=fs.readFileSync('supabase/functions/content-correction/index.js','utf8').replaceAll('\r\n','\n').replace(/^import.*\n/gm,'').replace('Deno.serve(req=>handleCorrection(req));','');
const Edge=await import('data:text/javascript,'+encodeURIComponent(shared+'\n'+entry));
const id='56b874c6-7438-421b-9c23-4ed196581e51',body=()=>({id,path:'/courses/c352/',category:'route',message:'기능 확인용 테스트입니다. 실제 정정 요청이 아닙니다.',acknowledged:true,website:'',started:Date.now()-5000});
const env={get:k=>({SUPABASE_URL:'https://example.test',SUPABASE_SERVICE_ROLE_KEY:'server-secret',SUPABASE_ANON_KEY:'public'}[k])};
const request=(b,origin='https://balzaguk.com',key='public')=>new Request('https://example.test',{method:'POST',headers:{origin,apikey:key,'content-type':'application/json','x-forwarded-for':'192.0.2.1'},body:JSON.stringify(b)});
test('public correction writes are bounded, anonymous and use a published first-party title',async()=>{
 const calls=[],client={rpc:async(n,a)=>{calls.push({n,a});return{data:{accepted:true,id:a.p_id}};}},fetcher=async(url,options)=>{assert.equal(url,'https://balzaguk.com/courses/c352/');assert.equal(options.redirect,'error');return new Response('<html><h1>공식 코스 &amp; 테스트</h1></html>',{headers:{'content-type':'text/html'}});};
 let r=await Edge.handleCorrection(request({...body(),name:'forged name',owner_id:'forged'}),()=>client,env,fetcher);assert.equal(r.status,201);assert.equal(calls.length,1);assert.equal(calls[0].a.p_name,'공식 코스 & 테스트');assert.match(calls[0].a.p_network_hash,/^[a-f0-9]{64}$/);assert(!JSON.stringify(calls).includes('192.0.2.1'));assert(!JSON.stringify(calls).includes('forged'));assert.deepEqual(await r.json(),{accepted:true,id});
 for(const b of [{...body(),website:'spam'},{...body(),acknowledged:false},{...body(),message:'짧음'},{...body(),path:'/places/../private/'},{...body(),path:'//evil.test/'},{...body(),source:'https://user:password@example.test/'},{...body(),message:'x'.repeat(13000)}]){r=await Edge.handleCorrection(request(b),()=>client,env,fetcher);assert.equal(r.status,400);}
 r=await Edge.handleCorrection(request(body(),'https://evil.test'),()=>client,env,fetcher);assert.equal(r.status,403);r=await Edge.handleCorrection(request(body(),'https://balzaguk.com','wrong'),()=>client,env,fetcher);assert.equal(r.status,401);assert.equal(calls.length,1);
 r=await Edge.handleCorrection(request(body()),()=>({rpc:async()=>({error:{message:'correction_rate_limited'}})}),env,fetcher);assert.equal(r.status,429);assert(!JSON.stringify(await r.json()).includes('server-secret'));
 r=await Edge.handleCorrection(new Request('https://example.test',{method:'OPTIONS',headers:{origin:'https://balzaguk.com'}}),()=>client,env,fetcher);assert.equal(r.status,204);assert.equal(r.headers.get('Access-Control-Allow-Origin'),'https://balzaguk.com');
});
test('a missing target never records a request; title reading stops before a huge route body',async()=>{
 let writes=0,read=0,cancelled=false;
 const response=()=>new Response(new ReadableStream({pull(c){read++;if(read===1)c.enqueue(new TextEncoder().encode('<h1>공개 코스</h1>'));else c.enqueue(new Uint8Array(2000000));},cancel(){cancelled=true;}}),{headers:{'content-type':'text/html'}});
 assert.equal(await Edge.publishedName('/courses/c352/',async()=>response()),'공개 코스');assert(cancelled);assert(read<=2);
 const r=await Edge.handleCorrection(request(body()),()=>({rpc:async()=>{writes++;}}),env,async()=>new Response('missing',{status:404}));assert.equal(r.status,503);assert.equal(writes,0);
});
test('form transport never transmits a member token or claims an unconfirmed success',async()=>{
 const fields=Form.validate({...body(),source:'https://example.com/info'});assert(fields.acknowledged);assert.throws(()=>Form.validate({...body(),source:'javascript:alert(1)'}));assert.throws(()=>Form.validate({...body(),acknowledged:false}));
 const b={...body(),...fields};const accepted=await Form.submit(b,async(url,opts)=>{assert(url.endsWith('/content-correction'));assert.equal(opts.credentials,'omit');assert(!Object.hasOwn(opts.headers,'Authorization'));assert.equal(JSON.parse(opts.body).id,id);return new Response(JSON.stringify({accepted:true,id}),{status:201});});assert.equal(accepted.id,id);
 await assert.rejects(Form.submit(b,async()=>new Response(JSON.stringify({accepted:false}),{status:201})),/결과/);
 await assert.rejects(Form.submit(b,async()=>new Response(JSON.stringify({error:'rate_limited'}),{status:429})),/접수 요청이 많/);
 assert(Admin.esc('<img src=x onerror=alert(1)>').startsWith('&lt;'));assert.equal(Admin.safeSource('javascript:alert(1)'),null);assert.equal(Admin.safePath('/courses/../../private/'),null);assert.equal(Admin.safePath('/pet-care/places/pc-test/'),'/pet-care/places/pc-test/');
});
test('shared entry covers detail categories once and leaves the home untouched',()=>{
 for(const p of ['/places/test/','/courses/c352/','/bins/b1/','/pet-care/places/pc-test/']){const h='<head><link rel="canonical" href="https://balzaguk.com'+p+'"></head><body><article data-detail-template="editorial-v3"><header class="detail-heading"><h1>장소</h1></header></article></body>',n=correctionAssets(h);assert.equal((n.match(/data-correction-open/g)||[]).length,1);assert(n.includes('correction-request.js'));assert.equal(correctionAssets(n),n);assert.equal(n.match(/rel="canonical"[^>]+/)[0],h.match(/rel="canonical"[^>]+/)[0]);}
 const home=fs.readFileSync('index.html','utf8');assert.equal(correctionAssets(home),home);assert(correctionButton('','<script>').includes('&lt;script&gt;'));
});
test('every published detail has one canonical-bound correction entry, with no per-place payload copied into it',()=>{
 const files=execFileSync('git',['ls-files','-z','--','courses/**/index.html','places/**/index.html','bins/**/index.html','pet-care/places/**/index.html'],{encoding:'utf8',maxBuffer:5000000}).split('\0').filter(Boolean);const counts={};
 for(const file of files){const h=fs.readFileSync(file,'utf8');if(!h.includes('data-detail-template='))continue;const canonical=h.match(/rel="canonical" href="https:\/\/balzaguk.com([^"?#]*)"/)?.[1];assert(Form.validPath(canonical),file);assert.equal((h.match(/data-correction-open/g)||[]).length,1,file);assert.equal((h.match(/\/correction-request\.js\?/g)||[]).length,1,file);assert.equal((h.match(/\/correction-request\.css\?/g)||[]).length,1,file);assert(!h.includes('data-correction-path='),file+' must bind its own canonical');assert(correctionAssets(h)===h,file+' generation must be idempotent');const kind=file.startsWith('pet-care/')?'professional':file.split('/')[0];counts[kind]=(counts[kind]||0)+1;}
 assert.deepEqual(counts,{bins:38,courses:JSON.parse(fs.readFileSync('data/public-counts.json','utf8')).courses,professional:17698,places:JSON.parse(fs.readFileSync('data/public-counts.json','utf8')).facilities});
});
