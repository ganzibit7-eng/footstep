import {readFile,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import CoursePhotos from '../course-photos.js';
const SITE='https://balzaguk.com';
const NS='http://www.google.com/schemas/sitemap-image/1.1';
const xmlEscape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
// Only published canonical course pages with the curated photograph in their HTML.
// Keep the image credit/license in the page; deprecated image sitemap fields are omitted.
export async function enrichImageSitemap(root){
 const file=path.join(root,'sitemap.xml');let xml=await readFile(file,'utf8'),count=0;
 const records=JSON.parse(await readFile(path.join(root,'assets/course-photos/credits.json'),'utf8'));
 const entries=[...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g)];
 for(const [entry,url] of entries){
  const id=url.match(/^https:\/\/balzaguk\.com\/courses\/([A-Za-z0-9_-]+)\/$/)?.[1];
  if(!id)continue;
  const html=await readFile(path.join(root,'courses',id,'index.html'),'utf8');
  const record=records.find(p=>p.courses?.[id]&&html.includes(`<h1>${xmlEscape(p.courses[id])}</h1>`));
  const photo=record&&CoursePhotos.get({id,name:record.courses[id]});
  const clean=entry.replace(/<image:image>[\s\S]*?<\/image:image>/g,'');
  if(!photo){xml=xml.replace(entry,clean);continue;}
  if(!/^\/assets\/course-photos\/[A-Za-z0-9_-]+\.(?:webp|jpg|jpeg|png)$/.test(photo.src))throw Error('Unexpected curated photo path: '+id);
  if(!html.includes(`<link rel="canonical" href="${url}">`)||/<meta[^>]*content="[^"]*noindex/i.test(html))throw Error('Image page is not public canonical: '+id);
  if(!html.includes(`src="${photo.src}"`))throw Error('Curated image missing from course page: '+id);
  if(!(await stat(path.join(root,photo.src.slice(1)))).isFile())throw Error('Image file missing: '+id);
  xml=xml.replace(entry,clean.replace('</url>',`<image:image><image:loc>${xmlEscape(SITE+photo.src)}</image:loc></image:image></url>`));count++;
 }
 if(count&&!xml.includes('xmlns:image='))xml=xml.replace('<urlset ',`<urlset xmlns:image="${NS}" `);
 await writeFile(file,xml,'utf8');
 return {pages:count};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(await enrichImageSitemap(path.resolve(import.meta.dirname,'..')));
