/* Experimental 16-frame gait study; supplied storyboard is not played as a slideshow. */
(async function(){'use strict';
 const stage=document.querySelector('.hero-park-stage');if(!stage||!window.ParkHeroPlayer)return;
 let controller=null,manifest=null;
 try{
  const frames=['pom','maltese'].map(name=>({frames:Array.from({length:6},(_,i)=>'/assets/hero-park/gallop-v1/'+name+'-0'+i+'.webp')}));
  manifest={status:'ready',motion:'chase',loopReviewed:true,poster:'/assets/hero-park/poster.webp',frameCount:6,fps:12,actors:frames.map((f,i)=>({id:i===0?'pomeranian':'maltese',width:192,height:192,alphaReviewed:true,frames:f.frames,fullBodyCycle:true,poses:[.024,0,.016,.034,0,.018].map(lift=>[.5,.8,.2,lift,.52])}))};
  stage.dataset.player='attached';stage.dataset.motion='chase';controller=await ParkHeroPlayer.create(stage,manifest);
  const butterfly=document.createElement('span');butterfly.className='hero-park-fly';butterfly.innerHTML='<svg viewBox="0 0 48 40" aria-hidden="true"><g class="wing wing-left"><path d="M24 24C2 16 5 0 17 7c5 4 5 10 7 17M24 24C6 15 9 37 19 32Z" fill="#e99a39" stroke="#9e542b"/><path d="M22 23 13 11m8 13-7 4" stroke="#fff3c0" fill="none"/></g><g class="wing wing-right"><path d="M24 24C46 16 43 0 31 7c-5 4-5 10-7 17M24 24C42 15 39 37 29 32Z" fill="#edae48" stroke="#9e542b"/><path d="m26 23 9-12m-8 13 7 4" stroke="#fff3c0" fill="none"/></g><path d="M24 29V16m0 1-4-5m4 5 4-5" stroke="#69472d" stroke-width="2" stroke-linecap="round"/></svg>';stage.append(butterfly);
  window.addEventListener('pagehide',event=>{if(event.persisted)return;controller?.dispose();},{once:true});
 }catch{stage.dataset.animation='poster';}
})();
