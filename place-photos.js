(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(root,require('./place-evidence.js'));else root.PlacePhotos=factory(root);})(typeof globalThis!=='undefined'?globalThis:this,function(root,evidence){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const DELIVERY_ORIGIN="https://balzaguk-place-photos.balzaguk-photo-delivery.workers.dev"; // Enabled only after remote byte verification.
 function url(photo){const src=typeof photo==='string'?photo:photo?.src;return DELIVERY_ORIGIN&&/^\/assets\/place-photos\/kto-\d+(?:-[a-f0-9]{12})?\.(jpg|png)$/.test(src||'')?DELIVERY_ORIGIN+src:src||'';}
 let pending;
 function usable(photo){return photo&&!['Type2','Type4'].includes(photo.rightsType);}
 function get(place){const photo=(evidence||root.PlaceEvidence)?.get(place)?.photo;return usable(photo)?photo:null;}
 function load(){
  if(evidence||root.PlaceEvidence)return Promise.resolve();if(pending)return pending;
  pending=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/place-evidence.js?v=20261020-nationwide-b';script.async=true;script.onload=()=>root.PlaceEvidence?resolve():reject(Error('사진 자료를 읽을 수 없습니다.'));script.onerror=()=>{script.remove();pending=null;reject(Error('사진 자료 연결 실패'));};document.head.append(script);});return pending;
 }
 function credit(p){return '<a href="'+esc(p.source)+'" target="_blank" rel="noopener noreferrer">사진: '+esc(p.author)+(p.photoKind&&p.title?' · '+esc(p.title):'')+' · 사진 원문</a> · <a href="'+esc(p.licenseUrl)+'" target="_blank" rel="noopener noreferrer">이용 조건'+(p.photoKind?' · '+esc(p.license):'')+'</a><br>'+(p.placeCaption?esc(p.placeCaption)+'<br>':'')+esc(p.dateNote)+' · '+esc(p.changes)+'<br>촬영 당시 제공 사진으로 현재 모습·동반 허용 구역을 보장하지 않습니다.';}
 function gallery(place){return ((evidence||root.PlaceEvidence)?.get(place)?.gallery||[]).filter(usable);}
 function galleryHTML(place){const photos=gallery(place);if(!photos.length)return '';return '<details class="place-photo-gallery"><summary>사진 더 보기 · '+photos.length+'장</summary><div class="place-photo-gallery-grid">'+photos.map(p=>'<div><img src="'+esc(url(p))+'" alt="'+esc(place.name)+' 장소 추가 사진" width="'+p.width+'" height="'+p.height+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"><p>'+credit(p)+'</p></div>').join('')+'</div></details>';}
 function figure(place,{compact=false,missing=true}={}){const p=get(place);if(!p)return missing?'<p class="place-photo-missing">재사용 가능한 장소 사진 미등록</p>':'';return '<figure class="place-photo" style="margin:16px 0"><img src="'+esc(url(p))+'" alt="'+esc(place.name)+' 장소 사진" width="'+p.width+'" height="'+p.height+'" loading="lazy" decoding="async" referrerpolicy="no-referrer" style="display:block;width:100%;height:auto;max-height:'+(compact?'160':'500')+'px;object-fit:contain;background:#eef1e9;border-radius:12px"><figcaption style="font-size:11px;line-height:1.65;margin-top:7px;overflow-wrap:anywhere">'+credit(p)+'</figcaption></figure>'+(compact?'':galleryHTML(place));}
 return Object.freeze({get,load,credit,figure,gallery,url,ready:()=>Boolean(evidence||root.PlaceEvidence)});
});
