import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {createRequire} from 'node:module';
import vm from 'node:vm';

const require=createRequire(import.meta.url);
const info=require('../course-info.js');
const access=require('../course-pet-access.js');
const addresses=require('../course-addresses.js');
const photos=require('../course-photos.js');
const read=file=>readFileSync(file,'utf8');
const batch=JSON.parse(read('docs/verified-walks-20261111/batch.json'));
const paths=new Set(require('./search-records.cjs')().map(record=>record.path));
const context={CourseInfo:info};
vm.createContext(context);
for(const file of ['course-routes.js','course-expansion-20261017.js'])vm.runInContext(read(file),context);

function detail(course){
 const route='/courses/'+course.id+'/';
 assert(paths.has(route),route);
 const html=read('.'+route+'index.html');
 assert(html.includes('rel="canonical" href="https://balzaguk.com'+route+'"'));
 assert(html.includes(course.name));
 return html;
}

test('new dog-friendly walks bind each route and its photograph to the documented outdoor scope',()=>{
 assert.equal(batch.courses.length,batch.evidence.length);
 for(const course of batch.courses){
  const row=batch.evidence.find(item=>item.id===course.id);
  const route=context.CourseRoutes.get(course);
  assert(route?.proposed);
  assert.equal(route.pointCount,course.path.length);
  assert.deepEqual([course.lat,course.lng],course.path[0]);
  assert.equal(info.sourceURL(course.description),row.source);
  assert.equal(info.checkedDate(course.description),batch.checked);
  assert.equal(access.get(course).conditions['동반 관련 상세정보'],row.limits);
  assert.equal(addresses.get(course).source,row.source);
  assert.equal(row.wayIds.length,course.path.length-1);
  for(const [index,wayId] of row.wayIds.entries()){
   const way=row.ways.find(entry=>entry.id===wayId);
   const [a,b]=row.nodeIds.slice(index,index+2);
   const matched=way.pts.findIndex(([node],i)=>i&&((node===b&&way.pts[i-1][0]===a)||(node===a&&way.pts[i-1][0]===b)));
   assert(matched>0);
   const segment=way.pts.slice(matched-1,matched+1);
   if(segment[0][0]!==a)segment.reverse();
   assert.deepEqual(segment.map(p=>p.slice(1)),course.path.slice(index,index+2));
   for(const field of ['access','dog','foot'])assert(!['no','private','customers','permit'].includes(way.tags[field]));
  }
  const photo=photos.get(course);
  assert.equal(photo.original,row.photo.originimgurl);
  assert.equal(photo.datasetContentId,String(row.photo.contentId));
  assert.equal(photo.rightsType,row.photo.cpyrhtDivCd);
  assert.equal(createHash('sha256').update(readFileSync('.'+photo.src)).digest('hex'),photo.assetSha256);
  if(photo.rightsType==='Type3')assert.equal(photo.assetSha256,photo.sourceSha256);
  const html=detail(course);
  assert(html.includes(photo.src));
  assert(html.includes(row.source));
  assert(html.includes('제안 경로 안내'));
  assert(!html.includes('id="detail-route-data"'));
 }
});

test('Darangshwi Oreum keeps its URL and photograph and never offers the summit to dogs',()=>{
 const {previous,updated,source}=batch.correction;
 assert.equal(updated.id,previous.id);
 assert.equal(updated.path,null);
 assert.equal(access.get(previous),null);
 assert.equal(photos.get(previous),null);
 assert.equal(info.sourceURL(updated.description),source);
 assert.equal(access.get(updated).checkedDate,batch.checked);
 assert(access.get(updated).conditions['동반구분'].includes('둘레길에서만'));
 assert(addresses.get(updated).point.includes('출발점 미확인'));
 const html=detail(updated);
 assert(html.includes('정상 탐방로 반려동물 출입 금지'));
 const photo=photos.get(updated);
 assert.equal(photo.src,'/assets/course-photos/'+previous.id+'.webp');
 assert.equal(createHash('sha256').update(readFileSync('.'+photo.src)).digest('hex'),photo.assetSha256);
 assert(html.includes(photo.src));
 assert(!html.split('data-related-template=')[0].includes('전구역 동반가능'));
 assert(!html.includes('id="detail-route-data"'));
});


test('the Darangshwi place, its map record and the walking detail agree about the restricted summit',()=>{
 const {previous,updated,source}=batch.facilityCorrection;
 const evidence=require('../place-evidence.js');
 const conditions=require('../place-conditions.js');
 assert.equal(previous.id,updated.id);
 assert.equal(evidence.conditions(previous),null);
 assert.equal(conditions.source(updated),source);
 assert(conditions.get(updated)[0].value.includes('하단 둘레길에서만'));
 assert(conditions.get(updated)[0].value.includes('정상으로 오르는 오름 탐방로는 반려동물 출입 금지'));
 const route='/places/'+updated.id+'/';
 assert(paths.has(route));
 const html=read('.'+route+'index.html').split('data-related-template=')[0];
 assert(html.includes(updated.name));
 assert(html.includes('하단 둘레길에서만 반려견 동반 가능'));
 assert(!html.includes('전구역 동반가능'));
 assert(html.includes(evidence.get(updated).photo.src));
 assert(html.includes('alt="다랑쉬오름 일대 경관"'));
});
