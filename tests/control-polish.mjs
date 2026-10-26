import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {refineControlAssets,CONTROL_VERSION,controlAssetVersion} from '../scripts/publish-control-polish.mjs';
test('control cache refresh is idempotent and preserves metadata, original links and source text',()=>{
 const source='<meta property="og:title" content="장소"><link rel="canonical" href="https://balzaguk.com/places/example/"><link rel="stylesheet" href="/detail-editorial.css?v=old"><script>const original="/detail-editorial.css?v=old";</script><a href="https://source.example/">사진 이용 조건</a>';
 const after=refineControlAssets(source);assert.equal(refineControlAssets(after),after);
 assert.equal(after.replace('detail-editorial.css?v='+controlAssetVersion('detail-editorial'),'detail-editorial.css?v=old'),source);
});

test('static public catalogues share deferred visitor collection exactly once without altering content',()=>{
 const original='<html><head><title>지역 업소</title></head><body data-listing-template="quality3"><main>원문·조건·출처</main></body></html>';
 const after=refineControlAssets(original);
 assert.equal((after.match(/src="\/traffic\.js\?/g)||[]).length,1);
 assert.equal((after.match(/supabase-js@/g)||[]).length,1);
 assert(after.indexOf('supabase-js@')<after.indexOf('src="/traffic.js'));
 assert(after.includes('<main>원문·조건·출처</main>'));
 assert.equal(refineControlAssets(after),after);
 const withSdk=original.replace('</head>','<script defer src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js"></script></head>');
 assert.equal((refineControlAssets(withSdk).match(/supabase-js@/g)||[]).length,1);
});

test('every generated public listing includes one collector and its existing exclusions',()=>{
 const files=execFileSync('git',['ls-files','-z','--','*.html'],{encoding:'utf8',maxBuffer:10000000}).split('\0').filter(Boolean);let lists=0;
 for(const file of files){if(/^(?:tests|docs|admin)/.test(file))continue;const html=readFileSync(file,'utf8');if(!html.includes('data-listing-template='))continue;lists++;assert.equal((html.match(/<script\b[^>]*src="\/?traffic\.js\?/g)||[]).length,1,file);assert(html.includes('supabase-js@2.117.2'),file);}
 assert(lists>=1100);
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
test('a delayed points response uses the current viewport after screen rotation',async()=>{
 const html=readFileSync('index.html','utf8'),start=html.indexOf('  async function loadMyPoints(){'),end=html.indexOf('  function reportKey(',start);
 assert(start>=0&&end>start);const badge={style:{},textContent:''},shop={textContent:''};let mobile=true,resolve;
 const context={console,myDeviceId:'test-owner',window:{matchMedia:()=>({matches:mobile})},document:{getElementById:id=>id==='points-badge'?badge:shop},sb:{from:()=>({select:()=>({eq:()=>new Promise(r=>resolve=r)})})}};
 vm.createContext(context);vm.runInContext(html.slice(start,end),context);
 const pending=context.loadMyPoints();mobile=false;resolve({data:[{amount:100}],error:null});await pending;assert.equal(badge.style.display,'');
 const pendingAgain=context.loadMyPoints();mobile=true;resolve({data:[{amount:100}],error:null});await pendingAgain;assert.equal(badge.style.display,'none');
});
test('all generated user pages use current shared styles; home has no detail/list stylesheet',()=>{
 const files=execFileSync('git',['ls-files','-z','--','*.html'],{encoding:'utf8',maxBuffer:10000000}).split('\0').filter(Boolean);let covered=0;
 for(const file of files){if(/^(?:tests|docs|admin)/.test(file))continue;const h=readFileSync(file,'utf8'),links=[...h.matchAll(/<link\b[^>]*href="\/(detail-editorial|listing-editorial|internal-pages|product-ui|design-system|legal)\.css\?v=([^"?]+)"/g)];if(links.length)covered++;for(const link of links)assert.equal(link[2],controlAssetVersion(link[1]),file);}
 assert(covered>=23400);const home=readFileSync('index.html','utf8');assert(!home.includes('href="/detail-editorial.css'));assert(!home.includes('href="/listing-editorial.css'));console.log('Shared-control style coverage:',covered);
});
