const {test}=require('node:test'),assert=require('node:assert/strict');
const A=require('../admin-analytics.js'),C=require('../admin-commercial.js');
const fixture=()=>({date_from:'2026-11-03',date_to:'2026-11-04',channels:Object.keys(C.CHANNELS).map(id=>({id,clicks:2,visitors:1,daily:[{date:'2026-11-03',views:null,visitors:null},{date:'2026-11-04',views:2,visitors:1}]}))});
test('commercial overview preserves unknown history and period distinct browser counts',()=>{
 const d=fixture(),copy=JSON.stringify(d),n=C.normalize(d,A);assert.equal(JSON.stringify(d),copy);assert.equal(n.channels[0].daily[0].views,null);assert.equal(n.channels[0].visitors,1);
 const csv=C.csv(n.channels[0]);assert(csv.startsWith('\uFEFF'));assert(csv.includes('"2026-11-03","",""'));assert(csv.includes('"2026-11-04","2","1"'));
 const p=n.channels.find(c=>c.id==='advertise');assert(C.csv(p).includes('조회 횟수'));assert(!C.csv(p).includes('클릭 횟수'));
});
test('invalid channel sets, impossible counts and malformed daily dates fail closed',()=>{
 for(const mutate of [d=>d.channels.pop(),d=>d.channels[0].id='unknown',d=>d.channels[0].id='trip',d=>d.channels[0].visitors=3,d=>d.channels[0].daily[0].date='<img src=x>']){const d=fixture();mutate(d);assert.throws(()=>C.normalize(d,A));}
});
