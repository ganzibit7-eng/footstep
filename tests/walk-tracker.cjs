const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {Tracker}=require('../walk-tracker.js');
const fix=(time,lat=37,lng=127,accuracy=5)=>({timestamp:time,coords:{latitude:lat,longitude:lng,accuracy}});
const t=new Tracker(70);t.start(1000);
assert.equal(t.add(fix(1000),1000),'accepted');
for(let i=1;i<=20;i++)t.add(fix(1000+i*1000,37+(i%2)*0.000005),1000+i*1000);
assert.equal(t.distanceM,0,'stationary jitter must not add distance');
assert.equal(t.add(fix(22000,37.0001),22000),'accepted');
assert.ok(t.distanceM>11&&t.distanceM<12);
const before=t.distanceM;
assert.equal(t.add(fix(23000,38),23000),'jump');
assert.equal(t.add(fix(24000,37.0002,127,100),24000),'accuracy');
assert.equal(t.add(fix(24000,37.0002),25000),'stale');
assert.equal(t.distanceM,before);
t.pause(25000);assert.equal(t.add(fix(30000,38),30000),'paused');
assert.equal(t.stats(85000).durationSec,24);
t.resume(85000);t.add(fix(86000,37.001),86000);
assert.equal(t.distanceM,before,'resuming at a new location must not bridge pause');
t.add(fix(96000,37.0011),96000);
const after=t.distanceM;t.add(fix(140000,37.002),140000);
assert.equal(t.distanceM,after,'GPS outages must not become straight-line distance');
assert.equal(t.parts.length,3);
t.stop(145000);const result=t.result(145000);
assert.equal(result.durationSec,84);assert.equal(result.pausedSec,60);
assert.equal(result.steps,Math.round(result.distanceKm*1000/0.7));
assert.equal(t.stats(245000).durationSec,84);

// Exercise the real page handlers with fake GPS/DB; no real location or user records.
const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
const section=html.slice(html.indexOf('  // ===== GPS 산책 기록 ====='),html.indexOf('  let walksRenderVersion=0,walksLimit=10;'));
let now=100000,callback,errback,permissionError=null,inserted,failed=true;
const storage=new Map();
const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{textContent:'',style:{},checked:id==='walk-screen-on',value:'70',disabled:false,checkValidity:()=>true,reportValidity(){},setAttribute(){},removeAttribute(){},addEventListener(){}});return elements.get(id);}
const layer=()=>({addTo(){return this;},setLatLngs(){},setLatLng(){},getBounds(){return [];}});
const context={WalkTracker:{Tracker},console,Date:class extends Date{static now(){return now;}},
  document:{getElementById:element,addEventListener(){},visibilityState:'visible'},window:{addEventListener(){}},
  localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},confirm:()=>true,
  navigator:{onLine:true,geolocation:{getCurrentPosition(fn,err){if(permissionError)err(permissionError);else fn(fix(now));},watchPosition(fn,err){callback=fn;errback=err;return 1;},clearWatch(){}}},
  L:{polyline:layer,marker:layer},setInterval:()=>1,clearInterval(){},
  sb:{from(){return {insert:async rows=>{inserted=rows[0];return failed?{error:{message:'offline'}}:{error:null};},delete(){return {eq:async()=>({})};}};}},
  walkMap:{removeLayer(){},setView(){},panTo(){},fitBounds(){}},
  walkLiveLine:null,walkMarker:null,walkWatchId:null,walkPath:[],walkSession:null,walkWakeLock:null,walkWakePending:false,walkTimerInterval:null,lastSavedWalk:null,
  myDeviceId:null,myNickname:'테스트',pathPointIcon(){},toast(){},loadMyWalks(){},awardPoints:async()=>{},openNickModal(){},allCourses:()=>[]};
vm.createContext(context);vm.runInContext(section,context);
context.startWalk();callback(fix(now));now+=10000;callback(fix(now,37.0001));
context.pauseWalk();now+=60000;assert.equal(context.walkSession.stats(now).durationSec,10);
context.pauseWalk();now+=1000;callback(fix(now,37.001));now+=10000;callback(fix(now,37.0011));
context.stopWalk();assert.equal(context.lastSavedWalk.parts.length,2);
(async()=>{
  await context.saveWalkToDB();assert.ok(context.lastSavedWalk,'failed save keeps unsaved record');
  assert.equal(inserted.estimated_steps,context.lastSavedWalk.steps);assert.equal(inserted.path_segments.length,2);
  assert.equal(inserted.paused_sec,60);failed=false;await context.saveWalkToDB();
  assert.equal(context.lastSavedWalk,null);assert.equal(element('walk-idle-panel').style.display,'');
  permissionError={code:1};context.startWalk();assert.equal(context.walkSession,null,'denied GPS must not start timer');assert.match(element('walk-local-status').textContent,/사이트 설정/);
  permissionError=null;context.startWalk();now+=10000;callback(fix(now,37.0001));context.stopWalk();context.navigator.onLine=false;await context.saveWalkToDB();assert.ok(storage.size,'offline save retains device draft');context.resetWalkPanels();now+=3600000;context.recoverWalkDraft();assert.ok(context.lastSavedWalk);assert.equal(context.lastSavedWalk.durationSec,10,'closed period must not count');
  console.log('Walk tracking: jitter, jumps, stale fixes, pauses, GPS gaps, metrics, save failures and permission denial passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});


const active=new Tracker();active.start(1000);active.add(fix(1000),1000);active.add(fix(11000,37.0001),11000);
const recovered=Tracker.restore(JSON.parse(JSON.stringify(active.snapshot(12000))),1000000);
assert.equal(recovered.state,'paused');assert.equal(recovered.stats(1000000).durationSec,11);const priorDistance=recovered.distanceM;
recovered.resume(1000000);recovered.add(fix(1000000,38),1000000);assert.equal(recovered.distanceM,priorDistance);
assert.throws(()=>Tracker.restore({version:1,state:'running',parts:[[[NaN,1]]]},1000));
