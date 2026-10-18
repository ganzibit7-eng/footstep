(function(){'use strict';
 const origin='https://balzaguk-place-photos.balzaguk-photo-delivery.workers.dev';
 function unavailable(image){
  if(image?.tagName!=='IMG'||image.dataset.photoUnavailable)return;
  let url;try{url=new URL(image.currentSrc||image.src,document.baseURI);}catch{return;}
  if(url.origin!==origin)return;
  image.dataset.photoUnavailable='true';image.hidden=true;image.style.display='none';
  const note=document.createElement('p');note.className='place-photo-unavailable';
  note.textContent='사진을 잠시 불러올 수 없어요. 장소 안내는 계속 확인할 수 있습니다.';
  note.style.cssText='padding:20px;margin:0;background:#f2f3ec;color:#526359;font-size:13px;line-height:1.7;border-radius:12px';
  image.insertAdjacentElement('afterend',note);
 }
 document.addEventListener('error',event=>unavailable(event.target),true);
 function scan(){document.querySelectorAll('img').forEach(image=>{if(image.complete&&!image.naturalWidth)unavailable(image);});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
})();
