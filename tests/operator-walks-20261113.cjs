const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync,existsSync}=require('node:fs');
const {createHash}=require('node:crypto');
const batch=require('../docs/operator-walks-20261113/batch.json');
const review=require('../docs/walks-route-review-20261113/batch.json');
const amended=new Map(review.updates.map(x=>[x.after.id,x.after]));
const delivery=require('../docs/operator-walks-20261113/photo-delivery.json');
const priorBatches=['verified-walks-20261113','municipal-walks-20261113','regional-walks-20261113'].map(n=>require('../docs/'+n+'/batch.json'));
const priorIds=new Set(priorBatches.flatMap(b=>b.courses.map(c=>c.id)));
const Access=require('../course-pet-access.js');
const Info=require('../course-info.js');
const Addresses=require('../course-addresses.js');
const Photos=require('../course-photos.js');
const credits=require('../assets/course-photos/credits.json');
const hash=b=>createHash('sha256').update(b).digest('hex');

test('operator-verified additions pair the same outdoor walking area, pet rules and licensed photograph',()=>{
 const {courses,evidence,publicBefore,publicAfter,checked}=batch;
 assert.equal(publicAfter,publicBefore+courses.length);
 assert.equal(review.publicBefore,publicAfter);
 assert.equal(new Set(courses.map(c=>c.name)).size,courses.length);
 assert(courses.every(c=>!priorIds.has(c.id)));
 for(const originalCourse of courses){
  const c=amended.get(originalCourse.id)||originalCourse;
  const proof=evidence.find(p=>p.id===c.id);
  const access=Access.get(c),photo=Photos.get(c),address=Addresses.get(c);
  assert(access&&photo&&address,c.id);
  assert.equal(Info.sourceURL(c.description),proof.source,c.id);
  assert.equal(Info.checkedDate(c.description),amended.has(c.id)?review.checked:checked,c.id);
  assert(!Info.cleanDescription(c.description).includes('공식안내:'),c.id);
  assert.equal(access.conditions.동반구분,proof.scope);
  assert.equal(proof.contentId,photo.datasetContentId);
  assert.equal(proof.photo.contentId,proof.contentId);
  assert.equal(proof.photo.cpyrhtDivCd,photo.rightsType);
  if(proof.rawPet){
   assert.equal(proof.rawPet.contId,proof.contentId);
   assert.match(proof.rawPet.acmpyTypeCd,/^(?:전구역|일부구역) 동반가능$/);
  }else{
   assert.notEqual(new URL(proof.source).hostname,'api.visitkorea.or.kr');
  }
  const original=credits.find(p=>Object.hasOwn(p.courses,c.id));
  assert.equal(hash(readFileSync('.'+original.src)),photo.assetSha256);
  if(photo.rightsType==='Type3'){
   assert(photo.noCrop);
   assert.equal(photo.assetSha256,photo.sourceSha256);
  }
  if(amended.has(c.id))continue;
  if(!c.path){
   assert.equal(c.distance,'');
   assert.equal(proof.location,'reference-point');
   assert.match(address.point,/출발점 미확인/);
   continue;
  }
  assert.equal(proof.location,'proposed');
  assert.deepEqual(c.path[0],[c.lat,c.lng]);
  const {ways,nodeIds,wayIds}=proof.geometry;
  if(proof.contentId==='2930935'){
   assert.match(c.description,/폐쇄된 연결 계단은 경로에서 제외/);
   assert(c.path.every(([lat])=>lat<=33.4576));
  }
  assert.equal(nodeIds.length,c.path.length);
  assert.equal(wayIds.length,c.path.length-1);
  for(const [i,id] of wayIds.entries()){
   const {pts,tags}=ways.find(w=>w.id===id);
   assert(!tags.bridge&&!tags.tunnel&&['footway','path','pedestrian'].includes(tags.highway),c.id);
   const a=pts.findIndex(([n],j)=>n===nodeIds[i]&&[pts[j-1],pts[j+1]].some(p=>p?.[0]===nodeIds[i+1]));
   assert(a>=0,c.id);
   const b=[pts[a-1],pts[a+1]].find(p=>p?.[0]===nodeIds[i+1]);
   assert.deepEqual(pts[a].slice(1),c.path[i]);
   assert.deepEqual(b.slice(1),c.path[i+1]);
  }
 }
});

test('operator-verified additions are available in course details, home, search and sitemap',()=>{
 const search=new Set(require('./search-records.cjs')().map(row=>row.path));
 const sitemap=readFileSync('sitemap.xml','utf8');
 const home=readFileSync('index.html','utf8');
 for(const originalCourse of batch.courses){
  const c=amended.get(originalCourse.id)||originalCourse;
  const url='/courses/'+c.id+'/';
  const html=readFileSync('.'+url+'index.html','utf8');
  assert(html.includes(c.name),url);
  assert(html.includes(Photos.get(c).src),url);
  assert(html.includes(amended.has(c.id)?'공개 보행로 기반 제안 경로':c.path?'제안 경로 안내':'출발점 미확인'),url);
  assert(html.includes(Access.get(c).source.replaceAll('&','&amp;')),url);
  assert(search.has(url),url);
  assert(sitemap.includes('https://balzaguk.com'+url),url);
  assert(home.includes('"'+c.id+'"'),url);
 }
 for(const item of batch.holds){
  if(!review.evidence.some(x=>x.contentId===item.contentId))assert(!existsSync('courses/walk_20261113_kto_'+item.contentId));
 }
});

test('consolidated photograph delivery preserves the original bytes and photo mapping',()=>{
 const config=readFileSync('_config.yml','utf8');
 for(const [src,proof] of Object.entries(delivery)){
  assert(config.includes('  - '+src.slice(1)));
  const bytes=readFileSync('.'+src);
  assert.equal(bytes.length,proof.bytes);
  assert.equal(hash(bytes),proof.sha256);
  for(const [id,name] of Object.entries(credits.find(p=>p.src===src).courses)){
   assert.equal(Photos.get({id,name}).src,proof.url);
  }
 }
});
