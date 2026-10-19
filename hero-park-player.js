/* Preview-only deterministic alpha-frame renderer. No storyboard frames are supplied. */
(function(root){'use strict';
 const LIMIT=64*1024*1024;
 function frameAt(elapsed,fps,count){return Math.floor(Math.max(0,elapsed)*fps/1000)%count;}
 function poseAt(poses,position){const index=Math.floor(position)%poses.length,next=(index+1)%poses.length,t=position-Math.floor(position);return poses[index].map((v,i)=>v+(poses[next][i]-v)*t);}
 function orbitAt(elapsed,actorIndex,width,height){
  const theta=elapsed/10000*Math.PI*2+actorIndex*.95,depth=Math.sin(theta),size=Math.min(126,height*.62,width*.31)*(.9+depth*.1);
  const radius=Math.min(190,width*.5-size*.65),ry=Math.min(24,height*.12),cx=width*.5+Math.cos(theta)*radius,ground=height*(width<600?.70:.82)+depth*ry;
  const vx=-Math.sin(theta),vy=Math.cos(theta);const direction=Math.abs(vx)>.55?(vx>0?0:2):(vy<0?1:3);
  return {x:cx,y:ground,size,direction,frame:direction*4+Math.floor(elapsed*8/1000+actorIndex*2)%4};
 }
 function chaseAt(elapsed,actorIndex,width,height){
  const half=6000,phase=((elapsed%12000)+12000)%12000,direction=phase<half?1:-1,progress=(phase%half)/half;
  const base=Math.min(126,height*.62,width*.30),padding=base*2+50;
  const center=direction===1?-padding+progress*(width+padding*2):width+padding-progress*(width+padding*2);
  const size=base*(actorIndex?.94:1),x=center-direction*actorIndex*base*.98,y=height*(width<600?.70:.82)-actorIndex*5;
  return {x,y,size,direction,frame:(direction===1?0:8)+Math.floor(elapsed*8/1000+actorIndex*2)%4,flyX:center+direction*(base*.55+28),flyY:height*(width<600?.70:.82)-base*.82+Math.sin(elapsed/450)*4};
 }
 function validate(m){
  if(m?.status!=='ready')throw Error('animation_assets_not_ready');
  if(typeof m.poster!=='string')throw Error('static_poster_required');
  if(m.loopReviewed!==true)throw Error('loop_review_required');
  if(!Number.isInteger(m.frameCount)||m.frameCount<16||m.frameCount>360||!Number.isFinite(m.fps)||m.fps<12||m.fps>30)throw Error('invalid_timing');
  if(!Array.isArray(m.actors)||(m.actors.length<2||m.actors.length>3))throw Error('separate_dog_actors_required');
  if(new Set(m.actors.map(a=>a.id)).size!==m.actors.length||!['pomeranian','maltese'].every(id=>m.actors.some(a=>a.id===id))||m.actors.some(a=>!['pomeranian','maltese','butterfly'].includes(a.id)))throw Error('invalid_actors');
  let decoded=0;
  for(const a of m.actors){
   if(!Number.isInteger(a.width)||!Number.isInteger(a.height)||a.width<1||a.height<1||a.width>512||a.height>512)throw Error('invalid_frame_size');
   if(a.alphaReviewed!==true||!Array.isArray(a.frames)||a.frames.length!==m.frameCount)throw Error('alpha_frames_required');
   if(!Array.isArray(a.poses)||a.poses.length!==m.frameCount)throw Error('motion_samples_required');
   for(const p of a.poses)if(!Array.isArray(p)||p.length!==5||p.some(x=>!Number.isFinite(x))||p[0]<0||p[0]>1||p[1]<0||p[1]>1||p[2]<=0||p[2]>.5||p[3]<0||p[3]>1||p[4]<0||p[4]>1)throw Error('invalid_motion_sample');
   decoded+=a.width*a.height*4*m.frameCount;
  }
  if(decoded>LIMIT)throw Error('decoded_memory_budget_exceeded');
  return decoded;
 }
 async function create(stage,manifest,env=root){
  validate(manifest);
  const doc=stage.ownerDocument,media=env.matchMedia('(prefers-reduced-motion: reduce)');
  let disposed=false,active=true,request=0,started=null,elapsed=0,previous=null,loading=null,failed=false,generation=0;
  const posterURL=new URL(manifest.poster,doc.baseURI);if(posterURL.origin!==env.location.origin||!posterURL.pathname.startsWith('/assets/hero-park/'))throw Error('invalid_poster_url');
  const poster=doc.createElement('img');poster.className='hero-park-poster';poster.alt='';poster.decoding='async';poster.src=posterURL.href;stage.append(poster);
  const canvases=[],decoded=new Map();
  for(const actor of manifest.actors){const canvas=doc.createElement('canvas');canvas.className='hero-park-actor';canvas.setAttribute('aria-hidden','true');stage.append(canvas);canvases.push({actor,canvas,ctx:canvas.getContext('2d')});}
  const release=()=>{for(const bitmap of decoded.values())bitmap.close?.();decoded.clear();};
  async function load(){
   if(loading)return loading;
   loading=(async()=>{
    const jobs=manifest.actors.flatMap(actor=>actor.frames.map(src=>({actor,src})));
    let cursor=0;
    await Promise.all(Array.from({length:4},async()=>{while(cursor<jobs.length&&!disposed&&!failed){const {actor,src}=jobs[cursor++];const url=new URL(src,doc.baseURI);if(url.origin!==env.location.origin||!url.pathname.startsWith('/assets/hero-park/'))throw Error('invalid_asset_url');
     if(decoded.has(url.href))continue;
     const response=await env.fetch(url.href,{credentials:'omit',cache:'force-cache'});if(!response.ok)throw Error('frame_unavailable');
     const bitmap=await env.createImageBitmap(await response.blob());
     if(disposed||failed){bitmap.close?.();return;}
     if(bitmap.width!==actor.width||bitmap.height!==actor.height){bitmap.close?.();throw Error('frame_dimensions_changed');}
     decoded.set(url.href,bitmap);
    }}));
   })().catch(error=>{failed=true;release();poster.hidden=false;stage.dataset.animation='poster';return false;});
   return loading;
  }
  function paint(index,position=index){
   stage.dataset.frame=String(index);stage.dataset.rendered='true';
   const rect=stage.getBoundingClientRect(),ratio=Math.min(env.devicePixelRatio||1,2);
   for(const [actorIndex,{actor,canvas,ctx}]of canvases.entries()){if(!ctx)continue;const cw=Math.max(1,Math.round(rect.width*ratio)),ch=Math.max(1,Math.round(rect.height*ratio));if(canvas.width!==cw)canvas.width=cw;if(canvas.height!==ch)canvas.height=ch;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,rect.width,rect.height);
    const pose=poseAt(actor.poses,position),orbit=manifest.motion==='chase'?chaseAt(elapsed,actorIndex,rect.width,rect.height):manifest.motion==='orbit'?orbitAt(elapsed,actorIndex,rect.width,rect.height):null;
    const [x,y,width,lift,shadow]=pose,w=orbit?orbit.size:width*rect.width,h=w*actor.height/actor.width,cx=orbit?orbit.x:x*rect.width,ground=orbit?orbit.y:y*rect.height,frame=orbit?orbit.frame:index;
    if(actor.id!=='butterfly'){ctx.save();ctx.fillStyle='rgba(38,52,31,'+shadow*.22+')';ctx.filter='blur(3px)';ctx.beginPath();ctx.ellipse(cx,ground,w*.33,w*.055,0,0,Math.PI*2);ctx.fill();ctx.restore();}
    const image=decoded.get(new URL(actor.frames[frame],doc.baseURI).href);if(image)ctx.drawImage(image,cx-w/2,ground-h-lift*rect.height,w,h);
    canvas.style.zIndex=String(Math.round(ground*10)+(actor.id==='butterfly'?1000:0));
   }
  }
  function moveButterfly(){if(manifest.motion==='chase'){const r=stage.getBoundingClientRect(),lead=chaseAt(elapsed,0,r.width,r.height);stage.style.setProperty('--fly-x',lead.flyX+'px');stage.style.setProperty('--fly-y',lead.flyY+'px');stage.dataset.direction=lead.direction===1?'right':'left';return;}if(manifest.motion!=='orbit')return;const r=stage.getBoundingClientRect(),lead=orbitAt(elapsed+1200,0,r.width,r.height);stage.style.setProperty('--fly-x',lead.x+'px');stage.style.setProperty('--fly-y',(lead.y-60-Math.sin(elapsed/500)*5)+'px');}
  function tick(now){request=0;if(disposed||failed||!active||doc.hidden||media.matches)return; if(started===null)started=now;elapsed+=Math.min(now-started,80);started=now;const position=elapsed*manifest.fps/1000%manifest.frameCount,index=Math.floor(position),renderStep=Math.floor(elapsed*30/1000);if(renderStep!==previous){paint(index,position);moveButterfly();previous=renderStep;}request=env.requestAnimationFrame(tick);}
  function stop(){if(request)env.cancelAnimationFrame(request);request=0;started=null;}
  async function sync(){const run=++generation;stop();if(disposed||failed)return;if(media.matches){for(const {canvas}of canvases)canvas.hidden=true;poster.hidden=false;stage.dataset.animation='poster';return;}if(!active||doc.hidden){stage.dataset.animation='paused';return;}await load();if(run!==generation||disposed||failed||media.matches||!active||doc.hidden)return;poster.hidden=true;for(const {canvas}of canvases)canvas.hidden=false;stage.dataset.animation='playing';request=env.requestAnimationFrame(tick);}
  const visible=()=>void sync(),resize=()=>{previous=null;if(decoded.size&&!media.matches&&active&&!doc.hidden)paint(frameAt(elapsed,manifest.fps,manifest.frameCount));};
  media.addEventListener('change',visible);doc.addEventListener('visibilitychange',visible);env.addEventListener('resize',resize,{passive:true});
  const observer=new env.IntersectionObserver(entries=>{active=entries[0]?.isIntersecting===true;void sync();},{threshold:.05});observer.observe(stage);
  return {dispose(){disposed=true;++generation;stop();observer.disconnect();media.removeEventListener('change',visible);doc.removeEventListener('visibilitychange',visible);env.removeEventListener('resize',resize);release();for(const {canvas}of canvases)canvas.remove();poster.remove();},get state(){return disposed?'disposed':stage.dataset.animation||'waiting';}};
 }
 const api=Object.freeze({frameAt,poseAt,orbitAt,chaseAt,validate,create});if(typeof module==='object'&&module.exports)module.exports=api;else root.ParkHeroPlayer=api;
})(typeof globalThis==='undefined'?this:globalThis);
