import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,copyFile,rm} from 'node:fs/promises';import os from 'node:os';import path from 'node:path';
import {enrichImageSitemap} from '../scripts/image-sitemap.mjs';
const root=path.resolve(import.meta.dirname,'..');
test('image sitemap covers every public photo course, without private URLs or deprecated tags',async()=>{
 const xml=await readFile(path.join(root,'sitemap.xml'),'utf8');
 const images=[...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)];
 const publicCourses=[...xml.matchAll(/<url><loc>https:\/\/balzaguk\.com\/courses\/[A-Za-z0-9_-]+\/<\/loc>/g)];assert.equal(images.length,publicCourses.length);assert(publicCourses.length>0);
 assert(xml.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'));
 assert(!/<image:(?:title|caption|license|geo_location)>/.test(xml));
 for(const [entry,image] of [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].filter(([s])=>s.includes('<image:image>')).map(([s])=>[s,s.match(/<image:loc>([^<]+)/)[1]])){
  const url=entry.match(/<loc>([^<]+)/)[1];assert.match(url,/^https:\/\/balzaguk.com\/courses\/[\w-]+\/$/);
  const html=await readFile(path.join(root,new URL(url).pathname,'index.html'),'utf8');
  assert(html.includes(`src="${new URL(image).pathname}"`));assert(html.includes('사진:'));assert(html.includes('license'));
 }
});
test('repeat enrichment preserves dates and fails before writing on missing assets or noindex',async()=>{
 const temp=await mkdtemp(path.join(os.tmpdir(),'balzaguk-images-'));
 try{
  await mkdir(path.join(temp,'courses/c31'),{recursive:true});await mkdir(path.join(temp,'assets/course-photos'),{recursive:true});
  const html=await readFile(path.join(root,'courses/c31/index.html'),'utf8');
  const src=html.match(/<img\b[^>]*src="(\/assets\/course-photos\/[^"]+)"/)[1];
  await copyFile(path.join(root,src),path.join(temp,src));await copyFile(path.join(root,'assets/course-photos/credits.json'),path.join(temp,'assets/course-photos/credits.json'));
  await writeFile(path.join(temp,'courses/c31/index.html'),html);
  const file=path.join(temp,'sitemap.xml');await writeFile(file,'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://balzaguk.com/courses/c31/</loc><lastmod>2026-10-02</lastmod></url></urlset>');
  assert.deepEqual(await enrichImageSitemap(temp),{pages:1});const first=await readFile(file,'utf8');
  await enrichImageSitemap(temp);assert.equal(await readFile(file,'utf8'),first);assert(first.includes('<lastmod>2026-10-02</lastmod>'));
  await writeFile(path.join(temp,'courses/c31/index.html'),html.replace('<head>','<head><meta name="robots" content="noindex">'));
  await assert.rejects(enrichImageSitemap(temp),/not public canonical/);assert.equal(await readFile(file,'utf8'),first);
  await writeFile(path.join(temp,'courses/c31/index.html'),html);await rm(path.join(temp,src));
  await assert.rejects(enrichImageSitemap(temp));assert.equal(await readFile(file,'utf8'),first);
 }finally{await rm(temp,{recursive:true,force:true});}
});
