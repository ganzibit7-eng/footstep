(function(){'use strict';
 const origin='https://balzaguk-place-photos.balzaguk-photo-delivery.workers.dev';
 function unavailable(image){
  if(image?.tagName!=='IMG'||image.dataset.photoUnavailable)return;
  let url;try{url=new URL(image.currentSrc||image.src,document.baseURI);}catch{return;}
  const venue=image.closest?.('.detail-gallery,.premium-card-media,.place-photo,.place-photo-gallery');
  if(url.origin!==origin&&!venue)return;
  const height=image.getBoundingClientRect?.().height||0;
  image.dataset.photoUnavailable='true';image.hidden=true;image.style.display='none';
  const note=document.createElement('p');note.className='place-photo-unavailable';
  note.textContent='사진을 잠시 불러올 수 없어요. 장소 안내는 계속 확인할 수 있습니다.';
  note.setAttribute('role','img');note.setAttribute('aria-label','장소 사진 연결 실패');
  note.style.cssText='box-sizing:border-box;display:flex;align-items:center;justify-content:center;padding:20px;margin:0;background:#f2f3ec;color:#526359;font-size:13px;line-height:1.7';
  if(height)note.style.minHeight=height+'px';
  image.insertAdjacentElement('afterend',note);
 }
 document.addEventListener('error',event=>unavailable(event.target),true);
 function scan(){document.querySelectorAll('img').forEach(image=>{if(image.complete&&!image.naturalWidth)unavailable(image);});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
})();
