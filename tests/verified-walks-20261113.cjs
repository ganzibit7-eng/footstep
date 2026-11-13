const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync,existsSync}=require('node:fs');
const {createHash}=require('node:crypto');
const {courses,evidence,holds,publicBefore,publicAfter}=require('../docs/verified-walks-20261113/batch.json');
const Access=require('../course-pet-access.js');
const Address=require('../course-addresses.js');
const Photos=require('../course-photos.js');
const credits=require('../assets/course-photos/credits.json');
const delivery=require('../docs/verified-walks-20261113/photo-delivery.json');

test('new courses have same-place pet evidence, correct rights, and real connected geometry when present',()=>{
 assert.equal(publicAfter,publicBefore+courses.length);
 assert.equal(publicAfter,require('../docs/municipal-walks-20261113/batch.json').publicBefore);
 assert.equal(new Set(courses.map(c=>c.id)).size,courses.length);
 for(const course of courses){
  const proof=evidence.find(e=>e.id===course.id);
  const access=Access.get(course),photo=Photos.get(course),address=Address.get(course);
  assert(access&&photo&&address,course.id);
  assert.equal(proof.rawPet.contId,proof.contentId);
  assert.equal(proof.rawPet.acmpyTypeCd,'전구역 동반가능');
  assert.match(access.conditions.동반구분,/야외/);
  assert.equal(proof.photo.contentId,photo.datasetContentId);
  assert.equal(proof.photo.cpyrhtDivCd,photo.rightsType);
  const original=credits.find(p=>Object.hasOwn(p.courses,course.id));
  assert.equal(createHash('sha256').update(readFileSync('.'+original.src)).digest('hex'),photo.assetSha256);
  if(photo.rightsType==='Type3'){
   assert(photo.noCrop);
   assert.equal(photo.assetSha256,photo.sourceSha256);
  }
  if(course.path){
   const {nodeIds,wayIds,ways}=proof.geometry;
   assert.equal(proof.location,'proposed');
   assert.deepEqual(course.path[0],[course.lat,course.lng]);
   assert.equal(nodeIds.length,course.path.length);
   assert.equal(wayIds.length,nodeIds.length-1);
   for(const [i,wayId] of wayIds.entries()){
    const points=ways.find(w=>w.id===wayId).pts;
    const a=points.findIndex(([id],j)=>id===nodeIds[i]&&[points[j-1],points[j+1]].some(p=>p?.[0]===nodeIds[i+1]));
    assert(a>=0,course.id);
    const b=[points[a-1],points[a+1]].find(p=>p?.[0]===nodeIds[i+1]);
    assert.deepEqual(points[a].slice(1),course.path[i]);
    assert.deepEqual(b.slice(1),course.path[i+1]);
   }
  }else{
   assert.equal(proof.location,'reference-point');
   assert.equal(course.distance,'');
   assert.match(address.point,/출발점 미확인/);
  }
 }
 assert.match(Access.get(courses.find(c=>c.id.endsWith('_126317'))).conditions.동반가능동물,/10kg 이하/);
});

test('every approved addition reaches detail, search, home directory and sitemap',()=>{
 const search=new Set(require('./search-records.cjs')().map(row=>row.path));
 const sitemap=readFileSync('sitemap.xml','utf8');
 const home=readFileSync('index.html','utf8');
 for(const c of courses){
  const url='/courses/'+c.id+'/';
  const html=readFileSync('.'+url+'index.html','utf8');
  assert(html.includes(c.name));
  assert(html.includes(Photos.get(c).src));
  assert(html.includes(c.path?'제안 경로 안내':'출발점 미확인'));
  assert(search.has(url));
  assert(sitemap.includes('https://balzaguk.com'+url));
  assert(home.includes('"'+c.id+'"'));
 }
 for(const item of holds)assert(!existsSync('courses/walk_20261113_kto_'+item.contentId));
});

test('shared originals keep the published URL, source bytes and Pages exclusions in sync',()=>{
 const config=readFileSync('_config.yml','utf8');
 for(const [src,proof] of Object.entries(delivery)){
  assert(config.includes('  - '+src.slice(1)));
  const bytes=readFileSync('.'+src);
  assert.equal(bytes.length,proof.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),proof.sha256);
  for(const [id,name] of Object.entries(credits.find(p=>p.src===src).courses))assert.equal(Photos.get({id,name}).src,proof.url);
 }
});
