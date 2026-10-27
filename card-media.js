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
  grooming:'M9 9 19 19M9 15 19 5M7 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  care:'M4 11 12 4l8 7v9H4v-9Zm5 9v-6h6v6',
  retail:'M5 8h14l1 12H4L5 8Zm4 0V6a3 3 0 0 1 6 0v2',
  course:'M5 19c11 0 11-6 5-6S4 7 18 7m-3-3 3 3-3 3',
  place:'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Zm-7-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'
 };
 function kind(label){return /카페|식당/.test(label)?'dining':/숙소|호텔/.test(label)?'stay':/캠핑/.test(label)?'camping':/공원|관광/.test(label)?'park':/미용/.test(label)?'grooming':/돌봄|위탁/.test(label)?'care':/쇼핑|용품|판매/.test(label)?'retail':/병원|약국/.test(label)?'professional':/코스|산책/.test(label)?'course':'place';}
 function placeholder(label='장소',note='사진 미등록'){
  return '<div class="premium-placeholder" data-placeholder-kind="'+kind(label)+'" role="img" aria-label="'+esc(label)+' '+esc(note)+'"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="'+paths[kind(label)]+'"/></svg><span>'+esc(label)+'</span><small>'+esc(note)+'</small></div>';
 }
 function image(photo,{src,name,href,category='장소'}={}){
  const media=photo?'<img src="'+esc(src||photo.src)+'" alt="'+esc(photo.place||name||category)+' 장소 사진" width="'+Number(photo.width||0)+'" height="'+Number(photo.height||0)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-card-fit="'+fit(photo)+'">':placeholder(category);
  return '<div class="premium-card-media'+(photo?'':' is-missing')+'">'+(href?'<a href="'+esc(href)+'" tabindex="-1">'+media+'</a>':media)+'</div>';
 }
 function author(photo){return String(photo.author||'사진 출처').replace(/\(\s*관광정보 제공기관\s*\)/g,'').replace(/\s*·\s*촬영자 미표기/g,'').trim();}
 function photoContext(value,category=''){
  // This exact editorial boilerplate is not an official quotation or license.
  const common='장소 참고사진 · 메뉴·시설 사진은 반려견의 해당 시설 출입 허용을 뜻하지 않습니다.';
  if(!category||category==='dining'||kind(category)==='dining'||!String(value).includes(common))return value;
  const notes={park:'공원·관광지 참고사진 · 사진 속 구역의 반려견 출입 허용을 뜻하지 않습니다.',stay:'숙소 참고사진 · 사진 속 객실·시설의 반려견 이용 가능 여부는 확인이 필요합니다.',camping:'캠핑장 참고사진 · 사진 속 사이트·시설의 반려견 이용 가능 여부는 확인이 필요합니다.',course:'산책 장소 참고사진 · 사진은 실제 경로 전체나 출입 허용을 보장하지 않습니다.',place:'제공 자료의 사진이며 현재 모습·반려견 출입 가능 구역을 보장하지 않습니다.'};
  const k=notes[category]?category:kind(category);return notes[k]?String(value).replaceAll(common,notes[k]):value;
 }
 function credits(photo,credit='',options={}){
  if(!photo)return '<div class="premium-card-credits" aria-hidden="true"></div>';
  credit=photoContext(credit,options.category);
  const links=[...credit.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].slice(0,2).map((m,i)=>i===0&&photo.author?m[0].replace(/>[\s\S]*<\/a>$/,'>'+esc('사진: '+author(photo))+'</a>'):m[0]).join(' · ');
  return '<div class="premium-card-credits"><div class="premium-credit-line">'+links+'</div><details><summary>사진 정보</summary><div>'+credit+(fit(photo)==='cover'&&!/가장자리.{0,12}잘림/.test(photo.changes||'')?'<p>'+cropNote+'</p>':'')+'</div></details></div>';
 }
 function mark(image,photo){image.setAttribute('data-card-fit',fit(photo));}
 function addressParts(value,name=''){
  const original=String(value||'').trim(),clean=original.replace(/ · (?:식당카페|식당·카페|숙소|캠핑|공원관광|공원·관광|쇼핑)$/, '');
  // Split only an explicit Korean road name + building number. Ambiguous lot
  // addresses and masked public addresses remain intact; never infer an entrance.
  const match=clean.match(/^(.+?(?:대로|로|길)\s+\d+(?:-\d+)?)(?=[\s,(]|$)(.*)$/);
  if(!match)return {original,road:'',detail:'',display:clean};
  let detail=match[2].trim().replace(/^,\s*/,'');
  if(name&&detail.endsWith(' '+name))detail=detail.slice(0,-name.length).trim();
  if(detail===name)detail='';
  return {original,road:match[1],detail,display:match[1]};
 }
 function address(value,area='',name=''){const full=addressParts(value,name).display;return area&&full.startsWith(area+' ')?full.slice(area.length).trim():full===area?'':full;}
 const factNote=row=>row.label==='추가 동반 수칙'||row.value==='세부 기준 미확인';
 function professionalNote(labels){const s=String(labels);return /병원/.test(s)?'진료 대상·예약은 병원에 확인':/약국/.test(s)?'취급 품목·운영시간은 약국에 확인':/미용/.test(s)?'미용 이용 조건·예약은 업소에 확인':/돌봄|위탁/.test(s)?'위탁 기준·예약은 업소에 확인':'서비스·이용 조건은 업소에 확인';}
 return Object.freeze({fit,placeholder,image,credits,mark,cropNote,address,addressParts,factNote,author,professionalNote,photoContext});
});
