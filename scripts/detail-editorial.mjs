import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
const placePhotos=createRequire(import.meta.url)('../place-photos.js');
export const detailPhotoURL=src=>placePhotos.url(src);

export const DETAIL_VERSION='20261025-editorial2';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const text=s=>String(s||'').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g,c=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&nbsp;':' '}[c])).trim();

// These fragments come from our own generators. Keep raw nodes intact, notably
// licenses, inline disclosures, JSON-LD and source links. No DOM reserialization.
export function fragments(html){
 const out=[];let depth=0,start=0,last=0;
 const tokens=/<\/?([a-z][\w:-]*)\b[^>]*>|<!--[\s\S]*?-->/gi;
 const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
 for(const m of html.matchAll(tokens)){
  if(!m[1])continue;const tag=m[1].toLowerCase(),close=m[0][1]==='/';
  if(depth===0&&!close){if(m.index>last&&html.slice(last,m.index).trim())out.push(html.slice(last,m.index));start=m.index;}
  if(!voids.has(tag)&&!m[0].endsWith('/>'))depth+=close?-1:1;
  if(depth===0){out.push(html.slice(start,m.index+m[0].length));last=m.index+m[0].length;}
 }
 if(html.slice(last).trim())out.push(html.slice(last));return out;
}
const inside=h=>h.slice(h.indexOf('>')+1,h.lastIndexOf('</'));
const rows=h=>[...String(h).matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/g)].map(m=>({label:text(m[1]),value:text(m[2])}));
const unknown=v=>!v||/^(?:미확인|정보\s*없음|공개 연락처 미등록|등록된 .*없|-)\s*(?:[·.]|$)/.test(v);
const dl=(data,cls='detail-facts')=>'<dl class="'+cls+'">'+data.map(r=>'<div><dt>'+esc(r.label)+'</dt><dd>'+esc(r.value).replaceAll('\n','<br>')+'</dd></div>').join('')+'</dl>';
const section=(id,title,content)=>'<section class="detail-section" id="'+id+'"><h2>'+title+'</h2>'+content+'</section>';
const guidance=data=>'<ul class="detail-guidance">'+data.map(r=>'<li><span>'+esc(r.label)+'</span><p>'+esc(r.value).replaceAll('\n','<br>')+'</p></li>').join('')+'</ul>';
const feature=(row,style='')=>row?'<div class="detail-feature '+style+'"><span>'+esc(row.label)+'</span><strong class="'+(row.value.length>70?'detail-feature-long':'')+'">'+esc(row.value).replaceAll('\n','<br>')+'</strong></div>':'';
function petPresentation(kind,pet,visit,facilities,caution,missing,booking){
 const scope=pet.find(r=>/허용 구역/.test(r.label)),size=pet.find(r=>/견종·크기/.test(r.label)),rest=pet.filter(r=>r!==scope&&r!==size);
 const hours=visit.find(r=>r.label==='운영시간'),checkin=visit.find(r=>r.label==='입실 시간'),checkout=visit.find(r=>r.label==='퇴실 시간');
 const times=visit.filter(r=>r!==hours&&(kind!=='stay'||r!==checkin&&r!==checkout));
 const unconfirmed=missing.length?'<p class="detail-unconfirmed"><strong>방문 전 문의</strong>'+esc(missing.join(' · '))+' 항목은 미확인입니다.</p>':'';
 let primary='',secondary='';
 if(kind==='stay'){
  primary=feature(size,'detail-feature-size')+feature(scope,'detail-feature-scope')+guidance(rest);
  secondary=(checkin||checkout?'<div class="detail-checkin">'+feature(checkin)+feature(checkout)+'</div>':'')+feature(hours,'detail-feature-hours')+booking+guidance(times)+guidance(facilities);
 }else if(kind==='camping'){
  primary=feature(size,'detail-feature-access')+feature(scope,'detail-feature-scope')+guidance(rest);
  const site=facilities.find(r=>r.label==='캠핑장 유형'),main=facilities.find(r=>r.label==='주요시설');
  secondary=feature(site,'detail-feature-site')+feature(main,'detail-feature-facilities')+guidance(facilities.filter(r=>r!==site&&r!==main))+guidance(visit);
 }else if(kind==='park'){
  primary=feature(scope,'detail-feature-access')+feature(size,'detail-feature-scope')+guidance(rest.filter(r=>!/구비시설/.test(r.label)));
  secondary=feature(hours,'detail-feature-hours')+guidance(times)+guidance([...rest.filter(r=>/구비시설/.test(r.label)),...facilities]);
 }else{
  primary=feature(scope,'detail-feature-access')+feature(size,'detail-feature-scope')+guidance(rest);
  secondary=feature(hours,'detail-feature-hours')+guidance(times)+guidance(facilities);
 }
 return section('detail-conditions',config[kind].conditions,caution+primary+unconfirmed)+(secondary?section('detail-visit',config[kind].visit,secondary):'<aside class="detail-visit-empty" id="detail-visit"><strong>방문 정보 확인</strong><p>운영시간·주차 자료는 미확인입니다. 방문 전에 업소에 문의해 주세요.</p></aside>');
}
function courseMetrics(nodes,route){
 const raw=text(nodes.join('')),parts=raw.split(/\s*·\s*/),data=[];
 for(const part of parts){let m;if((m=part.match(/^거리\s+(.+)/)))data.push({label:route?'GPX 좌표 기준 거리':'등록 거리 · 경로 미확인',value:m[1]});else if((m=part.match(/^((?:평지 예상|공식 안내) 시간)\s+(.+)/)))data.push({label:m[1],value:m[2]});else if((m=part.match(/^난이도\s+(.+)/)))data.push({label:'등록 난이도',value:m[1]});}
 return '<aside class="detail-course-metrics" aria-label="산책코스 핵심 정보">'+data.map(r=>feature(r)).join('')+'</aside>';
}

