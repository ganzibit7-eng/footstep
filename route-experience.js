(function(){'use strict';
 const page=document.querySelector('[data-detail-template]');if(!page)return;
 const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const status=page.querySelector('[data-detail-status]');
 const message=(value,error=false)=>{status.textContent=value;status.dataset.state=error?'error':'success';};
 async function action(button,work){if(button.disabled)return;button.disabled=true;button.setAttribute('aria-busy','true');try{await work();}finally{button.disabled=false;button.removeAttribute('aria-busy');}}
 page.querySelectorAll('[data-copy-address]').forEach(button=>button.addEventListener('click',()=>action(button,async()=>{
  try{if(!navigator.clipboard||!window.isSecureContext)throw Error();await navigator.clipboard.writeText(button.dataset.copyAddress);message('주소를 복사했습니다.');}catch{message('자동 복사가 어려워요. 위 주소를 선택해 복사해 주세요.',true);}
 })));
 page.querySelector('[data-detail-share]')?.addEventListener('click',event=>action(event.currentTarget,async()=>{
  const url=new URL(document.querySelector('link[rel="canonical"]').href);url.searchParams.set('utm_source','share');url.searchParams.set('utm_medium','referral');url.searchParams.set('utm_campaign','place_detail');
  try{if(navigator.share){await navigator.share({title:document.title,url:url.href});message('');}else if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url.href);message('공유 링크를 복사했습니다.');}else message('공유할 링크: '+url.href);}catch(error){if(error.name!=='AbortError')message('공유를 완료하지 못했어요. 주소창의 링크를 복사해 주세요.',true);}
 }));
 const back=page.querySelector('[data-detail-back]');
 // Keep ordinary click, copied links and modified/new-tab clicks on one return URL.
 try{const from=new URL(document.referrer);if(back&&from.origin===location.origin&&/^(\/$|\/discover\.html$|\/places\/|\/courses\/|\/pet-care\/|\/pet-life\/)/.test(from.pathname))back.href=from.pathname+from.search+from.hash;}catch{}
 // Section navigation replaces this detail's hash instead of adding history
 // entries, so the list return action still restores the original list state.
 page.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button)return;
  const target=document.getElementById(link.getAttribute('href').slice(1));if(!target)return;
  event.preventDefault();if(target.tagName==='DETAILS')target.open=true;
  history.replaceState(history.state,'',link.getAttribute('href'));target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView({block:'start',inline:'nearest',behavior:reduced()?'instant':'smooth'});
 }));
 back?.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button)return;try{const from=new URL(document.referrer);if(from.origin===location.origin&&history.length>1&&/^(\/$|\/discover\.html$|\/places\/|\/courses\/|\/pet-care\/|\/pet-life\/)/.test(from.pathname)){event.preventDefault();history.back();}}catch{}});
 const gallery=page.querySelector('.detail-gallery-track');
 if(gallery){
  const slides=[...gallery.children],controls=page.querySelector('.detail-gallery-controls');let frame=0;
  const position=()=>{if(gallery.scrollLeft>0&&gallery.scrollWidth-gallery.clientWidth-gallery.scrollLeft<=2)return slides.length-1;const origin=gallery.getBoundingClientRect().left;let index=0,distance=Infinity;slides.forEach((slide,i)=>{const d=Math.abs(slide.getBoundingClientRect().left-origin);if(d<distance){distance=d;index=i;}});return index;};
  const sync=()=>{frame=0;if(!controls)return;const index=position();controls.querySelector('[data-gallery-position]').textContent=(index+1)+' / '+slides.length;controls.querySelector('[data-gallery-step="-1"]').disabled=index===0;controls.querySelector('[data-gallery-step="1"]').disabled=index===slides.length-1;};
  const move=step=>{const index=Math.max(0,Math.min(slides.length-1,position()+step));gallery.scrollTo({left:slides[index].offsetLeft-slides[0].offsetLeft,behavior:reduced()?'instant':'smooth'});};
  controls?.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>move(Number(b.dataset.galleryStep))));
  gallery.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(sync);},{passive:true});
  gallery.addEventListener('keydown',event=>{if(event.target!==gallery)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
  window.addEventListener('resize',sync,{passive:true});sync();
 }
 // A Leaflet layer emits `load` even when tiles failed. Track the visible tile
 // elements instead, so route geometry and background availability stay distinct.
 function tileFeedback(layer,note,retry,focusTarget){
  const tiles=new Map();let timer,disposed=false,retrying=false;
  const render=()=>{
   clearTimeout(timer);if(disposed)return;
   const values=[...tiles.values()],pending=values.includes('loading'),failed=values.includes('error');
   retry.disabled=pending;retry.setAttribute('aria-busy',String(pending));
   if(pending){note.textContent='배경 지도를 불러오고 있어요. 경로선은 별도 자료입니다.';timer=setTimeout(()=>{for(const [tile,state] of tiles)if(state==='loading')tiles.set(tile,'error');render();},12000);return;}
   retrying=false;
   if(failed){retry.hidden=false;note.textContent='배경 지도 일부를 불러오지 못했어요. 경로선과 공식 원문은 계속 확인할 수 있습니다.';return;}
   note.textContent=values.length?'현재 화면의 배경 지도 로딩 완료':'';
   if(document.activeElement===retry)focusTarget.focus({preventScroll:true});
   retry.hidden=true;retrying=false;
  };
  const start=e=>{tiles.set(e.tile,'loading');render();},finish=state=>e=>{if(!tiles.has(e.tile))return;tiles.set(e.tile,state);render();},ready=finish('ready'),error=finish('error'),unload=e=>{tiles.delete(e.tile);render();};
  layer.on({tileloadstart:start,tileload:ready,tileerror:error,tileunload:unload});
  const redraw=()=>{if(disposed||retry.disabled||retrying)return;retrying=true;tiles.clear();retry.disabled=true;note.textContent='배경 지도를 다시 불러오고 있어요.';layer.redraw();render();};
  retry.addEventListener('click',redraw);
  return ()=>{disposed=true;clearTimeout(timer);layer.off({tileloadstart:start,tileload:ready,tileerror:error,tileunload:unload});retry.removeEventListener('click',redraw);};
 }
 const routeButton=page.querySelector('[data-route-load]'),routeHost=page.querySelector('[data-route-map]');
 if(routeButton&&routeHost){
  routeButton.textContent='지도에서 산책 경로 보기';
  let pending,activeMap,disposeTiles;
  function maps(){if(window.L&&document.querySelector('link[data-route-map-style="ready"]'))return Promise.resolve();if(pending)return pending;
   pending=new Promise((resolve,reject)=>{const sdk=document.createElement('script'),css=document.createElement('link');let ready=0,settled=false;const finish=()=>{if(!settled&&++ready===2){if(!window.L){fail();return;}settled=true;css.setAttribute('data-route-map-style','ready');clearTimeout(timer);resolve();}},fail=()=>{if(settled)return;settled=true;clearTimeout(timer);sdk.remove();css.remove();reject(Error('map_assets'));};const timer=setTimeout(fail,12000);css.rel='stylesheet';css.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';css.onload=finish;css.onerror=fail;sdk.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';sdk.async=true;sdk.onload=finish;sdk.onerror=fail;document.head.append(css,sdk);}).catch(error=>{pending=null;throw error;});return pending;
  }
  routeButton.addEventListener('click',()=>action(routeButton,async()=>{
   const note=page.querySelector('[data-route-status]');note.textContent='경로 지도를 불러오고 있어요.';
   try{
    const data=JSON.parse(document.getElementById('detail-route-data').textContent);if(!Array.isArray(data.parts)||!data.parts.length)throw Error('route');
    const geometry=window.RouteGeometry?.inspect(data);if(!geometry)throw Error('route');
    await maps();const L=window.L,points=data.parts.flat();
    routeHost.dataset.ready='true';const canvas=document.createElement('div');canvas.style.cssText='position:absolute;inset:0 0 38px';canvas.setAttribute('aria-label','공식 GPX 산책 경로 지도');routeHost.prepend(canvas);
    const mobile=window.matchMedia('(pointer: coarse), (max-width: 767px)').matches;
    const map=activeMap=L.map(canvas,{scrollWheelZoom:false,dragging:!mobile,touchZoom:!mobile,zoomControl:true,zoomAnimation:!reduced(),fadeAnimation:!reduced()});
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19,referrerPolicy:'strict-origin-when-cross-origin'});
    for(const part of data.parts)L.polyline(part,{color:'#294e3d',weight:5,opacity:.95,smoothFactor:0}).addTo(map);
    const first=geometry.start,last=geometry.end,loop=geometry.close;
    for(const [p,label] of (loop?[[first,'S/E']]:[[first,'S'],[last,'E']]))L.marker(p,{icon:L.divIcon({className:'detail-route-endpoint '+(label==='E'?'is-end':'is-start'),html:label,iconSize:[28,28],iconAnchor:[14,28]}),title:label==='S'?'출발점':label==='E'?'도착점':'출발·도착점'}).addTo(map);
    const fit=()=>map.fitBounds(L.latLngBounds(points),{padding:[36,36],animate:false});fit();
    const controls=document.createElement('div');controls.className='detail-route-controls';
    const full=document.createElement('button');full.type='button';full.className='detail-button';full.textContent='경로 전체 보기';full.addEventListener('click',fit);controls.append(full);
    const touch=document.createElement('button');touch.type='button';touch.className='detail-button';touch.textContent=mobile?'지도 조작 켜기':'지도 조작 끄기';touch.setAttribute('aria-pressed',String(!mobile));touch.addEventListener('click',()=>{const on=touch.getAttribute('aria-pressed')!=='true';map.dragging[on?'enable':'disable']();map.touchZoom[on?'enable':'disable']();touch.setAttribute('aria-pressed',String(on));touch.textContent=on?'지도 조작 끄기':'지도 조작 켜기';});controls.append(touch);
    const start=document.createElement('a');start.className='detail-button';start.href=window.RouteGeometry.directions(page.querySelector('h1').textContent,first);start.target='_blank';start.rel='noopener noreferrer';start.textContent='GPX 첫 지점까지 길찾기';controls.append(start);routeHost.after(controls);
    const retry=document.createElement('button');retry.type='button';retry.className='detail-button';retry.textContent='배경 지도 다시 불러오기';retry.hidden=true;controls.append(retry);
    const tileNote=document.createElement('p');tileNote.className='detail-route-tiles';tileNote.setAttribute('role','status');tileNote.setAttribute('aria-live','polite');controls.after(tileNote);
    disposeTiles=tileFeedback(tiles,tileNote,retry,full);tiles.addTo(map);
    const context=document.createElement('p');context.className='detail-route-context';context.textContent=(geometry.disconnected?'여러 구간으로 제공된 경로입니다. 구간 사이를 연결하거나 이동 가능하다고 추정하지 않습니다. ':geometry.close?'출발·도착 좌표가 인접합니다. 순환 통행 가능 여부는 공식 안내를 확인하세요. ':'GPX 좌표 순서의 첫 지점과 마지막 지점을 표시합니다. 편도·왕복 여부는 공식 안내를 확인하세요. ')+'길찾기는 GPX 첫 좌표까지의 안내이며 실제 출입구·주차장 확인과 다릅니다.';controls.after(context);
    const hadFocus=document.activeElement===routeButton;routeButton.hidden=true;if(hadFocus)full.focus({preventScroll:true});note.textContent='공식 GPX 경로 · 당일 통제와 출입 가능 여부는 현장 안내를 확인하세요.';
    new ResizeObserver(()=>{map.invalidateSize({pan:false});}).observe(canvas);
   }catch{disposeTiles?.();disposeTiles=null;activeMap?.remove();activeMap=null;page.querySelector('.detail-route-controls')?.remove();page.querySelector('.detail-route-context')?.remove();page.querySelector('.detail-route-tiles')?.remove();routeHost.dataset.ready='false';routeHost.querySelector('[aria-label="공식 GPX 산책 경로 지도"]')?.remove();note.textContent='지도를 불러오지 못했어요. 아래 공식 경로 원문으로 확인하거나 다시 시도해 주세요.';routeButton.textContent='산책 경로 지도 다시 불러오기';}
  }));
  // Load only when the verified route actually enters the viewport. No GPS or
  // geolocation permission is requested; data-saver users keep the manual action.
  if('IntersectionObserver' in window&&!navigator.connection?.saveData){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();routeButton.click();}},{rootMargin:'80px'});observer.observe(routeHost);}
 }
})();
