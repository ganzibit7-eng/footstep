(function(root){
  'use strict';
  var categories=['공원관광','쇼핑','숙소','식당카페','캠핑'];
  var textIndex=new WeakMap();
  function searchable(item){
    var prior=textIndex.get(item);
    if(prior&&prior.name===item.name&&prior.region===item.region&&prior.info===item.info&&prior.conditions===item.conditions)return prior.text;
    var value={name:item.name,region:item.region,info:item.info,conditions:item.conditions,text:[item.name,item.region,item.info,item.conditions].join(' ').toLocaleLowerCase('ko')};textIndex.set(item,value);return value.text;
  }
  function category(item){return item.kind==='facilities'?(item.info||'').split(' · ').pop():'';}
  function companionKnown(item){
    return item.kind==='facilities'&&Array.isArray(item.facts)&&item.facts.some(function(r){
      return /견종|크기|체중|허용 구역|동반 구역|준비물|목줄|이동장/.test(r.label||'')&&!/미확인|미확정|문의|상세 확인|확인 필요|재확인|고캠핑 공식|공식 허용|공식 소개|공식 관광 소개/.test(r.value||'')&&String(r.value||'').trim().length>0;
    });
  }
  // Only link to an actually generated collection with eligible local records.
  // This is a regional/category collection, not a claim to match the query word.
  function curationDestination(scopes,state){
    if(state.kind&&state.kind!=='facilities'||!Array.isArray(scopes))return null;
    return scopes.find(r=>r.region===(state.region||'')&&r.category===(state.category||'')&&/^\/places\/(?:regions\/[a-z-]+\/(?:[a-z-]+\/)?|[a-z-]+\/)$/.test(r.path||''))||null;
  }
  function filter(data,state){
    var words=(state.q||'').trim().toLocaleLowerCase('ko').split(/\s+/).filter(Boolean);
    return data.filter(function(item){
      var text=searchable(item);
      return (!state.kind||item.kind===state.kind)&&(!state.region||item.region===state.region)&&(!state.category||category(item)===state.category)&&(!state.pet||companionKnown(item))&&words.every(function(word){return text.includes(word);});
    });
  }
  function ordered(data,sort){
    if(sort==='conditions')return data.slice().sort(function(a,b){return Number(companionKnown(b))-Number(companionKnown(a))||Number(!!b.photo)-Number(!!a.photo);});
    if(sort==='name')return data.slice().sort(function(a,b){return a.name.localeCompare(b.name,'ko');});
    if(sort==='photos')return data.slice().sort(function(a,b){return Number(!!b.photo)-Number(!!a.photo);});
    return data;
  }
  function conditionRows(text){
    var raw=String(text||'동반 구역·크기 제한·준비물은 상세에서 확인하세요. 자료에 없는 조건은 미확인입니다.');
    var split=raw.indexOf(' · 준비물:');
    return split<0?[['동반 조건',raw]]:[['동반 조건',raw.slice(0,split)],['준비물',raw.slice(split+' · 준비물:'.length).trim()]];
  }
  // Keep the full public index out of first paint. One pending request is shared
  // across rapid filter changes; failed attempts can be explicitly retried.
  function createDataSource(initial,fetcher,options){
    if(initial?.version===2)return partitionedSource(initial,fetcher,options);
    options=options||{};var loaded=Array.isArray(initial)?initial:null,pending=null,failed=false;
    var valid=initial&&initial.version===1&&/^\/assets\/search-data\/(?:discover(?:\.json\?v=[a-f0-9]{16}|-[a-f0-9]{16}\.json)|part-[a-f0-9]{16}\.json)$/.test(initial.src)&&Number.isSafeInteger(initial.count)&&initial.count>0;
    return {regions:loaded?Array.from(new Set(loaded.map(function(r){return r.region;}).filter(Boolean))):Array.isArray(initial?.regions)?initial.regions:[],count:loaded?loaded.length:valid?initial.count:0,peek:function(){return loaded;},load:function(){
      if(loaded)return Promise.resolve(loaded);if(pending)return pending;
      if(!valid||typeof fetcher!=='function')return Promise.reject(new Error('Search index unavailable'));
      var controller=typeof AbortController==='function'?new AbortController():null,timer;
      var timeout=new Promise(function(_,reject){timer=setTimeout(function(){controller?.abort();reject(new Error('Search index timeout'));},options.timeoutMs||15000);});
      var request=Promise.resolve().then(function(){return fetcher(initial.src,{credentials:'omit',referrerPolicy:'no-referrer',cache:failed?'reload':'force-cache',...(controller?{signal:controller.signal}:{})});}).then(function(response){if(!response.ok)throw new Error('Search index response');return response.json();}).then(function(rows){
        if(!Array.isArray(rows)||rows.length!==initial.count||!rows.every(function(r){return r&&typeof r.name==='string'&&typeof r.path==='string'&&/^\/(?:places|courses|bins)\/[^?#]+\/$/.test(r.path)&&['facilities','courses','bins'].includes(r.kind);}))throw new Error('Search index format');return rows;
      });
      pending=Promise.race([request,timeout]).then(function(rows){loaded=rows;return rows;}).catch(function(error){failed=true;throw error;}).finally(function(){clearTimeout(timer);pending=null;});return pending;
    }};
  }
  function partitionedSource(manifest,fetcher,options){
    var parts=manifest.parts,indices=new Map(),loaders=new Map(),attempted=false,merged=null,fullPending=null;
    var valid=Array.isArray(parts)&&parts.length>0&&parts.every(p=>['facilities','courses','bins'].includes(p.kind)&&Number.isSafeInteger(p.count)&&p.count>0&&/^\/assets\/search-data\/part-[a-f0-9]{16}\.json$/.test(p.src))&&parts.reduce((n,p)=>n+p.count,0)===manifest.count&&new Set(parts.map(p=>p.src)).size===parts.length;
    if(!valid)return createDataSource({version:0},fetcher,options);
    var full=createDataSource({...manifest,version:1},fetcher,options);
    function selected(s){s=s||{};var a=parts.filter(p=>(!s.kind||p.kind===s.kind)&&(!s.category||p.kind==='facilities'&&p.category===s.category));return a.length===1?a[0]:null;}
    function part(p){if(!loaders.has(p.src))loaders.set(p.src,createDataSource({...p,version:1},async(url,settings)=>{
      var response=await fetcher(url,settings);return {ok:response.ok,json:async()=>{var body=await response.json();if(!body||!Array.isArray(body.indices)||!Array.isArray(body.rows)||body.indices.length!==p.count||body.rows.length!==p.count||new Set(body.indices).size!==p.count||body.indices.some(i=>!Number.isSafeInteger(i)||i<0||i>=manifest.count))throw Error('Search partition format');indices.set(p.src,body.indices);return body.rows;}};
    },options));return loaders.get(p.src);}
    function join(){var rows=new Array(manifest.count),seen=0;for(var p of parts){var data=part(p).peek();if(!data)return null;data.forEach((r,i)=>{var index=indices.get(p.src)[i];if(rows[index])throw Error('Duplicate search partition');rows[index]=r;seen++;});}if(seen!==manifest.count||rows.some(r=>!r))throw Error('Incomplete search partition');return rows;}
    return {count:manifest.count,regions:manifest.regions,peek:function(s){return full.peek()||merged||(selected(s)?part(selected(s)).peek():null);},load:function(s){
      if(full.peek()||merged)return Promise.resolve(full.peek()||merged);if(fullPending)return fullPending;
      var p=selected(s);if(p){attempted=true;return part(p).load();}
      if(!attempted){fullPending=full.load().finally(()=>{fullPending=null;});return fullPending;}
      return Promise.all(parts.map(p=>part(p).load())).then(()=>merged=join());
    }};
  }
  if(typeof module==='object'&&module.exports){module.exports={filter:filter,category:category,ordered:ordered,conditionRows:conditionRows,createDataSource:createDataSource,companionKnown:companionKnown,curationDestination:curationDestination};return;}
  var source=createDataSource(JSON.parse(document.getElementById('place-data').textContent),root.fetch?.bind(root)),data=source.peek(),ticket=0,form=document.getElementById('place-search'),query=document.getElementById('place-query'),kind=document.getElementById('place-kind'),region=document.getElementById('place-region'),type=document.getElementById('place-category'),list=document.getElementById('place-results'),count=document.getElementById('place-count'),more=document.getElementById('place-more'),limit=20,matches=[];
  source.regions.slice().sort(function(a,b){return a.localeCompare(b,'ko');}).forEach(function(name){var option=document.createElement('option');option.value=name;option.textContent=name;region.append(option);});
  var sort=document.getElementById('place-sort'),title=document.getElementById('discovery-title'),pet=document.getElementById('place-pet-known');
  var curatedEntry=document.getElementById('place-curation-entry'),curatedScopes=[];
  try{curatedScopes=JSON.parse(document.getElementById('place-curation-scopes')?.textContent||'[]');}catch(_){}
  function collectionEntry(value){
    if(!curatedEntry)return;curatedEntry.replaceChildren();curatedEntry.hidden=true;
    var destination=matches.length?curationDestination(curatedScopes,value):null;if(!destination)return;
    var link=document.createElement('a');link.href=destination.path+'#prepared-places';link.textContent=[value.region,value.category?type.options[type.selectedIndex].textContent:''].filter(Boolean).join(' · ')+' 사진·동반 조건 자료 모아보기 ↗';curatedEntry.append(link);curatedEntry.hidden=false;
  }
  var options=document.getElementById('place-filter-options'),selection=document.getElementById('place-filter-selection');
  // Native history still owns navigation. Restore only a back/forward document
  // whose asynchronous result list was not present when native scroll ran.
  var returnPosition=null;
  try{if(root.performance?.getEntriesByType('navigation')[0]?.type==='back_forward'){var saved=JSON.parse(root.sessionStorage.getItem('paw-directory-return')||'null');if(saved&&saved.url===root.location.href&&Number.isFinite(saved.y)&&saved.y>=0)returnPosition=saved.y;}}catch(_){}
  root.addEventListener?.('pagehide',function(){try{root.sessionStorage.setItem('paw-directory-return',JSON.stringify({url:root.location.href,y:root.scrollY}));}catch(_){}});
  ['pointerdown','wheel','keydown'].forEach(function(name){root.addEventListener?.(name,function(){returnPosition=null;},{passive:true,once:true});});
  function restorePosition(){if(returnPosition===null)return;var y=returnPosition;returnPosition=null;root.requestAnimationFrame?.(function(){root.scrollTo({top:y,behavior:'instant'});});}
  // Collapse only on first mobile entry. Later searches never close a user's open controls.
  if(options&&root.matchMedia?.('(max-width:600px)').matches)options.open=false;
  function state(){return {q:query.value.trim().slice(0,100),kind:kind.value,region:region.value,category:type.value,...(pet?.checked?{pet:'known'}:{})};}
  function remember(){
    var url=new URL(root.location.href),value=state();
    ['q','kind','region','category','pet'].forEach(function(key){if(value[key])url.searchParams.set(key,value[key]);else url.searchParams.delete(key);});
    if(sort&&sort.value!=='photos')url.searchParams.set('sort',sort.value);else url.searchParams.delete('sort');
    if(limit>20)url.searchParams.set('shown',String(limit));else url.searchParams.delete('shown');
    root.history.replaceState(root.history.state,'',url.pathname+url.search+url.hash);
  }
  function render(append){
    var start=append?list.children.length:0;
    if(!append)list.replaceChildren();
    matches.slice(start,limit).forEach(function(item,index){
      var li=document.createElement('li'),a=document.createElement('a'),p=document.createElement('p'),location=document.createElement('p'),media=document.createElement('div'),heading=document.createElement('h2'),context=document.createElement('div'),note=document.createElement('dl'),credits=document.createElement('div'),cta=document.createElement('a');
      li.className='directory-card premium-place-card';li.setAttribute('data-card-template','premium5');li.setAttribute('data-card-revision','quality6');li.setAttribute('data-card-source',item.path);
      var label=category(item).replace('식당카페','식당·카페').replace('공원관광','공원·관광')||(item.kind==='courses'?'산책코스':'편의시설');
      media.className='premium-card-media';
      if(item.photo){
        var img=document.createElement('img'),photoLink=document.createElement('a');photoLink.href=item.path;photoLink.tabIndex=-1;img.referrerPolicy='no-referrer';img.src=item.photo.src;img.alt=(item.photo.place||item.name)+' 사진';img.width=item.photo.width;img.height=item.photo.height;img.loading='lazy';img.decoding='async';root.CardMedia?.mark(img,item.photo);photoLink.append(img);media.append(photoLink);
        var author=document.createElement('a'),license=document.createElement('a');author.href=item.photo.source;author.target='_blank';author.rel='noopener noreferrer';author.textContent='사진: '+(root.CardMedia?root.CardMedia.author(item.photo):item.photo.author);license.href=item.photo.licenseUrl;license.target='_blank';license.rel='noopener noreferrer';license.textContent='이용 조건 · '+(item.photo.license||'라이선스');
        var line=document.createElement('div'),details=document.createElement('details'),summary=document.createElement('summary'),full=document.createElement('div');line.className='premium-credit-line';line.append(author,document.createTextNode(' · '),license);summary.textContent='사진 정보';
        full.textContent=[root.CardMedia&&root.CardMedia.author(item.photo)!==item.photo.author?'제공·촬영: '+item.photo.author:'',item.photo.place?'사진 안내: '+item.photo.place:'',item.photo.licenseScope,item.photo.caption,item.photo.checked?'사진 자료 확인 '+item.photo.checked:'',item.photo.dateNote||(item.photo.date?'촬영일 '+item.photo.date:'촬영일 자료 미확인'),item.photo.changes,item.photo.deliveryNote,root.CardMedia?.fit(item.photo)==='cover'&&!/가장자리.{0,12}잘림/.test(item.photo.changes||'')?root.CardMedia.cropNote:'','현재 모습·출입 허용 구역을 보장하지 않습니다.'].filter(Boolean).join(' · ');details.append(summary,full);credits.append(line,details);
      }else if(root.CardMedia){media.className+=' is-missing';media.innerHTML=root.CardMedia.placeholder(label);}
      else{var absent=document.createElement('p');absent.textContent=label+' · 사진 미등록';media.append(absent);}
      location.className='premium-card-meta';location.textContent=[item.region,label].filter(Boolean).join(' · ');
      a.href=item.path;a.textContent=item.name;a.className='directory-name';heading.className='premium-card-title';heading.append(a);
      context.className='premium-card-context';p.className='directory-address';p.textContent=item.kind==='facilities'?(item.info||'').split(' · ').slice(0,-1).join(' · '):item.kind==='courses'?(item.info||'').split(' · ')[0]:item.info||'';p.title=p.textContent;var area=p.textContent.split(/\s+/).slice(0,2).join(' ');if(root.CardMedia)p.textContent=root.CardMedia.address(p.textContent,area,item.name);if(area)location.textContent=area+' · '+label;heading.setAttribute('title',item.name);context.append(p);
      note.className='premium-card-facts';
      if(item.kind==='facilities'||item.kind==='courses'){
        (Array.isArray(item.facts)?item.facts:root.PlacePresentation?root.PlacePresentation.cardSummary(conditionRows(item.conditions).map(function(r){return {label:r[0],value:r[1]};})):conditionRows(item.conditions).map(function(r){return {label:r[0],value:r[1].length<=86?r[1]:'세부 조건은 상세 안내에서 확인해 주세요.'};})).forEach(function(row){var group=document.createElement('div'),term=document.createElement('dt'),value=document.createElement('dd');if(root.CardMedia?.factNote(row))group.className='card-fact-note';term.textContent=row.label;value.textContent=row.value;group.append(term,value);note.append(group);});
      }
      credits.className='premium-card-credits';if(!item.photo)credits.setAttribute('aria-hidden','true');
      cta.className='premium-card-cta';cta.href=item.path;var ctaLabel=document.createElement('span'),arrow=document.createElement('span');ctaLabel.textContent='자세히 보기';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');cta.append(ctaLabel,arrow);
      li.append(media,location,heading,context,note,credits,cta);
      list.append(li);
    });
    count.textContent=matches.length?'등록 정보 '+matches.length.toLocaleString('ko-KR')+'곳 중 '+Math.min(limit,matches.length).toLocaleString('ko-KR')+'곳 표시':'일치하는 등록 정보가 없습니다. 지역·업종 선택을 바꾸거나 검색어를 짧게 입력하세요.';
    more.hidden=limit>=matches.length;
    if(!matches.length){var empty=document.createElement('li'),heading=document.createElement('strong'),help=document.createElement('p'),reset=document.createElement('button');empty.className='directory-empty';heading.textContent='조건에 맞는 곳을 찾지 못했어요';help.textContent='지역이나 업종을 바꾸거나, 장소 이름을 짧게 입력해 보세요.';reset.type='button';reset.textContent='검색 조건 초기화';reset.onclick=function(){document.getElementById('place-clear').click();};empty.append(heading,help,reset);list.append(empty);}
    if(append){var next=list.children[start]?.querySelector('.directory-name');if(next){next.focus({preventScroll:true});next.scrollIntoView({block:'nearest',behavior:'instant'});}}
    else restorePosition();

  }
  var summary=document.getElementById('place-active-filters');if(!summary){summary=document.createElement('p');summary.id='place-active-filters';summary.className='directory-active-filters';count.parentElement.after(summary);}
  function search(preserve){
    var current=++ticket;
    if(curatedEntry)curatedEntry.hidden=true;
    type.disabled=kind.value!==''&&kind.value!=='facilities';
    if(type.disabled)type.value='';
    if(pet){pet.disabled=type.disabled;if(pet.disabled)pet.checked=false;}
    var conditionSort=sort?.querySelector?.('option[value="conditions"]');if(conditionSort)conditionSort.disabled=type.disabled;
    if(type.disabled&&sort?.value==='conditions')sort.value='photos';
    var value=state();if(!preserve)limit=20;
    var selected=[value.q?'“'+value.q+'”':'',value.region,value.category?type.options[type.selectedIndex].textContent:value.kind?kind.options[kind.selectedIndex].textContent:'',value.pet?'세부 동반 조건 있음':''].filter(Boolean);
    if(selection)selection.textContent=[value.region,value.category?type.options[type.selectedIndex].textContent:value.kind?kind.options[kind.selectedIndex].textContent:''].filter(Boolean).join(' · ')||'전체';
    summary.textContent=selected.join(' · ');summary.hidden=!selected.length;
    if(title)title.textContent=value.category==='숙소'?'함께 머무는 숙소':value.category==='식당카페'?'산책 후, 식당과 카페':value.kind==='courses'?'다음 산책길을 찾아요':'반려견과 함께 갈 곳';
    if(!value.q&&!value.kind&&!value.region&&!value.category&&!value.pet){document.documentElement?.removeAttribute('data-directory-requested');matches=[];list.setAttribute('aria-busy','false');list.replaceChildren();count.textContent='지역·업종을 선택하거나 장소 이름을 입력하세요.';more.hidden=true;remember();return;}
    document.documentElement?.setAttribute('data-directory-requested','');
    remember();
    data=source.peek(value);
    if(!data){
      list.setAttribute('aria-busy','true');list.replaceChildren();more.hidden=true;count.textContent='등록된 장소·코스 정보를 불러오고 있어요.';
      source.load(value).then(function(rows){data=rows;if(current===ticket){list.setAttribute('aria-busy','false');search(true);}}).catch(function(){
        if(current!==ticket)return;list.setAttribute('aria-busy','false');count.textContent='장소 정보를 불러오지 못했습니다. 연결을 확인하고 다시 시도해 주세요.';
        var empty=document.createElement('li'),heading=document.createElement('strong'),help=document.createElement('p'),retry=document.createElement('button');empty.className='directory-empty';heading.textContent='잠시 연결이 원활하지 않아요';help.textContent='검색 조건은 유지됩니다. 다시 불러오거나 아래 지역별 안내를 이용해 주세요.';retry.type='button';retry.textContent='다시 불러오기';retry.onclick=function(){search(true);};empty.append(heading,help,retry);list.replaceChildren(empty);
      });return;
    }
    matches=ordered(filter(data,value),sort?.value);collectionEntry(value);render();remember();
  }
  form.addEventListener('submit',function(event){event.preventDefault();search(false);});
  kind.addEventListener('change',function(){search(false);});region.addEventListener('change',function(){search(false);});
  type.addEventListener('change',function(){if(type.value)kind.value='facilities';search(false);});
  sort?.addEventListener('change',function(){search(false);});
  pet?.addEventListener('change',function(){if(pet.checked)kind.value='facilities';search(false);});
  document.getElementById('place-clear').addEventListener('click',function(){query.value='';kind.value='';region.value='';type.value='';if(pet)pet.checked=false;if(sort)sort.value='photos';search(false);query.focus();});
  more.addEventListener('click',function(){limit+=20;render(true);remember();});
  var params=new URLSearchParams(root.location.search);query.value=(params.get('q')||'').slice(0,100);
  if(['courses','facilities','bins'].includes(params.get('kind')))kind.value=params.get('kind');
  if(Array.from(region.options).some(function(option){return option.value===params.get('region');}))region.value=params.get('region');
  if(categories.includes(params.get('category'))){type.value=params.get('category');kind.value='facilities';}
  if(sort&&['registered','name','conditions'].includes(params.get('sort')))sort.value=params.get('sort');
  if(pet&&params.get('pet')==='known'&&(!kind.value||kind.value==='facilities')){pet.checked=true;kind.value='facilities';}
  var shown=Number(params.get('shown'));if(Number.isSafeInteger(shown)&&shown>=20&&shown<=source.count)limit=Math.ceil(shown/20)*20;
  search(true);
})(typeof window==='undefined'?globalThis:window);
