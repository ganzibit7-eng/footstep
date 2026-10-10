const assert=require('node:assert/strict'),fs=require('node:fs'),zlib=require('node:zlib'),crypto=require('node:crypto'),vm=require('node:vm');
const access=require('../course-pet-access.js'),photos=require('../course-photos.js');
const courses=JSON.parse(zlib.gunzipSync(fs.readFileSync('docs/pet-access-audit-20261010/public-courses.json.gz')));
const review=JSON.parse(fs.readFileSync('docs/pet-access-audit-20261010/review.json'));
const context=vm.createContext({CourseInfo:require('../course-info.js')});
for(const name of ['course-routes.js','course-expansion-300.js','course-expansion-20261009.js','course-expansion-20261009-night.js'])vm.runInContext(fs.readFileSync(name,'utf8'),context);
assert.equal(courses.length,JSON.parse(fs.readFileSync('docs/pet-access-audit-20261010/summary.json')).publicCourses);
for(const c of courses){
 const r=review.find(r=>r.id===c.id);assert(r.publish && r.hasPhoto);assert(r.positive||r.scopeReview);
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(c.path)).digest('hex'),r.pathSha256);
 assert(access.get(c),c.id);assert(context.CourseRoutes.get({...c,desc:c.description}),'Missing original geometry '+c.id);assert(photos.get(c),'Missing licensed photo '+c.id);
 const original=context.CourseRoutes.get({...c,desc:c.description});
 if(c.path){let cursor=0;for(const point of c.path){while(cursor<original.path.length&&!point.every((v,j)=>Math.abs(v-original.path[cursor][j])<1e-9))cursor++;assert(cursor<original.path.length,'Point absent or reordered in original geometry '+c.id);cursor++;}assert(c.path[0].every((v,j)=>Math.abs(v-original.path[0][j])<1e-9));assert(c.path.at(-1).every((v,j)=>Math.abs(v-original.path.at(-1)[j])<1e-9));}
 else assert((original.parts||[original.path]).every(p=>p.length>1),'Missing original multipart path');
 assert.equal(access.get({...c,lat:c.lat+.001}),null);
 assert.equal(access.get({...c,name:c.name+' changed'}),null);
 assert.equal(access.get({...c,path:c.path?c.path.slice(1):[]}),null);
 assert.equal(access.get({...c,description:'No permission source'}),null);
 assert.equal(access.get({...c,tags:['동반 확인 필요']}),null);
 const page=fs.readFileSync('courses/'+c.id+'/index.html','utf8');assert(page.includes(photos.figure(c)));
}
for(const r of review.filter(r=>!r.publish))assert(!fs.existsSync('courses/'+r.id+'/index.html'),'Held route still publicly emitted: '+r.id);
assert(!fs.existsSync('courses/duru_T_CRS_MNG0000000243/index.html'));
const html=fs.readFileSync('index.html','utf8');assert(html.includes('!CoursePetAccess.get(item) || !CoursePhotos.get(item)'));assert(!html.includes('총 691개'));
console.log('PASS: public courses have bound original geometry, operator permission and licensed matching photos; edited and held routes excluded.');
