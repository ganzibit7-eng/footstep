const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
function harness(){
 const pending=[];let renders=0;
 const ctx={myDeviceId:'A',myBadge:null,myOwnedBadges:[],adminSet:new Set(),Set,console:{error(){}},document:{getElementById:()=>null},updateProfileLabel(){renders++},renderGrid(){renders++},renderBadgeShop(){renders++},sb:{from(table){return {select(){const p=new Promise((resolve,reject)=>pending.push({table,resolve,reject}));return table==='admins'?p:{eq:()=>p}}}}}};
 vm.createContext(ctx);
 vm.runInContext(html.slice(html.indexOf('  let adminSetRequest=0;'),html.indexOf('  function applySession('))+html.slice(html.indexOf('  let badgeStateRequest=0;'),html.indexOf('  async function syncProfileTable(')),ctx);
 return {ctx,pending,renders:()=>renders};
}
(async()=>{
 for(const method of ['loadAdminSet','loadMyBadgeState']){
  let h=harness(),old=h.ctx[method]();h.ctx.myDeviceId='B';h.ctx.myBadge='B-badge';h.ctx.adminSet=new Set(['B']);h.pending[0].resolve({data:method==='loadAdminSet'?[{owner_id:'A'}]:[{badge_id:'A-badge',active:true}]});await old;assert.equal(h.renders(),0);assert.equal(h.ctx.myBadge,'B-badge');assert(h.ctx.adminSet.has('B'));
  h=harness();old=h.ctx[method]();h.ctx.myDeviceId=null;await h.ctx[method]();h.pending[0].resolve({data:method==='loadAdminSet'?[{owner_id:'A'}]:[{badge_id:'A-badge',active:true}]});await old;assert.equal(h.ctx.myBadge,null);assert.equal(h.ctx.adminSet.size,0);
  h=harness();old=h.ctx[method]();const newer=h.ctx[method]();h.pending[1].resolve({data:method==='loadAdminSet'?[{owner_id:'new'}]:[{badge_id:'new',active:true}]});await newer;const n=h.renders();h.pending[0].reject(new Error('late failure'));await old;assert.equal(h.renders(),n);assert(method==='loadAdminSet'?h.ctx.adminSet.has('new'):h.ctx.myBadge==='new');
 }
 console.log('PASS: account switch, logout and late same-account failures cannot overwrite current badges or admin roles.');
})().catch(e=>{console.error(e);process.exitCode=1});
