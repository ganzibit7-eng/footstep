const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const script=html.match(/<script>\s*\/\/ Published course pages[\s\S]*?<\/script>/)[0].replace(/^<script>|<\/script>$/g,'');
function route(href){let destination;const context={URL,window:{},location:{href,replace(value){destination=value;}}};vm.runInNewContext(script,context);return {destination,ids:context.window.PawCoursePages};}
assert.equal(route('https://balzaguk.com/?course=c309').destination,'https://balzaguk.com/courses/c309/');
assert.equal(route('https://balzaguk.com/?course=c309&utm_source=naver').destination,'https://balzaguk.com/courses/c309/?utm_source=naver');
for(const url of ['https://balzaguk.com/#map&course=c309','https://balzaguk.com/?course=unknown','https://balzaguk.com/?course=../privacy','https://balzaguk.com/courses/c309/?course=c309'])assert.equal(route(url).destination,undefined);
assert.equal((html.match(/<h1\b/g)||[]).length,1);
for(const id of route('https://balzaguk.com/').ids)assert.ok(fs.existsSync(path.join(root,'courses',id,'index.html')),id);
const detail=fs.readFileSync(path.join(root,'courses/c309/index.html'),'utf8');
assert.ok(detail.includes('https://balzaguk.com/#map&course=c309'));
assert.ok(!detail.includes('https://balzaguk.com/?course='));
assert.ok(html.includes("window.location.hash.slice(1).split('&')[0]"));
assert.ok(html.includes("new URLSearchParams(window.location.hash.split('&').slice(1).join('&')).get('course')"));
assert.ok(fs.readFileSync(path.join(root,'favicon.ico')).length>22);
console.log('PASS: legacy course redirect, tracking parameters, fragment map entry, unknown/path traversal rejection, published routes, one home H1 and favicon.');
