import test from 'node:test';import assert from 'node:assert/strict';import {readFile,access} from 'node:fs/promises';import path from 'node:path';import {searchHead,publicPageFiles,SITE} from '../scripts/search-head.mjs';
const root=path.resolve(import.meta.dirname,'..');
test('one stable absolute icon without changing structured data or body',()=>{
 const json='{"@type":"HowTo","name":"保留 <example>"}';
 const source=`<html><head><link rel="icon" href="old.png"><link href="old.ico" rel="shortcut icon"><link rel="apple-touch-icon" href="icon-192.png"><script type="application/ld+json">${json}</script></head><body>unchanged</body></html>`;
 const output=searchHead(source);assert.equal((output.match(/rel="icon"/g)||[]).length,1);assert.match(output,/href="https:\/\/balzaguk.com\/icon-192.png"/);assert(output.includes(json));assert(output.endsWith('<body>unchanged</body></html>'));assert.equal(searchHead(output),output);
});
test('all published pages have valid JSON-LD, matching place identity and resolvable breadcrumbs',async()=>{
 let schemas=0,breadcrumbs=0,places=0,files=await publicPageFiles(root);
 const publicURLs=new Set(files.map(x=>x.url));
 for(const {url,file} of files){
  const html=await readFile(file,'utf8');if(/<meta[^>]+content=["'][^"']*noindex/i.test(html))continue;
  const head=html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i)?.[0];assert(head,url+' head');
  const icons=[...head.matchAll(/<link\b[^>]*\brel="icon"[^>]*>/g)];assert.equal(icons.length,1,url+' unique favicon');assert(icons[0][0].includes(SITE+'/icon-192.png'),url+' absolute favicon');
  for(const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)){
   let data;try{data=JSON.parse(match[1]);}catch(e){assert.fail(url+' invalid JSON-LD '+e.message);}schemas++;
   const nodes=Array.isArray(data)?data:data['@graph']||[data];
   for(const node of nodes){
    if(node['@type']==='BreadcrumbList'){breadcrumbs++;assert(node.itemListElement.length>=2,url);for(const [i,crumb] of node.itemListElement.entries()){assert.equal(crumb.position,i+1,url);const name=crumb.name||crumb.item?.name;assert(name&&!/^(홈|top)$/i.test(name),url+' descriptive breadcrumb');const target=typeof crumb.item==='string'?crumb.item:crumb.item?.['@id'];assert(target?.startsWith(SITE+'/'),url+' breadcrumb URL');assert(publicURLs.has(target),url+' unresolved breadcrumb '+target);}}
    if(node['@type']==='Place'){places++;assert.equal(node.url,url);const h1=html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]||'';const escaped=node.name.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');assert(h1.includes(escaped),url+' place name matches visible heading');if(node.geo){assert(Number.isFinite(node.geo.latitude)&&Math.abs(node.geo.latitude)<=90);assert(Number.isFinite(node.geo.longitude)&&Math.abs(node.geo.longitude)<=180);}for(const absent of ['aggregateRating','review','openingHoursSpecification'])assert(!Object.hasOwn(node,absent),url+' unverified claims');}
   }
  }
 }
 const png=await readFile(path.join(root,'icon-192.png'));assert.equal(png.readUInt32BE(16),192);assert.equal(png.readUInt32BE(20),192);await access(path.join(root,'favicon.ico'));
 console.log(JSON.stringify({pages:files.length,jsonLdBlocks:schemas,breadcrumbs,places}));assert(places>=3500);
});
