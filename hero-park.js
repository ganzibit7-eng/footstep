/* Whole-body chase animation with static fallback and shared motion timing. */
(async function(){'use strict';
 const stage=document.querySelector('.hero-park-stage');if(!stage||!window.ParkHeroPlayer)return;
 // Sparse vector vegetation, layered over the existing meadow without new downloads.
 const meadow=document.createElement('div');meadow.className='hero-meadow';meadow.setAttribute('aria-hidden','true');
 const colors=['#879b58','#a5b872','#6f864c'];
 for(let i=0;i<9;i++){const tuft=document.createElement('span');tuft.className='meadow-tuft depth-'+i%3;tuft.style.left=[4,16,29,37,53,61,72,85,95][i]+'%';tuft.style.setProperty('--wind-time',(4.8+i*.39)+'s');tuft.style.setProperty('--wind-delay',(-i*.73)+'s');tuft.innerHTML='<svg viewBox="0 0 40 28" fill="none" aria-hidden="true"><path d="M20 28Q15 15 9 9M20 28Q20 10 24 3M20 28Q27 17 35 13M16 28Q10 22 4 21M25 28Q29 21 31 18" stroke="'+colors[i%3]+'" stroke-width="1.4" stroke-linecap="round"/>'+(i%4===0?'<circle cx="24" cy="4" r="2" fill="#e9dba1"/>':'')+'</svg>';meadow.append(tuft);}
 stage.append(meadow);
 let controller=null,manifest=null;
 try{
  const frames=['pom','maltese'].map(name=>({frames:Array.from({length:6},(_,i)=>'/assets/hero-park/gallop-v1/'+name+'-0'+i+'.webp')}));
  manifest={status:'ready',motion:'chase',loopReviewed:true,poster:'/assets/hero-park/poster.webp',frameCount:6,fps:12,actors:frames.map((f,i)=>({id:i===0?'pomeranian':'maltese',width:192,height:192,alphaReviewed:true,frames:f.frames,fullBodyCycle:true,poses:[.024,0,.016,.034,0,.018].map(lift=>[.5,.8,.2,lift,.52])}))};
  stage.dataset.player='attached';stage.dataset.motion='chase';controller=await ParkHeroPlayer.create(stage,manifest);
  const butterfly=document.createElement('span');butterfly.className='hero-park-fly';butterfly.innerHTML='<svg viewBox="0 0 48 40" aria-hidden="true"><g class="wing wing-left"><path d="M24 24C2 16 5 0 17 7c5 4 5 10 7 17M24 24C6 15 9 37 19 32Z" fill="#e99a39" stroke="#9e542b"/><path d="M22 23 13 11m8 13-7 4" stroke="#fff3c0" fill="none"/></g><g class="wing wing-right"><path d="M24 24C46 16 43 0 31 7c-5 4-5 10-7 17M24 24C42 15 39 37 29 32Z" fill="#edae48" stroke="#9e542b"/><path d="m26 23 9-12m-8 13 7 4" stroke="#fff3c0" fill="none"/></g><path d="M24 29V16m0 1-4-5m4 5 4-5" stroke="#69472d" stroke-width="2" stroke-linecap="round"/></svg>';stage.append(butterfly);
  window.addEventListener('pagehide',event=>{if(event.persisted)return;controller?.dispose();},{once:true});
 }catch{stage.dataset.animation='poster';}
})();
