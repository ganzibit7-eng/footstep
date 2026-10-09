const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const site=fs.readFileSync('index.html','utf8');
const code=site.slice(site.indexOf('  async function checkNotifications(){'),site.indexOf("  document.getElementById('notif-btn').addEventListener"));
function harness(){
 const els=Object.fromEntries(['notif-dot','notif-list','notif-overlay','admin-security-details'].map(id=>[id,{style:{display:'none'},innerHTML:'',classList:{add(){},remove(){}},addEventListener(type,cb){this.click=cb;},scrollIntoView(){this.scrolled=true;}}]));
 const changes=[];let resolve;let pending=false;
 const c={myDeviceId:'admin',navigator:{onLine:true},document:{getElementById:id=>els[id]},isAdminUser:id=>id==='admin',escapeHtml:v=>String(v).replace(/</g,'&lt;'),console,openNickModal(){},toast(){},openAdminDashboard(){c.opened=true;},sb:{from(){let mode,filters=[];return{select(x){mode=x;return this;},update(x){mode='update';return this;},eq(...v){filters.push(v);return this;},in(...v){filters.push(v);return this;},order(){return this;},limit(){if(mode==='id')return Promise.resolve({data:[]});if(pending)return new Promise(r=>resolve=r);return Promise.resolve({data:[{id:7,type:'security',message:'<script>alert(1)</script>',created_at:'2026-10-09T00:00:00Z'}]});},then(cb){changes.push(filters);return Promise.resolve({}).then(cb);}};}}};vm.createContext(c);vm.runInContext(code,c);
 return{c,els,changes,delay(){pending=true;},resolve(v){resolve(v);}};
}
(async()=>{
 let h=harness();await h.c.openNotifications();
 assert(h.els['notif-list'].innerHTML.includes('data-open-security'));assert(!h.els['notif-list'].innerHTML.includes('<script>'));
 assert.deepEqual(JSON.parse(JSON.stringify(h.changes[0])),[['owner_id','admin'],['id',[7]],['read',false]]);
 h.els['notif-list'].click({target:{closest:()=>true}});assert(h.c.opened);assert(h.els['admin-security-details'].open&&h.els['admin-security-details'].scrolled);
 h=harness();h.delay();const wait=h.c.openNotifications();h.c.myDeviceId='member';h.resolve({data:[{id:8,type:'security',message:'private',created_at:'2026-10-09'}]});await wait;assert(!h.els['notif-list'].innerHTML.includes('private'));assert.equal(h.changes.length,0);
 assert(site.includes('<details class="admin-section-details" id="admin-security-details">'));
 assert(!site.includes('id="admin-security-details" open'));
 console.log('PASS security notifications: safe text, admin deep link, displayed-only read marking, account-switch isolation and collapsed panel');
})();
