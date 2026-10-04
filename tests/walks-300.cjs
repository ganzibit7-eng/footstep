const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path'),root=path.resolve(__dirname,'..');
const sql=fs.readFileSync(path.join(root,'database_sql/seed_expansion_walks_300_20261004.sql'),'utf8');
const courses=JSON.parse(sql.match(/\$payload\$([\s\S]*?)\$payload\$/)[1]);
const proof=JSON.parse(fs.readFileSync(path.join(root,'docs/walks-300-20261004/routes.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/walks-300-20261004/manifest.json'),'utf8'));
const context={CourseInfo:require('../course-info.js'),CourseRoutes:{get:()=>null,isLoop:()=>false}};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'course-expansion-300.js'),'utf8'),context);
function meters(a,b){const r=Math.PI/180;return Math.hypot((b[0]-a[0])*r,(b[1]-a[1])*r*Math.cos((a[0]+b[0])*r/2))*6371000;}
assert.equal(courses.length,83);assert.equal(manifest.after,300);assert.equal(new Set(courses.map(c=>c.id)).size,83);
for(const c of courses){
 const e=proof.find(x=>x.id===c.id);assert(e);assert.deepEqual(c.path,e.path);
 assert(c.path.length>=10);assert.deepEqual([c.lat,c.lng],c.path[0]);assert(c.path.every(p=>p.length===2&&p.every(Number.isFinite)&&p[0]>=33&&p[0]<=39.5&&p[1]>=124&&p[1]<=132));
 const total=c.path.slice(1).reduce((s,p,i)=>s+meters(c.path[i],p),0);assert(Math.abs(total-e.meters)<.01);assert(c.path.slice(1).every((p,i)=>meters(c.path[i],p)<=220));
 const route=context.CourseRoutes.get({...c,desc:c.description});assert(route,c.id);assert.equal(route.path,c.path);
 assert.equal(context.CourseRoutes.get({...c,name:c.name+' changed'}),null);
 const changed=c.path.map(p=>[...p]);changed[1][0]+=.001;assert.equal(context.CourseRoutes.get({...c,path:changed}),null);
 assert.equal(context.CourseRoutes.get({...c,description:'no source'}),null);
 if(c.tags.includes('동반 확인 필요')){assert.equal(route.petStatus,'needs_confirmation');assert(c.description.includes('반려견 동반 조건 미확인'));assert.equal(e.petStatus,'needs_confirmation');assert.equal(e.sha256.length,64);}
 else{assert.equal(e.pet.conditions['동반구분'],'전구역 동반가능');const ids=new Set(e.ways.map(w=>w.id));assert(e.wayIds.every(id=>ids.has(id)));for(let i=1;i<e.nodeIds.length;i++)assert(e.ways.some(w=>w.nodes.some((n,j)=>j&&((w.nodes[j-1]===e.nodeIds[i-1]&&n===e.nodeIds[i])||(w.nodes[j-1]===e.nodeIds[i]&&n===e.nodeIds[i-1])))));}
}
assert.equal(courses.filter(c=>c.tags.includes('동반 확인 필요')).length,77);
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');assert(home.includes('course-expansion-300.js'));assert(home.includes('!needsPetCheck(c)'));assert(home.includes('course-pet-check'));
console.log('PASS: 83 distinct sourced paths, original GPX/OSM nodes, distance and continuity, geometry binding, edited-path rejection, 77 explicit pet warnings and recommendation exclusion.');
