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
      var li=document.createElement('li'),a=document.createElement('a'),p=document.createElement('p'),location=document.createElement('div');
      li.className='directory-card';if(index<6)li.classList.add('directory-enter');
      var label=category(item).replace('식당카페','식당·카페').replace('공원관광','공원·관광');
      location.className='directory-region';location.textContent=[item.region,label||(item.kind==='courses'?'산책 코스':'배변봉투함')].filter(Boolean).join(' · ');
      a.href=item.path;a.textContent=item.name;a.className='directory-name';p.className='directory-address';p.textContent=item.kind==='facilities'?(item.info||'').split(' · ').slice(0,-1).join(' · '):item.info||'';
      li.append(location,a,p);
      if(item.kind==='facilities'){
        if(item.photo){var figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption'),credit=document.createElement('a'),photoLink=document.createElement('a'),details=document.createElement('details'),summary=document.createElement('summary');figure.className='directory-photo';photoLink.href=item.path;photoLink.setAttribute('aria-label',item.name+' 상세 정보');img.referrerPolicy='no-referrer';img.src=item.photo.src;img.alt=item.name+' 공식 관광자료 제공 사진';img.width=item.photo.width;img.height=item.photo.height;img.loading='lazy';img.decoding='async';credit.href=item.photo.source;credit.target='_blank';credit.rel='noopener noreferrer';credit.textContent='사진: '+item.photo.author;summary.textContent='사진 출처·이용 안내';details.append(summary,credit,document.createElement('br'));var license=document.createElement('a');license.href=item.photo.licenseUrl;license.target='_blank';license.rel='noopener noreferrer';license.textContent='이용 조건 · 원본 비율 유지';details.append(license,document.createElement('br'),document.createTextNode('촬영 시기 미상 · 현재 모습과 다를 수 있어요.'));caption.append(details);photoLink.append(img);figure.append(photoLink,caption);li.prepend(figure);}
        else{var placeholder=document.createElement('a'),placeholderTitle=document.createElement('span'),placeholderNote=document.createElement('span');placeholder.href=item.path;placeholder.className='directory-no-photo';placeholder.setAttribute('aria-label',item.name+' 상세 정보');placeholderTitle.textContent=label||'반려생활 장소';placeholderNote.textContent='사진 준비 중';placeholder.append(placeholderTitle,placeholderNote);li.prepend(placeholder);}
        var note=document.createElement('dl');note.className='directory-conditions';conditionRows(item.conditions).forEach(function(row){var term=document.createElement('dt'),value=document.createElement('dd');term.textContent=row[0];value.textContent=row[1];note.append(term,value);});li.append(note);
      }
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
