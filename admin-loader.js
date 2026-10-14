(function(root){'use strict';
const VERSION='20261014-event-roster';
const scripts=new Map();
let stylesheet=null;
function style(){if(stylesheet)return stylesheet;stylesheet=new Promise((resolve,reject)=>{const el=document.createElement('link');el.rel='stylesheet';el.href='/admin-panel.css?v='+VERSION;el.dataset.adminStyle='';el.onload=resolve;el.onerror=()=>{el.remove();stylesheet=null;reject(new Error('admin_style_failed'));};document.head.append(el);});return stylesheet;}
function script(url){if(scripts.has(url))return scripts.get(url);const pending=new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=url;el.onload=resolve;el.onerror=()=>{el.remove();scripts.delete(url);reject(new Error('admin_resource_failed'));};document.head.append(el);});scripts.set(url,pending);return pending;}
function create({client,viewer,mount}){
 let panel=null,owner=null,pending=null,generation=0;
 function reset(){generation++;panel?.dispose();panel=null;owner=null;pending=null;document.getElementById('admin-overlay')?.remove();}
 async function authorize(expected){const {data,error}=await client.auth.getUser();if(error||!data?.user||data.user.is_anonymous||data.user.id!==expected||viewer()!==expected)throw new Error('admin_identity_required');const role=await client.rpc('is_admin',{uid:data.user.id});if(role.error||role.data!==true||viewer()!==expected)throw new Error('admin_role_required');}
 function load(){if(pending)return pending;const expected=viewer();if(!expected){reset();return Promise.reject(new Error('admin_sign_in_required'));}const request=++generation;
  const task=(async()=>{await authorize(expected);if(request!==generation)throw new Error('admin_session_changed');if(panel&&owner===expected)return panel;
   const response=await fetch('/admin-panel.html?v='+VERSION,{credentials:'same-origin',cache:'no-cache'});if(!response.ok)throw new Error('admin_markup_failed');const markup=await response.text();if(/<script|<iframe|<object|<embed|\bon[a-z]+\s*=/i.test(markup))throw new Error('admin_markup_invalid');
   await Promise.all([style(),script('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js'),script('/admin-bot-panel.js?v=20261004'),script('/admin-affiliate.js?v=20261009'),script('/admin-member-event.js?v='+VERSION),script('/admin-panel.js?v='+VERSION)]);
   await authorize(expected);if(request!==generation)throw new Error('admin_session_changed');
   const template=document.createElement('template');template.innerHTML=markup;const overlay=template.content.querySelector('#admin-overlay');if(!overlay||template.content.children.length!==1)throw new Error('admin_markup_invalid');
   document.body.append(overlay);try{panel=mount();owner=expected;return panel;}catch(error){overlay.remove();throw error;}
  })();pending=task;task.catch(()=>{if(request===generation)reset();}).finally(()=>{if(pending===task)pending=null;});return task;
 }
 return Object.freeze({load,reset,peek:()=>panel});
}
const api=Object.freeze({create});if(typeof module==='object'&&module.exports)module.exports=api;else root.AdminLoader=api;
})(typeof globalThis==='undefined'?this:globalThis);