// Professional records have no reusable photographs or verified opening hours.
// Keep their concise public register, rather than repeating a tourism template
// and the same disclaimer several times across 17,000+ business pages.
function professionalDetail(html,article){
 const nodes=fragments(article[1]),find=re=>nodes.find(n=>re.test(n))||'';
 const kicker=find(/class="care-kicker"/),originalH1=find(/^<h1/),name=text(originalH1);
 const heading=/^[-.\s]*$/.test(name)?'<h1>업소명 미확인 <small>등록명: '+esc(name)+'</small></h1>':originalH1;
 const facts=find(/class="care-facts"/),address=rows(facts).find(r=>r.label==='주소')?.value||'';
 const back=find(/class="care-back"/).replace('class="care-back"','class="care-back" data-detail-back');
 const visit=find(/class="care-visit"/).replace('class="care-visit"','class="detail-section" id="detail-visit"');
 let actions=find(/class="care-actions"/).replace('class="care-actions"','class="detail-toolbar detail-contact-actions"');
 const phone=rows(facts).find(r=>r.label==='연락처')?.value||'';
 if(/^\+?[0-9()\s-]{8,30}$/.test(phone))actions=actions.replace(/(<a class="care-primary"[^>]*>)[\s\S]*?(<\/a>)/,'$1<span>전화로 문의하기</span><strong>'+esc(phone)+'<\/strong>$2');
 actions=actions.replace('</div>','<button type="button" class="detail-button" data-detail-share>공유</button>'+(address?'<button type="button" class="detail-button" data-copy-address="'+esc(address)+'">주소 복사</button>':'')+'</div>');
 const note=find(/class="care-note"/),sources=find(/class="care-sources"/),state=find(/class="care-state"/);
 const next=back+'<header class="detail-heading">'+kicker+heading+'</header>'+actions+'<p class="detail-action-status" data-detail-status role="status" aria-live="polite"></p><div class="detail-content">'+section('detail-conditions','위치와 공개 등록 정보',facts+state+note)+visit+section('detail-sources','자료 출처',sources)+'</div>';
 html=html.replace(article[0],'<article class="detail-article" data-detail-template="editorial-v2" data-detail-kind="professional">'+next+'</article>');
 return html.replace('<body>','<body class="editorial-detail">').replace('</head>','<link rel="stylesheet" href="/detail-editorial.css?v='+DETAIL_VERSION+'"></head>').replace('</body>','<script defer src="/detail-editorial.js?v='+DETAIL_VERSION+'"></script></body>');
}
const config={
 dining:{label:'식당·카페',conditions:'함께 머무를 수 있는 곳',visit:'이용 시간과 방문 정보',missing:['체중·견종 기준','허용 구역','목줄·이동장 조건']},
 stay:{label:'반려견 동반 숙소',conditions:'반려견과 숙박하기',visit:'체크인과 예약 준비',missing:['허용 객실·공용 공간','동반 마릿수','추가요금']},
 camping:{label:'반려견 동반 캠핑',conditions:'반려견과 캠핑하기',visit:'운영과 캠핑 준비',missing:['허용 사이트·숙박 시설','동반 마릿수','추가요금']},
 park:{label:'공원·관광지',conditions:'입장 구역과 이용 수칙',visit:'운영과 공원 시설',missing:['출입 가능 구역','목줄·입마개 기준']},
 retail:{label:'반려견 동반 쇼핑',conditions:'출입과 이용 조건',visit:'운영시간과 매장 정보',missing:['세부 출입 조건']},
 amenity:{label:'반려생활 편의시설',conditions:'사용·수거 안내',visit:'이용 위치',missing:[]},
 place:{label:'반려생활 장소',conditions:'반려견 동반 안내',visit:'방문 정보',missing:['세부 출입 조건']},
 course:{label:'산책코스',conditions:'코스와 산책 준비',visit:'출발 전 확인',missing:[]},
 professional:{label:'반려동물 전문업소',conditions:'공개 등록 정보',visit:'문의와 방문 준비',missing:[]}
};

