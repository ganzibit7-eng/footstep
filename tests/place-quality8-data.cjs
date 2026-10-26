const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {createDataSource}=require('../place-search.js');
const rows=[{name:'원문 장소',path:'/places/example/',kind:'facilities',conditions:'대형견 불가 · 원문 유지'}];
const manifest={version:1,src:'/assets/search-data/discover.json?v=0123456789abcdef',count:1,regions:['서울']};
test('deferred public index shares one request, preserves complete records and reuses the result',async()=>{
 let calls=0,complete;const loader=createDataSource(manifest,(url,options)=>{calls++;assert.equal(url,manifest.src);assert.equal(options.credentials,'omit');return new Promise(resolve=>{complete=()=>resolve({ok:true,json:async()=>rows});});});
 assert.equal(loader.peek(),null);const a=loader.load(),b=loader.load();assert.equal(a,b);await Promise.resolve();assert.equal(calls,1);complete();assert.equal(await a,rows);assert.equal(await loader.load(),rows);assert.equal(calls,1);
});
test('failed and malformed indexes reject without dropping rows, and explicit retry reloads',async()=>{
 let calls=0;const loader=createDataSource(manifest,async(_,options)=>{calls++;assert.equal(options.cache,calls===1?'force-cache':'reload');return {ok:true,json:async()=>calls===1?[]:rows};});
 await assert.rejects(loader.load(),/format/);assert.equal(loader.peek(),null);assert.deepEqual(await loader.load(),rows);
 for(const src of ['https://other.example/index.json','/assets/search-data/other.json','//other.example/discover.json']){let called=false;await assert.rejects(createDataSource({...manifest,src},()=>{called=true;}).load());assert.equal(called,false);}
 await assert.rejects(createDataSource(manifest,async()=>({ok:false})).load(),/response/);
});
test('index loading has a deadline and can retry after a stalled request',async()=>{
 let calls=0;const loader=createDataSource(manifest,async()=>{if(++calls===1)return new Promise(()=>{});return {ok:true,json:async()=>rows};},{timeoutMs:10});
 await assert.rejects(loader.load(),/timeout/);assert.deepEqual(await loader.load(),rows);
});
test('published directory manifest and full index agree, without precaching the payload on home',()=>{
 const html=fs.readFileSync('discover.html','utf8'),m=JSON.parse(html.match(/id="place-data">([\s\S]*?)<\/script>/)[1]);assert.equal(m.version,1);assert(m.count>4000);assert(html.length<700000);
 const raw=fs.readFileSync('.'+m.src.split('?')[0]),data=JSON.parse(raw);assert.equal(data.length,m.count);assert(m.src.endsWith(crypto.createHash('sha256').update(raw).digest('hex').slice(0,16)));
 assert.deepEqual([...new Set(data.map(r=>r.region).filter(Boolean))],m.regions);assert(!fs.readFileSync('sw.js','utf8').includes('assets/search-data'));assert(html.includes('검색')&&html.includes('/places/regions/'));
});
