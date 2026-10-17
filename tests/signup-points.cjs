const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
function extract(start,end){return html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)))}
(async()=>{
 let calls=0,referrals=0,loads=0,notices=0,finish;
 const ctx={myDeviceId:'A',navigator:{onLine:true},console:{error(){}},sb:{rpc:()=>{calls++;return new Promise(r=>finish=r)}},toast:()=>notices++,applyReferralBonus:async()=>referrals++,loadMyPoints:async()=>loads++};
 vm.createContext(ctx);vm.runInContext(extract('  let signupBonusPendingOwner=null;','  // ===== 추천인 포인트 제도'),ctx);
 const first=ctx.checkFirstLoginBonus();await ctx.checkFirstLoginBonus();assert.equal(calls,1,'overlapping auth events share one claim');finish({data:{awarded:false},error:null});await first;assert.equal(referrals,1,'server-awarded bonus still allows validated referral claim');assert.equal(loads,1);assert.equal(notices,0,'do not announce a second award');
 const stale=ctx.checkFirstLoginBonus();ctx.myDeviceId='B';finish({data:{awarded:true},error:null});await stale;assert.equal(referrals,1);assert.equal(loads,1);assert.equal(notices,0,'stale account result must not affect the current account');
 ctx.navigator.onLine=false;await ctx.checkFirstLoginBonus();assert.equal(calls,2);ctx.navigator.onLine=true;ctx.myDeviceId=null;await ctx.checkFirstLoginBonus();assert.equal(calls,2);
 ctx.myDeviceId='A';const retry=ctx.checkFirstLoginBonus();finish({error:new Error('temporary failure')});await retry;assert.equal(loads,2,'still reload existing balance on failure');const recovered=ctx.checkFirstLoginBonus();finish({data:{awarded:false},error:null});await recovered;assert.equal(calls,4,'failure does not suppress the next retry');
 let callback,inside=false,bonusCalls=0,timers=[],syncCalls=0;
 const session={user:{id:'A'}},state={myDeviceId:null,myDogName:null,myNickname:'회원',console:{error(){}},setTimeout:f=>timers.push(f),sb:{auth:{getSession:async()=>({data:{session}}),onAuthStateChange:f=>callback=f}},applySession:s=>state.myDeviceId=s?.user?.id||null,checkFirstLoginBonus:()=>{assert(!inside,'no Supabase calls while auth lock is held');bonusCalls++},closeNickModal(){},toast(){},clearPrivateReportState(){},resetAdminPanel(){}};
 for(const name of ['loadAdminSet','syncProfileTable','loadMyBadgeState','syncFavoritesFromServer','checkNotifications','loadMyWalks','renderAll'])state[name]=()=>{assert(!inside,name+' must be deferred');syncCalls++};
 vm.createContext(state);vm.runInContext(extract('  async function ensureIdentity(){','  const ADMIN_UID'),state);await state.ensureIdentity();assert.equal(bonusCalls,0);while(timers.length)await timers.shift()();assert.equal(bonusCalls,1,'restore session retries missing signup award');
 inside=true;callback('SIGNED_IN',session);inside=false;assert.equal(bonusCalls,1);while(timers.length)await timers.shift()();assert.equal(bonusCalls,2);assert(syncCalls>3);
 inside=true;callback('INITIAL_SESSION',session);inside=false;while(timers.length)await timers.shift()();assert.equal(bonusCalls,3,'INITIAL_SESSION is supported');
 inside=true;callback('SIGNED_IN',session);inside=false;state.myDeviceId='B';while(timers.length)await timers.shift()();assert.equal(bonusCalls,3,'discard delayed work after account switch');
 console.log('PASS: restored/initial sessions, auth-lock deferral, overlapping events, server-preawarded referral, stale account isolation, offline and retry recovery.');
})().catch(e=>{console.error(e);process.exitCode=1});
