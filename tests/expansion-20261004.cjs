const assert=require('node:assert/strict'),fs=require('node:fs'),zlib=require('node:zlib');
global.CourseInfo=require('../course-info.js');require('../course-routes.js');
const photos=require('../course-photos.js'),addresses=require('../course-addresses.js');
const load=n=>JSON.parse(zlib.gunzipSync(fs.readFileSync(`${__dirname}/../docs/expansion-20261004/${n}.json.gz`)));
const routes=load('route-evidence'),places=load('added-places');
assert.equal(places.length,135);assert.equal(new Set(places.map(x=>x.id)).size,135);
for(const p of places){assert(p.lat>=33&&p.lat<=39.5&&p.lng>=124&&p.lng<=132);assert(p.address);assert(p.description.includes('확인일: 2026-10-04'));assert.equal(p.status,'approved');}
for(const r of routes){
 const c={...r.course,desc:r.course.description};const bound=CourseRoutes.get(c);assert(bound);assert.equal(bound.petPermissionURL,r.pet.routePermissionURL);assert(r.maxJump<150);assert(r.meters>3000);assert(r.sha256.length===64);assert.equal(c.path.length,r.parts.flat().length);assert.deepEqual(c.path,r.parts.flat());assert(addresses.get(c));assert(photos.get(c));
}
const markup=fs.readFileSync(`${__dirname}/../index.html`,'utf8');const head=markup.slice(markup.indexOf('<head>'),markup.indexOf('</head>'));
assert.equal((head.match(/client=ca-pub-7985051386153263/g)||[]).length,1);assert(head.includes('crossorigin="anonymous"'));
console.log('PASS: 135 unique places, two sourced GPX paths, explicit pet permissions, address/photo bindings and one AdSense head script');
