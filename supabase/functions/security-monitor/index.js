import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { readBoundedJson, audit } from '../_shared/security.js';
export async function handleSecurityReport(req,create=createClient,env=Deno.env){
 const origin=req.headers.get('origin'),allowed=['https://balzaguk.com','https://www.balzaguk.com'];
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version'};
 if(allowed.includes(origin))headers['Access-Control-Allow-Origin']=origin;
 const reply=(status,body)=>new Response(JSON.stringify(body),{status,headers});
 if(!allowed.includes(origin))return reply(403,{error:'origin_not_allowed'});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply(405,{error:'method_not_allowed'});
 // Anonymous browser reports use the application's public key; records remain unverified.
 const publicKeys=new Set([env.get('SUPABASE_ANON_KEY'),'sb_publishable_RcJxSk1kYXkqeyptw7sCXw_zJhQ0DJJ'].filter(Boolean));
 if(!publicKeys.has(req.headers.get('apikey')))return reply(401,{error:'invalid_client'});
 let body;try{body=await readBoundedJson(req);}catch{return reply(400,{error:'invalid_request'});}
 const events=['auth_failed','auth_rate_limited','script_policy_block','suspicious_route','admin_access_denied'];
 if(!events.includes(body?.event))return reply(400,{error:'invalid_event'});
 const client=create(env.get('SUPABASE_URL'),env.get('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});
 let actor=null;const token=(req.headers.get('authorization')||'').replace(/^Bearer /,'');
 if(token&&!publicKeys.has(token)){try{const {data,error}=await client.auth.getUser(token);if(!error&&data?.user&&!data.user.is_anonymous)actor=data.user.id;}catch{}}
 const recorded=await audit(client,env,req,body.event,actor,'browser',typeof body.path==='string'?body.path.split(/[?#]/)[0]:'/');
 return reply(recorded?202:429,{recorded});
}
Deno.serve(req=>handleSecurityReport(req));
