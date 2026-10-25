import {readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {editorialDetail,buildRelatedIndex,detailPhotoURL} from './detail-editorial.mjs';
import assert from 'node:assert/strict';
export function assertPreserved(before,after,url){
 const match=(html,re)=>[...html.matchAll(re)].map(m=>m[0]);
 assert.deepEqual(match(after,/<meta\b[^>]*>/g),match(before,/<meta\b[^>]*>/g),url+' metadata');
 assert.deepEqual(match(after,/<script type="application\/ld\+json">[\s\S]*?<\/script>/g),match(before,/<script type="application\/ld\+json">[\s\S]*?<\/script>/g),url+' structured data');
 const links=new Set([...after.matchAll(/href="([^"]+)"/g)].map(m=>m[1]));
 for(const m of before.matchAll(/href="([^"]+)"/g))assert(links.has(m[1]),url+' missing destination '+m[1]);
 const photos=new Set([...after.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m=>m[1]));
 for(const m of before.matchAll(/<img\b[^>]*src="([^"]+)"/g))assert(photos.has(m[1])||photos.has(detailPhotoURL(m[1])),url+' missing photograph '+m[1]);
}
export async function publishEditorial(root,{only=[]}={}){
 const pages=[];
 for(const folder of ['places','courses','bins','pet-care/places']){
  for(const entry of await readdir(path.join(root,folder),{withFileTypes:true})){
   if(!entry.isDirectory())continue;const url='/'+folder+'/'+entry.name+'/',file=path.join(root,folder,entry.name,'index.html');
   let html;try{html=await readFile(file,'utf8');}catch(e){if(e.code==='ENOENT')continue;throw e;}
   if(!html.includes('rel="canonical" href="https://balzaguk.com'+url+'"')||!/<article class="(?:card|care-detail|detail-article)"/.test(html))continue;
   pages.push([url,html,file]);
  }
 }
 const relatedIndex=buildRelatedIndex(pages),counts={};
 for(const [url,html,file] of pages){if(only.length&&!only.includes(url))continue;const next=editorialDetail(html,{relatedIndex});if(next!==html){assertPreserved(html,next,url);await writeFile(file,next);const kind=next.match(/data-detail-kind="([^"]+)"/)?.[1];counts[kind]=(counts[kind]||0)+1;}}
 return counts;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)console.log(JSON.stringify(await publishEditorial(path.resolve(import.meta.dirname,'..'),{only:process.argv.slice(2)})));
