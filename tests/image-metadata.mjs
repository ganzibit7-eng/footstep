import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const images=html=>{
 const out=[];function walk(value){if(!value||typeof value!=='object')return;if(value['@type']==='ImageObject')out.push(value);for(const child of Object.values(value))walk(child);}
 for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))walk(JSON.parse(m[1]));
 return out;
};
test('image licensing points to existing source or rights access and never invents an unknown photographer',()=>{
 let count=0;
 for(const folder of ['courses','places'])for(const entry of readdirSync(folder,{withFileTypes:true})){
  if(!entry.isDirectory())continue;
  let html;try{html=readFileSync(folder+'/'+entry.name+'/index.html','utf8');}catch{continue;}
  for(const image of images(html)){
   const target=new URL(image.acquireLicensePage);assert.equal(target.protocol,'https:');assert(!target.username&&!target.password);
   assert([image.license,image.url].includes(image.acquireLicensePage));
   if(/촬영자 미표기/.test(image.creditText))assert.equal(image.creator,undefined,'credit provider is not an identified photographer');
   if(/^https:\/\/data\.si\.re\.kr\//.test(image.url))assert.equal(image.creator,undefined,'publication credit does not identify an individual photographer');
   count++;
  }
 }
 assert(count>=412);console.log('Licensed image metadata checked:',count);
 const unknown=images(readFileSync('places/gocamping_2867/index.html','utf8'))[0];
 assert(unknown.creditText.includes('촬영자 미표기'));assert.equal(unknown.creator,undefined);assert.equal(unknown.copyrightNotice,undefined);
 assert.equal(unknown.acquireLicensePage,unknown.license);
});
