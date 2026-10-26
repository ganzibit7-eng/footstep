(function(root){
  'use strict';
  var categories=['공원관광','쇼핑','숙소','식당카페','캠핑'];
  function category(item){return item.kind==='facilities'?(item.info||'').split(' · ').pop():'';}
  function filter(data,state){
    var words=(state.q||'').trim().toLocaleLowerCase('ko').split(/\s+/).filter(Boolean);
    return data.filter(function(item){
      var text=[item.name,item.region,item.info,item.conditions].join(' ').toLocaleLowerCase('ko');
      return (!state.kind||item.kind===state.kind)&&(!state.region||item.region===state.region)&&(!state.category||category(item)===state.category)&&words.every(function(word){return text.includes(word);});
    });
  }
  function ordered(data,sort){
    if(sort==='name')return data.slice().sort(function(a,b){return a.name.localeCompare(b.name,'ko');});
    if(sort==='photos')return data.slice().sort(function(a,b){return Number(!!b.photo)-Number(!!a.photo);});
    return data;
  }
  function conditionRows(text){
    var raw=String(text||'동반 구역·크기 제한·준비물은 상세에서 확인하세요. 자료에 없는 조건은 미확인입니다.');
    var split=raw.indexOf(' · 준비물:');
    return split<0?[['동반 조건',raw]]:[['동반 조건',raw.slice(0,split)],['준비물',raw.slice(split+' · 준비물:'.length).trim()]];
  }
  if(typeof module==='object'&&module.exports){module.exports={filter:filter,category:category,ordered:ordered,conditionRows:conditionRows};return;}
  var data=JSON.parse(document.getElementById('place-data').textContent),form=document.getElementById('place-search'),query=document.getElementById('place-query'),kind=document.getElementById('place-kind'),region=document.getElementById('place-region'),type=document.getElementById('place-category'),list=document.getElementById('place-results'),count=document.getElementById('place-count'),more=document.getElementById('place-more'),limit=20,matches=[];
  Array.from(new Set(data.map(function(item){return item.region;}).filter(Boolean))).sort(function(a,b){return a.localeCompare(b,'ko');}).forEach(function(name){var option=document.createElement('option');option.value=name;option.textContent=name;region.append(option);});
  var sort=document.getElementById('place-sort'),title=document.getElementById('discovery-title');
  var options=document.getElementById('place-filter-options'),selection=document.getElementById('place-filter-selection');
  // Collapse only on first mobile entry. Later searches never close a user's open controls.
  if(options&&root.matchMedia?.('(max-width:600px)').matches)options.open=false;
  function state(){return {q:query.value.trim().slice(0,100),kind:kind.value,region:region.value,category:type.value};}
  function remember(){
    var url=new URL(root.location.href),value=state();
    ['q','kind','region','category'].forEach(function(key){if(value[key])url.searchParams.set(key,value[key]);else url.searchParams.delete(key);});
    if(sort&&sort.value!=='photos')url.searchParams.set('sort',sort.value);else url.searchParams.delete('sort');
    if(limit>20)url.searchParams.set('shown',String(limit));else url.searchParams.delete('shown');
    root.history.replaceState(root.history.state,'',url.pathname+url.search+url.hash);
  }
  function render(append){
    var start=append?list.children.length:0;
    if(!append)list.replaceChildren();
    matches.slice(start,limit).forEach(function(item,index){
      var li=document.createElement('li'),a=document.createElement('a'),p=document.createElement('p'),location=document.createElement('p'),media=document.createElement('div'),heading=document.createElement('h2'),context=document.createElement('div'),note=document.createElement('dl'),credits=document.createElement('div'),cta=document.createElement('a');
      li.className='directory-card premium-place-card';li.setAttribute('data-card-template','premium5');li.setAttribute('data-card-source',item.path);
      var label=category(item).replace('식당카페','식당·카페').replace('공원관광','공원·관광')||(item.kind==='courses'?'산책코스':'편의시설');
      media.className='premium-card-media';
      if(item.photo){
        var img=document.createElement('img'),photoLink=document.createElement('a');photoLink.href=item.path;photoLink.tabIndex=-1;img.referrerPolicy='no-referrer';img.src=item.photo.src;img.alt=(item.photo.place||item.name)+' 사진';img.width=item.photo.width;img.height=item.photo.height;img.loading='lazy';img.decoding='async';root.CardMedia?.mark(img,item.photo);photoLink.append(img);media.append(photoLink);
        var author=document.createElement('a'),license=document.createElement('a');author.href=item.photo.source;author.target='_blank';author.rel='noopener noreferrer';author.textContent='사진: '+item.photo.author;license.href=item.photo.licenseUrl;license.target='_blank';license.rel='noopener noreferrer';license.textContent='이용 조건 · '+(item.photo.license||'라이선스');
        var line=document.createElement('div'),details=document.createElement('details'),summary=document.createElement('summary'),full=document.createElement('div');line.className='premium-credit-line';line.append(author,document.createTextNode(' · '),license);summary.textContent='사진 정보 · '+(root.CardMedia?.fit(item.photo)==='cover'?'프레임 표시':'전체 비율 유지');
        full.textContent=[item.photo.place?'사진 안내: '+item.photo.place:'',item.photo.licenseScope,item.photo.caption,item.photo.checked?'사진 자료 확인 '+item.photo.checked:'',item.photo.dateNote||(item.photo.date?'촬영일 '+item.photo.date:'촬영일 자료 미확인'),item.photo.changes,item.photo.deliveryNote,root.CardMedia?.fit(item.photo)==='cover'?root.CardMedia.cropNote:'','현재 모습·출입 허용 구역을 보장하지 않습니다.'].filter(Boolean).join(' · ');details.append(summary,full);credits.append(line,details);
      }else if(root.CardMedia)media.innerHTML=root.CardMedia.placeholder(label);
      else{var absent=document.createElement('p');absent.textContent=label+' · 사진 미등록';media.append(absent);}
      location.className='premium-card-meta';location.textContent=[item.region,label].filter(Boolean).join(' · ');
      a.href=item.path;a.textContent=item.name;a.className='directory-name';heading.className='premium-card-title';heading.append(a);
      context.className='premium-card-context';p.className='directory-address';p.textContent=item.kind==='facilities'?(item.info||'').split(' · ').slice(0,-1).join(' · '):item.kind==='courses'?(item.info||'').split(' · ')[0]:item.info||'';context.append(p);
      note.className='premium-card-facts';
      if(item.kind==='facilities'||item.kind==='courses'){
        (Array.isArray(item.facts)?item.facts:root.PlacePresentation?root.PlacePresentation.summary(conditionRows(item.conditions).map(function(r){return {label:r[0],value:r[1]};})):conditionRows(item.conditions).map(function(r){return {label:r[0],value:r[1].length<=86?r[1]:'세부 조건은 상세 안내에서 확인해 주세요.'};})).forEach(function(row){var group=document.createElement('div'),term=document.createElement('dt'),value=document.createElement('dd');term.textContent=row.label;value.textContent=row.value;group.append(term,value);note.append(group);});
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

  }
  var summary=document.createElement('p');summary.id='place-active-filters';summary.className='directory-active-filters';count.parentElement.after(summary);
  function search(preserve){
    type.disabled=kind.value!==''&&kind.value!=='facilities';
    if(type.disabled)type.value='';
    var value=state();if(!preserve)limit=20;
    var selected=[value.q?'“'+value.q+'”':'',value.region,value.category?type.options[type.selectedIndex].textContent:value.kind?kind.options[kind.selectedIndex].textContent:''].filter(Boolean);
    if(selection)selection.textContent=[value.region,value.category?type.options[type.selectedIndex].textContent:value.kind?kind.options[kind.selectedIndex].textContent:''].filter(Boolean).join(' · ')||'전체';
    summary.textContent=selected.join(' · ');summary.hidden=!selected.length;
    if(title)title.textContent=value.category==='숙소'?'함께 머무는 숙소':value.category==='식당카페'?'산책 후, 식당과 카페':value.kind==='courses'?'다음 산책길을 찾아요':'반려견과 함께 갈 곳';
    if(!value.q&&!value.kind&&!value.region&&!value.category){matches=[];list.replaceChildren();count.textContent='지역·업종을 선택하거나 장소 이름을 입력하세요.';more.hidden=true;remember();return;}
    matches=ordered(filter(data,value),sort?.value);render();remember();
  }
  form.addEventListener('submit',function(event){event.preventDefault();search(false);});
  kind.addEventListener('change',function(){search(false);});region.addEventListener('change',function(){search(false);});
  type.addEventListener('change',function(){if(type.value)kind.value='facilities';search(false);});
  sort?.addEventListener('change',function(){search(false);});
  document.getElementById('place-clear').addEventListener('click',function(){query.value='';kind.value='';region.value='';type.value='';if(sort)sort.value='photos';search(false);query.focus();});
  more.addEventListener('click',function(){limit+=20;render(true);remember();});
  var params=new URLSearchParams(root.location.search);query.value=(params.get('q')||'').slice(0,100);
  if(['courses','facilities','bins'].includes(params.get('kind')))kind.value=params.get('kind');
  if(Array.from(region.options).some(function(option){return option.value===params.get('region');}))region.value=params.get('region');
  if(categories.includes(params.get('category'))){type.value=params.get('category');kind.value='facilities';}
  if(sort&&['registered','name'].includes(params.get('sort')))sort.value=params.get('sort');
  var shown=Number(params.get('shown'));if(Number.isSafeInteger(shown)&&shown>=20&&shown<=data.length)limit=Math.ceil(shown/20)*20;
  search(true);
})(typeof window==='undefined'?globalThis:window);
