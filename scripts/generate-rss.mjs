import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const SITE='https://balzaguk.com';
const xml=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
const cdata=value=>'<![CDATA['+value.replaceAll(']]>',']]]]><![CDATA[>')+']]>';
function plain(value){return value.replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').trim();}
export function feedItem(html,url){
  if(!url.startsWith(SITE+'/')||/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html))throw Error('RSS requires a public same-site page: '+url);
  const title=plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]||'');
  let body=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if(!title||!body)throw Error('Missing title or full main content: '+url);
  body=body.replace(/<(script|style|iframe|form)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*')/gi,'');
  body=body.replace(/\b(href|src)=("|')([^"']+)\2/gi,(_,attr,quote,value)=>{
    if(/^javascript:/i.test(value.trim()))return attr+'="#"';
    return attr+'='+quote+new URL(value,url).href+quote;
  });
  return '<item><title>'+xml(title)+'</title><link>'+xml(url)+'</link><guid isPermaLink="true">'+xml(url)+'</guid><description>'+cdata(body)+'</description></item>';
}
export async function generateRSS(root){
  const sitemap=await readFile(path.join(root,'sitemap.xml'),'utf8');
  const urls=[...new Set([...sitemap.matchAll(/<loc>(https:\/\/balzaguk\.com\/(?:about\/|weekend\/|guides\/[^/]+\/|with-dog\/[^/]+\/))<\/loc>/g)].map(m=>m[1]))].sort();
  if(!urls.length)throw Error('No public guide pages for RSS');
  const items=await Promise.all(urls.map(async url=>feedItem(await readFile(path.join(root,new URL(url).pathname.slice(1),'index.html'),'utf8'),url)));
  // No invented publication dates: only the actual feed generation time is dated.
  const payload=items.join('\n'),output=path.join(root,'rss.xml');
  const previous=await readFile(output,'utf8').catch(()=> '');
  if(previous.replace(/\r\n/g,'\n').includes(payload.replace(/\r\n/g,'\n')))return {count:items.length,changed:false};
  const feed='<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>발자국 산책·동반장소 안내</title><link>'+SITE+'/</link><description>발자국의 지역별 산책·동반장소 안내와 산책 준비 가이드입니다. 동반 조건과 자료 확인 기준은 각 본문에서 확인하세요.</description><language>ko-kr</language><atom:link href="'+SITE+'/rss.xml" rel="self" type="application/rss+xml"/><lastBuildDate>'+new Date().toUTCString()+'</lastBuildDate>\n'+payload+'\n</channel></rss>\n';
  if(Buffer.byteLength(feed)>=10*1024*1024)throw Error('RSS exceeds Naver size limit');
  await writeFile(output,feed,'utf8');return {count:items.length,changed:true};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)console.log(await generateRSS(path.resolve(import.meta.dirname,'..')));
