const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('member-event.js','utf8');
const deferred=()=>{let resolve;const promise=new Promise(r=>{resolve=r;});return {promise,resolve};};
const flush=async()=>{for(let i=0;i<18;i++)await Promise.resolve();};
const snapshot=(entry=null)=>({server_now:'2026-10-15T06:30:00Z',campaigns:[{id:'2026-10',enabled:true,opens_at:'2026-10-13T15:00:00Z',closes_at:'2026-10-31T15:00:00Z',announces_at:'2026-11-04T15:00:00Z',winner_count:1,base_winner_count:1,eligibility:'eligible',my_entry:entry}]});
function harness(responses){
 class Element{
  constructor(){this.listeners={};this.children=new Map();this.attrs={};this.textContent='';this.html='';this.checked=true;}
  addEventListener(name,fn){this.listeners[name]=fn;}
  set innerHTML(value){this.html=value;this.children.clear();}get innerHTML(){return this.html;}
  querySelector(selector){const id=selector.slice(1);if(!this.html.includes('id="'+id+'"'))return null;if(!this.children.has(id))this.children.set(id,new Element());return this.children.get(id);}
  querySelectorAll(){return [];}
  setAttribute(name,value){this.attrs[name]=value;}removeAttribute(name){delete this.attrs[name];}
  focus(){}showModal(){this.open=true;}close(){this.open=false;this.listeners.close?.();}
 }
 const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
 const timers=new Map();let timerId=0;const calls=[];
 const context={module:{exports:{}},document:{getElementById:node},setTimeout(fn,ms){const id=++timerId;timers.set(id,{fn,ms});return id;},clearTimeout(id){timers.delete(id);}};
 vm.createContext(context);vm.runInContext(source,context);
 const client={rpc(name,args){calls.push({name,args});const reply=responses.shift();assert(reply,'unexpected duplicate request');return reply;},auth:{onAuthStateChange(){}}};
 const api=context.module.exports.create({client,login(){}}),host=node('member-event-content'),status=node('member-event-status');
 return {api,host,status,calls,dialog:node('member-event-dialog'),submit(){host.querySelector('#member-event-entry-form').listeners.submit({preventDefault(){}});},expire(){const timer=[...timers.entries()].find(([,t])=>t.ms===12000);assert(timer,'deadline timer missing');timers.delete(timer[0]);timer[1].fn();}};
}
(async()=>{
 // A stalled read recovers, and a late reply cannot repaint an error as success.
 let pending=deferred(),h=harness([pending.promise]);const read=h.api.load();await flush();h.expire();await read;
 assert(h.host.innerHTML.includes('확인하지 못했어요'));assert(!('aria-busy' in h.host.attrs));
 const errorView=h.host.innerHTML;pending.resolve({data:snapshot()});await flush();assert.equal(h.host.innerHTML,errorView);
 // A timed-out write is uncertain; remove its action form until a status refresh.
 pending=deferred();h=harness([{data:snapshot()},pending.promise,{data:snapshot({ticket:'CONFIRMED',entered_at:'2026-10-15T06:30:00Z'})}]);
 await h.api.load();h.submit();await flush();h.expire();await flush();
 assert(!h.host.querySelector('#member-event-entry-form'));assert(!h.status.textContent.includes('응모가 완료'));assert.equal(h.calls.length,2);
 await h.api.load();assert(h.host.innerHTML.includes('CONFIRMED'));pending.resolve({data:snapshot()});await flush();assert(h.host.innerHTML.includes('CONFIRMED'));
 // No entry in a nominally successful reply must never display entry success.
 h=harness([{data:snapshot()},{data:snapshot()}]);await h.api.load();h.submit();await flush();assert(!h.status.textContent.includes('응모가 완료'));assert(!h.host.querySelector('#member-event-entry-form'));
 // Closing and reopening must not let the previous request unlock a new request.
 const first=deferred(),second=deferred();h=harness([{data:snapshot()},first.promise,{data:snapshot()},second.promise]);
 await h.api.load();h.submit();await flush();h.dialog.close();await h.api.load();h.submit();await flush();
 first.resolve({data:snapshot({ticket:'OLD',entered_at:'2026-10-15T06:30:00Z'})});await flush();h.submit();await flush();
 assert.equal(h.calls.filter(c=>c.name==='enter_member_event').length,2);
 second.resolve({data:snapshot({ticket:'NEW',entered_at:'2026-10-15T06:30:00Z'})});await flush();assert(h.host.innerHTML.includes('NEW'));assert(h.status.textContent.includes('응모가 완료'));
 console.log('PASS event read deadlines, uncertain-write recovery, confirmed results and close/reopen request isolation.');
})().catch(error=>{console.error(error);process.exitCode=1;});
