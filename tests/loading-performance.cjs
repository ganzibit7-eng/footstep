const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8')+'\n'+fs.readFileSync('admin-panel.js','utf8');
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject};};
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
const elements=new Map();function el(id){if(!elements.has(id))elements.set(id,{textContent:'',innerHTML:'',disabled:false,hidden:false,style:{},classList:{contains:()=>false},closest:()=>null,querySelector:()=>el('notice-span')});return elements.get(id);}
const document={getElementById:el,querySelector:el};
async function home(){
 const reads={},saved=[],countOnly=deferred(),counts=[{id:'open'},{id:'hidden'}];let grid=0;
 const ctx={document,localStorage:{getItem:()=>JSON.stringify({courses:205,facilities:412,at:Date.now()}),setItem:(_,v)=>saved.push(JSON.parse(v))},Date,
 courses:[],bins:[],facilities:[],reviews:{},profilesMap:{},courseBoosts:{},reports:{},myDeviceId:null,
 allCourses:()=>ctx.courses,isHidden:(_,id)=>id==='hidden',rowToCourse:x=>x,rowToBin:x=>x,
 fetchAllRows:table=>{reads[table]=deferred();return reads[table].promise;},renderGrid:()=>grid++,renderWalkReference(){},renderAll(){ctx.renderStats();},toast(){},console:{error(){}},isAdminUser:()=>false,
 sb:{rpc:async()=>({data:[]}),from:table=>table==='facilities'?{select:(columns,options)=>{assert.deepEqual({...options},{count:'exact',head:true});return {or:()=>countOnly.promise};}}:{select:()=>({gt:async()=>({data:[]})})}}};
 vm.createContext(ctx);vm.runInContext(html.slice(html.indexOf('  function renderStats(){'),html.indexOf('  // ===== 홈 화면 히어로 스타일')),ctx);
 vm.runInContext(html.slice(html.indexOf('  let courseDataState='),html.indexOf("  document.getElementById('data-load-retry').addEventListener")),ctx);
 const firstVisit={...ctx,localStorage:{getItem:()=>null,setItem(){}}};vm.createContext(firstVisit);
 vm.runInContext(html.slice(html.indexOf('  function renderStats(){'),html.indexOf('  // ===== 홈 화면 히어로 스타일')),firstVisit);
 vm.runInContext(html.slice(html.indexOf('  let courseDataState='),html.indexOf("  document.getElementById('data-load-retry').addEventListener")),firstVisit);
 firstVisit.renderStats();assert.equal(el('hero-stat-courses').textContent,'407개');assert.equal(el('hero-stat-facilities').textContent,'3,133곳');assert.match(el('home-count-status').textContent,/등록 정보 기준/);
 assert.match(html,/<div class="hero-stat-num" id="hero-stat-courses">407개<\/div>/,'first paint must contain a verified number without JavaScript');
 const loading=ctx.loadData();assert.equal(el('hero-stat-courses').textContent,'407개');assert.match(el('home-count-status').textContent,/등록 정보 기준/);
 reads.courses.resolve(counts);await flush();assert.equal(el('hero-stat-courses').textContent,'407개');assert.ok(grid>=2,'Course list must render without waiting for reviews');
 countOnly.resolve({count:1});await flush();assert.equal(ctx.facilities.length,0);reads.facilities.resolve([{status:'approved'},{status:'pending'}]);await flush();assert.equal(el('hero-stat-facilities').textContent,'3,133곳');assert.match(el('home-count-status').textContent,/자료 추가 시 갱신/);assert.equal(saved.length,0);
 reads.bins.resolve([]);reads.reviews.resolve([]);await loading;
 const failed=ctx.loadData();reads.courses.reject(Error('network'));reads.facilities.resolve([]);reads.bins.resolve([]);reads.reviews.resolve([]);await failed;
 assert.equal(el('hero-stat-courses').textContent,'407개');assert.equal(el('hero-stat-facilities').textContent,'3,133곳');assert.match(el('home-count-status').textContent,/등록 정보 기준/);

 const previousFacilityRead=reads.facilities;
 const deferredHome=ctx.loadData({deferFacilities:true});assert.equal(reads.facilities,previousFacilityRead,'Home must not start a full facility request');
 reads.courses.resolve(counts);reads.bins.resolve([]);reads.reviews.resolve([{course_id:'open',id:'review',text:'preserved'}]);await deferredHome;
 assert.equal(ctx.reviews.open[0].text,'preserved','Deferred facility slot must not overwrite review data');
 const first=ctx.ensureFacilityData(true);assert.notEqual(reads.facilities,previousFacilityRead);assert.equal(ctx.ensureFacilityData(),first,'Concurrent consumers share the full request');
 reads.facilities.resolve([{status:'approved'}]);await first;assert.equal(ctx.facilities.length,1);assert.equal(vm.runInContext('facilityDataAvailable',ctx),true);
 await ctx.ensureFacilityData();assert.equal(ctx.facilities.length,1);
 assert(!html.includes('seedIfNeeded().then(loadData)'));
}
async function members(){
 let profiles=deferred(),activity=deferred(),queries=0,paints=[];
 const ctx={document,Date,myDeviceId:'admin',memberListRequest:0,allMembersCache:[],memberPointsMap:{},memberVisitMap:{},memberLastSeenMap:{},
 isAdminUser:id=>id==='admin',readSignupMembers:()=>{queries++;return profiles.promise;},sb:{rpc:name=>{assert.equal(name,'admin_member_activity_summary');queries++;return activity.promise;}},console:{error(){}},renderMemberSummary(){},applyMemberFilters(){paints.push(ctx.allMembersCache.map(x=>x.owner_id));}};
 ctx.context=ctx;vm.createContext(ctx);vm.runInContext(html.slice(html.indexOf("  let memberActivityState='loading'"),html.indexOf('  function daysAgoLabel(')),ctx);
 const loading=ctx.renderAllMemberList();assert.equal(ctx.renderAllMemberList(),loading);assert.equal(queries,2);
 profiles.resolve([{owner_id:'member'}]);await flush();assert.deepEqual(paints.at(-1),['member']);assert.equal(el('export-members-csv-btn').disabled,true);
 activity.resolve({data:[{owner_id:'member',points:'130',visits:'45',last_seen:'2026-10-11T01:00:00Z'}]});await loading;
 assert.equal(ctx.memberPointsMap.member,130);assert.equal(ctx.memberVisitMap.member,45);assert.equal(el('export-members-csv-btn').disabled,false);
 await ctx.renderAllMemberList();assert.equal(queries,2,'Reopening should reuse the same-viewer recent result');
 profiles=deferred();activity=deferred();const failing=ctx.renderAllMemberList(true);profiles.resolve([{owner_id:'member'}]);activity.resolve({error:Error('summary failed')});await failing;
 assert.equal(ctx.allMembersCache.length,1);assert.equal(el('export-members-csv-btn').disabled,true);assert.match(el('member-auto-status').textContent,/부가 정보 조회 실패/);
 profiles=deferred();activity=deferred();const stale=ctx.renderAllMemberList(true);ctx.myDeviceId=null;ctx.clearMemberInventory();profiles.resolve([{owner_id:'private'}]);activity.resolve({data:[]});await stale;assert.equal(ctx.allMembersCache.length,0);assert.equal(el('all-member-list').textContent,'');
 assert.match(html,/metricPending\?metricLabel:visitCount/);assert.match(html,/metricPending\?'disabled'/);
}
(async()=>{await home();await members();console.log('PASS: published home counts remain stable across data loads and failures, early course list, roster before metrics, aggregate RPC, deduplication, recent reuse, metric failure and logout stale-response protection.');})().catch(e=>{console.error(e);process.exitCode=1;});
