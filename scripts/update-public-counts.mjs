import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export function applyPublicCounts(html,counts){
 for(const key of ['courses','facilities'])if(!Number.isSafeInteger(counts[key])||counts[key]<0)throw Error('Invalid '+key+' count');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(counts.checked)||new Date(counts.checked).toISOString().slice(0,10)!==counts.checked)throw Error('Invalid checked date');
 const ids={courses:['hero-stat-courses','stat-courses','stat-courses-1','stat-courses-3','stat-courses-live'],facilities:['hero-stat-facilities','stat-facilities','stat-facilities-1','stat-facilities-3','stat-facilities-live']};
 for(const [key,list]of Object.entries(ids))for(const id of list){const pattern=new RegExp('(id="'+id+'"[^>]*>)[0-9,]+([^<]*)');html=html.replace(pattern,(_,prefix,suffix)=>prefix+counts[key].toLocaleString('en-US')+suffix);}
 const pattern=/homeCountSnapshot=\{courses:\d+,facilities:\d+,checked:'\d{4}-\d{2}-\d{2}',source:'release'\}/;
 if(!pattern.test(html))throw Error('Published counter declaration missing');
 return html.replace(pattern,`homeCountSnapshot={courses:${counts.courses},facilities:${counts.facilities},checked:'${counts.checked}',source:'release'}`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const args=process.argv.slice(2),get=flag=>args[args.indexOf(flag)+1];
 if(!['--courses','--facilities','--checked'].every(f=>args.includes(f)))throw Error('Usage: node scripts/update-public-counts.mjs --courses 407 --facilities 3133 --checked 2026-10-20');
 const counts={courses:Number(get('--courses')),facilities:Number(get('--facilities')),checked:get('--checked')};
 const root=path.resolve(import.meta.dirname,'..'),file=path.join(root,'index.html'),next=applyPublicCounts(await readFile(file,'utf8'),counts);
 await writeFile(file,next);await writeFile(path.join(root,'data/public-counts.json'),JSON.stringify(counts,null,2)+'\n');
 console.log('Published counts updated locally:',counts);
}
