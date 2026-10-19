const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');const courses=JSON.parse(fs.readFileSync(path.join(root,'course-photos.js'),'utf8').match(/const records = (\[[\s\S]*?\]);/)[1]);
module.exports=function verifySource(p){
 assert(!['Type2','Type4'].includes(p.rightsType));
 if(p.photoKind==='shared-course-photo'){
  const original=courses.find(x=>Object.hasOwn(x.courses,p.sharedCourseId));assert(original,'existing course photo provenance');
  for(const key of ['src','source','original','author','license','licenseUrl'])assert.equal(p[key],original[key],key+' must preserve the prior source');
  assert(['CC BY-SA 3.0','CC BY-SA 4.0','공공누리 제1유형'].includes(p.license));assert(p.changes.includes(original.changes));assert(p.dateNote.includes(original.date||'미상'));assert.match(p.src,/^\/assets\/course-photos\/[A-Za-z0-9_-]+\.(webp|jpg)$/);
 }else{
  assert.match(p.src,/^\/assets\/(?:place-photos|place-supplement)\/kto-\d+(?:-[a-f0-9]{12})?\.(jpg|png)$/);
  assert.match(p.original,/^https:\/\/tong\.visitkorea\.or\.kr\/cms\/resource\//);assert.equal(p.licenseUrl,'https://www.data.go.kr/data/15101578/openapi.do');assert.match(p.dateNote,/미상/);
 }
};
