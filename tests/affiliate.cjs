const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
async function collector({test=false,automated=false}={}){
 let now=1791500000000,uuid=0;const listeners={},calls=[];const store=new Map();
 const doc={currentScript:{hasAttribute:()=>true},visibilityState:'visible',referrer:'',documentElement:{scrollHeight:1000},addEventListener:(k,v)=>listeners[k]=v};
 const ctx={document:doc,location:{hostname:'balzaguk.com',pathname:'/',origin:'https://balzaguk.com',search:test?'?analytics_test=1':''},navigator:{webdriver:automated},URL,URLSearchParams,crypto:{randomUUID:()=>`f1000000-0000-4000-8000-${String(++uuid).padStart(12,'0')}`},Date:class extends Date{static now(){return now;}},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},sessionStorage:{getItem:()=>null,setItem:()=>{}},setInterval:()=>{},setTimeout:fn=>fn(),addEventListener:()=>{}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync('traffic.js','utf8'),ctx);
 await ctx.PawTraffic.start({rpc:async(name,p)=>{calls.push({name,...p});return {data:{excluded:false}};},auth:{onAuthStateChange:()=>{}}});
 const anchor={href:'https://link.coupang.com/a/hHjJ8nlsJg',dataset:{shoppingItem:'waste-bags',shoppingPlacement:'home-walk-shopping'},closest:()=>null,matches:()=>true};
 const click=(type='click',trusted=true,button=0)=>listeners[type]?.({type,isTrusted:trusted,button,target:{closest:()=>anchor}});
 return {ctx,calls,anchor,click,advance:()=>now+=1000};
}
async function admin(){
 const els={};function el(){return {value:'',checked:false,disabled:false,textContent:'',innerHTML:'',handlers:{},addEventListener(k,fn){this.handlers[k]=fn;},replaceChildren(){this.innerHTML='';}};}
 for(const k of ['result','from','to','link','audience','excluded','export','today','refresh','events-label','people-label','events-prev','events-next','people-prev','people-next','export-status'])els['admin-affiliate-'+k]=el();
 els['admin-affiliate-audience'].value='all';let viewer='admin',privileged=true,resolver;
 const ctx={URL,Intl,Date,Option:function(text,value){this.value=value;},document:{getElementById:id=>els[id]}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync('admin-affiliate.js','utf8'),ctx);
 const component=ctx.AdminAffiliate.mount({client:{rpc:()=>new Promise(r=>resolver=r)},isAdmin:()=>privileged,viewer:()=>viewer});
 const pending=component.load();viewer='other';resolver({data:{events:[],products:[],daily:[]}});await pending;
 assert.equal(els['admin-affiliate-result'].innerHTML,'','stale admin response must never render for another account');
 component.clear();assert.equal(els['admin-affiliate-export'].disabled,true);
 const bad='<img src=x onerror=alert(1)>',data={tracking_started_at:'2026-10-09T07:00:00Z',clicks:1,visitors:1,members:1,people_total:1,events:[{actor_id:'id',nickname:bad,title:bad,url:'javascript:alert(1)',path:bad,source:bad,browser:bad,device:bad,included:true}],people:[{actor_id:'id',nickname:bad,products:[{title:bad,link_id:'x" onclick="alert(1)'}]}],products:[{title:bad,url:'javascript:alert(1)'}]};
 const html=ctx.AdminAffiliate.render(data);assert.doesNotMatch(html,/<img| onclick="/);assert.match(html,/&lt;img/);assert.doesNotMatch(html,/href="javascript:/);
 const csv=ctx.AdminAffiliate.csv([['=cmd()','  +cmd()','@cmd()','\tcmd()','normal','a"b']]);assert.match(csv,/"'=cmd\(\)"/);assert.match(csv,/"'  \+cmd/);assert.match(csv,/"'@cmd/);assert.match(csv,/"a""b"/);
}
(async()=>{
 const b=await collector();b.click('click',false);assert.equal(b.calls.filter(x=>x.name==='record_affiliate_click').length,0);
 b.click();b.click();let clicks=b.calls.filter(x=>x.name==='record_affiliate_click');assert.equal(clicks.length,1);assert.equal(clicks[0].p_payload.url,b.anchor.href);assert.equal(clicks[0].p_payload.path,'/');assert.equal(Object.hasOwn(clicks[0].p_payload,'actor_id'),false);
 b.advance();b.click('auxclick',true,1);assert.equal(b.calls.filter(x=>x.name==='record_affiliate_click').length,2);
 b.advance();b.anchor.href+='?email=private';b.click();assert.equal(b.calls.filter(x=>x.name==='record_affiliate_click').length,2);
 const auto=await collector({automated:true});auto.click();assert.equal(auto.calls.filter(x=>x.name==='record_affiliate_click').length,0);
 const test=await collector({test:true});test.click();assert.equal(test.calls.length,0);
 await admin();console.log('PASS affiliate: trusted primary/middle clicks, no automatic navigation, duplicate gesture suppression, exclusions, query removal, stale-account protection, hostile HTML and CSV formula safety');
})().catch(e=>{console.error(e);process.exit(1);});