// Tourism prose may arrive in an upstream field named etcAcmpyInfo. Split by
// complete sentences, never reinterpret menu/nearby sightseeing as access rules.
export function separateProse(value){
 const sentences=String(value).split(/(?<=[.!?])\s+|\n+/);
 const rules=[],intro=[];
 for(const sentence of sentences){const s=sentence.trim();if(!s)continue;(/반려|동반|애완|애견|강아지|입장|출입|목줄|이동장|켄넬|케이지|리드줄|입마개|견종|체중|예방접종|배설|배변|마릿수|대형견|소형견|중형견|도사견|로트와일러|핏불|맹견|\d\s*(?:kg|㎏)|불가|금지|제한|필수/i.test(s)?rules:intro).push(s);}
 return {rules:rules.join(' '),intro:intro.join(' ')};
}

function photoFigure(image,credit,index){
 image=image.replace(/src="([^"]+)"/,(_,src)=>'src="'+esc(detailPhotoURL(text(src)))+'"');
 image=image.replace(/\sstyle="[^"]*"/g,'').replace(/loading="(?:eager|lazy)"/,'loading="'+(index?'lazy':'eager')+'"');
 if(!index&&!image.includes('fetchpriority='))image=image.replace('<img ','<img fetchpriority="high" ');
 // Existing nested credits are unwrapped; every original license/date/change note remains.
 credit=credit.replace(/^\s*<details[^>]*>\s*<summary[^>]*>[\s\S]*?<\/summary>\s*<div>([\s\S]*)<\/div>\s*<\/details>\s*$/,'$1');
 const previousCredit=credit.match(/<details class="detail-photo-credit"><summary[^>]*>[\s\S]*?<\/summary><div>([\s\S]*)<\/div><\/details>/);if(previousCredit)credit=previousCredit[1];
 const links=[...credit.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].slice(0,2).map(m=>m[0]).join(' · ');
 return '<figure class="detail-slide" id="detail-photo-'+(index+1)+'">'+image+'<figcaption><div class="detail-credit-line">'+links+'</div><details class="detail-photo-credit"><summary>사진 '+(index+1)+' · 출처와 이용 조건</summary><div>'+credit+'</div></details></figcaption></figure>';
}
function gallery(nodes){
 const photos=[];
 for(const n of nodes){
  if(/^<figure/.test(n)){const img=n.match(/<img\b[^>]*>/)?.[0],credit=n.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/)?.[1];if(img)photos.push({img,credit:credit||''});}
  if(/class="place-photo-gallery"/.test(n))for(const m of n.matchAll(/<div>\s*(<img\b[^>]*>)\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g))photos.push({img:m[1],credit:m[2]});
 }
 if(!photos.length)return '<p class="detail-photo-empty">확인된 재사용 가능 사진이 아직 없습니다. 아래의 장소 정보로 방문을 준비해 주세요.</p>';
 return '<section class="detail-gallery" aria-label="장소 사진"><div class="detail-gallery-track" tabindex="0" aria-label="사진을 좌우로 넘겨 보세요">'+photos.map((p,i)=>photoFigure(p.img,p.credit,i)).join('')+'</div>'+(photos.length>1?'<div class="detail-gallery-controls"><span data-gallery-position aria-live="polite">1 / '+photos.length+'</span><div><button type="button" data-gallery-step="-1" aria-label="이전 사진" disabled>←</button><button type="button" data-gallery-step="1" aria-label="다음 사진">→</button></div></div>':'')+'</section>';
}

