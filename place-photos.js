(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(root,require('./place-evidence.js'));else root.PlacePhotos=factory(root);})(typeof globalThis!=='undefined'?globalThis:this,function(root,evidence){
 'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let pending;
 function get(place){return (evidence||root.PlaceEvidence)?.get(place)?.photo||null;}
 function load(){
  if(evidence||root.PlaceEvidence)return Promise.resolve();if(pending)return pending;
  pending=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/place-evidence.js?v=20261018-batch3-verified';script.async=true;script.onload=()=>root.PlaceEvidence?resolve():reject(Error('사진 자료를 읽을 수 없습니다.'));script.onerror=()=>{script.remove();pending=null;reject(Error('사진 자료 연결 실패'));};document.head.append(script);});return pending;
 }
 function credit(p){return '<a href="'+esc(p.source)+'" target="_blank" rel="noopener noreferrer">사진: '+esc(p.author)+' · 공식 자료</a> · <a href="'+esc(p.licenseUrl)+'" target="_blank" rel="noopener noreferrer">이용 조건</a><br>'+esc(p.dateNote)+' · '+esc(p.changes)+'<br>촬영 당시 제공 사진으로 현재 모습·동반 허용 구역을 보장하지 않습니다.';}
 function gallery(place){return (evidence||root.PlaceEvidence)?.get(place)?.gallery||[];}
 function galleryHTML(place){const photos=gallery(place);if(!photos.length)return '';return '<details class="place-photo-gallery"><summary>사진 더 보기 · '+photos.length+'장</summary><div class="place-photo-gallery-grid">'+photos.map(p=>'<div><img src="'+esc(p.src)+'" alt="'+esc(place.name)+' 공식 관광자료 추가 사진" width="'+p.width+'" height="'+p.height+'" loading="lazy" decoding="async"><p>'+credit(p)+'</p></div>').join('')+'</div></details>';}
 function figure(place,{compact=false,missing=true}={}){const p=get(place);if(!p)return missing?'<p class="place-photo-missing">재사용 가능한 장소 사진 미등록</p>':'';return '<figure class="place-photo" style="margin:16px 0"><img src="'+esc(p.src)+'" alt="'+esc(place.name)+' 공식 관광자료 제공 사진" width="'+p.width+'" height="'+p.height+'" loading="lazy" decoding="async" style="display:block;width:100%;height:auto;max-height:'+(compact?'160':'500')+'px;object-fit:contain;background:#eef1e9;border-radius:12px"><figcaption style="font-size:11px;line-height:1.65;margin-top:7px;overflow-wrap:anywhere">'+credit(p)+'</figcaption></figure>'+(compact?'':galleryHTML(place));}
 return Object.freeze({get,load,credit,figure,gallery,ready:()=>Boolean(evidence||root.PlaceEvidence)});
});
