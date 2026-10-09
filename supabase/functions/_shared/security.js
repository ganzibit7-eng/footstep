export async function readBoundedJson(req, limit=4096) {
 if(!req.headers.get('content-type')?.toLowerCase().startsWith('application/json'))throw new Error('invalid_request');
 if(Number(req.headers.get('content-length'))>limit)throw new Error('too_large');
 const reader=req.body?.getReader();if(!reader)throw new Error('invalid_request');
 let size=0,parts=[];
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw new Error('too_large');}parts.push(value);}
 const bytes=new Uint8Array(size);let at=0;for(const part of parts){bytes.set(part,at);at+=part.length;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
export async function audit(client,env,req,event,actor=null,source='server',path='/functions/delete-account') {
 // Fingerprint is correlation only: a forwarded header is not proof of identity.
 try{
  const encoder=new TextEncoder(),key=await crypto.subtle.importKey('raw',encoder.encode(env.get('SUPABASE_SERVICE_ROLE_KEY')), {name:'HMAC',hash:'SHA-256'},false,['sign']);
  const subject=actor||req.headers.get('x-forwarded-for')?.slice(0,200)||'unknown';
  const signed=await crypto.subtle.sign('HMAC',key,encoder.encode(source+':'+subject));
  const hash=Array.from(new Uint8Array(signed),b=>b.toString(16).padStart(2,'0')).join('');
  const {data,error}=await client.rpc('record_security_event',{p_source:source,p_event:event,p_actor_id:actor,p_subject_hash:hash,p_path:path});
  return !error&&data===true;
 }catch{return false;}
}
