import {readFile,writeFile,mkdir} from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';import {publicPageFiles} from './search-head.mjs';
export async function cacheRepeatedSearchStyles(root){
 const files=await publicPageFiles(root),counts=new Map();
 for(const {file}of files){const html=await readFile(file,'utf8');for(const m of html.matchAll(/<style>([\s\S]*?)<\/style>/g)){const css=m[1];if(css.length<500||/url\s*\(|@import/i.test(css))continue;counts.set(css,(counts.get(css)||0)+1);}}
 const shared=new Map();await mkdir(path.join(root,'assets/search-styles'),{recursive:true});
 for(const [css,count]of counts){if(count<10)continue;const name=createHash('sha256').update(css).digest('hex').slice(0,16)+'.css';await writeFile(path.join(root,'assets/search-styles',name),css);shared.set(css,'/assets/search-styles/'+name);}
 let updated=0,saved=0;for(const {file}of files){const html=await readFile(file,'utf8'),next=html.replace(/<style>([\s\S]*?)<\/style>/g,(block,css)=>shared.has(css)?'<link rel="stylesheet" href="'+shared.get(css)+'">':block);if(html!==next){saved+=Buffer.byteLength(html)-Buffer.byteLength(next);await writeFile(file,next);updated++;}}
 return {shared:shared.size,pages:updated,savedBytes:saved};
}
