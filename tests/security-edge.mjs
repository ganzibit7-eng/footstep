import fs from 'node:fs';import assert from 'node:assert/strict';
const shared=fs.readFileSync('supabase/functions/_shared/security.js','utf8');
const entry=fs.readFileSync('supabase/functions/security-monitor/index.js','utf8').replaceAll('\r\n','\n').replace(/^import.*\n/gm,'').replace('Deno.serve(req=>handleSecurityReport(req));','');
const {handleSecurityReport,readBoundedJson}=await import('data:text/javascript,'+encodeURIComponent(shared+'\n'+entry));
const env={get:key=>({SUPABASE_ANON_KEY:'public',SUPABASE_SERVICE_ROLE_KEY:'secret',SUPABASE_URL:'https://example.test'}[key])};
let writes=[];const client={rpc:async(name,args)=>{writes.push(args);return {data:true};},auth:{getUser:async()=>({error:{status:401}})}};
const request=(body,origin='https://balzaguk.com')=>new Request('https://example.test',{method:'POST',headers:{origin,apikey:'public','content-type':'application/json'},body:JSON.stringify(body)});
let res=await handleSecurityReport(request({event:'suspicious_route',path:'/?token=secret'}),()=>client,env);assert.equal(res.status,202);assert.equal(writes[0].p_path,'/');assert.equal(writes[0].p_source,'browser');assert.equal(writes[0].p_actor_id,null);assert.match(writes[0].p_subject_hash,/^[a-f0-9]{64}$/);
res=await handleSecurityReport(request({event:'account_deleted'}),()=>client,env);assert.equal(res.status,400);assert.equal(writes.length,1,'browser cannot forge a server event');
res=await handleSecurityReport(request({event:'auth_failed'},'https://evil.example'),()=>client,env);assert.equal(res.status,403);
res=await handleSecurityReport(request({event:'auth_failed',junk:'x'.repeat(5000)}),()=>client,env);assert.equal(res.status,400);assert.equal(writes.length,1);
await assert.rejects(readBoundedJson(new Request('https://example.test',{method:'POST',headers:{'content-type':'text/plain'},body:'{}'})));
console.log('PASS Edge: bounded JSON, origins, private actor identity, hashed correlation, query removal and forged server event rejection');

const initialWrites=writes.length;
for(const event of ['auth_failed','auth_rate_limited','script_policy_block']){res=await handleSecurityReport(request({event}),()=>client,env);assert.equal(res.status,202);assert.equal((await res.json()).ignored,true);}
for(const signal of [undefined,{disposition:'report'},{disposition:'enforce',directive:'script-src-elem',sourceOrigin:'https://balzaguk.com',documentOrigin:'https://balzaguk.com',blockedOrigin:'https://cdn.jsdelivr.net'}]){res=await handleSecurityReport(request({event:'external_script_block',signal}),()=>client,env);assert.equal((await res.json()).ignored,true);}
assert.equal(writes.length,initialWrites,'legacy or ambiguous reports must never be stored');
res=await handleSecurityReport(request({event:'external_script_block',signal:{disposition:'enforce',directive:'script-src-elem',sourceOrigin:'https://balzaguk.com',documentOrigin:'https://balzaguk.com',blockedOrigin:'https://unlisted.example'}}),()=>client,env);assert.equal(res.status,202);assert.equal(writes.at(-1).p_event,'external_script_block');assert.equal(writes.length,initialWrites+1);
console.log('PASS Edge filtering: old client CSP/auth noise ignored, missing context rejected, unexpected external script retained as unverified browser signal.');
