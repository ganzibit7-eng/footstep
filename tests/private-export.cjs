const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const source=html.slice(html.indexOf('  async function exportMyData(){'),html.indexOf("  document.getElementById('export-data-btn').addEventListener"));
function fixture(){
 const pending=[],authPending=[],queries=[],downloads=[],messages=[];let blobs=0,revoked=0;
 const button={disabled:false,textContent:'내 정보 다운로드'};
 const ctx={myDeviceId:'A',accountExportGeneration:0,myNickname:'A-profile',myDogName:null,myDogBreed:null,myDogAge:null,myRegionName:null,myBadge:null,
  toast:m=>messages.push(m),Blob:class{constructor(parts){blobs++;this.text=parts[0]}},
  URL:{createObjectURL(blob){downloads.push(JSON.parse(blob.text));return 'blob:fixture'},revokeObjectURL(){revoked++}},
  document:{getElementById:()=>button,body:{appendChild(){}},createElement:()=>({click(){},remove(){}})},
  sb:{auth:{getUser:()=>new Promise(resolve=>authPending.push(resolve))},from:table=>({select:()=>({eq:(key,owner)=>{queries.push({table,key,owner});return new Promise(resolve=>pending.push(resolve));}})})}};
 vm.createContext(ctx);vm.runInContext(source,ctx);
 const auth=async(id='A')=>{assert(authPending.length,'auth lookup pending');authPending.shift()({data:{user:id?{id}:null},error:null});await new Promise(setImmediate);};
 const rows=async(overrides={})=>{assert.equal(pending.length,6);pending.splice(0).forEach((resolve,i)=>resolve(overrides[i]||{data:[{owner_id:'A',fixture:true}],error:null}));await new Promise(setImmediate);};
 return {ctx,button,queries,downloads,messages,authPending,auth,rows,get blobs(){return blobs},get revoked(){return revoked}};
}
test('export is bound to verified initiating account and one profile snapshot',async()=>{
 const f=fixture(),done=f.ctx.exportMyData();await f.auth();assert.equal(f.queries.length,6);assert(f.queries.every(q=>q.owner==='A'&&q.key==='owner_id'));
 f.ctx.myNickname='changed while waiting';await f.rows();await f.auth();await done;
 assert.equal(f.downloads.length,1);assert.equal(f.downloads[0].프로필.닉네임,'A-profile');assert.equal(f.downloads[0].내_산책기록[0].owner_id,'A');assert.equal(f.revoked,1);assert(!f.button.disabled);
});
for(const transition of ['switch','logout','return-to-same-account','logout-request'])test('pending export is discarded on '+transition,async()=>{
 const f=fixture(),done=f.ctx.exportMyData();await f.auth();
 f.ctx.accountExportGeneration++;if(transition==='switch')f.ctx.myDeviceId='B';if(transition==='logout')f.ctx.myDeviceId=null;
 await f.rows();await done;assert.equal(f.blobs,0);assert.equal(f.messages.length,0);assert(!f.button.disabled);
});
test('account changes during final identity validation cannot trigger a download',async()=>{
 const f=fixture(),done=f.ctx.exportMyData();await f.auth();await f.rows();f.ctx.myDeviceId='B';f.ctx.accountExportGeneration++;await f.auth();await done;assert.equal(f.blobs,0);
});
test('initial server identity mismatch stops every private query',async()=>{
 const f=fixture(),done=f.ctx.exportMyData();await f.auth('B');await done;assert.equal(f.queries.length,0);assert.equal(f.blobs,0);assert.equal(f.messages.length,1);
});
for(const invalid of [{data:[{owner_id:'B'}],error:null},{data:null,error:null},{data:[],error:{message:'fixture failure'}}])test('unexpected owner, malformed or failed responses never become export files',async()=>{
 const f=fixture(),done=f.ctx.exportMyData();await f.auth();await f.rows({3:invalid});await done;assert.equal(f.blobs,0);assert.equal(f.messages.length,1);assert(!f.button.disabled);
});
test('server session expiration at completion prevents download and allows retry',async()=>{
 const f=fixture(),done=f.ctx.exportMyData();await f.auth();await f.rows();await f.auth(null);await done;assert.equal(f.blobs,0);assert(!f.button.disabled);
});
test('duplicate export click does not submit a second identity lookup',async()=>{
 const f=fixture(),done=f.ctx.exportMyData();await f.ctx.exportMyData();assert.equal(f.authPending.length,1);await f.auth();await f.rows();await f.auth();await done;assert.equal(f.downloads.length,1);
});
test('real session transitions and logout requests invalidate all in-flight exports',()=>{
 const ctx={myDeviceId:'A',accountExportGeneration:0,switchFavoriteOwner(){},updateProfileLabel(){},updateJoinVisibility(){},sb:{auth:{signOut:async()=>({error:null})}}};
 vm.createContext(ctx);vm.runInContext(html.slice(html.indexOf('  function applySession(session){'),html.indexOf('  let badgeStateRequest=0;'))+html.slice(html.indexOf('  async function signOutUser(){'),html.indexOf('  let signupBonusPendingOwner=')),ctx);
 ctx.applySession({user:{id:'B'}});ctx.applySession({user:{id:'A'}});assert.equal(ctx.accountExportGeneration,2);
 ctx.applySession({user:{id:'A'}});assert.equal(ctx.accountExportGeneration,2,'ordinary token refresh does not invalidate export');
 ctx.signOutUser();assert.equal(ctx.accountExportGeneration,3);
});
