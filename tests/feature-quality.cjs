const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
const slice=(start,end)=>html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)));
const elements=new Map(),storage=new Map(),messages=[];
function element(id){if(!elements.has(id))elements.set(id,{hidden:false,textContent:'',innerHTML:'',value:'좋은 산책길',files:[],disabled:false,style:{},listeners:{},dataset:{},setAttribute(){},removeAttribute(){},querySelector(){return null;},addEventListener(type,fn){this.listeners[type]=fn;}});return elements.get(id);}
const context={myDeviceId:null,myNickname:'테스트',console:{error(){}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
  document:{getElementById:element},toast:s=>messages.push(s),confirm:()=>true,openNickModal(){},
  updateDetailFavorite(){},renderGrid(){},loadNearbyRecommendations(){},renderHomeGpsPreview(){},renderPopularCourses(){}};
vm.createContext(context);
let reply={data:[],error:null},writes=0,pending;
context.sb={from(){const q={eq(){return q;},select(){return q;},delete(){writes++;return q;},upsert(){writes++;return q;},insert(){writes++;return q;},then(resolve,reject){return (pending||Promise.resolve(reply)).then(resolve,reject);}};return q;}};
vm.runInContext(slice('  function favoriteStorageKey','  let courseBoosts ='),context);
const saved=()=>Array.from(vm.runInContext('[...favoriteIds]',context));
(async()=>{
  await context.toggleFavorite('guest-course');assert.deepEqual(saved(),['guest-course']);
  context.myDeviceId='A';context.switchFavoriteOwner();assert.deepEqual(saved(),[],'account must not inherit guest/another account cache');
  reply={error:{message:'offline'}};await context.toggleFavorite('c1');assert.deepEqual(saved(),[],'failed favorite write must roll back');
  reply={data:[],error:null};await context.toggleFavorite('c1');assert.deepEqual(saved(),['c1']);
  context.myDeviceId='B';context.switchFavoriteOwner();assert.deepEqual(saved(),[]);
  context.myDeviceId='A';context.switchFavoriteOwner();assert.deepEqual(saved(),['c1']);
  await context.syncFavoritesFromServer();assert.deepEqual(saved(),[],'server removal must not be resurrected by local cache');
  let resolve;pending=new Promise(r=>resolve=r);const sync=context.syncFavoritesFromServer();
  context.myDeviceId='B';context.switchFavoriteOwner();resolve({data:[{course_id:'private-A'}],error:null});await sync;
  assert.deepEqual(saved(),[],'stale account response must never overwrite the current account');pending=null;

  vm.runInContext(slice('  async function deleteFacilityDB','  async function insertReviewDB'),context);
  reply={data:[],error:null};assert.equal(await context.deleteFacilityDB('x'),false);
  reply={error:{message:'denied'}};assert.equal(await context.deleteFacilityDB('x'),false);
  reply={data:[{id:'x'}],error:null};assert.equal(await context.deleteFacilityDB('x'),true);

  context.setTimeout=()=>1;context.clearTimeout=()=>{};
  context.kakao={maps:{services:{Status:{OK:'OK',ZERO_RESULT:'ZERO'}}}};
  context.kakaoPlacesService={keywordSearch(_q,fn){fn([], 'ERROR');}};
  vm.runInContext(slice('  function kakaoKeywordSearch','  // ===== 지도 화면 장소 검색'),context);
  await assert.rejects(context.kakaoKeywordSearch('서울',null));
  context.kakaoPlacesService.keywordSearch=(_q,fn)=>fn([],'ZERO');assert.equal((await context.kakaoKeywordSearch('서울',null)).length,0);

  context.activeCourseId='c1';context.reviews={};context.renderReviewList=async()=>{};context.notifyUser=()=>{};
  vm.runInContext(slice('  const helpfulPending','  // ===== 알림'),context);
  let done;pending=new Promise(r=>done=r);const action=context.toggleReviewHelpful('r1','c1');const before=writes;
  await context.toggleReviewHelpful('r1','c1');assert.equal(writes,before,'rapid duplicate helpful clicks must not issue another write');
  done({error:{message:'offline'}});await action;pending=null;

  context.activeStars=5;context.containsBadWord=()=>false;context.MAX_PHOTO_MB=10;
  context.compressImage=async()=>new Uint8Array();let submitted=0;
  context.insertReviewDB=async()=>{submitted++;return true;};
  context.sb.storage={from:()=>({upload:async()=>({error:{message:'upload failed'}})})};
  vm.runInContext(slice('  let reviewSubmitting','  // ===== 날씨 &'),context);
  const form=element('review-form'),button=element('submit');form.querySelector=()=>button;
  element('review-photo-input').files=[{size:1000}];
  await form.listeners.submit({preventDefault(){},target:form});
  assert.equal(submitted,0,'attachment failure must not publish a photo-less review');assert.equal(button.disabled,false);
  assert.equal(element('review-text').value,'좋은 산책길','failed upload must preserve input');
  const historyElements=new Map();let historyReply,historyMood;
  const history={Date,Number,console:{error(){}},myNickname:'A',myDeviceId:'A',
    formatDuration:n=>String(n),updateTodayMood:data=>{historyMood=data;},
    document:{getElementById:id=>{if(!historyElements.has(id))historyElements.set(id,{innerHTML:'',style:{},children:[],addEventListener(){},append(x){this.children.push(x);}});return historyElements.get(id);},createElement:()=>({})},
    sb:{from(){const q={select(){return q;},eq(){return q;},order(){return q;},limit(){return q;},gte(){return q;},then(fn){return Promise.resolve(historyReply).then(fn);}};return q;}}};
  vm.createContext(history);vm.runInContext(slice('  let walksRenderVersion','  // ===== 오늘의 산책'),history);
  historyReply={data:Array.from({length:11},(_,i)=>({created_at:'2026-10-03',distance_km:1,duration_sec:60,estimated_steps:100,stride_cm:70})),error:null};
  await history.loadMyWalks();assert.equal(historyElements.get('my-walks-list').children.length,1,'older records must remain accessible');
  historyReply={error:{message:'offline'}};await history.loadMyWalks();assert.match(historyElements.get('my-walks-list').innerHTML,/새로고침/);
  let historyResolve;historyReply=new Promise(r=>historyResolve=r);const oldRequest=history.loadMyWalks();
  history.myDeviceId='B';historyResolve({data:[{created_at:'2026-10-03',distance_km:999,duration_sec:60}],error:null});await oldRequest;
  assert.ok(!historyElements.get('my-walks-list').innerHTML.includes('999'),'prior account history must not render after identity changes');
  console.log('PASS: favorite isolation, rollback, stale responses, delete results, search failures, duplicate helpful actions, attachment failure preservation.');
})().catch(e=>{console.error(e);process.exitCode=1;});
