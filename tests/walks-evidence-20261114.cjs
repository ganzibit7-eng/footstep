const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {createHash}=require('node:crypto');
const batch=require('../docs/walks-evidence-20261114/batch.json');
const prior=require('../docs/walks-route-review-20261113/batch.json');
const Access=require('../course-pet-access.js');
const Addresses=require('../course-addresses.js');
const Photos=require('../course-photos.js');
const credits=require('../assets/course-photos/credits.json');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

test('new and revised walks follow exact consecutive public path nodes',()=>{
 assert.equal(batch.publicBefore,prior.publicAfter);
 assert.equal(batch.publicAfter,batch.publicBefore+batch.courses.length);
 assert.equal(batch.publicAfter,require('../data/public-counts.json').courses);
 const reviewed=[...batch.updates.map(x=>x.after.id.split('_').at(-1)),...Object.keys(batch.holds)];
 assert.deepEqual(reviewed.sort(),Object.keys(prior.holds).sort());
 for(const row of [...batch.courses,...batch.updates.map(x=>x.after)]){
  const proof=batch.evidence.find(e=>e.id===row.id);
  const {geometry:g}=proof;
  assert.deepEqual(row.path[0],[row.lat,row.lng]);
  assert.deepEqual(row.path,g.path);
  assert.equal(Access.get(row)?.source,proof.source);
  assert(Addresses.get(row)?.point.includes('지도상 출발 지점'));
  assert.equal(row.distance,(g.meters/1000).toFixed(2)+'km');
  assert.equal(g.wayIds.length,row.path.length-1);
  for(const [i,wayId] of g.wayIds.entries()){
   const way=g.ways.find(w=>w.id===wayId);
   assert(['path','footway','pedestrian'].includes(way.tags.highway),row.id);
   assert(!['no','private','customers','permit'].some(flag=>[way.tags.access,way.tags.foot,way.tags.dog].includes(flag)),row.id);
   const start=way.pts.findIndex((p,j)=>p[0]===g.nodeIds[i]&&[way.pts[j-1],way.pts[j+1]].some(q=>q?.[0]===g.nodeIds[i+1]));
   assert(start>=0,row.id);
   const end=[way.pts[start-1],way.pts[start+1]].find(p=>p?.[0]===g.nodeIds[i+1]);
   assert.deepEqual(way.pts[start].slice(1),row.path[i]);
   assert.deepEqual(end.slice(1),row.path[i+1]);
  }
  if(proof.photo){
   const p=Photos.get(row);
   const record=credits.find(x=>Object.hasOwn(x.courses,row.id));
   assert.equal(p.rightsType,proof.photo.cpyrhtDivCd);
   assert.equal(p.datasetContentId,proof.contentId);
   assert.equal(hash(readFileSync('.'+record.src)),p.assetSha256);
   if(p.rightsType==='Type3')assert.equal(p.assetSha256,p.sourceSha256);
  }
 }
});
test('course detail, search and sitemap preserve published links, photo credit and routes',()=>{
 const sitemap=readFileSync('sitemap.xml','utf8');
 const search=new Set(require('./search-records.cjs')().map(x=>x.path));
 const config=readFileSync('_config.yml','utf8');
 for(const row of [...batch.courses,...batch.updates.map(x=>x.after)]){
  const url='/courses/'+row.id+'/',html=readFileSync('.'+url+'index.html','utf8');
  const route=JSON.parse(html.match(/id="detail-route-data">([^<]+)/)[1]);
  assert.deepEqual(route.parts,[row.path]);
  assert.equal(route.proposed,true);
  assert.match(html,/공개 보행로 기반 제안 경로/);
  assert(html.includes(Photos.get(row).src));
  assert(search.has(url));
  assert(sitemap.includes('https://balzaguk.com'+url));
 }
 for(const [src,proof] of Object.entries(batch.delivery.shared)){
  const bytes=readFileSync('.'+src);
  assert.equal(bytes.length,proof.bytes);
  assert.equal(hash(bytes),proof.sha256);
  assert(bytes.equals(readFileSync('.'+proof.target)));
  assert(config.includes('  - '+src.slice(1)+'\n'));
  assert(!config.includes('  - '+proof.target.slice(1)+'\n'));
 }
 for(const [src,proof] of Object.entries(batch.delivery.remote)){
  assert.equal(hash(readFileSync('.'+src)),proof.sha256);
  assert(config.includes('  - '+src.slice(1)+'\n'));
 }
 for(const key of Object.keys(batch.holds)){
  const html=readFileSync('courses/walk_20261113_kto_'+key+'/index.html','utf8');
  assert(!html.includes('data-pedestrian-review'));
  assert(html.includes('정확한 경로 미확인'));
 }
});
