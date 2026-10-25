import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {refineControlAssets,CONTROL_VERSION,controlAssetVersion} from '../scripts/publish-control-polish.mjs';
test('control cache refresh is idempotent and preserves metadata, original links and source text',()=>{
 const source='<meta property="og:title" content="장소"><link rel="canonical" href="https://balzaguk.com/places/example/"><link rel="stylesheet" href="/detail-editorial.css?v=old"><script>const original="/detail-editorial.css?v=old";</script><a href="https://source.example/">사진 이용 조건</a>';
 const after=refineControlAssets(source);assert.equal(refineControlAssets(after),after);
 assert.equal(after.replace('detail-editorial.css?v='+CONTROL_VERSION,'detail-editorial.css?v=old'),source);
});
test('the offline shell includes local stylesheet imports without caching private data',async()=>{
 const html=readFileSync('index.html','utf8'),handlers={},cached=new Set();
 const context={URL,Response,self:{location:{href:'https://balzaguk.com/sw.js',origin:'https://balzaguk.com'},addEventListener:(t,f)=>handlers[t]=f,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>({add:async p=>cached.add(new URL(p,'https://balzaguk.com').href)})}};
 vm.runInNewContext(readFileSync('sw.js','utf8'),context);let installed;handlers.install({waitUntil:p=>installed=p});await installed;
 for(const match of html.matchAll(/<link\b[^>]*href="(\/[^"?]+\.css)([^\"]*)"/g)){
  assert(cached.has('https://balzaguk.com'+match[1]+match[2]),match[1]);
  for(const imported of readFileSync(match[1].slice(1),'utf8').matchAll(/@import url\(['"](\/[^'"]+)['"]\)/g))assert(cached.has('https://balzaguk.com'+imported[1]),imported[1]);
 }
 for(const url of ['https://balzaguk.com/private-location.json','https://euwujrpjtwsrxhiytego.supabase.co/rest/v1/walk_records','https://tile.openstreetmap.org/1/1/1.png']){let handled=false;handlers.fetch({request:{url,method:'GET',mode:'cors'},respondWith:()=>handled=true});assert(!handled);}
});
test('all generated user pages use current shared styles; home has no detail/list stylesheet',()=>{
 const files=execFileSync('git',['ls-files','-z','--','*.html'],{encoding:'utf8',maxBuffer:10000000}).split('\0').filter(Boolean);let covered=0;
 for(const file of files){if(/^(?:tests|docs|admin)/.test(file))continue;const h=readFileSync(file,'utf8'),links=[...h.matchAll(/<link\b[^>]*href="\/(detail-editorial|listing-editorial|internal-pages|product-ui|design-system|legal)\.css\?v=([^"?]+)"/g)];if(links.length)covered++;for(const link of links)assert.equal(link[2],controlAssetVersion(link[1]),file);}
 assert(covered>=23400);const home=readFileSync('index.html','utf8');assert(!home.includes('href="/detail-editorial.css'));assert(!home.includes('href="/listing-editorial.css'));console.log('Shared-control style coverage:',covered);
});
