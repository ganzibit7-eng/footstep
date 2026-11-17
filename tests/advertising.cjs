const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');const a=require('../advertising.js');
test('paused notice links resolve to real public destinations',()=>{for(const m of fs.readFileSync('advertise/index.html','utf8').matchAll(/href="(\/(?!\/)[^"#?]*)/g)){const p=m[1];assert(fs.existsSync('.'+p+(p.endsWith('/')?'index.html':'')),p);}});
test('KST is explicit, end boundary is exclusive and invalid dates fail',()=>{assert.equal(a.kst('2026-10-29T09:00'),'2026-10-29T00:00:00.000Z');assert.throws(()=>a.kst('2026-02-30T12:00'));assert.throws(()=>a.kst('yesterday'));const c={brand:'example',headline:'test',image_pc:'https://a.example/a.webp',image_mobile:'https://a.example/m.webp',target_url:'https://a.example/',ends_at:'2026-10-29T00:00:00Z'};assert(a.eligible(c,Date.parse(c.ends_at)-1));assert(!a.eligible(c,Date.parse(c.ends_at)));assert(!a.eligible({...c,target_url:'javascript:alert(1)'},0));});
test('unsafe destinations and credentials fail closed',()=>{for(const v of ['javascript:alert(1)','http://example.com','https://user:secret@example.com','data:image/svg+xml,abc','/relative'])assert.equal(a.safeURL(v),null);assert.equal(a.safeURL('https://example.com/path'),'https://example.com/path');});
test('public advertisement routes and assets stay paused',()=>{
 const notice=fs.readFileSync('advertise/index.html','utf8');
 const home=fs.readFileSync('index.html','utf8');
 const sitemap=fs.readFileSync('sitemap.xml','utf8');
 const config=fs.readFileSync('_config.yml','utf8').replaceAll('\r\n','\n');
 const serviceWorker=fs.readFileSync('sw.js','utf8');
 assert.match(notice,/content="noindex, follow"/);
 assert.match(notice,/광고 게재와 신규 광고·제휴 문의 접수를 잠정 중단/);
 assert.doesNotMatch(notice,/<script|<form|mailto:|kakao\.com|kmong\.com/);
 assert.doesNotMatch(home,/brand-partner-slot|support-partnership|trip-section-disclosure|트립닷컴에서 객실을 확인할 수 있는 숙소|\/advertise\/|\/advertising\.(?:js|css)/);
 assert(!sitemap.includes('https://balzaguk.com/advertise/'));
 assert(!serviceWorker.includes('/admin-advertising.js'));
 for(const name of ['assets/advertising','advertising.js','advertising.css','shopping.js','shopping-config.js','trip-stays.json','trip-stays.css']){
  assert(config.includes('  - '+name+'\n'),name);
  assert(!serviceWorker.includes('/'+name),name);
 }
});
test('additive policies preserve privileged writes and limited public projection',()=>{const s=fs.readFileSync('database_sql/advertising_setup.sql','utf8');assert.equal((s.match(/enable row level security/g)||[]).length,2);assert(s.includes('ad_admin_update'));assert(s.includes('with check(public.is_admin'));assert(s.includes('pg_advisory_xact_lock'));assert(s.includes("'[)'"));assert(s.includes('starts_at<=now() and ends_at>now()'));assert(!/drop table|disable row level security/i.test(s));});
const vm=require('node:vm');
test('package inquiry carries the exact product and moves keyboard focus without capturing modified clicks',()=>{let click,focused=false,scrolled=false,pushed=0;const selected={},email={},contact={scrollIntoView(){scrolled=true;},querySelector:()=>({focus(){focused=true;}})};const ctx={URL,Date,Promise,AbortSignal,performance:{now:()=>0},location:{hash:'#packages'},history:{pushState(){pushed++;}},document:{querySelectorAll:()=>[{dataset:{packageLabel:'PREMIUM · 30일 · 40,000원'},addEventListener(t,f){click=f;}}],getElementById:id=>({'ad-selected':selected,'ad-email-link':email,contact}[id]||null)},fetch:async()=>({ok:true,json:async()=>({server_time:'2026-10-29T00:00:00Z',campaign:null})})};vm.runInNewContext(fs.readFileSync('advertising.js','utf8'),ctx);let prevented=0;click({button:0,ctrlKey:true,preventDefault(){prevented++;}});assert.equal(pushed,0);click({button:0,preventDefault(){prevented++;}});assert.equal(prevented,1);assert.equal(pushed,1);assert(focused&&scrolled);assert.equal(selected.hidden,false);assert(decodeURIComponent(email.href).includes('PREMIUM · 30일 · 40,000원'));});
test('email copy reports actual success, rejects repeated pending clicks and exposes failure fallback',async()=>{let handler,calls=0,release,fail=false;const button={disabled:false,addEventListener(t,f){handler=f;}},status={textContent:''};const ctx={URL,Date,Promise,AbortSignal,performance:{now:()=>0},navigator:{clipboard:{writeText(){calls++;if(fail)return Promise.reject(Error('denied'));return new Promise(r=>release=r);}}},document:{querySelectorAll:()=>[],getElementById:id=>id==='ad-email-copy'?button:id==='ad-copy-status'?status:null},fetch:async()=>({ok:true,json:async()=>({server_time:'2026-10-29T00:00:00Z',campaign:null})})};vm.runInNewContext(fs.readFileSync('advertising.js','utf8'),ctx);const pending=handler();await handler();assert.equal(calls,1);assert.equal(button.disabled,true);release();await pending;assert(status.textContent.includes('복사했어요'));assert.equal(button.disabled,false);fail=true;await handler();assert(status.textContent.includes('자동 복사를 사용할 수 없어요'));assert.equal(button.disabled,false);});
