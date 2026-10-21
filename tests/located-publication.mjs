import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';import {locatedPublication} from '../scripts/publish-located-professionals.mjs';
const require=createRequire(import.meta.url),D=require('../pet-care-data.js');
test('unlocated records are excluded from regional payloads, search, direct detail and published counts',async()=>{
 const kinds=Array.from({length:5},(_,i)=>({id:String(i)})),ids=['pc-seoul-1111111111111111','pc-seoul-2222222222222222'];
 const m={version:1,total:2,kinds,regions:[{id:'seoul',file:'/data/pet-care/regions/seoul.json'}]},regions={seoul:{version:1,region:'seoul',rows:ids.map((id,i)=>[id,i?'숨길 장소':'공개 장소','서울특별시 종로구 예시로 1','','종로구',[0],'','',false])}},map={version:1,kinds,rows:ids.map((id,i)=>[id,i?'숨길 장소':'공개 장소',i?null:37.5,i?null:127,[0],'seoul',i?null:0,'서울특별시 종로구 예시로 1'])};
 const snapshot=structuredClone(regions),result=locatedPublication(map,m,regions);assert.equal(result.map.total,1);assert.equal(result.manifest.total,1);assert.equal(result.map.unmapped,0);assert.deepEqual(regions,snapshot,'source objects are retained');
 const store=D.createStore(async url=>({ok:true,json:async()=>url.endsWith('manifest.json')?result.manifest:result.regions.seoul}));assert.equal((await store.search({region:'seoul',q:'숨길'})).length,0);await assert.rejects(store.get(ids[1]));assert.equal((await store.get(ids[0])).name,'공개 장소');
 assert.deepEqual(locatedPublication(result.map,result.manifest,result.regions),result,'repeated publication cannot revive hidden records');
});
test('published dataset has one-to-one directory/map membership and verified supplementary detail addresses',()=>{
 const m=JSON.parse(fs.readFileSync('data/pet-care/manifest.json')),map=JSON.parse(fs.readFileSync('data/pet-care/map-index.json')),rows=m.regions.flatMap(r=>JSON.parse(fs.readFileSync('.'+r.file)).rows);
 assert.equal(m.visibility,'located-only');assert.equal(rows.length,17698);assert.equal(map.unmapped,0);assert(map.rows.every(r=>Number.isFinite(r[2])&&Number.isFinite(r[3])));assert.deepEqual(rows.map(r=>r[0]).sort(),map.rows.map(r=>r[0]).sort());
 const atti=rows.find(r=>r[0]==='pc-seoul-214e66fe9c3606a6');const decoded=D.decode(atti,'seoul');assert(decoded.address.includes('진흥로 439'));assert.equal(decoded.masked,false);assert(decoded.location.note);assert(atti[2].includes('*'),'original source address is preserved');
});

