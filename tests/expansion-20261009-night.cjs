const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const path=require('node:path'),root=path.resolve(__dirname,'..'),dir=path.join(root,'docs/expansion-20261009-night');
const courses=JSON.parse(fs.readFileSync(path.join(root,'database_sql/seed_expansion_walks_20261009_night.sql'),'utf8').match(/\$payload\$([\s\S]*?)\$payload\$/)[1]);
const evidence=JSON.parse(require('node:zlib').gunzipSync(fs.readFileSync(path.join(dir,'routes.json.gz'))));
const originals=JSON.parse(require('node:zlib').gunzipSync(fs.readFileSync(path.join(dir,'gpx-originals.json.gz'))));
const context={CourseInfo:require('../course-info.js'),CourseRoutes:{get:()=>null,isLoop:()=>false}};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'course-expansion-20261009-night.js'),'utf8'),context);
function meters(a,b){const r=Math.PI/180;return Math.hypot((b[0]-a[0])*r,(b[1]-a[1])*r*Math.cos((a[0]+b[0])*r/2))*6371000;}
assert.equal(courses.length,52);assert.equal(new Set(courses.map(c=>c.id)).size,52);
for(const c of courses){
 const e=evidence.find(x=>x.id===c.id);assert(e);assert.deepEqual(c.path,e.path);
 assert.equal(crypto.createHash('sha256').update(Buffer.from(originals[e.facts.crs_idx],'base64')).digest('hex'),e.sha256);
 const total=c.path.slice(1).reduce((s,p,i)=>s+meters(c.path[i],p),0);assert(Math.abs(total-e.meters)<.01);
 assert(c.path.slice(1).every((p,i)=>meters(c.path[i],p)<=220));
 assert(total/(e.facts.crs_Dstnc*1000)>=.7&&total/(e.facts.crs_Dstnc*1000)<=1.3);
 assert.deepEqual([c.lat,c.lng],c.path[0]);
 const r=context.CourseRoutes.get(c);assert(r,c.id);assert.equal(r.path,c.path);assert.equal(r.petStatus,'needs_confirmation');
 assert.equal(context.CourseRoutes.get({...c,name:c.name+' edited'}),null);
 const edited=c.path.map(p=>[...p]);edited[1][0]+=.001;assert.equal(context.CourseRoutes.get({...c,path:edited}),null);
 assert.equal(context.CourseRoutes.get({...c,description:'no source'}),null);
 assert(c.tags.includes('동반 확인 필요'));assert(c.description.includes('반려견 동반 조건 미확인'));
}
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');assert(home.includes('course-expansion-20261009-night.js'));assert(home.includes('!needsPetCheck(c)'));
console.log('PASS: 52 original GPX files and immutable coordinate bindings, continuity, distance, pet warnings and recommendation exclusion');
