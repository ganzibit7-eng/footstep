const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('admin-loader.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
function harness({user='admin',role=true,markup='<div id="admin-overlay"></div>',waitResources=false}={}){
 let viewer=user,fetches=0,mounts=0,disposed=0,overlay=null;const resources=[];
 const document={head:{append(el){resources.push(el);if(!waitResources)queueMicrotask(()=>el.onload());}},body:{append(el){overlay=el;}},getElementById:()=>overlay,createElement(tag){const el={dataset:{},remove(){if(overlay===this)overlay=null;}};if(tag==='template'){el.content={children:[{}],querySelector:()=>({remove(){overlay=null;}})};}return el;}};
 const ctx={document,Map,Promise,module:{exports:{}},fetch:async()=>{fetches++;return {ok:true,text:async()=>markup};}};vm.createContext(ctx);vm.runInContext(source,ctx);
 const client={auth:{getUser:async()=>({data:{user:viewer?{id:viewer,is_anonymous:false}:null}})},rpc:async()=>({data:role})};
 const controller=ctx.module.exports.create({client,viewer:()=>viewer,mount:()=>{mounts++;return{dispose(){disposed++;overlay=null;}};}});
 return {controller,resources,client,setViewer(v){viewer=v;},release(){resources.forEach(r=>r.onload());},get stats(){return{fetches,mounts,disposed,overlay:!!overlay};}};
}
const timeout=setTimeout(()=>{console.error('Admin separation test did not finish');process.exit(1);},5000);
async function ready(h){for(let i=0;i<50&&h.resources.length<5;i++)await new Promise(setImmediate);assert.equal(h.resources.length,5);}
(async()=>{
 for(const setup of [{user:null},{user:'member',role:false}]){const h=harness(setup);await assert.rejects(h.controller.load());assert.equal(h.stats.fetches,0);assert.equal(h.resources.length,0);assert.equal(h.stats.overlay,false);}
 let h=harness();h.client.auth.getUser=async()=>({data:{user:{id:'different'}}});await assert.rejects(h.controller.load());assert.equal(h.stats.fetches,0);
 h=harness();const a=h.controller.load(),b=h.controller.load();assert.equal(a,b);await a;assert.equal(h.stats.mounts,1);assert.equal(h.resources.length,5);assert(h.stats.overlay);h.controller.reset();assert.equal(h.stats.disposed,1);assert.equal(h.stats.overlay,false);
 h=harness({waitResources:true});const stale=h.controller.load();await ready(h);h.setViewer('member');h.release();await assert.rejects(stale);assert.equal(h.stats.mounts,0);assert.equal(h.stats.overlay,false);
 h=harness({markup:'<script>alert(1)</script>'});await assert.rejects(h.controller.load());assert.equal(h.resources.length,0);
 h=harness({waitResources:true});const revoked=h.controller.load();await ready(h);h.client.rpc=async()=>({data:false});h.release();await assert.rejects(revoked);assert.equal(h.stats.mounts,0);
 assert(!html.includes('id="admin-overlay"'));assert(!html.includes('id="privacy-section"'));assert(!html.includes('id="terms-section"'));assert(!html.includes('src="admin-affiliate.js'));assert(!html.includes('PapaParse/'));
 const precache=sw.slice(0,sw.indexOf("self.addEventListener('install'"));assert(!precache.includes('admin-panel.html'));assert(!precache.includes('admin-affiliate'));assert(!precache.includes('admin-bot-panel'));assert(!precache.includes('PapaParse/'));
 console.log('PASS admin separation: unauthorized zero loads, authoritative identity/role, concurrent deduplication, logout disposal, stale session and revoked-role rejection, markup validation, public HTML and offline shell isolation.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>clearTimeout(timeout));
