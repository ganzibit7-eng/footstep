/* Short, interruptible entrance motion. No hidden-content dependency or map animation. */
(function(root){
  'use strict';
  const doc=root.document;if(!doc)return;
  const reduced=root.matchMedia?.('(prefers-reduced-motion: reduce)');
  const running=new Set(),seen=new WeakSet();let observer;
  const allowed=()=>!reduced?.matches&&!root.navigator?.connection?.saveData;
  function stop(){for(const animation of running)animation.cancel();running.clear();}
  function cancel(){stop();observer?.disconnect();}
  function reveal(element,index=0){
    if(seen.has(element)||!allowed()||!element?.animate||element.closest('[hidden]')||!element.getClientRects().length||element.contains?.(doc.activeElement))return;
    seen.add(element);
    const animation=element.animate([{opacity:.35,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,delay:Math.min(index,4)*40,easing:'cubic-bezier(.22,1,.36,1)'});
    running.add(animation);animation.finished?.then(()=>running.delete(animation),()=>running.delete(animation));
  }
  function enter(scope){
    if(!scope||!allowed())return;
    const nodes=scope.querySelectorAll('.section-head,.ui-panel-heading,.ui-form-group>legend,.admin-view-heading');
    if(typeof root.IntersectionObserver!=='function'){Array.from(nodes).slice(0,4).forEach(reveal);return;}
    observer?.disconnect();observer=new root.IntersectionObserver(entries=>{
      let index=0;for(const entry of entries)if(entry.isIntersecting){observer.unobserve(entry.target);reveal(entry.target,index++);}
    },{threshold:.08});
    nodes.forEach(node=>{if(!seen.has(node))observer.observe(node);});
  }
  function page(name){cancel();if(name==='home')return;enter(doc.querySelector('.app-page.active[data-page-section="'+name+'"]'));}
  function sync(button){button.setAttribute('aria-pressed',String(button.classList.contains('on')||button.classList.contains('active')));}
  function start(){
    // The route hash also matches Leaflet's container id. Let the native anchor
    // finish before restoring the search header, unless the visitor has interacted.
    if(root.location?.hash==='#map'){
      let touched=false;const mark=()=>{touched=true;};
      const inputs=['pointerdown','keydown','wheel','touchstart'];
      inputs.forEach(type=>doc.addEventListener(type,mark,{passive:true}));
      const settle=()=>{
        root.requestAnimationFrame(()=>{
          inputs.forEach(type=>doc.removeEventListener(type,mark));
          if(!touched&&root.location.hash==='#map'&&doc.querySelector('.app-page.active')?.dataset.pageSection==='map')root.scrollTo({top:0,behavior:'auto'});
        });
      };
      if(doc.readyState==='complete')settle();else root.addEventListener('load',settle,{once:true});
    }
    const proposal=doc.getElementById('register-section');
    if(proposal){proposal.querySelectorAll('button.tag-check,button.draw-mode-btn,button.type-btn').forEach(sync);
      new root.MutationObserver(records=>{for(const record of records)if(record.target.matches('button.tag-check,button.draw-mode-btn,button.type-btn'))sync(record.target);}).observe(proposal,{subtree:true,attributes:true,attributeFilter:['class']});}
    for(const id of ['course-grid','my-walks-list']){const list=doc.getElementById(id);if(!list)continue;
      new root.MutationObserver(records=>{let index=0;for(const record of records)for(const node of record.addedNodes){if(node.nodeType===1&&index<4&&node.matches('.course-card,.review-item')){index++;if(observer&&allowed()&&node.getClientRects().length)observer.observe(node);else reveal(node,index-1);}}}).observe(list,{childList:true});}
    const active=doc.querySelector('.app-page.active[data-page-section]');if(active)page(active.dataset.pageSection);
  }
  doc.addEventListener('pointerdown',stop,{passive:true});doc.addEventListener('focusin',stop);
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)cancel();});reduced?.addEventListener?.('change',cancel);
  root.PawUI={page,enter,cancel};
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(window);
