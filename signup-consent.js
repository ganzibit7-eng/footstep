/* Consent receipts contain only account, notice version and server time. */
(function(root){'use strict';
 const key='paw_pending_signup_consent',version='2026-10-18-v1';let running=false;
 function capture(){try{root.sessionStorage.setItem(key,JSON.stringify({version,at:Date.now()}));return true;}catch{return false;}}
 async function flush(client){
  if(running)return false;
  let pending;try{pending=JSON.parse(root.sessionStorage.getItem(key));}catch{return false;}
  if(!pending)return false;
  const age=Date.now()-pending.at;
  if(pending.version!==version||!Number.isFinite(age)||age<0||age>86400000){try{root.sessionStorage.removeItem(key);}catch{}return false;}
  running=true;
  try{const {data,error}=await client.rpc('record_signup_consent',{p_version:version});if(error||data!==true)return false;root.sessionStorage.removeItem(key);return true;}catch{return false;}finally{running=false;}
 }
 const api=Object.freeze({capture,flush,version});if(typeof module==='object'&&module.exports)module.exports=api;else root.SignupConsent=api;
})(typeof globalThis!=='undefined'?globalThis:this);
