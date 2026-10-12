import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),titles=new Set(),missing=[];
for(const dir of await readdir(path.join(root,'guides'))){if(!(await stat(path.join(root,'guides',dir))).isDirectory())continue;
 const html=await readFile(path.join(root,'guides',dir,'index.html'),'utf8');
 const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title),'Duplicate guide title');titles.add(title);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.ok(html.includes('https://balzaguk.com/guides/'+dir+'/'));
 for(const [,json]of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(json);
 for(const [,url]of html.matchAll(/href="(\/(?:guides|courses|about)\/[^"#?]*)"/g))try{await stat(path.join(root,url.slice(1),'index.html'));}catch{missing.push(dir+' -> '+url);}
}
assert.deepEqual(missing,[]);
assert.equal(titles.size,9);
const guide=await readFile(path.join(root,'guides/compare-dog-walk-courses/index.html'),'utf8');
for(const phrase of ['미확인은','시속 4km','GPS 기록은','자료 확인일','비교 보기'])assert.ok(guide.includes(phrase),phrase);
const hub=await readFile(path.join(root,'guides/index.html'),'utf8');assert.equal((hub.match(/<article>/g)||[]).length,9);
console.log('PASS: 9 unique guide titles, full local destinations, one H1, valid structured data, comparison safeguards and complete directory.');
