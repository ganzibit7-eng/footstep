const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const code=fs.readFileSync('traffic.js','utf8');
function browser({search='',referrer='',shared=new Map(),test=false}={}){
 let now=1791008000000;const calls=[],listeners={},timers=[];
 const store=map=>({getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)});
 const document={currentScript:{hasAttribute:()=>true},visibilityState:'visible',referrer,documentElement:{scrollHeight:2000},addEventListener:(k,v)=>listeners[k]=v};
 const ctx={document,location:{hostname:'balzaguk.com',pathname:'/courses/c416/',origin:'https://balzaguk.com',search:test?'?analytics_test=1':search},navigator:{webdriver:false},crypto:{randomUUID:()=> '0bbd8221-ad64-48f0-97f0-167dace172d4'},localStorage:store(new Map()),sessionStorage:store(shared),URL,URLSearchParams,Date:class extends Date{static now(){return now;}},innerHeight:1000,scrollY:0,setInterval:(fn,ms)=>timers.push({fn,ms}),setTimeout:fn=>{fn();},addEventListener:()=>{}};
 vm.createContext(ctx);vm.runInContext(code,ctx);
 const client={rpc:async(name,args)=>{calls.push(JSON.parse(JSON.stringify({name,...args})));return {data:{excluded:false},error:null};},auth:{onAuthStateChange:()=>{}}};
 return {ctx,calls,listeners,timers,shared,start:()=>ctx.PawTraffic.start(client),advance:ms=>{now+=ms;},flush:()=>new Promise(r=>setImmediate(r))};
}
(async()=>{
 const b=browser({search:'?utm_source=threads&utm_medium=social&utm_campaign=autumn&secret=ignored'});await b.start();
 assert.equal(b.calls.length,1);assert.equal(b.calls[0].p_payload.path,'/courses/c416/');assert.equal(b.calls[0].p_payload.source,'utm:threads');assert.equal(b.calls[0].p_payload.campaign,'autumn');
 for(let n=0;n<10;n++){b.advance(1000);b.timers.find(t=>t.ms===1000).fn();}
 await b.flush();assert.equal(b.calls.length,2);assert.equal(b.calls[1].p_payload.active_seconds,10,'activity threshold must be persisted before the 15s heartbeat');
 for(let n=0;n<5;n++){b.advance(1000);b.timers.find(t=>t.ms===1000).fn();}
 b.timers.find(t=>t.ms===15000).fn();await b.flush();assert.equal(b.calls[2].p_payload.active_seconds,15);assert.equal(b.calls[2].p_payload.view_token,b.calls[0].p_payload.view_token);
 b.ctx.document.visibilityState='hidden';b.listeners.visibilitychange();await b.flush();const hiddenCalls=b.calls.length;b.advance(60000);b.timers.find(t=>t.ms===1000).fn();b.timers.find(t=>t.ms===15000).fn();await b.flush();assert.equal(b.calls.length,hiddenCalls);
 b.ctx.document.visibilityState='visible';b.advance(3000);
 const el={closest:()=>null,matches:()=>true};
 b.listeners.click({isTrusted:false,target:{closest:()=>el}});assert.equal(b.calls.length,hiddenCalls);
 b.listeners.click({isTrusted:true,target:{closest:()=>el}});await b.flush();assert.equal(b.calls.at(-1).p_payload.clicks,1);assert.equal(b.calls.at(-1).p_payload.actions.link,1);
 const next=browser({referrer:'https://balzaguk.com/courses/c416/',shared:b.shared});await next.start();assert.equal(next.calls[0].p_payload.source,'utm:threads');
 const privateVisit=browser({test:true});await privateVisit.start();assert.equal(privateVisit.calls.length,0);assert.equal(privateVisit.ctx.PawTraffic.excluded,true);
 const stripped=browser({search:'?utm_source=<script>&utm_campaign=x@y'});await stripped.start();assert.equal(stripped.calls[0].p_payload.source,'utm:script');assert.equal(stripped.calls[0].p_payload.campaign,'xy');
 const form={matches:selector=>selector.includes('#place-search')};b.listeners.submit({isTrusted:true,target:form});await b.flush();assert.equal(b.calls.at(-1).p_payload.actions.search,1);b.listeners.submit({isTrusted:false,target:form});assert.equal(b.calls.at(-1).p_payload.actions.search,1);
 const beforeOptOut=b.calls.length;b.ctx.localStorage.setItem('paw_analytics_exclude','1');b.advance(16000);b.timers.find(t=>t.ms===1000).fn();b.timers.find(t=>t.ms===15000).fn();await b.flush();assert.equal(b.calls.length,beforeOptOut);assert.equal(b.ctx.PawTraffic.excluded,true);
 const quick=browser();await quick.start();quick.advance(100);quick.listeners.click({isTrusted:true,target:{closest:()=>el}});await quick.flush();assert.equal(quick.calls.at(-1).p_payload.clicks,1,'first trusted click inside 2 seconds is sent immediately');assert.equal(quick.calls.at(-1).p_payload.view_token,quick.calls[0].p_payload.view_token);
 const visibility=browser();await visibility.start();visibility.advance(1500);visibility.ctx.document.visibilityState='hidden';visibility.listeners.visibilitychange();await visibility.flush();assert.equal(visibility.calls.at(-1).p_payload.active_seconds,1,'final visible fraction is included');visibility.advance(60000);visibility.ctx.document.visibilityState='visible';visibility.listeners.visibilitychange();await visibility.flush();assert.equal(visibility.calls.at(-1).p_payload.active_seconds,1,'hidden time is never charged on resume');
 const hidden=browser();hidden.ctx.document.visibilityState='hidden';await hidden.start();hidden.advance(10000);hidden.timers.find(t=>t.ms===1000).fn();assert.equal(hidden.calls.length,1,'hidden initial load cannot qualify as engagement');

 const business=browser();await business.start();let prevented=0;
 const anchor=(href,type)=>({href,dataset:{},matches:sel=>sel==='a'||sel==='[data-ad-link]'&&type==='ad',closest:sel=>sel==='#brand-partner-slot'&&type==='ad'?{}:sel==='.trip-booking'&&type==='trip'?{}:null});
 const hit=(el,extra={})=>({isTrusted:true,button:0,target:{closest:sel=>sel==='a[data-shopping-item]'?null:el},preventDefault(){prevented++;},...extra});
 const ad=anchor('https://balzaguk.com/advertise/','ad');business.listeners.click(hit(ad));await business.flush();assert.equal(business.calls.at(-1).p_payload.actions.ad_banner,1);
 business.listeners.click(hit(ad));await business.flush();assert.equal(business.calls.at(-1).p_payload.actions.ad_banner,1,'rapid duplicate cannot count twice');
 business.advance(701);business.listeners.click(hit(ad));await business.flush();assert.equal(business.calls.at(-1).p_payload.actions.ad_banner,2);
 const trip=anchor('https://kr.trip.com/hotels/test/?private=not-stored','trip');business.listeners.click(hit(trip));await business.flush();assert.equal(business.calls.at(-1).p_payload.actions.trip,1);assert(!JSON.stringify(business.calls).includes('private=not-stored'));assert.equal(prevented,0,'analytics never blocks affiliate navigation');
 business.advance(1000);business.listeners.auxclick(hit(trip,{type:'auxclick',button:1}));await business.flush();assert.equal(business.calls.at(-1).p_payload.actions.trip,2);
 business.advance(1000);business.listeners.click(hit(anchor('https://kr.trip.com.evil.test/','trip')));await business.flush();assert.equal(business.calls.at(-1).p_payload.actions.trip,2);
 business.advance(1000);business.listeners.click(hit(trip,{isTrusted:false}));await business.flush();assert.equal(business.calls.at(-1).p_payload.actions.trip,2);
 business.ctx.localStorage.setItem('paw_analytics_exclude','1');const last=business.calls.length;business.listeners.click(hit(trip));await business.flush();assert.equal(business.calls.length,last);
 console.log('PASS: one token per load, visible-only duration, trusted clicks, internal attribution carry, query minimization, work-test exclusion.');
})().catch(e=>{console.error(e);process.exit(1);});
