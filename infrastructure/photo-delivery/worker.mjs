import {blockedPhotoKeys} from './blocked-photos.mjs';
const blocked=new Set(blockedPhotoKeys);
// Deploy only on Workers Free, with all direct R2 public endpoints disabled.
// One invocation performs at most one R2 read and never writes or lists objects.
export function createHandler(photos){
 const entries=Object.entries(photos);
 if(entries.length>10_000||entries.reduce((n,[,p])=>n+p.bytes,0)>8_000_000_000)throw Error('Photo manifest exceeds storage budget');
 return {async fetch(request,env){
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  if(env.ENABLED!=='true')return new Response('Photo delivery is paused',{status:503,headers});
  if(!['GET','HEAD'].includes(request.method))return new Response('Read only',{status:405,headers:{...headers,Allow:'GET, HEAD'}});
  const url=new URL(request.url),key=url.pathname.slice(1);
  if(url.search||blocked.has(key)||!Object.hasOwn(photos,key))return new Response('Not found',{status:404,headers});
  if(request.headers.has('Range'))return new Response('Ranges are not supported',{status:416,headers});
  const expected=photos[key];
  try{
   // Dashboard uploads have no application SHA metadata. Verify their complete
   // original bytes instead; this uses one read and is limited to 2 MB objects.
   const digest=expected.digest===true;
   if(digest&&expected.bytes>2_000_000)return new Response('Photo exceeds verification budget',{status:503,headers});
   const object=request.method==='HEAD'&&!digest?await env.IMAGES.head(key):await env.IMAGES.get(key);
   if(!object)return new Response('Not found',{status:404,headers});
   if(object.size!==expected.bytes||!digest&&object.customMetadata?.sha256!==expected.sha256)return new Response('Photo verification failed',{status:503,headers});
   let body=object.body;
   if(digest){body=await object.arrayBuffer();const actual=[...new Uint8Array(await crypto.subtle.digest('SHA-256',body))].map(b=>b.toString(16).padStart(2,'0')).join('');if(actual!==expected.sha256)return new Response('Photo verification failed',{status:503,headers});}
   const responseHeaders=new Headers({'Content-Type':expected.type,'Content-Length':String(expected.bytes),'Cache-Control':'public, max-age=86400','ETag':'"'+expected.sha256+'"','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'cross-origin'});
   if(request.headers.get('If-None-Match')===responseHeaders.get('ETag')){
    if(object.body&&!digest)await object.body.cancel();
    responseHeaders.delete('Content-Length');return new Response(null,{status:304,headers:responseHeaders});
   }
   return new Response(request.method==='HEAD'?null:body,{headers:responseHeaders});
  }catch{return new Response('Photo delivery is temporarily unavailable',{status:503,headers});}
 }};
}
