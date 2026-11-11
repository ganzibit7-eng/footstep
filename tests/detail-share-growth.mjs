import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

function mount(file, {canonical='https://balzaguk.com/places/example/', native, clipboard, secure=true, primary=true}={}) {
 const events={}, attrs={}, messages={dataset:{}}, label={}, toolbar={children:[],append(button){this.children.push(button);}};
 const button={disabled:false,setAttribute(k,v){attrs[k]=v;},removeAttribute(k){delete attrs[k];},addEventListener(type,handler){events[type]=handler;}};
 const page={querySelectorAll:()=>[],querySelector(selector){return ({'[data-detail-share]':button,'[data-detail-status]':messages,'.detail-actions-primary':primary?toolbar:null,'.detail-actions-secondary > summary':label})[selector]||null;}};
 const context={URL,document:{title:'Example | Balzaguk',querySelector(selector){return selector==='[data-detail-template]'?page:canonical?{href:canonical}:null;}},window:{isSecureContext:secure,matchMedia:()=>({matches:true})},navigator:{share:native,clipboard:clipboard?{writeText:clipboard}:undefined}};
 vm.runInNewContext(readFileSync(file,'utf8'),context);
 return {button,attrs,messages,label,toolbar,click:()=>events.click({currentTarget:button})};
}

for(const file of ['detail-editorial.js','route-experience.js']) {
 test(file+': exposes exactly the existing share button in primary actions',()=>{
  const ui=mount(file);assert.deepEqual(ui.toolbar.children,[ui.button]);assert.equal(ui.button.textContent,'친구에게 공유');assert.equal(ui.label.textContent,'다른 지도·주소');
  assert.doesNotThrow(()=>mount(file,{primary:false}));
 });
 test(file+': native failure copies canonical URL with correct attribution and no private query',async()=>{
  for(const [pathname,campaign] of [['/courses/c31/','course_detail'],['/places/p1/','place_detail'],['/bins/b1/','bin_detail'],['/pet-care/places/p1/','pet_care_detail']]){
   let copied;const ui=mount(file,{canonical:'https://balzaguk.com'+pathname+'?owner=secret#private',native:async()=>{throw {name:'NotAllowedError'};},clipboard:async value=>{copied=value;}});
   await ui.click();const url=new URL(copied);assert.equal(url.pathname,pathname);assert.equal(url.hash,'');assert.equal(url.searchParams.get('owner'),null);assert.equal(url.searchParams.get('utm_source'),'share');assert.equal(url.searchParams.get('utm_medium'),'referral');assert.equal(url.searchParams.get('utm_campaign'),campaign);assert.equal(ui.button.disabled,false);assert.equal(ui.attrs['aria-busy'],undefined);
  }
 });
 test(file+': successful native share or cancellation never copies',async()=>{
  for(const cancelled of [false,true]){let copies=0;const ui=mount(file,{native:async()=>{if(cancelled)throw {name:'AbortError'};},clipboard:async()=>copies++});await ui.click();assert.equal(copies,0);assert.equal(ui.messages.textContent,'');}
 });
 test(file+': repeated click blocked while pending; busy state cleared',async()=>{
  let finish,calls=0;const ui=mount(file,{native:()=>{calls++;return new Promise(resolve=>finish=resolve);}});const pending=ui.click();await ui.click();assert.equal(calls,1);assert.equal(ui.button.disabled,true);finish();await pending;assert.equal(ui.button.disabled,false);
 });
 test(file+': clipboard denial leaves manually copyable canonical URL',async()=>{
  const ui=mount(file,{clipboard:async()=>{throw Error('denied');}});await ui.click();assert(ui.messages.textContent.includes('https://balzaguk.com/places/example/?utm_source=share'));assert.equal(ui.button.disabled,false);
 });
 test(file+': rejects missing or offsite canonical without sharing',async()=>{
  for(const canonical of [null,'https://evil.example/places/p1/','https://balzaguk.com/?user=secret']){let calls=0;const ui=mount(file,{canonical,native:async()=>calls++,clipboard:async()=>calls++});await ui.click();assert.equal(calls,0);assert.equal(ui.messages.dataset.state,'error');assert.equal(ui.button.disabled,false);}
 });
}
