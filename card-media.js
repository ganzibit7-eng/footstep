(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CardMedia=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const cropNote='카드 프레임에 맞춰 가장자리 일부를 표시합니다. 원본은 사진 출처에서 확인하세요.';
 function fit(photo){
  if(!photo||photo.noCrop||/ND|제\s*[34]\s*유형|변경\s*금지/i.test(photo.license||''))return 'contain';
  const allowed=/CC\s*BY(?:-SA)?\s*[234]|CC0|Public Domain|공공누리\s*제?\s*1\s*유형/i.test(photo.license||'');
  const ratio=Number(photo.width)/Number(photo.height);
  return allowed&&ratio>=.9&&ratio<=2.3&&Number(photo.width)>=480?'cover':'contain';
 }
 const paths={
  dining:'M7 5v6m3-6v6M7 8h3m-1 3v8m8-14v14m0-14c-4 3-4 7 0 7',
  stay:'M4 19V8h16v11M8 8V5h8v3M8 12h2m4 0h2m-8 4h2m4 0h2',
  camping:'m3 19 9-14 9 14H3Zm9-14v14m-5 0 5-8 5 8',
  park:'M12 3 5 14h4l-3 4h12l-3-4h4L12 3Zm0 15v3',
  professional:'M8 4h8v4h4v8h-4v4H8v-4H4V8h4V4Z',
  course:'M5 19c11 0 11-6 5-6S4 7 18 7m-3-3 3 3-3 3',
  place:'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Zm-7-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'
 };
 function kind(label){return /카페|식당/.test(label)?'dining':/숙소|호텔/.test(label)?'stay':/캠핑/.test(label)?'camping':/공원|관광/.test(label)?'park':/병원|전문|미용|돌봄|약국/.test(label)?'professional':/코스|산책/.test(label)?'course':'place';}
 function placeholder(label='장소',note='사진 미등록'){
  return '<div class="premium-placeholder" role="img" aria-label="'+esc(label)+' '+esc(note)+'"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="'+paths[kind(label)]+'"/></svg><span>'+esc(label)+'</span><small>'+esc(note)+'</small></div>';
 }
 function image(photo,{src,name,href,category='장소'}={}){
  const media=photo?'<img src="'+esc(src||photo.src)+'" alt="'+esc(photo.place||name||category)+' 장소 사진" width="'+Number(photo.width||0)+'" height="'+Number(photo.height||0)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-card-fit="'+fit(photo)+'">':placeholder(category);
  return '<div class="premium-card-media">'+(href?'<a href="'+esc(href)+'" tabindex="-1">'+media+'</a>':media)+'</div>';
 }
 function credits(photo,credit=''){
  if(!photo)return '<div class="premium-card-credits" aria-hidden="true"></div>';
  const links=[...credit.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].slice(0,2).map(m=>m[0]).join(' · ');
  return '<div class="premium-card-credits"><div class="premium-credit-line">'+links+'</div><details><summary>사진 정보'+(fit(photo)==='contain'?' · 전체 비율 유지':' · 프레임 표시')+'</summary><div>'+credit+(fit(photo)==='cover'?'<p>'+cropNote+'</p>':'')+'</div></details></div>';
 }
 function mark(image,photo){image.setAttribute('data-card-fit',fit(photo));}
 return Object.freeze({fit,placeholder,image,credits,mark,cropNote});
});
