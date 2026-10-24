const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const A=require('../admin-analytics.js');
const fixture=()=>({days:7,to:'2026-10-24T12:00:00Z',views:12,visitors:8,engaged_visitors:3,previous_views:10,raw_views:15,excluded_views:3,unmeasured_views:0,daily:[{date:'2026-10-23',views:10,visitors:7,engaged:2},{date:'2026-10-24',views:2,visitors:2,engaged:1}]});
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
test('chart preserves source rows, distinguishes unknowns and never bridges a missing value',()=>{
 const data=fixture();data.daily.splice(1,0,{date:'2026-10-23x',views:null});assert.throws(()=>A.dailyRows(data));
 const rows=[{date:'2026-10-21',views:5},{date:'2026-10-22',views:null},{date:'2026-10-23',views:0}],copy=JSON.stringify(rows),model=A.chartModel(rows,'views');
 assert.equal(model.points[1].y,null);assert.equal(model.points[2].value,0);assert.equal((model.path.match(/ M/g)||[]).length,2);assert.equal(JSON.stringify(rows),copy);
 assert.equal(A.chartModel([rows[0]],'views').points[0].x,360);assert.equal(A.chartModel([],'views').points.length,0);assert.throws(()=>A.chartModel(rows,'people'));
});
test('daily dates reject injection, duplicate dates, impossible dates and unordered source data',()=>{
 for(const daily of [[{date:'<img src=x>'}],[{date:'2026-02-30'}],[{date:'2026-10-24'},{date:'2026-10-24'}],[{date:'2026-10-24'},{date:'2026-10-23'}]])assert.throws(()=>A.dailyRows({daily}));
 const data=fixture(),copy=JSON.stringify(data);assert.equal(A.dailyRows(data).length,2);assert.equal(JSON.stringify(data),copy);
});
test('comparison uses actual previous values, handles zero and omits unsupported comparisons',()=>{
 assert.match(A.comparison(fixture()),/\+2회 · \+20.0%/);
 assert.match(A.comparison({views:0,previous_views:5}),/-5회 · -100.0%/);
 assert.equal(A.comparison({views:10,previous_views:0}),'이전 동기간 대비 조회 +10회 · 이전 0회');
 assert.equal(A.comparison({views:10}),'이전 기간 비교 자료 없음');
 assert.match(A.summary(fixture()),/사람 인증은 아닙니다/);assert.match(A.summary(fixture()),/일별 브라우저 수를 더한 값과 다를/);
});
test('CSV retains the original aggregate columns and unknowns are blank instead of zero',()=>{
 const data=fixture();data.daily[1].visitors=null;const csv=A.csv(data);
 assert(csv.startsWith('\uFEFF"날짜(KST)"'));assert(csv.includes('"2026-10-24","2","","1"'));assert(!csv.includes('NaN'));
 assert.throws(()=>A.csv({daily:[{date:'=WEBSERVICE("x")',views:5}]}));
 assert.equal(A.kstTime('2026-10-24T00:00:00Z'),'09:00:00 KST');
});
test('live polling coalesces overlapping requests and counts only confirmed numeric results',async()=>{
 const d=deferred(),states=[];let calls=0;const live=A.createLive({fetchCount:()=>{calls++;return d.promise;},render:s=>states.push(s),isCurrent:()=>true,now:()=>new Date('2026-10-24T00:00:00Z')});
 assert.equal(await live.update(),false);live.start();const first=live.update(),second=live.update();assert.equal(first,second);assert.equal(calls,1);
 d.resolve({data:0});assert.equal(await first,true);assert.equal(states.at(-1).value,0);assert.equal(states.at(-1).status,'ready');assert.equal(A.kstTime(states.at(-1).updated),'09:00:00 KST');
});
test('live failure is explicit, preserves last successful time and recovers without a zero fallback',async()=>{
 const states=[];let response={data:3};const live=A.createLive({fetchCount:async()=>response,render:s=>states.push(s),isCurrent:()=>true,now:()=>new Date('2026-10-24T00:00:00Z')});live.start();await live.update();
 response={error:new Error('offline')};assert.equal(await live.update(),false);assert.equal(states.at(-1).status,'error');assert.equal(states.at(-1).value,3);assert(states.at(-1).updated);
 response={data:null};assert.equal(await live.update(),false);assert.equal(states.at(-1).status,'error');response={data:5};assert.equal(await live.update(),true);assert.equal(states.at(-1).value,5);
});
test('closing or switching identity rejects late live responses; reopening can start a fresh request',async()=>{
 const first=deferred(),second=deferred(),states=[];let current=true,calls=0;
 const live=A.createLive({fetchCount:()=>++calls===1?first.promise:second.promise,render:s=>states.push(s),isCurrent:()=>current});live.start();const old=live.update();live.stop();live.start();const next=live.update();
 first.resolve({data:99});assert.equal(await old,false);assert(!states.some(s=>s.value===99));current=false;second.resolve({data:4});assert.equal(await next,false);assert(!states.some(s=>s.status==='ready'));live.stop();
});
function traffic(){
 const nodes={};for(const id of ['admin-traffic-result','admin-traffic-export','admin-traffic-status','admin-traffic-retry','admin-traffic-period'])nodes[id]={attrs:{},value:'7',setAttribute(k,v){this.attrs[k]=v;}};
 const requests=[],charts=[],context={context:{myDeviceId:'admin'},isAdminUser:()=>true,document:{getElementById:id=>nodes[id]},affiliateAdmin:{load(){}},sb:{rpc(name,args){const d=deferred();requests.push({name,args,...d});return d.promise;}},escapeHtml:s=>s,adminTrafficPageLink:s=>s,renderAdminBots(){},renderAdminSecurity(){},AdminAnalytics:{...A,mountChart(el,data){charts.push(data);}}};
 const source=fs.readFileSync('admin-panel.js','utf8');vm.runInNewContext(source.slice(source.indexOf(' let adminTrafficData=null'),source.indexOf(" document.getElementById('admin-traffic-period').addEventListener")),context);
 return {context,nodes,requests,charts};
}
test('newest traffic period wins and stale responses cannot change the chart or CSV state',async()=>{
 const h=traffic(),first=h.context.renderAdminTraffic();h.nodes['admin-traffic-period'].value='30';const second=h.context.renderAdminTraffic();
 assert.equal(h.nodes['admin-traffic-export'].disabled,true);assert.equal(h.requests[1].args.p_days,30);
 h.requests[1].resolve({data:{...fixture(),days:30}});assert.equal(await second,true);assert.equal(h.charts[0].days,30);assert.equal(h.nodes['admin-traffic-export'].disabled,false);
 h.requests[0].resolve({data:fixture()});assert.equal(await first,false);assert.equal(h.charts.length,1);assert.equal(h.nodes['admin-traffic-result'].attrs['aria-busy'],'false');
});
test('traffic failure enables retry and identity changes cannot display an old admin response',async()=>{
 const h=traffic(),first=h.context.renderAdminTraffic();h.requests[0].resolve({error:new Error('offline')});assert.equal(await first,false);assert.equal(h.nodes['admin-traffic-retry'].hidden,false);assert.equal(h.nodes['admin-traffic-export'].disabled,true);assert.match(h.nodes['admin-traffic-status'].textContent,/조회 실패/);
 const second=h.context.renderAdminTraffic();h.context.context.myDeviceId='other-admin';h.requests[1].resolve({data:fixture()});assert.equal(await second,false);assert.equal(h.charts.length,0);
});
