import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const SITE='https://balzaguk.com';
// Stable existing brand asset; 192px exceeds Naver's 32px recommendation.
export const ICON='<link rel="icon" href="https://balzaguk.com/icon-192.png" type="image/png" sizes="192x192">';
export function searchHead(html){
  return html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i,head=>{
    head=head.replace(/<link\b[^>]*>/gi,tag=>{
      const rel=tag.match(/\brel\s*=\s*["']([^"']+)["']/i)?.[1].toLowerCase();
      if(rel==='icon'||rel==='shortcut icon')return '';
      if(rel==='apple-touch-icon'||rel==='apple-touch-icon-precomposed')return tag.replace(/\bhref\s*=\s*(["'])(.*?)\1/i,(_,q,href)=>'href='+q+new URL(href,SITE+'/').href+q);
      return tag;
    });
    return head.replace(/<\/head>/i,'').trimEnd()+'\n'+ICON+'\n</head>';
  });
}
export async function publicPageFiles(root){
  const urls=new Set([SITE+'/']);
  for(const name of ['sitemap.xml','walk-sitemap.xml']){
    const xml=await readFile(path.join(root,name),'utf8');
    for(const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g))urls.add(m[1]);
  }
  return [...urls].map(raw=>{
    const url=new URL(raw);
    if(url.origin!==SITE||url.search||url.hash)throw Error('Invalid public URL: '+raw);
    const pathname=decodeURIComponent(url.pathname);
    const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
    if(!file.startsWith(path.resolve(root)+path.sep))throw Error('Path outside public site');
    return {url:raw,file};
  });
}
export async function normalizePublicSearchHeads(root){
  const files=await publicPageFiles(root);let updated=0;
  for(const {file} of files){const html=await readFile(file,'utf8');if(/<meta[^>]+content=["'][^"']*noindex/i.test(html))continue;const next=searchHead(html);if(next!==html){await writeFile(file,next);updated++;}}
  return {checked:files.length,updated};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(await normalizePublicSearchHeads(path.resolve(import.meta.dirname,'..')));
