import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';

// A build or a CSS cache key is not a content modification. Compare the actual
// published title, metadata, structured data and visible body/link/image values.
export function contentSignature(html){
  const data=[...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1].trim());
  const clean=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<!--[\s\S]*?-->/g,'');
  const metadata=[...clean.matchAll(/<(title|meta)\b[^>]*>(?:[^<]*<\/title>)?/gi)].map(m=>m[0].replace(/\s+/g,' '));
  const body=clean.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1]||'';
  const resources=[...body.matchAll(/<(?:a|img|source)\b[^>]*>/gi)].map(m=>[...m[0].matchAll(/\b(href|src|srcset|alt)\s*=\s*(["'])(.*?)\2/gi)].map(a=>a[1].toLowerCase()+'='+a[3]).join('|'));
  const text=body.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  return createHash('sha256').update(JSON.stringify([metadata,data,resources,text])).digest('hex');
}
export async function snapshotSitemap(root){
  const xml=await readFile(path.join(root,'sitemap.xml'),'utf8');
  const snapshot=new Map();
  for(const match of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g)){
    const url=new URL(match[1]);
    if(url.origin!=='https://balzaguk.com'||url.search||url.hash)throw Error('Unexpected sitemap URL');
    const file=path.resolve(root,'.'+decodeURIComponent(url.pathname)+(url.pathname.endsWith('/')?'index.html':''));
    if(!file.startsWith(path.resolve(root)+path.sep))throw Error('Sitemap path outside site');
    let signature=null;
    try{signature=contentSignature(await readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
    snapshot.set(url.href,{signature,lastmod:match[2].match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/)?.[1]||null});
  }
  return snapshot;
}
export function modificationDate(previous,html,fallback,today){
  if(!previous?.signature)return previous?.lastmod||fallback;
  if(previous.signature!==contentSignature(html))return today;
  return previous.lastmod||fallback;
}
export async function updateModificationDates(root,entries,snapshot,today){
  let changed=0;
  for(const entry of entries){
    const url=new URL(entry.url),file=path.resolve(root,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));
    if(!file.startsWith(path.resolve(root)+path.sep))throw Error('Sitemap path outside site');
    const previous=snapshot.get(entry.url),html=await readFile(file,'utf8');
    const lastmod=modificationDate(previous,html,entry.lastmod,today);
    if(previous?.signature&&lastmod!==previous.lastmod)changed++;
    entry.lastmod=lastmod;
  }
  return {compared:snapshot.size,contentChanged:changed};
}
export async function finalizeModificationDates(root,entries,snapshot,today){
  const result=await updateModificationDates(root,entries,snapshot,today);
  const dates=new Map(entries.map(e=>[e.url,e.lastmod]));
  const file=path.join(root,'sitemap.xml'),xml=await readFile(file,'utf8');
  const next=xml.replace(/(<url>\s*<loc>([^<]+)<\/loc>)([\s\S]*?)(<\/url>)/g,(_,start,url,rest,end)=>{
    const date=dates.get(url);
    return start+rest.replace(/<lastmod>[^<]*<\/lastmod>/,'')+(date?'<lastmod>'+date+'</lastmod>':'')+end;
  });
  await writeFile(file,next,'utf8');
  return result;
}
