import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import vm from 'node:vm';

const require=createRequire(import.meta.url);
const evidence=require('../place-evidence.js');
const access=require('../course-pet-access.js');
const photos=require('../course-photos.js');
const conditions=require('../place-conditions.js');
const read=file=>readFileSync(file,'utf8');
const readJSON=file=>JSON.parse(read(file));
const prefix='docs/expansion-20261111/';
const batch=readJSON(prefix+'batch.json');
const proof=readJSON(prefix+'source-proof.json');
const graph=readJSON(prefix+'route-proof.json');
const catalogue=require('./search-records.cjs')();
const publicPaths=new Set(catalogue.map(row=>row.path));
const held=new Set(readJSON('data/pet-access-review-holds-20261111.json').facilities);
const normalize=s=>s.normalize('NFKC').replace(/^\s*(?:주식회사|\(주\))\s*/,'').replace(/[^가-힣0-9a-z]/gi,'').toLowerCase();
const road=s=>s.match(/([가-힣A-Za-z0-9·.]+(?:로|길))\s*(\d+(?:-\d+)?)(?=[^\d-]|$)/)?.slice(1);

test('each added place is uniquely bound to its own official evidence, search path and detail',()=>{
 const food=new Map(proof.food.map(row=>[row.id,row]));
 const tourism=new Map(proof.kto.map(row=>[row.id,row]));
 assert.equal(new Set(batch.places.map(place=>place.id)).size,batch.places.length);
 assert.equal(food.size+tourism.size,batch.places.length);
 for(const place of batch.places){
  const id=place.id,route='/places/'+id+'/';
  assert.equal(publicPaths.has(route),!held.has(id),id);
  const detail=held.has(id)?'':read('.'+route+'index.html');
  if(detail)assert(detail.includes('rel="canonical" href="https://balzaguk.com'+route+'"'),id);
  assert(place.lat>33&&place.lat<39&&place.lng>124&&place.lng<132,id);
  if(food.has(id)){
   const row=food.get(id);
   assert.equal(row.name,place.name);
   assert.equal(row.address,place.address);
   assert.deepEqual([row.lat,row.lng],[place.lat,place.lng]);
   const legalNames=[row.coordinateName,row.coordinateName+' '+row.branch].map(normalize);
   assert(legalNames.includes(normalize(row.name)),id);
   assert.deepEqual(road(row.coordinateAddress),road(row.address),id);
   assert(place.description.includes(proof.mfds),id);
   if(detail)assert(detail.includes(proof.mfds),id);
   assert(conditions.get(place).some(row=>row.label==='체중 기준'&&row.value.includes('미확인')),id);
  }else{
   assert.equal(tourism.get(id)?.pet.contId,tourism.get(id)?.contentId,id);
   assert(evidence.conditions(place),id);
  }
 }
});

test('new photos retain source identity, individual reuse permission and original bytes',()=>{
 const byAsset=new Map(proof.photos.map(photo=>[photo.src,photo]));
 assert.equal(byAsset.size,batch.photographedPlaces+batch.coursePhotos);
 const all=[...batch.places.map(row=>evidence.get(row)?.photo),...batch.courses.map(photos.get)].filter(Boolean);
 assert.equal(all.length,byAsset.size);
 for(const photo of all){
  const binding=byAsset.get(photo.src);
  assert(binding,photo.src);
  assert.equal(photo.original,binding.original);
  assert(['Type1','Type3'].includes(binding.rights));
  assert(photo.noCrop,photo.src);
  assert.equal(createHash('sha256').update(readFileSync('.'+photo.src)).digest('hex'),binding.sha256);
 }
});

test('new walking courses use original consecutive map segments and are marked as proposals',()=>{
 const context={CourseInfo:require('../course-info.js')};
 vm.createContext(context);
 for(const file of ['course-routes.js','course-expansion-20261017.js'])vm.runInContext(read(file),context);
 const segments=new Map(graph.ways.map(way=>[way.id,way]));
 for(const course of batch.courses){
  const row=proof.routes.find(x=>x.id===course.id);
  assert(row&&row.pet.acmpyTypeCd==='전구역 동반가능');
  assert(access.get(course));
  assert(context.CourseRoutes.get({...course,desc:course.description})?.proposed);
  assert.deepEqual(course.path,row.nodeIds.map(id=>graph.nodes[id]));
  assert.equal(row.wayIds.length,row.nodeIds.length-1);
  for(const [i,wayId] of row.wayIds.entries()){
   const way=segments.get(wayId);
   const [a,b]=row.nodeIds.slice(i,i+2);
   assert(way?.nodes.some((id,j)=>j&&((id===b&&way.nodes[j-1]===a)||(id===a&&way.nodes[j-1]===b))));
   assert(!['no','private','customers','permit'].includes(way.tags.access));
   assert.notEqual(way.tags.dog,'no');
  }
  const url='/courses/'+course.id+'/';
  assert(publicPaths.has(url));
  const detail=read('.'+url+'index.html');
  assert(detail.includes('제안 경로 안내'));
  assert(!detail.includes('id="detail-route-data"'));
 }
});