let routeRecords;
function routes(){if(!routeRecords){const s=readFileSync(new URL('../course-routes.js',import.meta.url),'utf8'),a=s.indexOf('const routes=')+13,b=s.indexOf(';',a);routeRecords=JSON.parse(s.slice(a,b));}return routeRecords;}
export function verifiedRoute(id,html){
 const r=routes()[id];if(!r||r.proposed||r.geometryProvider!=='두루누비 공식 GPX'||!r.geometryURL)return null;
 const links=[...html.matchAll(/href="([^"]+)"/g)].map(m=>text(m[1]));if(!links.includes(r.source))return null;
 const parts=r.parts||[r.path];if(!parts.length||parts.some(p=>!Array.isArray(p)||p.length<2||p.length>50000||p.some(v=>!Array.isArray(v)||v.length!==2||!Number.isFinite(v[0])||!Number.isFinite(v[1])||v[0]<32||v[0]>40||v[1]<123||v[1]>133)))return null;
 return {parts,source:r.geometryURL,provider:r.geometryProvider,segment:r.segment?.parent||null};
}

function courseSection(id,html,link){
 const r=verifiedRoute(id,html);
 return section('detail-route',r?'공식 GPX'+(r.segment?' 선택 구간':' 경로'):'산책 위치 안내',r?'<p class="detail-verification">'+(r.segment?esc(r.segment)+'의 일부 구간입니다. ':'')+'공식 GPX 자료 기준 · 현장 답사 확인과 다릅니다.</p><div class="detail-route-map" data-route-map><button class="detail-button" type="button" data-route-load>경로 지도 불러오기</button><p data-route-status role="status">필요할 때 지도를 불러옵니다.</p></div><script type="application/json" id="detail-route-data">'+JSON.stringify(r).replaceAll('<','\\u003c')+'</script><p class="detail-caption"><a href="'+esc(r.source)+'" target="_blank" rel="noopener noreferrer">'+esc(r.provider)+' 원문 ↗</a> · 출발 S / 도착 E. 단절된 구간은 연결하지 않습니다.</p>':'<p class="detail-caution"><strong>정확한 경로 미확인</strong><br>제안 경로 또는 장소 위치 안내입니다. 실제 걸을 수 있는 검증 경로로 표시하지 않습니다. 출입구·통제 구역은 운영기관에 확인해 주세요.</p><a class="detail-text-link" href="'+esc(link)+'">발자국 지도에서 등록 위치 확인 ↗</a>');
}

