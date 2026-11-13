const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {createHash}=require('node:crypto');
const batch=require('../docs/walks-route-review-20261113/batch.json');
const previous=require('../docs/operator-walks-20261113/batch.json');
const Access=require('../course-pet-access.js');
const Address=require('../course-addresses.js');
const Photos=require('../course-photos.js');
const credits=require('../assets/course-photos/credits.json');
const rows=new Map([...batch.courses,...batch.updates.map(u=>u.after)].map(c=>[c.id,c]));
test('reviewed routes follow mapped pedestrian nodes and preserve pet access, images and route scope',()=>{
 assert.equal(batch.publicBefore,previous.publicAfter);
 assert.equal(batch.publicAfter,batch.publicBefore+batch.courses.length);
 assert.equal(batch.publicAfter,require('../data/public-counts.json').courses);
 assert.equal(batch.updates.length+Object.keys(batch.holds).length,previous.courses.filter(c=>!c.path).length);
 for(const {id,source,geometry,photo} of batch.evidence){
  const c=rows.get(id);
  assert(c&&Access.get(c)&&Address.get(c)&&Photos.get(c),id);
  assert.equal(Access.get(c).source,source);
  assert.deepEqual(c.path[0],[c.lat,c.lng]);
  assert.deepEqual(c.path,geometry.path);
  assert.equal(geometry.wayIds.length,c.path.length-1);
  for(const [i,wayId] of geometry.wayIds.entries()){
   const way=geometry.ways.find(w=>w.id===wayId);
   assert(['path','footway','pedestrian'].includes(way.tags.highway),id);
   assert(!['no','private','customers','permit'].some(flag=>[way.tags.access,way.tags.foot,way.tags.dog].includes(flag)),id);
   const start=way.pts.findIndex((p,j)=>p[0]===geometry.nodeIds[i]&&[way.pts[j-1],way.pts[j+1]].some(q=>q?.[0]===geometry.nodeIds[i+1]));
   assert(start>=0,id);
   const end=[way.pts[start-1],way.pts[start+1]].find(q=>q?.[0]===geometry.nodeIds[i+1]);
   assert.deepEqual(way.pts[start].slice(1),c.path[i]);assert.deepEqual(end.slice(1),c.path[i+1]);
  }
  const old=previous.courses.find(c=>c.id===id);
  if(old){assert.equal(old.name,c.name);assert.equal(old.created_at,c.created_at);}
  if(photo){
   const record=credits.find(x=>Object.hasOwn(x.courses,id));
   const hash=createHash('sha256').update(readFileSync('.'+record.src)).digest('hex');
   assert.equal(hash,record.assetSha256);
   if(photo.cpyrhtDivCd==='Type3')assert.equal(hash,record.sourceSha256);
  }
 }
});
test('all reviewed routes expose their exact line and photographic credit on published pages',()=>{
 const sitemap=readFileSync('sitemap.xml','utf8');
 const search=new Set(require('./search-records.cjs')().map(x=>x.path));
 for(const c of rows.values()){
  const url='/courses/'+c.id+'/',html=readFileSync('.'+url+'index.html','utf8');
  const route=JSON.parse(html.match(/id="detail-route-data">([^<]+)/)[1]);
  assert.deepEqual(route.parts,[c.path]);assert.equal(route.proposed,true);
  assert.match(html,/공개 보행로 기반 제안 경로/);assert.match(html,/route-experience\.js\?v=20261113-pedestrian/);
  assert(html.includes(Photos.get(c).src));assert(search.has(url));assert(sitemap.includes('https://balzaguk.com'+url));
 }
});
