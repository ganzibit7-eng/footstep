const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('critical hero assets are discoverable before blocking libraries; map keeps dependency order',()=>{
 const h=fs.readFileSync('index.html','utf8'),head=h.slice(0,h.indexOf('</head>'));
 assert(h.indexOf('as="font"')<h.indexOf('supabase-js@'));
 assert(head.includes('imagesrcset="/assets/hero-park-preview/mobile-480.webp 480w'));
 assert(head.includes('media="(min-width:881px)"'));
 const libs=['leaflet/1.9.4/leaflet.min.js','leaflet.markercluster.js','/professional-map.js?','/map-services.js?','dapi.kakao.com/v2/maps/sdk.js','/walk-calendar.js?','/weather-widget.js?','/map-explorer.js?'];
 let prior=h.indexOf('id="hero-side-wrap"');
 for(const name of libs){assert(!head.includes('<script src="'+name));const pos=h.indexOf(name);assert(pos>prior,name+' must follow first screen and previous dependency');prior=pos;}
 assert(prior<h.indexOf('const sb = window.supabase.createClient'));
 assert.equal((h.match(/as="image"[^>]*gallop-v1\/pom-00/g)||[]).length,1);
});
test('offline install deduplicates URLs, bounds concurrency, and continues after an asset failure',async()=>{
 let install,active=0,peak=0,claimed=false;const requested=[];
 const ctx={URL,Response,console,self:{location:{href:'https://balzaguk.com/sw.js',origin:'https://balzaguk.com'},addEventListener:(name,fn)=>{if(name==='install')install=fn;},skipWaiting:()=>{claimed=true;}},caches:{open:async()=>({add:async url=>{requested.push(url);active++;peak=Math.max(peak,active);await new Promise(r=>setImmediate(r));active--;if(url.endsWith('/icon-192.png'))throw Error('optional failure');}})}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync('sw.js','utf8')+';globalThis.expected=[...new Set(SHELL_FILES.map(p=>new URL(p,self.location.href).href))];globalThis.raw=SHELL_FILES.length;',ctx);
 let done;install({waitUntil:p=>{done=p;}});await done;
 assert.equal(requested.length,ctx.expected.length);assert.equal(new Set(requested).size,requested.length);assert(requested.length<ctx.raw);assert(peak<=4);assert(claimed);
 assert(requested.some(x=>x.includes('hero-park.js?v=20261031-breeze')));
 console.log('Offline shell: '+ctx.raw+' entries → '+requested.length+' unique requests; maximum '+peak+' simultaneous.');
});
