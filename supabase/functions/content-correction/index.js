import {createClient} from 'npm:@supabase/supabase-js@2.117.2';
import {readBoundedJson} from '../_shared/security.js';
export const categories=['pet','route','location','hours','photo','other'];
export function validate(body,now=Date.now()){
 if(!body||body.acknowledged!==true||body.website||!categories.includes(body.category)||!/^\/[\w/-]+\/$/.test(body.path||'')||!/^\/(?:places|courses|bins)\/[A-Za-z0-9_-]+\/$|^\/pet-care\/places\/[A-Za-z0-9_-]+\/$/.test(body.path))throw Error('invalid_request');
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id||''))throw Error('invalid_request');
 if(!Number.isFinite(body.started)||now-body.started<2500||now-body.started>86400000)throw Error('too_fast');
 const message=typeof body.message==='string'?body.message.replace(/\r\n?/g,'\n').trim():'';
 if(message.length<10||message.length>2000||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message))throw Error('invalid_request');
 let source=null;if(body.source){const u=new URL(body.source);if(u.protocol!=='https:'||u.username||u.password||u.href.length>1000)throw Error('invalid_request');source=u.href;}
 return {id:body.id,path:body.path,category:body.category,message,source};
}
export async function publishedName(path,fetcher=fetch){
 // Fixed first-party host and strict path allowlist; never fetch a submitted source URL.
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
 try{const response=await fetcher('https://balzaguk.com'+path,{redirect:'error',signal:controller.signal});if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))throw Error('target_unavailable');
  const reader=response.body.getReader();let size=0,raw='',decoder=new TextDecoder();
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>1048576)throw Error('target_unavailable');raw+=decoder.decode(value,{stream:true});if(/<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(raw))break;}}finally{await reader.cancel().catch(()=>{});}
  const title=raw.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]*>/g,'').replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g,s=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&nbsp;':' '}[s])).trim();
  if(!title||title.length>160)throw Error('target_unavailable');return title;
 }finally{clearTimeout(timer);}
}
export async function handleCorrection(req,create=createClient,env=Deno.env,fetcher=fetch){
 const origin=req.headers.get('origin'),allowed=['https://balzaguk.com','https://www.balzaguk.com'];
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'apikey, content-type, authorization, x-client-info'};
 if(allowed.includes(origin))headers['Access-Control-Allow-Origin']=origin;
 const reply=(status,body)=>new Response(JSON.stringify(body),{status,headers});
 if(!allowed.includes(origin))return reply(403,{error:'origin_not_allowed'});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});if(req.method!=='POST')return reply(405,{error:'method_not_allowed'});
 const keys=[env.get('SUPABASE_ANON_KEY'),'sb_publishable_RcJxSk1kYXkqeyptw7sCXw_zJhQ0DJJ'];if(!keys.includes(req.headers.get('apikey')))return reply(401,{error:'invalid_client'});
 let body;try{body=validate(await readBoundedJson(req,12288));}catch(error){return reply(400,{error:error.message==='too_fast'?'too_fast':'invalid_request'});}
 try{
  const name=await publishedName(body.path,fetcher),enc=new TextEncoder(),key=await crypto.subtle.importKey('raw',enc.encode(env.get('SUPABASE_SERVICE_ROLE_KEY')),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  // Correlation/rate control only, not proof of identity. No raw address is stored.
  const subject='corrections:'+new Date().toISOString().slice(0,10)+':'+(req.headers.get('x-forwarded-for')?.slice(0,200)||'unknown');
  const hash=Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(subject))),b=>b.toString(16).padStart(2,'0')).join('');
  const client=create(env.get('SUPABASE_URL'),env.get('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await client.rpc('submit_content_correction',{p_id:body.id,p_path:body.path,p_name:name,p_category:body.category,p_message:body.message,p_source:body.source,p_network_hash:hash});
  if(error){if(/correction_rate_limited|correction_capacity/.test(error.message||''))return reply(429,{error:'rate_limited'});throw Error('submission_failed');}
  if(data?.accepted!==true||data.id!==body.id)throw Error('submission_failed');return reply(201,data);
 }catch(error){return reply(503,{error:error.message==='target_unavailable'?'target_unavailable':'submission_failed'});}
}
Deno.serve(req=>handleCorrection(req));
