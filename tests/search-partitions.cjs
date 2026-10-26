const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{createDataSource,filter,ordered}=require('../place-search.js');
const manifest=()=>JSON.parse(fs.readFileSync('discover.html','utf8').match(/id="place-data">([\s\S]*?)<\/script>/)[1]);
test('category partitions preserve every original field and ordering and reuse loaded subsets for broad searches',async()=>{
 const m=manifest(),original=JSON.parse(fs.readFileSync('.'+m.src,'utf8')),calls=[];
 const source=createDataSource(m,async url=>{calls.push(url);return {ok:true,json:async()=>JSON.parse(fs.readFileSync('.'+url,'utf8'))};});
 for(const category of ['캠핑','숙소'])assert.deepEqual(await source.load({kind:'facilities',category}),filter(original,{kind:'facilities',category}));
 assert.equal(calls.length,2);assert.deepEqual(await source.load({}),original);assert.equal(calls.length,m.parts.length);assert(!calls.includes(m.src));
 for(const q of ['목줄','서울','반려견','이동장','제주','공원','강원 숙소','없는장소987'])for(const sort of ['photos','name','registered'])assert.deepEqual(ordered(filter(await source.load({q}),{q}),sort),ordered(filter(original,{q}),sort));
 assert.equal(calls.length,m.parts.length);
});
test('a cold broad query uses one original full index and never redownloads it for narrow queries',async()=>{
 const m=manifest(),calls=[];const source=createDataSource(m,async url=>{calls.push(url);return {ok:true,json:async()=>JSON.parse(fs.readFileSync('.'+url,'utf8'))};});const a=source.load({q:'서울'});await a;await source.load({category:'캠핑'});assert.deepEqual(calls,[m.src]);
});
test('invalid partition metadata fails safely rather than omitting records',async()=>{
 const m=manifest(),p=m.parts.find(x=>x.category==='캠핑');let bad=true;const source=createDataSource(m,async url=>({ok:true,json:async()=>{const data=JSON.parse(fs.readFileSync('.'+url,'utf8'));if(bad&&url===p.src)data.indices=[0];return data;}}));await assert.rejects(source.load({category:'캠핑'}),/format/);bad=false;assert.equal((await source.load({category:'캠핑'})).length,p.count);
});