export function buildRelatedIndex(pages){
 const out=new Map();for(const [url,html] of pages){const title=html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1],photo=html.match(/<figure class="(?:place-photo|curated-course-photo|detail-slide)"[\s\S]*?<\/figure>/)?.[0],meta=text(html.match(/<p class="(?:meta|detail-kicker)">([\s\S]*?)<\/p>/)?.[1]);if(title)out.set(url,{name:text(title),meta,photo});}return out;
}
let sharedRelatedIndex;
export function setRelatedIndex(pages){sharedRelatedIndex=buildRelatedIndex(pages);}
function relatedCards(html,index){
 return html.replace(/(<section class="card"[^>]*>[\s\S]*?<ul>)([\s\S]*?)(<\/ul><\/section>)/g,(_,head,items,end)=>{
 if(/같은 지역에서 함께 보기|비슷한 장소 함께 보기/.test(head))return '<details class="detail-region-links"><summary>다른 장소도 둘러보기</summary><p>아래는 지역·분류별 탐색 링크이며 현재 장소와 가까운 추천 목록이 아닙니다.</p>'+head+items+end+'</details>';
 return head.replace('<section class="card"','<section class="card detail-related"')+items.replace(/<li>([\s\S]*?)<\/li>/g,(all,body)=>{
  const a=body.match(/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/);if(!a)return all;const p=index?.get(a[1]);
  let photo='';if(p?.photo){const img=p.photo.match(/<img\b[^>]*>/)?.[0]?.replace(/\sstyle="[^"]*"/g,'').replace(/loading="[^"]*"/,'loading="lazy"').replace(/src="([^"]+)"/,(_,src)=>'src="'+esc(detailPhotoURL(text(src)))+'"'),links=[...p.photo.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].slice(0,2).map(m=>m[0]).join(' · ');if(img)photo='<figure class="detail-nearby-thumb"><a href="'+esc(a[1])+'" tabindex="-1">'+img+'</a><figcaption>'+links+' · <a href="'+esc(a[1])+'#detail-photo-1">사진 정보</a></figcaption></figure>';}
  return '<li>'+photo+'<div class="detail-related-copy">'+a[0]+'<span>'+esc(p?.meta||'장소·산책 안내')+'</span><small>'+esc(text(body.replace(a[0],'')))+'</small></div></li>';
 })+end;});
}

