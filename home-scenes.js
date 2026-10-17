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
  if(reduced?.matches||!root.IntersectionObserver)return;
  const area=doc.getElementById('nearby-section');if(!area)return;
  // Observe each heading/card: tall mobile chapters enter before their cards are visible.
  const selector='.home-region-heading,#nearby-grid .course-card,.home-region-card,.home-region-select-row,.home-section-head,.home-place-heading,.home-place-card,.walk-shopping-heading,.walk-shopping-card,.join-benefits';
  const known=new WeakSet();let stopped=false;
  const observer=new root.IntersectionObserver(entries=>{
   for(const entry of entries){if(!entry.isIntersecting)continue;const item=entry.target;
    if(!item.contains(doc.activeElement))item.classList.add('home-motion-enter');
    observer.unobserve(item);
   }
  },{rootMargin:'0px 0px -24px 0px',threshold:0.08});
  function register(){if(stopped)return;area.querySelectorAll(selector).forEach(item=>{
   if(known.has(item))return;known.add(item);observer.observe(item);
   item.addEventListener('focusin',()=>{item.classList.remove('home-motion-enter');observer.unobserve(item);});
  });}
  register();
  // Course and shopping cards can arrive after the initial render.
  const mutations=root.MutationObserver?new root.MutationObserver(register):null;
  mutations?.observe(area,{childList:true,subtree:true});
  const stop=event=>{if(!event.matches)return;stopped=true;observer.disconnect();mutations?.disconnect();area.querySelectorAll('.home-motion-enter').forEach(item=>item.classList.remove('home-motion-enter'));};
  if(reduced?.addEventListener)reduced.addEventListener('change',stop);else reduced?.addListener?.(stop);
 }
 if(root.document?.readyState==='loading')root.document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(typeof globalThis!=='undefined'?globalThis:this);
