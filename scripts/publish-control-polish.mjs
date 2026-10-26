import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export const CONTROL_VERSION='20261026-controls4-final';
export const controlAssetVersion=name=>['product-ui','detail-editorial','listing-editorial','internal-pages','readability'].includes(name)?'20261026-quality7':CONTROL_VERSION;
export function refineControlAssets(html){
 const interactive=/id="(?:find-place|care-form)"/.test(html);
 html=html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/,head=>head.replace(/<script(?: defer)? src="\/card-media\.js\?v=[\w-]+"><\/script>/g,''));
 if(interactive)html=html.replace('</head>','<script src="/card-media.js?v=20261026-quality7"></script></head>');
 html=html.replace(/(?:place-search|pet-care|place-saves|place-presentation)\.js\?v=[\w-]+/g,match=>match.split('?')[0]+'?v=20261026-quality7');
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
