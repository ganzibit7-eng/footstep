const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),zlib=require('node:zlib');
const html=fs.readFileSync('index.html','utf8');
const courses=JSON.parse(zlib.gunzipSync(fs.readFileSync('docs/pet-access-audit-20261010/public-courses.json.gz')));
const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{hidden:true,textContent:'',innerHTML:'',listeners:{},setAttribute(k,v){this[k]=v;},removeAttribute(k){delete this[k];},replaceChildren(){this.innerHTML='';},focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;},querySelector(){return element('compare-clear-control');},querySelectorAll(){return [];},addEventListener(k,fn){this.listeners[k]=fn;}});return elements.get(id);}
let running=false,hidden=new Set(),opened=[],pages=[],messages=[],gpsStarts=0;
const ctx={courseDataAvailable:true,courseDataState:"ready",walkReferenceCourseId:null,CoursePetAccess:require('../course-pet-access.js'),CourseComfort:require('../course-comfort.js'),CourseAddresses:{get:()=>null},
 courseWalkTime:()=>({minutes:54,official:false}),avgRating:()=>0,reviewsFor:()=>[],tagLabel:x=>x,
 escapeHtml:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 allCourses:()=>courses,isHidden:(_,id)=>hidden.has(id),walkInProgress:()=>running,walkStarting:false,
 closeModal(){ctx.activeCourseId=null;},showPage(page){pages.push(page);ctx.renderWalkReference();},openCourseDetail:id=>opened.push(id),toast:s=>messages.push(s),
 startWalk:()=>gpsStarts++,document:{getElementById:element,querySelectorAll:()=>[]}};
vm.createContext(ctx);
vm.runInContext(html.slice(html.indexOf('  const compareCourseIds=new Set();'),html.indexOf('  function updateCollectionHints()')),ctx);
vm.runInContext(html.slice(html.indexOf('  let walkReferenceCourseId=restoredCourseSelection.reference;'),html.indexOf("  document.getElementById('walk-start-btn').addEventListener")),ctx);
const first=courses.find(c=>c.id==='c388'),second=courses.find(c=>c.id==='c133');assert.ok(first&&second);
ctx.prepareCourseWalk(first.id);
assert.equal(pages.at(-1),'walk');assert.equal(element('walk-reference-name').textContent,first.name);
assert.match(element('walk-reference-info').innerHTML,/허용 구역:.*필수 조건:/);
assert.match(element('walk-reference-info').innerHTML,/계단 수 미확인/);
assert.ok(element('walk-reference-info').innerHTML.includes(ctx.CoursePetAccess.get(first).source));
assert.equal(element('walk-reference-details').open,false);assert.equal(element('walk-reference-title').focused,true);
assert.equal(element('walk-reference').scrolled,true);
assert.equal(element('walk-reference-directions').href,'https://map.kakao.com/link/to/'+encodeURIComponent(first.name)+','+Number(first.lat)+','+Number(first.lng));
assert.equal(gpsStarts,0,'Preparation must never start GPS');
element('walk-reference-open').listeners.click();assert.equal(opened.at(-1),first.id);
for(const state of ['running','starting']){
 running=state==='running';ctx.walkStarting=state==='starting';
 ctx.prepareCourseWalk(second.id);assert.equal(element('walk-reference-name').textContent,first.name,'Recording/requesting position must preserve reference');
 element('walk-reference-clear').listeners.click();assert.equal(element('walk-reference-name').textContent,first.name);
}
running=false;ctx.walkStarting=false;
hidden.add(second.id);ctx.prepareCourseWalk(second.id);assert.equal(element('walk-reference-name').textContent,first.name);
hidden.add(first.id);element('walk-reference-open').listeners.click();assert.equal(element('walk-reference').hidden,true);
assert.equal(element('walk-reference-info').innerHTML,'');assert.equal(element('walk-reference-directions').href,undefined);
hidden.clear();ctx.activeCourseId=second.id;element('course-prepare-walk').listeners.click();assert.equal(element('walk-reference-name').textContent,second.name);
const original={...second};second.path=[];ctx.renderWalkReference();assert.match(element('walk-reference-info').innerHTML,/동반 안내 미확인/);assert.ok(!element('walk-reference-info').innerHTML.includes('공식 동반 안내 원문'));
Object.assign(second,original);
const unsafe={...first,id:'unsafe',name:'<img src=x onerror=alert(1)>',lat:null,lng:''};courses.push(unsafe);ctx.prepareCourseWalk(unsafe.id);
assert.ok(!element('walk-reference-info').innerHTML.includes('<img'));assert.equal(element('walk-reference-directions').hidden,true);
element('walk-reference-clear').listeners.click();assert.equal(element('walk-reference').hidden,true);assert.equal(element('walk-start-btn').focused,true);assert.equal(gpsStarts,0);
ctx.toggleCourseComparison(first.id);assert.ok(element('course-compare').innerHTML.includes('data-compare-prepare="'+first.id+'"'));
console.log('PASS: comparison/detail preparation, verified conditions and source, unknowns after route edits, recording/position-request guard, hidden courses, safe links, clear focus and no automatic GPS.');

