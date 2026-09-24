import fs from 'node:fs';
import assert from 'node:assert/strict';
// Mock Auth/Storage: these tests never delete a real account.
const source=fs.readFileSync(new URL('../supabase/functions/delete-account/index.js',import.meta.url),'utf8').replace(/^import .*\n/,'').replace('Deno.serve(handleRequest);','');
const {handleRequest}=await import('data:text/javascript,'+encodeURIComponent(source));
const self='11111111-1111-4111-8111-111111111111',target='22222222-2222-4222-8222-222222222222';
async function run(body,opts={}){
 const calls=[];let filesRead=false;
 const client={
  auth:{getUser:async()=>({data:{user:opts.noUser?null:{id:self,last_sign_in_at:new Date(Date.now()-(opts.stale?3600000:0)).toISOString()}}}),admin:{signOut:async()=>{calls.push(['signOut']);return {};},deleteUser:async id=>{calls.push(['deleteUser',id]);return {};}}},
  storage:{from:bucket=>({remove:async names=>{calls.push(['remove',{bucket,names}]);return opts.storageFail?{error:{message:'failed'}}:{};}})},
  rpc:async(name,args)=>{
   calls.push([name,args]);
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
