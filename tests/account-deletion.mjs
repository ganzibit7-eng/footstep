import fs from 'node:fs';
import assert from 'node:assert/strict';
// Mock Auth/Storage: these tests never delete a real account.
const source=fs.readFileSync(new URL('../supabase/functions/delete-account/index.js',import.meta.url),'utf8').replace(/^import .*\n/,'').replace('Deno.serve(req => handleRequest(req));','');
const {handleRequest}=await import('data:text/javascript,'+encodeURIComponent(source));
const self='11111111-1111-4111-8111-111111111111',target='22222222-2222-4222-8222-222222222222';
async function run(body,opts={}){
 const calls=[];let filesRead=false;
 const client={
  auth:{getUser:async()=>{if(opts.authThrows)throw new Error('unavailable');return ({data:{user:opts.noUser?null:{id:self,last_sign_in_at:new Date(Date.now()-(opts.stale?3600000:0)).toISOString()}}});},admin:{signOut:async()=>{calls.push(['signOut']);return opts.signOutFail?{error:{message:'fail'}}:{};},deleteUser:async id=>{calls.push(['deleteUser',id]);return opts.deleteFail?{error:{message:'fail'}}:{};}}},
  storage:{from:bucket=>({remove:async names=>{calls.push(['remove',{bucket,names}]);return opts.storageFail?{error:{message:'failed'}}:{};}})},
  rpc:async(name,args)=>{
   calls.push([name,args]);
   if(name==='finish_account_deletion'&&args.p_success&&opts.finishThrows)throw new Error('unavailable');
   if(name==='is_admin')return {data:!!opts.admin};
   if(name==='begin_account_deletion'&&opts.protected)return {error:{message:'admin_transfer_required'}};
   if(name==='account_deletion_files'){const data=opts.files&&!filesRead?[{bucket_id:'photos',name:'owned.jpg'}]:[];filesRead=true;return {data};}
   if(name==='erase_account_activity'&&opts.fail)return {error:{message:'fail'}};
   return {};
  }
 };
 const res=await handleRequest(new Request('https://test',{method:'POST',headers:{authorization:'Bearer test','content-type':'application/json',origin:'https://balzaguk.com'},body:JSON.stringify(body)}),()=>client,{get:()=> 'test'});
 return {status:res.status,data:await res.json(),calls};
}
let r=await run({confirm:'DELETE_MY_ACCOUNT'});assert.equal(r.data.deleted,true);assert(r.calls.some(c=>c[0]==='deleteUser'&&c[1]===self));
r=await run({confirm:'DELETE_MY_ACCOUNT',user_id:target});assert.equal(r.status,403);assert.equal(r.calls.length,0);
r=await run({confirm:'DELETE_MEMBER_ACCOUNT',user_id:target});assert.equal(r.status,403);assert.deepEqual(r.calls.map(c=>c[0]),['is_admin']);
r=await run({confirm:'DELETE_MEMBER_ACCOUNT',user_id:target},{admin:true,files:true});assert.equal(r.data.deleted,true);assert(!r.calls.some(c=>c[0]==='signOut'));assert(r.calls.some(c=>c[0]==='deleteUser'&&c[1]===target));assert(r.calls.filter(c=>c[1]?.p_user_id).every(c=>c[1].p_user_id===target));assert(r.calls.findIndex(c=>c[0]==='remove')<r.calls.findIndex(c=>c[0]==='deleteUser'));
for(const opts of [{stale:true},{noUser:true},{protected:true}]){r=await run({confirm:'DELETE_MY_ACCOUNT'},opts);assert(r.status>=400);assert(!r.calls.some(c=>c[0]==='deleteUser'));}
for(const opts of [{fail:true},{files:true,storageFail:true}]){r=await run({confirm:'DELETE_MY_ACCOUNT'},opts);assert.equal(r.status,503);assert(!r.calls.some(c=>c[0]==='deleteUser'));assert(r.calls.some(c=>c[0]==='finish_account_deletion'&&c[1].p_success===false));}
console.log('Account deletion: identity, permissions, storage ordering, failures, retry lease passed.');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(!m[1].includes('src=')&&!m[1].includes('ld+json'))new Function(m[2]);}
console.log('Frontend scripts: syntax passed.');
const {createRequire}=await import('node:module');
const clientApi=createRequire(import.meta.url)('../account-deletion-client.js');
const session={access_token:'old',user:{id:self}};
const httpError=(status,error)=>({error:{context:new Response(JSON.stringify({error}),{status})}});
async function clientRun(responses,refreshedId=self){
 const calls=[];const sb={auth:{getSession:async()=>({data:{session}}),refreshSession:async()=>{calls.push('refresh');return {data:{session:{access_token:'new',user:{id:refreshedId}}}};}},functions:{invoke:async(name,args)=>{calls.push(args);const result=responses.shift();if(result instanceof Error)throw result;return result;}}};
 return {data:await clientApi.request(sb,{confirm:'DELETE_MY_ACCOUNT'}),calls};
}
r=await clientRun([httpError(401,'sign_in_required'),{data:{deleted:true,user_id:self}}]);assert.equal(r.data.deleted,true);assert.equal(r.calls.length,3);assert.equal(r.calls[2].headers.Authorization,'Bearer new');
r=await clientRun([httpError(401,'sign_in_required'),httpError(401,'sign_in_required')]);assert.equal(r.data.error,'sign_in_required');assert.equal(r.calls.length,3);
r=await clientRun([httpError(401,'sign_in_required')],target);assert.equal(r.data.error,'account_changed');assert.equal(r.calls.length,2);
r=await clientRun([httpError(503,'auth_delete_failed')]);assert.equal(r.data.error,'auth_delete_failed');assert.equal(r.calls.length,1);
r=await clientRun([new Error('offline')]);assert.equal(r.data.error,'network_error');assert.equal(r.calls.length,1);
r=await run({confirm:'wrong'});assert.equal(r.status,400);assert.equal(r.calls.length,0);
r=await run({confirm:'DELETE_MEMBER_ACCOUNT',user_id:self},{admin:true});assert.equal(r.data.error,'admin_transfer_required');assert(!r.calls.some(c=>c[0]==='deleteUser'));
console.log('Client: one authentication retry, account-switch protection, stage errors and uncertain network result passed.');

