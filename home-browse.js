/* Small exploration controls; filtering remains owned by the existing home form. */
(function(root){'use strict';
 const fields={'home-query-input':'','home-walk-time':'0','home-difficulty':'all','home-comfort-stairs':false,'home-comfort-gentle':false,'home-comfort-rest':false};
 function sanitize(input){const out={};for(const [id,fallback] of Object.entries(fields)){const v=input?.[id];out[id]=typeof fallback==='boolean'?v===true:typeof v==='string'?v.slice(0,100):fallback;}if(!['0','20','40','60'].includes(out['home-walk-time']))out['home-walk-time']='0';if(!['all','쉬움','보통','어려움'].includes(out['home-difficulty']))out['home-difficulty']='all';return out;}
 function mount(doc,storage){const form=doc.getElementById('home-course-filter-form'),chips=doc.getElementById('home-active-conditions');if(!form||!chips)return;
 const region=()=>doc.getElementById('home-area-select').value,key=()=> 'paw_home_filters_v1:'+region();
 const read=()=>Object.fromEntries(Object.entries(fields).map(([id,v])=>[id,typeof v==='boolean'?doc.getElementById(id).checked:doc.getElementById(id).value]));
 function render(){const state=read();chips.replaceChildren();for(const [id,fallback] of Object.entries(fields)){const v=state[id];if(v===fallback)continue;const input=doc.getElementById(id),button=doc.createElement('button');button.type='button';const label=id==='home-query-input'?'검색: '+v:input.tagName==='SELECT'?input.selectedOptions[0].textContent:input.parentElement.textContent.trim();button.textContent=label+' ×';button.setAttribute('aria-label',label+' 조건 해제');button.addEventListener('click',()=>{if(typeof fallback==='boolean')input.checked=false;else input.value=fallback;input.dispatchEvent(new Event('change',{bubbles:true}));input.focus({preventScroll:true});});chips.append(button);}
 chips.hidden=!chips.childElementCount;
 form.querySelectorAll('[data-quick-field]').forEach(b=>b.setAttribute('aria-pressed',String(state[b.dataset.quickField]===b.dataset.quickValue)));
 try{if(region())storage.setItem(key(),JSON.stringify(state));}catch{}
 }
 form.querySelectorAll('[data-quick-field]').forEach(button=>button.addEventListener('click',()=>{const input=doc.getElementById(button.dataset.quickField);input.value=input.value===button.dataset.quickValue?fields[input.id]:button.dataset.quickValue;input.dispatchEvent(new Event('change',{bubbles:true}));}));
 // A search chip can be cleared without submitting another form.
 doc.getElementById('home-query-input').addEventListener('change',()=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
 form.addEventListener('change',render);form.addEventListener('submit',render);doc.getElementById('home-filters-clear').addEventListener('click',render);
 try{const saved=storage.getItem(key());if(saved&&region()){const state=sanitize(JSON.parse(saved));for(const [id,v]of Object.entries(state)){const el=doc.getElementById(id);if(typeof v==='boolean')el.checked=v;else el.value=v;}form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));}}catch{}
 render();
 }
 const api={sanitize,mount};if(typeof module==='object'&&module.exports)module.exports=api;else {root.HomeBrowse=api;const boot=()=>{let storage;try{storage=root.sessionStorage;}catch{}mount(document,storage);};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();}
})(typeof globalThis==='undefined'?this:globalThis);
