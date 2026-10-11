(function(root){
  'use strict';
  var categories=['공원관광','쇼핑','숙소','식당카페','캠핑'];
  function category(item){return item.kind==='facilities'?(item.info||'').split(' · ').pop():'';}
  function filter(data,state){
    var words=(state.q||'').trim().toLocaleLowerCase('ko').split(/\s+/).filter(Boolean);
    return data.filter(function(item){
      var text=[item.name,item.region,item.info].join(' ').toLocaleLowerCase('ko');
      return (!state.kind||item.kind===state.kind)&&(!state.region||item.region===state.region)&&(!state.category||category(item)===state.category)&&words.every(function(word){return text.includes(word);});
    });
  }
  if(typeof module==='object'&&module.exports){module.exports={filter:filter,category:category};return;}
  var data=JSON.parse(document.getElementById('place-data').textContent),form=document.getElementById('place-search'),query=document.getElementById('place-query'),kind=document.getElementById('place-kind'),region=document.getElementById('place-region'),type=document.getElementById('place-category'),list=document.getElementById('place-results'),count=document.getElementById('place-count'),more=document.getElementById('place-more'),limit=20,matches=[];
  Array.from(new Set(data.map(function(item){return item.region;}).filter(Boolean))).sort(function(a,b){return a.localeCompare(b,'ko');}).forEach(function(name){var option=document.createElement('option');option.value=name;option.textContent=name;region.append(option);});
  function state(){return {q:query.value.trim().slice(0,100),kind:kind.value,region:region.value,category:type.value};}
  function remember(){
    var url=new URL(root.location.href),value=state();
    ['q','kind','region','category'].forEach(function(key){if(value[key])url.searchParams.set(key,value[key]);else url.searchParams.delete(key);});
    if(limit>20)url.searchParams.set('shown',String(limit));else url.searchParams.delete('shown');
    root.history.replaceState(root.history.state,'',url.pathname+url.search+url.hash);
  }
  function render(){
    list.replaceChildren();
    matches.slice(0,limit).forEach(function(item){
      var li=document.createElement('li'),a=document.createElement('a'),p=document.createElement('p');
      a.href=item.path;a.textContent=item.name;p.textContent=[item.region,item.info].filter(Boolean).join(' · ');li.append(a,p);
      if(item.kind==='facilities'){var note=document.createElement('p');note.textContent='동반 구역·크기 제한·준비물은 상세에서 확인하세요. 자료에 없는 조건은 미확인입니다.';li.append(note);}
      list.append(li);
    });
    count.textContent=matches.length?'등록 정보 '+matches.length+'곳 중 '+Math.min(limit,matches.length)+'곳 표시':'일치하는 등록 정보가 없습니다. 지역·업종 선택을 바꾸거나 검색어를 짧게 입력하세요.';
    more.hidden=limit>=matches.length;
  }
  function search(preserve){
    type.disabled=kind.value!==''&&kind.value!=='facilities';
    if(type.disabled)type.value='';
    var value=state();if(!preserve)limit=20;
    if(!value.q&&!value.kind&&!value.region&&!value.category){matches=[];list.replaceChildren();count.textContent='지역·업종을 선택하거나 장소 이름을 입력하세요.';more.hidden=true;remember();return;}
    matches=filter(data,value);render();remember();
  }
  form.addEventListener('submit',function(event){event.preventDefault();search(false);});
  kind.addEventListener('change',function(){search(false);});region.addEventListener('change',function(){search(false);});
  type.addEventListener('change',function(){if(type.value)kind.value='facilities';search(false);});
  document.getElementById('place-clear').addEventListener('click',function(){query.value='';kind.value='';region.value='';type.value='';search(false);query.focus();});
  more.addEventListener('click',function(){limit+=20;render();remember();});
  var params=new URLSearchParams(root.location.search);query.value=(params.get('q')||'').slice(0,100);
  if(['courses','facilities','bins'].includes(params.get('kind')))kind.value=params.get('kind');
  if(Array.from(region.options).some(function(option){return option.value===params.get('region');}))region.value=params.get('region');
  if(categories.includes(params.get('category'))){type.value=params.get('category');kind.value='facilities';}
  var shown=Number(params.get('shown'));if(Number.isSafeInteger(shown)&&shown>=20&&shown<=data.length)limit=Math.ceil(shown/20)*20;
  search(true);
})(typeof window==='undefined'?globalThis:window);
