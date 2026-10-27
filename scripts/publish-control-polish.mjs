import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export const CONTROL_VERSION='20261026-controls4-final';
export const controlAssetVersion=name=>name==='listing-editorial'?'20261027-quality11-final':name==='detail-editorial'?'20261027-quality11':['product-ui','detail-editorial','listing-editorial','internal-pages','readability'].includes(name)?'20261026-quality8':CONTROL_VERSION;
export function refineControlAssets(html){
 html=html.replace(/\/card-media\.js\?v=[\w-]+/g,'/card-media.js?v=20261027-quality10');
 const interactive=/id="(?:find-place|care-form)"/.test(html);
 // Static professional catalogues must use the same visitor exclusions as the
 // searchable directory and detail pages. Defer both scripts, in dependency order.
 if(html.includes('data-listing-template=')&&!/<script\b[^>]*\bsrc=["']\/?traffic\.js(?:[?"'])/.test(html)){
  const sdk=/<script\b[^>]*\bsrc=["'][^"']*supabase-js[^"']*["']/.test(html)?'':'<script defer src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js"></script>';
  html=html.replace('</body>',sdk+'<script defer src="/traffic.js?v=20261026-quality9"></script></body>');
 }
 html=html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/,head=>head.replace(/<script(?: defer)? src="\/card-media\.js\?v=[\w-]+"><\/script>/g,''));
 if(interactive)html=html.replace('</head>','<script src="/card-media.js?v=20261027-quality10"></script></head>');
 html=html.replace(/(?:place-search|pet-care|place-saves|place-presentation)\.js\?v=[\w-]+/g,match=>match.split('?')[0]+'?v='+ (match.startsWith('place-search.')?'20261027-quality11-search':'20261026-quality8'));
 html=html.replace(/traffic\.js\?v=[\w-]+/g,'traffic.js?v=20261026-quality9').replace(/admin-bot-panel\.js\?v=[\w-]+/g,'admin-bot-panel.js?v=20261026-quality9');
 html=html.replace(/\/photo-display\.js\?v=[\w-]+/g,'/photo-display.js?v=20261026-quality9').replace(/\/place-photos\.js\?v=[\w-]+/g,'/place-photos.js?v=20261026-context9');
 if((html.includes('data-detail-template=')||html.includes('data-listing-template=')||html.includes('id="find-place"'))&&!html.includes('/public-update.js?'))html=html.replace('</body>','<script defer src="/public-update.js?v=20261026-quality9"></script></body>');
 return html.replace(/(<link\b[^>]*\bhref=["'])\/(detail-editorial|listing-editorial|internal-pages|product-ui|design-system|legal|readability)\.css\?v=[\w-]+/g,(_,prefix,name)=>prefix+'/'+name+'.css?v='+controlAssetVersion(name));
}
export async function publishControlPolish(root){
 const files=execFileSync('git',['ls-files','-z','--','*.html'],{cwd:root,encoding:'utf8',maxBuffer:10000000}).split('\0').filter(Boolean);let changed=0,covered=0;
 for(const file of files){if(/^(?:tests|docs|admin)/.test(file))continue;let before;try{before=await readFile(path.join(root,file),'utf8');}catch(e){if(e.code==='ENOENT')continue;throw e;}
  const after=refineControlAssets(before);if(after!==before){await writeFile(path.join(root,file),after);changed++;}if(after.includes('.css?v='+CONTROL_VERSION))covered++;
 }
 return {changed,covered};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)console.log(await publishControlPolish(path.resolve(import.meta.dirname,'..')));
