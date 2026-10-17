(function(root){
 'use strict';
 function init(){
  const doc=root.document;if(!doc)return;
  doc.querySelectorAll('[data-home-jump]').forEach(link=>link.addEventListener('click',event=>{
   const section=doc.getElementById(link.dataset.homeJump);if(!section)return;
   event.preventDefault();section.scrollIntoView({block:'start',behavior:'auto'});
   const heading=section.querySelector('[id="nearby-title"]:not([hidden])');
   const target=section.dataset.view==='results'?heading:doc.getElementById('home-region-guides-title');
   if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
  }));
  const reduced=root.matchMedia?.('(prefers-reduced-motion: reduce)');
  if(reduced?.matches||root.navigator?.connection?.saveData||!root.IntersectionObserver)return;
  const observer=new root.IntersectionObserver(entries=>{
   for(const entry of entries){if(!entry.isIntersecting)continue;
    const section=entry.target;
    const selectors=section.id==='home-explore'?'#home-region-intro,.home-region-card,.home-region-select-row,.home-section-head':'.walk-shopping-heading,.walk-shopping-card';
    section.querySelectorAll(selectors).forEach((item,i)=>{item.setAttribute('data-home-motion','');item.style.setProperty('--home-motion-delay',Math.min(i*45,180)+'ms');});
    section.classList.add('home-scene-enter');observer.unobserve(section);
   }
  },{rootMargin:'0px 0px -32px 0px',threshold:0});
  doc.querySelectorAll('.home-scene').forEach(section=>observer.observe(section));
  reduced?.addEventListener?.('change',event=>{if(event.matches){observer.disconnect();doc.querySelectorAll('.home-scene-enter').forEach(section=>section.classList.remove('home-scene-enter'));}});
 }
 if(root.document?.readyState==='loading')root.document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(typeof globalThis!=='undefined'?globalThis:this);
