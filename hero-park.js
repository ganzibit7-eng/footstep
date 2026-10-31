/* Whole-body chase animation with static fallback and shared motion timing. */
(async function(){'use strict';
 const stage=document.querySelector('.hero-park-stage');if(!stage||!window.ParkHeroPlayer)return;
 // Small grass patches share a travelling gust; individual blades remain irregular.
 const meadow=document.createElement('div');meadow.className='hero-meadow';meadow.setAttribute('aria-hidden','true');
 const colors=['#849852','#a1ad68','#71884c'];
 for(let i=0;i<9;i++){
  const tuft=document.createElement('span');tuft.className='meadow-tuft depth-'+i%3;
  const left=[3,15,28,38,51,63,74,86,96][i];tuft.style.left=left+'%';tuft.style.setProperty('--gust-delay',(-8.8+left*.026)+'s');tuft.style.setProperty('--wind-time',(5.7+i*.23)+'s');tuft.style.setProperty('--wind-delay',(-i*.57)+'s');
  let groups='';for(let g=0;g<3;g++){let blades='';for(let j=0;j<7;j++){
   const seed=(i*37+g*17+j*23)%97,x=2+g*21+j*3.1,y=30-(seed%4),height=6+seed%14,lean=2+seed%5;
   blades+='<path d="M'+x+' '+y+' Q'+(x+1)+' '+(y-height*.5)+' '+(x+lean)+' '+(y-height)+' Q'+(x+2)+' '+(y-height*.45)+' '+(x+.65)+' '+y+'Z" fill="'+colors[(j+i)%3]+'" opacity="'+(.4+(seed%4)*.12)+'"/>';
  }groups+='<g class="meadow-blades" style="--blade-delay:'+(-g*.7-i*.2)+'s">'+blades+'</g>';}
  tuft.innerHTML='<svg viewBox="0 0 70 32" aria-hidden="true">'+groups+'</svg>';meadow.append(tuft);
 }
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
