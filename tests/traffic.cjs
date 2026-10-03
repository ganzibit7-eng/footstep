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
 for(let n=0;n<15;n++){b.advance(1000);b.timers.find(t=>t.ms===1000).fn();}
 b.timers.find(t=>t.ms===15000).fn();await b.flush();assert.equal(b.calls[1].p_payload.active_seconds,15);assert.equal(b.calls[1].p_payload.view_token,b.calls[0].p_payload.view_token);
 b.ctx.document.visibilityState='hidden';b.advance(60000);b.timers.find(t=>t.ms===1000).fn();b.timers.find(t=>t.ms===15000).fn();await b.flush();assert.equal(b.calls.length,2);
 b.ctx.document.visibilityState='visible';b.advance(3000);
 const el={closest:()=>null,matches:()=>true};
 b.listeners.click({isTrusted:false,target:{closest:()=>el}});assert.equal(b.calls.length,2);
 b.listeners.click({isTrusted:true,target:{closest:()=>el}});await b.flush();assert.equal(b.calls[2].p_payload.clicks,1);assert.equal(b.calls[2].p_payload.actions.link,1);
 const next=browser({referrer:'https://balzaguk.com/courses/c416/',shared:b.shared});await next.start();assert.equal(next.calls[0].p_payload.source,'utm:threads');
 const privateVisit=browser({test:true});await privateVisit.start();assert.equal(privateVisit.calls.length,0);assert.equal(privateVisit.ctx.PawTraffic.excluded,true);
 const stripped=browser({search:'?utm_source=<script>&utm_campaign=x@y'});await stripped.start();assert.equal(stripped.calls[0].p_payload.source,'utm:script');assert.equal(stripped.calls[0].p_payload.campaign,'xy');
 console.log('PASS: one token per load, visible-only duration, trusted clicks, internal attribution carry, query minimization, work-test exclusion.');
})().catch(e=>{console.error(e);process.exit(1);});