for(const [opts,code] of [[{authThrows:true},'auth_unavailable'],[{signOutFail:true},'session_cleanup_failed'],[{deleteFail:true},'auth_delete_failed']]){r=await run({confirm:'DELETE_MY_ACCOUNT'},opts);assert.equal(r.status,503);assert.equal(r.data.error,code);if(!opts.authThrows)assert(r.calls.some(c=>c[0]==='finish_account_deletion'&&c[1].p_success===false));}
r=await run({confirm:'DELETE_MY_ACCOUNT'},{finishThrows:true});assert.equal(r.data.deleted,true);assert.equal(r.data.cleanup_pending,true);assert(!r.calls.some(c=>c[0]==='finish_account_deletion'&&c[1].p_success===false));
console.log('Server: Auth outage, sign-out/delete failures, post-deletion completion failure passed.');
let served;
const deployedSource=fs.readFileSync(new URL('../supabase/functions/delete-account/index.js',import.meta.url),'utf8').replace(/^import .*\n/,'').replace('export async function','async function');
new Function('createClient','Deno',deployedSource)(()=>({auth:{getUser:async()=>({error:{status:401}})}}),{env:{get:()=> 'test'},serve:handler=>{served=handler;}});
const entrypointResponse=await served(new Request('https://test',{method:'POST',headers:{authorization:'Bearer invalid','content-type':'application/json'},body:JSON.stringify({confirm:'DELETE_MY_ACCOUNT'})}),{remoteAddr:{hostname:'127.0.0.1'}});
assert.equal(entrypointResponse.status,401);
assert.equal((await entrypointResponse.json()).error,'sign_in_required');
console.log('Deno entrypoint: connection metadata does not overwrite createClient passed.');