let stored=JSON.stringify({compare:[first.id,second.id,first.id,42,'missing'],reference:first.id});
const storage={getItem:()=>stored,setItem:(_,value)=>{stored=value;}};
const compareSource=html.slice(html.indexOf('  const compareCourseIds=new Set();'),html.indexOf('  function updateCollectionHints()'));
const referenceSource=html.slice(html.indexOf('  let walkReferenceCourseId=restoredCourseSelection.reference;'),html.indexOf("  document.getElementById('walk-start-btn').addEventListener"));
function reload(sessionStorage=storage){
 const fresh={...ctx,sessionStorage,courseDataAvailable:false,courseDataState:'loading'};
 fresh.showPage=()=>fresh.renderWalkReference();vm.createContext(fresh);
 vm.runInContext(compareSource+referenceSource+'\nthis.selection=compareCourseIds;',fresh);return fresh;
}
let restored=reload();restored.renderCourseComparison();restored.renderWalkReference();
assert.deepEqual([...restored.selection],[first.id,second.id,'missing']);
assert.equal(element('course-compare').hidden,true);assert.equal(element('walk-reference').hidden,true);
assert.ok(stored.includes('missing'),'Loading must not delete restored IDs');
restored.courseDataState='error';restored.renderCourseComparison();restored.renderWalkReference();assert.ok(stored.includes('missing'));
restored.courseDataAvailable=true;restored.courseDataState='ready';
restored.renderCourseComparison();restored.renderWalkReference();
assert.deepEqual([...restored.selection],[first.id,second.id]);assert.equal(element('walk-reference-name').textContent,first.name);
assert.deepEqual(JSON.parse(stored),{compare:[first.id,second.id],reference:first.id});
restored=reload();restored.courseDataAvailable=true;restored.renderCourseComparison();restored.renderWalkReference();
assert.equal(element('compare-selection-count').textContent,'2/3개 선택');assert.equal(element('walk-reference-name').textContent,first.name);
hidden.add(first.id);restored.renderCourseComparison();restored.renderWalkReference();
assert.deepEqual(JSON.parse(stored),{compare:[second.id],reference:null});hidden.clear();
element('compare-clear').onclick();assert.deepEqual(JSON.parse(stored),{compare:[],reference:null});
for(const bad of ['{broken',JSON.stringify({compare:'invalid',reference:{id:first.id}})]){
 stored=bad;assert.equal(reload().selection.size,0);
}
const blocked=reload({getItem(){throw Error('blocked');},setItem(){throw Error('quota');}});
blocked.courseDataAvailable=true;blocked.toggleCourseComparison(first.id);blocked.prepareCourseWalk(first.id);
assert.equal(element('walk-reference-name').textContent,first.name);assert.equal(gpsStarts,0);
console.log('PASS: same-tab reload, loading/error preservation, deduplication, stale/hidden cleanup, persisted clear, malformed/blocked storage and no automatic GPS.');
