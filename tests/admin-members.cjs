const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(process.argv[2]||'member-current-index.html','utf8');
const begin=html.indexOf('  async function readSignupMembers(){'),end=html.indexOf("  document.getElementById('members-refresh-btn')",begin);
const rows=Array.from({length:1001},(_,i)=>({owner_id:String(i).padStart(5,'0')}));let requests=0,fail=false;
const context={sb:{rpc:async(name,{p_after,p_limit})=>{assert.equal(name,'admin_signup_members');requests++;return fail?{error:{message:'permission denied'}}:{data:rows.filter(r=>!p_after||r.owner_id>p_after).slice(0,p_limit)};}}};
vm.createContext(context);vm.runInContext(html.slice(begin,end),context);
(async()=>{const result=await context.readSignupMembers();assert.equal(result.length,1001);assert.equal(new Set(result.map(r=>r.owner_id)).size,1001);assert.equal(requests,3);fail=true;await assert.rejects(context.readSignupMembers());console.log('Member pagination: 1001 accounts across 3 pages, no duplicates, permission errors preserved.');})().catch(e=>{console.error(e);process.exitCode=1;});
