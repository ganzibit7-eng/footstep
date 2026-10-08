(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;else root.PlaceSaves=api;})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';
  const KEY='paw_saved_places_v1',MAX=100;
  function valid(item){return item&&typeof item.id==='string'&&/^[A-Za-z0-9_-]{1,160}$/.test(item.id)&&typeof item.name==='string'&&item.name.trim();}
  function list(){try{const data=JSON.parse(root.localStorage.getItem(KEY)||'[]');if(!Array.isArray(data))return [];const seen=new Set();return data.filter(item=>valid(item)&&!seen.has(item.id)&&seen.add(item.id)).slice(0,MAX).map(item=>({id:item.id,name:item.name.slice(0,120)}));}catch{return [];}}
  function toggle(id,name){
    if(!valid({id,name}))return {ok:false,message:'장소 정보를 확인할 수 없어 저장하지 못했어요.'};
    const rows=list(),saved=rows.some(item=>item.id===id);
    if(!saved&&rows.length>=MAX)return {ok:false,message:'장소는 최대 100곳까지 찜할 수 있어요. 먼저 다른 장소의 찜을 해제해 주세요.'};
    const next=saved?rows.filter(item=>item.id!==id):[{id,name:name.slice(0,120)},...rows];
    try{root.localStorage.setItem(KEY,JSON.stringify(next));if(root.localStorage.getItem(KEY)!==JSON.stringify(next))throw new Error('storage_unavailable');return {ok:true,saved:!saved,message:saved?'장소 찜을 해제했어요.':'이 브라우저에 찜했어요. 홈에서 다시 볼 수 있어요.'};}catch{return {ok:false,message:'브라우저 저장이 차단되어 찜하지 못했어요. 저장 설정을 확인해 주세요.'};}
  }
  function render(){
    if(!root.document)return;
    const rows=list(),ids=new Set(rows.map(item=>item.id));
    root.document.querySelectorAll('[data-place-save]').forEach(button=>{const saved=ids.has(button.dataset.placeSave);button.textContent=saved?'♥ 찜 해제':'♡ 장소 찜';button.setAttribute('aria-pressed',String(saved));});
    root.document.querySelectorAll('[data-place-saved-section]').forEach(section=>section.hidden=rows.length===0);
    root.document.querySelectorAll('[data-place-saved-list]').forEach(container=>{container.replaceChildren();rows.forEach(item=>{const li=root.document.createElement('li'),link=root.document.createElement('a'),remove=root.document.createElement('button');link.href='/places/'+item.id+'/';link.textContent=item.name;remove.type='button';remove.textContent='찜 해제';remove.setAttribute('aria-label',item.name+' 찜 해제');remove.addEventListener('click',()=>act(item.id,item.name));li.append(link,remove);container.append(li);});});
  }
  function act(id,name){const result=toggle(id,name);render();root.document.querySelectorAll('[data-place-save-status]').forEach(status=>status.textContent=result.message);return result;}
  function boot(){render();root.document.querySelectorAll('[data-place-save]').forEach(button=>button.addEventListener('click',()=>act(button.dataset.placeSave,button.dataset.placeName)));root.addEventListener('storage',event=>{if(event.key===KEY||event.key===null)render();});}
  if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
  return {list,toggle,render};
});
