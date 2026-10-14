const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('admin-panel.js','utf8');
const start=source.indexOf('  const memberDeletionActions=new Set();'),end=source.indexOf('  function csvSafeCell',start);
const admin='11111111-1111-4111-8111-111111111111',target='22222222-2222-4222-8222-222222222222';
async function run(result){
 let logout=0,reauth=0,requests=0;const count={textContent:''};
 const ctx={context:{myDeviceId:admin,reauthenticateAdmin(){reauth++;}},allMembersCache:[{owner_id:target,nickname:'테스트 회원'}],memberPointsMap:{},memberVisitMap:{},memberLastSeenMap:{},isAdminUser:id=>id===admin,confirm:()=>true,prompt:()=>'회원탈퇴',toast(){},openNickModal(){reauth++;},signOutUser:async()=>{logout++;},requestAccountDeletion:async body=>{requests++;assert.equal(body.user_id,target);assert.equal(body.confirm,'DELETE_MEMBER_ACCOUNT');return result;},AccountDeletionClient:{message:x=>x},document:{querySelectorAll:()=>[],getElementById:()=>count},renderMemberSummary(){},applyMemberFilters(){},loadData:async()=>{},renderAllMemberList:async()=>{},renderMemberList:async()=>{},renderAdminStats:async()=>{},console};
 vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);await ctx.adminForceWithdraw(target);
 return {logout,reauth,requests,remaining:ctx.allMembersCache.length,viewer:ctx.context.myDeviceId};
}
(async()=>{
 for(const error of ['recent_sign_in_required','sign_in_required']){const r=await run({error});assert.equal(r.logout,0);assert.equal(r.reauth,1);assert.equal(r.remaining,1);assert.equal(r.viewer,admin);}
 let r=await run({deleted:true,user_id:admin});assert.equal(r.remaining,1);assert.equal(r.logout,0);
 r=await run({deleted:true,user_id:target});assert.equal(r.remaining,0);assert.equal(r.logout,0);assert.equal(r.viewer,admin);assert.equal(r.requests,1);
 console.log('PASS admin reauthentication keeps session and member; only confirmed target deletion removes member.');
})().catch(e=>{console.error(e);process.exitCode=1;});