export function editorialDetail(html,{relatedIndex=sharedRelatedIndex}={}){
 if(html.includes('data-detail-template="editorial-v2"'))return html;
 const canonical=html.match(/rel="canonical" href="https:\/\/balzaguk.com([^"?]+)"/)?.[1];
 const match=canonical?.match(/^\/(places|courses|bins|pet-care\/places)\/([^/]+)\/$/);if(!match)return html;
 const professional=match[1]==='pet-care/places';if(!professional&&!html.includes('<article class="card">'))return html;
 const category=text(html.match(/<p class="meta">([\s\S]*?)<\/p>/)?.[1]);
 const kind=professional?'professional':match[1]==='courses'?'course':match[1]==='bins'?'amenity':/숙소/.test(category)?'stay':/캠핑/.test(category)?'camping':/식당|카페/.test(category)?'dining':/공원|관광/.test(category)?'park':/쇼핑|용품/.test(category)?'retail':'place',cfg=config[kind];
 const article=html.match(/<article class="(?:card|care-detail)">([\s\S]*?)<\/article>/);if(!article)return html;
 if(professional)return professionalDetail(html,article);
 let nodes=fragments(article[1]),used=new Set();const take=predicate=>{const found=[];nodes.forEach((n,i)=>{if(!used.has(i)&&predicate(n)){found.push(n);used.add(i);}});return found;};
 const originalH1=take(n=>/^<h1\b/.test(n)).join(''),name=text(originalH1),h1=/^[-.\s]*$/.test(name)?'<h1>업소명 미확인</h1>':originalH1;
 const firstMeta=nodes.find(n=>/^<p class="(?:meta|care-kicker)"/.test(n));
 take(n=>/^<div class="icon"/.test(n)||n===firstMeta);
 const photoNodes=take(n=>/^<figure|class="place-photo-gallery"|class="place-photo-missing"/.test(n));
 const actionNodes=take(n=>/class="place-actions"|class="care-actions"/.test(n));
 const stateNodes=take(n=>/class="place-save-(?:note|status)"/.test(n));
 const booking=take(n=>/aria-label="트립닷컴 제휴 예약"/.test(n));
 const location=take(n=>/^<p><strong>(?:위치·분류|공원 대표 주소|출발 지점 주소|대표 위치 주소)/.test(n));
 const condition=take(n=>/^<section aria-label="반려견 동반 조건"/.test(n))[0]||'';
 const visit=take(n=>/class="place-visit-info"/.test(n))[0]||'';
 const comfort=take(n=>/class="comfort-detail"/.test(n));
 const critical=take(n=>/^<p/.test(n)&&/반려견 동반 확인 필요/.test(n));
 const careFacts=take(n=>/class="care-facts"/.test(n)).join('');
 const binFacts=kind==='amenity'?take(n=>/^<section class="note"/.test(n)).join(''):'';
 const careBack=take(n=>/class="care-back"/.test(n)).join('');
 const moreSources=take(n=>/class="place-(?:cultural-info|official-listing|official-notes)"/.test(n));
 take(n=>/^<h2>전체 이용 안내/.test(n));
 const rawDescription=take((n)=>/^<p>/.test(n)&&!/<a |<strong>/.test(n));
 take(n=>/id="share-detail"|id="share-status"/.test(n));
 const intro=[],pet=[],facilities=[],unknownLabels=[];
 for(const row of rows(condition)){
  if(unknown(row.value)){unknownLabels.push(row.label);continue;}
  if(/세부 출입|反려동물 이용|반려동물 이용/.test(row.label)){
   const parts=separateProse(row.value);if(parts.intro)intro.push(parts.intro);if(parts.rules)pet.push({...row,value:parts.rules});
  }else if(/시설|운영기간|운영일|예약방법|유형|대여|안전/.test(row.label))facilities.push(row);else pet.push(row);
 }
 const visiting=rows(visit).filter(r=>!unknown(r.value)),contact=pet.find(r=>/문의/.test(r.label));
 const petRows=pet.filter(r=>!/문의/.test(r.label));if(contact&&!visiting.some(r=>/문의|연락/.test(r.label)))visiting.unshift(contact);
 // Unavailable optional fields share one concise notice. No invented policies.
 const concepts={'체중·견종 기준':/견종|크기|체중/,'허용 구역':/허용 구역|허용구역/,'목줄·이동장 조건':/준비물|목줄|이동장/,'허용 객실·공용 공간':/객실|공용/,'허용 사이트·숙박 시설':/사이트|숙박/,'동반 마릿수':/마릿수|마리/,'추가요금':/요금|비용/,'출입 가능 구역':/구역/,'목줄·입마개 기준':/목줄|입마개/};
 const sizeUnknown=unknownLabels.some(label=>/견종|크기/.test(label));
 const missing=[...new Set([...unknownLabels,...cfg.missing.filter(label=>!petRows.some(r=>(concepts[label]||/a^/).test(r.label+' '+r.value)))].map(label=>/견종|크기/.test(label)?'견종·체중 기준':/체중/.test(label)?(sizeUnknown?'견종·체중 기준':'세부 체중 기준'):/준비물|목줄·이동장/.test(label)?'목줄·이동장 조건':label==='실내·객실 출입'&&kind==='stay'?'허용 객실·공용 공간':label).filter(label=>kind!=='park'||label!=='실내·객실 출입'))];
 const conditionExtras=condition?fragments(inside(condition)).filter(n=>!/^<h3|^<dl/.test(n)):[];
 const cautions=conditionExtras.filter(n=>/role="note"/.test(n));
 const sources=conditionExtras.filter(n=>!cautions.includes(n));
 const provenance=visit?fragments(inside(visit)).filter(n=>!/^<summary|^<dl/.test(n)):[];
 const geo=(()=>{for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{let a=JSON.parse(m[1]);const items=Array.isArray(a)?a:a['@graph']||[a];const p=items.find(v=>v.geo);if(p)return p.geo;}catch{}}return null;})();
 const address=text(location[0]?.replace(/^<p><strong>[\s\S]*?<\/strong><br>/,'').replace(/<\/p>$/,''))||rows(careFacts).find(r=>r.label==='주소')?.value||'';
 const mapLink=actionNodes.join('').match(/href="([^"]+)"/)?.[1]||('https://balzaguk.com/#map'+(kind==='course'?'&course='+encodeURIComponent(match[2]):''));
 const directions=geo&&Number.isFinite(Number(geo.latitude))&&Number.isFinite(Number(geo.longitude))?'<a class="detail-button detail-directions" href="https://map.kakao.com/link/to/'+encodeURIComponent(name)+','+Number(geo.latitude)+','+Number(geo.longitude)+'" target="_blank" rel="noopener noreferrer">길찾기 ↗</a>':'';
 const phone=visiting.find(r=>/문의|연락|전화/.test(r.label))?.value.match(/(?:\+82[-\s]?)?0?\d{1,3}[-\s]\d{3,4}[-\s]\d{4}/)?.[0];
 const call=phone&&!professional?'<a class="detail-button" href="tel:'+phone.replace(/[^0-9+]/g,'')+'">전화 문의</a>':'';
 const toolbar=actionNodes.length?actionNodes.join(''):'<div class="place-actions"><a class="place-action place-map" href="'+esc(mapLink)+'">발자국 지도에서 보기 ↗</a></div>';
 let content='',routeHero='';
 if(professional){
  const vet=/동물병원/.test(text(firstMeta));
  content=section('detail-conditions',cfg.conditions,careFacts)+section('detail-visit',cfg.visit,'<p>'+(vet?'진료 대상·제공 서비스·예약 가능 여부와 운영시간은 업소에 직접 확인해 주세요. 공공 인허가 등록은 당일 영업이나 응급진료를 보장하지 않습니다.':'제공 서비스·예약·이용 조건과 운영시간은 업소에 직접 확인해 주세요. 공공 인허가 등록은 당일 영업을 보장하지 않습니다.')+'</p>');
 }else if(kind==='amenity'){
  content=section('detail-conditions',cfg.conditions,binFacts)+section('detail-visit',cfg.visit,location.join('')+'<p>설치 자료의 좌표입니다. 실제 입구·시설 작동·수거 상태는 현장에서 확인해 주세요.</p>');
 }else if(kind==='course'){
  const metrics=nodes.filter((n,i)=>!used.has(i)&&/^<p class="meta"/.test(n));
  routeHero='<div class="detail-course-hero">'+courseSection(match[2],html,text(mapLink))+courseMetrics(metrics,verifiedRoute(match[2],html))+'</div>';
  content=section('detail-conditions','걸음에 맞는 길인지 살펴보세요',comfort.join(''));
 }else{
  content=petPresentation(kind,petRows,visiting,facilities,cautions.join(''),missing,booking.join(''));
 }
 const description=rawDescription.join('');
 const editorialIntro=kind==='course'&&description?section('detail-about','코스 소개',description):intro.length?section('detail-about',kind==='dining'?'이 공간의 이야기':'장소 소개',intro.map(s=>'<p>'+esc(s)+'</p>').join('')):'';
 const original=description&&kind!=='course'?'<details class="detail-original"><summary>등록 안내 원문</summary><div>'+description+'</div></details>':'';
 const remaining=nodes.filter((n,i)=>!used.has(i)&&!/^<p class="meta"/.test(n)).join('');
 const sourceNotes=sources.join('')+provenance.join('')+remaining;
 const uniqueLinks=new Map();for(const m of sourceNotes.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/g))if(!uniqueLinks.has(m[1]))uniqueLinks.set(m[1],m[0]);
 const dates=[...new Set(text(sourceNotes).match(/\d{4}-\d{2}-\d{2}/g)||[])];
 const sourceSection=section('detail-sources','자료와 방문 전 확인','<p class="detail-caption">'+(dates.length?'자료에 표시된 날짜 '+dates.join(' · ')+'. ':'')+'자료 확인일은 현장 방문일이나 운영정책 갱신일과 다릅니다. 허용 구역·요금·운영은 방문 전에 다시 확인해 주세요.</p><div class="detail-source-links">'+[...uniqueLinks.values()].join(' ')+'</div>'+moreSources.join('')+original+'<details class="detail-source-notes"><summary>출처별 확인 기록과 주의사항</summary><div>'+sourceNotes+'</div></details>');
 const links=professional?careBack:'<a class="detail-back" data-detail-back href="'+(kind==='course'?'/discover.html?kind=courses#find-place':'/discover.html?kind=facilities#find-place')+'">← 목록으로</a>';
 const tabs='<nav class="detail-sections" aria-label="상세 정보 바로가기">'+(kind==='course'?'<a href="#detail-route">산책 경로</a>':'')+'<a href="#detail-conditions">'+(kind==='course'?'코스 정보':professional?'등록 정보':'동반 조건')+'</a>'+(kind==='course'?'':'<a href="#detail-visit">방문 준비</a>')+'<a href="#detail-sources">출처·주의사항</a></nav>';
 const addressLabel=kind==='course'?text(location[0]?.match(/<strong>([\s\S]*?)<\/strong>/)?.[1]):'';
 let next=links+'<header class="detail-heading"><p class="detail-kicker">'+esc(cfg.label)+'</p>'+h1+(address?'<p class="detail-address">'+(addressLabel?'<span>'+esc(addressLabel)+'</span><br>':'')+esc(address)+'</p>':'')+'</header>'+routeHero+gallery(photoNodes)+'<div class="detail-toolbar">'+toolbar+directions+call+'<button type="button" class="detail-button" data-detail-share>공유</button>'+(address?'<button type="button" class="detail-button" data-copy-address="'+esc(address)+'">주소 복사</button>':'')+'</div><p class="detail-action-status" data-detail-status role="status" aria-live="polite"></p>'+stateNodes.join('')+tabs+'<div class="detail-content">'+(critical.length?'<div class="detail-critical">'+critical.join('')+'</div>':'')+editorialIntro+content+sourceSection+'</div>';
 html=html.replace(article[0],'<article class="detail-article" data-detail-template="editorial-v2" data-detail-kind="'+kind+'">'+next+'</article>');
 html=html.replace(/<body([^>]*)>/,(all,attrs)=>attrs.includes('class="')?'<body'+attrs.replace('class="','class="editorial-detail ') +'>':'<body class="editorial-detail"'+attrs+'>');
 html=html.replace('</head>','<link rel="stylesheet" href="/detail-editorial.css?v='+DETAIL_VERSION+'"></head>');
 if(!professional&&!html.includes('class="place-site-header"'))html=html.replace(/<a class="brand"[^>]*>[\s\S]*?<\/a>/,brand=>'<header class="place-site-header">'+brand+'<a class="place-back" href="/discover.html">장소·산책 둘러보기 ↗</a></header>');
 if(!html.includes('photo-display.js?'))html=html.replace('</body>','<script defer src="/photo-display.js?v=20261018-r2"></script></body>');
 if(!professional){
  const directory=html.match(/<nav aria-label="관련 장소 목록"[^>]*>[\s\S]*?<\/nav>/)?.[0];
  if(directory&&!html.includes('class="place-directory"'))html=html.replace(directory,'').replace('</main>','<details class="place-directory"><summary>지역·분류별 장소 더 보기</summary>'+directory+'</details></main>');
 }
 html=html.replace('</body>','<script defer src="/detail-editorial.js?v='+DETAIL_VERSION+'"></script></body>');
 html=html.replace(/<script>\s*\(function\(\)\{\s*var button=document\.getElementById\('share-detail'\)[\s\S]*?<\/script>/,'');
 html=relatedCards(html,relatedIndex);
 return html;
}
