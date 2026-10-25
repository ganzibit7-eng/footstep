import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export const CONTROL_VERSION='20261026-controls4-final';
export function refineControlAssets(html){
 return html.replace(/(<link\b[^>]*\bhref=["'])\/(detail-editorial|listing-editorial|internal-pages|product-ui|design-system|legal)\.css\?v=[\w-]+/g,(_,prefix,name)=>prefix+'/'+name+'.css?v='+CONTROL_VERSION);
}
export async function publishControlPolish(root){
 const files=execFileSync('git',['ls-files','-z','--','*.html'],{cwd:root,encoding:'utf8',maxBuffer:10000000}).split('\0').filter(Boolean);let changed=0,covered=0;
 for(const file of files){if(/^(?:tests|docs|admin)/.test(file))continue;let before;try{before=await readFile(path.join(root,file),'utf8');}catch(e){if(e.code==='ENOENT')continue;throw e;}
  const after=refineControlAssets(before);if(after!==before){await writeFile(path.join(root,file),after);changed++;}if(after.includes('.css?v='+CONTROL_VERSION))covered++;
 }
 return {changed,covered};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)console.log(await publishControlPolish(path.resolve(import.meta.dirname,'..')));
