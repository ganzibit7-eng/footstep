import {readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {readFileSync} from 'node:fs';
const externalLinks=JSON.parse(readFileSync(new URL('../data/place-external-links.json',import.meta.url),'utf8'));
function addExternalLink(html){
 if(html.includes('class="place-naver-link"'))return html;
 const id=html.match(/rel="canonical" href="https:\/\/balzaguk.com\/places\/([^/]+)\//)?.[1];
 const name=html.match(/<h1>([^<]+)<\/h1>/)?.[1]?.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'");
 if(!id||!name)return html;
 const address=html.match(/<strong>위치·분류<\/strong><br>([^<]+)/)?.[1]?.split(' · ')[0]||'';
 const exact=externalLinks[id],url=exact||'https://map.naver.com/p/search/'+encodeURIComponent(name+' '+address);
 const safe=url.replaceAll('&','&amp;').replaceAll('"','&quot;');
 return html.replace(/(<div class="place-actions"[^>]*>[\s\S]*?)(<\/div>)/,'$1<a class="place-naver-link" href="'+safe+'" target="_blank" rel="noopener noreferrer">'+(exact?'네이버에서 확인':'네이버 지도에서 검색')+' ↗</a>$2');
}

// Applied to generated HTML as well as existing pages; factual data and JSON-LD stay intact.
export function refinePlaceDetail(html){
 if(!/class="reading-page place-detail-page"/.test(html))return html;
 html=addExternalLink(html);
 if(html.includes('/place-detail.css?'))return html.replaceAll('place-detail.css?v=20261017-premium','place-detail.css?v=20261017-native');
 html=html.replace('</head>','<link rel="stylesheet" href="/place-detail.css?v=20261017-native"></head>');
 html=html.replace(/<a class="brand"[^>]*>[\s\S]*?<\/a>/,'<header class="place-site-header"><a class="brand" href="/" aria-label="발자국 홈"><img src="/icon-192.png" width="28" height="28" alt="">발자국</a><a class="place-back" href="/discover.html?kind=facilities#find-place">장소 둘러보기 ↗</a></header>');
 html=html.replace(/<nav aria-label="현재 위치">([\s\S]*?)<\/nav>/,(_,content)=>{
  const links=[...content.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(x=>x[0]);
  const current=content.match(/<span aria-current="page">[\s\S]*?<\/span>/)?.[0]||'';
  return '<nav aria-label="현재 위치">'+[links.at(-1),current].filter(Boolean).join('<span class="place-crumb-separator" aria-hidden="true">/</span>')+'</nav>';
 });
 let directory='';
 html=html.replace(/<nav aria-label="관련 장소 목록"[^>]*>[\s\S]*?<\/nav>/,nav=>{directory='<details class="place-directory"><summary>지역·분류별 장소 더 보기</summary>'+nav+'</details>';return '';});
 html=html.replace(/<div class="icon">[\s\S]*?<\/div>/,'').replace(/(<p class="meta">[^<]*)식당카페/,'$1식당·카페');
 // Keep original image ratio, full credits and license links. Lead image should load promptly.
 let photo='';
 html=html.replace(/<figure class="place-photo"[\s\S]*?<\/figure>/,figure=>{photo=figure.replace('loading="lazy"','loading="eager" fetchpriority="high"').replace(/(<figcaption\b[^>]*>)([\s\S]*?)(<\/figcaption>)/,'$1<details><summary>사진 출처·이용 안내</summary><div>$2</div></details>$3');return '';});
 if(photo)html=html.replace('</h1>','</h1>'+photo);
 html=html.replace(/<nav class="place-dock"[\s\S]*?<\/nav>/,'');
 html=html.replace('</article>','</article>'+directory);
 return html;
}

export async function refinePublishedPlaces(root){
 let changed=0;
 for(const entry of await readdir(path.join(root,'places'),{withFileTypes:true})){
  if(!entry.isDirectory())continue;
  const file=path.join(root,'places',entry.name,'index.html');
  let original;try{original=await readFile(file,'utf8');}catch(e){if(e.code==='ENOENT')continue;throw e;}
  const next=refinePlaceDetail(original);if(next!==original){await writeFile(file,next);changed++;}
 }
 return changed;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)console.log('Refined place details:',await refinePublishedPlaces(path.resolve(import.meta.dirname,'..')));
