const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),H=require('../home-browse.js'),Explore=require('../home-explore.js');
test('restored home filters reject malformed values without changing verified filtering',()=>{
 const s=H.sanitize({'home-walk-time':'-1','home-difficulty':'가짜','home-comfort-stairs':'true','home-query-input':'x'.repeat(200)});assert.equal(s['home-walk-time'],'0');assert.equal(s['home-difficulty'],'all');assert.equal(s['home-comfort-stairs'],false);assert.equal(s['home-query-input'].length,100);
 const state=H.sanitize({'home-walk-time':'20','home-difficulty':'쉬움'}),courses=[{id:'a',diff:'쉬움',minutes:15},{id:'b',diff:'쉬움',minutes:30},{id:'c',diff:'미확인',minutes:15}];assert.deepEqual(Explore.filter(courses,{region:'all',maxMinutes:+state['home-walk-time'],diff:state['home-difficulty']},{minutes:c=>c.minutes,address:()=>({}),query:()=>true,comfort:()=>true}).map(c=>c.id),['a']);
});
test('quick choices reuse existing form, retain advanced fields and isolate styling',()=>{
 const h=fs.readFileSync('index.html','utf8');for(const id of ['home-course-filter-form','home-active-conditions','home-walk-time','home-difficulty','home-filters-clear'])assert.equal((h.match(new RegExp('id="'+id+'"','g'))||[]).length,1);assert(h.includes('class="home-timing-options"'));assert(h.includes('data-quick-value="20"'));assert(h.includes('data-quick-value="쉬움"'));assert(!fs.readFileSync('home-browse.js','utf8').includes('fetch('));
});

