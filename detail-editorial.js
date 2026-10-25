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
 const routeButton=page.querySelector('[data-route-load]'),routeHost=page.querySelector('[data-route-map]');
 if(routeButton&&routeHost){
  let pending;
  function maps(){if(window.L)return Promise.resolve();if(pending)return pending;
   pending=new Promise((resolve,reject)=>{const sdk=document.createElement('script'),css=document.createElement('link');css.rel='stylesheet';css.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';document.head.append(css);sdk.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';sdk.async=true;const timer=setTimeout(()=>{sdk.remove();reject(Error('timeout'));},12000);sdk.onload=()=>{clearTimeout(timer);window.L?resolve():reject(Error('library'));};sdk.onerror=()=>{clearTimeout(timer);sdk.remove();reject(Error('offline'));};document.head.append(sdk);}).catch(error=>{pending=null;throw error;});return pending;
  }
  routeButton.addEventListener('click',()=>action(routeButton,async()=>{
   const note=page.querySelector('[data-route-status]');note.textContent='경로 지도를 불러오고 있어요.';
   try{
    const data=JSON.parse(document.getElementById('detail-route-data').textContent);if(!Array.isArray(data.parts)||!data.parts.length)throw Error('route');
    await maps();const L=window.L,points=data.parts.flat();if(!points.length)throw Error('route');
    routeHost.dataset.ready='true';const canvas=document.createElement('div');canvas.style.cssText='position:absolute;inset:0 0 38px';canvas.setAttribute('aria-label','공식 GPX 산책 경로 지도');routeHost.prepend(canvas);
    const map=L.map(canvas,{scrollWheelZoom:false,zoomControl:true,zoomAnimation:!reduced(),fadeAnimation:!reduced()});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19,referrerPolicy:'strict-origin-when-cross-origin'}).addTo(map);
    for(const part of data.parts)L.polyline(part,{color:'#294e3d',weight:5,opacity:.95,smoothFactor:0}).addTo(map);
    const first=points[0],last=points.at(-1),loop=Math.hypot((first[0]-last[0])*111000,(first[1]-last[1])*88000)<30;
    for(const [p,label] of (loop?[[first,'S/E']]:[[first,'S'],[last,'E']]))L.marker(p,{icon:L.divIcon({className:'detail-route-endpoint',html:label,iconSize:[28,28],iconAnchor:[14,28]}),title:label==='S'?'출발점':label==='E'?'도착점':'출발·도착점'}).addTo(map);
    map.fitBounds(L.latLngBounds(points),{padding:[36,36]});routeButton.hidden=true;note.textContent='공식 GPX 경로 · 당일 통제와 출입 가능 여부는 현장 안내를 확인하세요.';
    new ResizeObserver(()=>{map.invalidateSize({pan:false});}).observe(canvas);
   }catch{routeHost.dataset.ready='false';routeHost.querySelector('[aria-label="공식 GPX 산책 경로 지도"]')?.remove();note.textContent='지도를 불러오지 못했어요. 아래 공식 경로 원문으로 확인하거나 다시 시도해 주세요.';routeButton.textContent='경로 지도 다시 시도';}
  }));
  // Load only when the verified route actually enters the viewport. No GPS or
  // geolocation permission is requested; data-saver users keep the manual action.
  if('IntersectionObserver' in window&&!navigator.connection?.saveData){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();routeButton.click();}},{rootMargin:'80px'});observer.observe(routeHost);}
 }
})();
