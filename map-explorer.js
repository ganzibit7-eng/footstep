(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MapExplorer=api;})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 const valid=e=>Number.isFinite(Number(e.lat))&&Number.isFinite(Number(e.lng))&&e.lat!==null&&e.lng!==null&&String(e.lat).trim()!==''&&String(e.lng).trim()!==''&&Math.abs(Number(e.lat))<=90&&Math.abs(Number(e.lng))<=180;
 function inBounds(entries,bounds){return entries.filter(e=>valid(e)&&bounds.contains([Number(e.lat),Number(e.lng)]));}
 function create({map,host,isVisible,onCourse,reveal,getStatus,onSearchArea}){
  // Also remove retired controls when an older cached document loads this module.
  host.querySelectorAll('.map-quick-filters').forEach(node=>node.remove());
  const groups=new Map(),frame=host.querySelector('.map-wrap-relative');
  const panel=host.querySelector('#map-explorer-panel'),list=host.querySelector('#map-explorer-list'),count=host.querySelector('#map-explorer-count'),selection=host.querySelector('#map-explorer-selection'),body=host.querySelector('#map-selection-body'),peek=host.querySelector('#map-course-peek'),area=host.querySelector('#map-search-area'),toggle=host.querySelector('#map-results-toggle');
  let selected=null,previousMarker=null,shown=30,scheduled=false,resizeScheduled=false,insetScheduled=false,lastInset=-1,lastSize='',disposed=false,mobile=innerWidth<=700;
  host.classList.add('map-explorer-ready');panel.hidden=innerWidth<=700;toggle.setAttribute('aria-expanded',String(!panel.hidden));toggle.textContent=panel.hidden?'목록 열기':'목록 접기';
  const bridge=host.querySelector('.map-results-bridge');if(bridge)frame.after(bridge);
  function entries(){return [...groups].flatMap(([group,rows])=>isVisible(group)?[...rows.values()]:[]);}
  function highlight(){
   if(previousMarker&&previousMarker!==selected?.marker){previousMarker.getElement?.()?.classList.remove('map-marker-selected');previousMarker.setZIndexOffset?.(0);}
   if(selected){selected.marker?.getElement?.()?.classList.add('map-marker-selected');selected.marker?.setZIndexOffset?.(1000);previousMarker=selected.marker;}
   for(const button of list.querySelectorAll('[data-map-key]'))button.setAttribute('aria-current',String(button.dataset.mapKey===selected?.key));
  }
  function close(){selection.hidden=true;selected=null;highlight();if(peek)peek.hidden=true;host.dispatchEvent(new CustomEvent('mapselectionclear'));}
  function render(){
   if(disposed)return;scheduled=false;const legacy=host.querySelector('#facility-search-results');if(legacy){legacy.hidden=true;legacy.style.setProperty('display','none','important');}
   const rows=inBounds(entries(),map.getBounds()),center=map.getCenter();
   rows.sort((a,b)=>map.distance([a.lat,a.lng],center)-map.distance([b.lat,b.lng],center));
   const status=getStatus?.();count.textContent=!rows.length&&status==='loading'?'장소를 불러오는 중…':!rows.length&&status==='error'?'연결을 확인해 주세요':'이 지도 안 '+rows.length.toLocaleString('ko-KR')+'곳';list.replaceChildren();
   host.querySelector('#map-explorer-more').hidden=shown>=rows.length;
   if(!rows.length){const empty=document.createElement('li');empty.className='map-explorer-empty';empty.textContent=status==='loading'?'등록된 장소와 코스 정보를 확인하고 있어요.':status==='error'?'정보를 불러오지 못했어요. 연결 상태를 확인하고 다시 불러와 주세요.':'표시할 장소가 없어요. 지도를 넓히거나 다른 종류를 선택해 보세요.';list.append(empty);}
   const visible=rows.slice(0,shown);if(selected&&rows.some(e=>e.key===selected.key)&&!visible.some(e=>e.key===selected.key))visible.unshift(selected);
   for(const entry of visible){
    const li=document.createElement('li'),button=document.createElement('button'),label=document.createElement('small'),name=document.createElement('strong'),address=document.createElement('span'),note=document.createElement('span');
    button.type='button';button.dataset.mapKey=entry.key;label.textContent=entry.label;name.textContent=entry.name;address.textContent=entry.address||'주소 안내는 상세에서 확인하세요.';note.textContent=entry.conditions||'동반 조건 미확인 · 방문 전 문의';note.className='map-result-condition';button.append(label,name,address,note);button.onclick=()=>select(entry,true);li.append(button);list.append(li);
   }
   highlight();
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
  function select(entry,pan){
   selected=entry;if(innerWidth<=700){panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.textContent='목록 열기';}selection.hidden=false;selection.dataset.expanded='false';body.replaceChildren();
   host.querySelector('#map-selection-expand').setAttribute('aria-expanded','false');
   host.querySelector('#map-selection-title').textContent=entry.name;
   if(entry.group==='course'){
    if(peek){body.append(peek);peek.hidden=false;}onCourse(entry.item,pan);
   }else{
    if(peek)peek.hidden=true;
    const html=entry.marker?.getPopup?.()?.getContent();
    if(typeof html==='string'){body.innerHTML=html;const title=body.firstElementChild;if(title?.tagName==='STRONG'){if(title.nextSibling?.nodeName==='BR')title.nextSibling.remove();title.remove();}}
    else {const p=document.createElement('p');p.textContent=entry.conditions||'동반 조건 미확인';body.append(p);}
    if(pan||innerWidth<=700){map.setView([entry.lat,entry.lng],Math.max(map.getZoom(),16),{animate:false});if(innerWidth<=700)map.panBy([0,Math.round(map.getSize().y*.22)],{animate:false});reveal?.(entry.marker,highlight);}
   }
   highlight();schedule();scheduleInset();
  }
  function add(group,entry){
   if(!valid(entry))return;entry={...entry,group,key:group+':'+String(entry.id)};
   if(!groups.has(group))groups.set(group,new Map());groups.get(group).set(entry.key,entry);
   if(entry.marker?.getPopup?.()){
    entry.marker.getPopup().options.autoPan=false;
    entry.marker.on('popupopen',()=>{select(entry,false);map.closePopup();});
   }else entry.marker?.on('click',()=>select(entry,false));
   schedule();return entry;
  }
  function clear(group){groups.set(group,new Map());if(selected?.group===group)close();schedule();}
  function refresh(){if(selected&&!isVisible(selected.group))close();shown=30;area.hidden=true;render();resize(true);}
  function resize(force){
   if(disposed||!host.classList.contains('active'))return;
   const nextMobile=innerWidth<=700;if(nextMobile!==mobile){mobile=nextMobile;panel.hidden=mobile;toggle.textContent=mobile?'목록 열기':'목록 접기';toggle.setAttribute('aria-expanded',String(!mobile));}
   const top=Math.max(64,frame.getBoundingClientRect().top),viewport=window.visualViewport?.height||innerHeight;
   const height=Math.round(Math.max(330,Math.min(740,viewport-top-(mobile?88:24)))),size=innerWidth+':'+height;
   scheduleInset();if(force!==true&&size===lastSize)return;lastSize=size;
   frame.style.setProperty('--map-workspace-height',height+'px');map.invalidateSize({pan:false});
  }
  function syncInset(){
   if(disposed||innerWidth>700)return;
   const rect=frame.getBoundingClientRect(),nav=document.getElementById?.('bottom-tab-bar');
   if(!Number.isFinite(rect.bottom)||!rect.height)return;
   const viewport=window.visualViewport,edge=Math.min(innerHeight,viewport?viewport.height+viewport.offsetTop:innerHeight,nav?.getBoundingClientRect().top??innerHeight);
   const inset=Math.round(Math.min(Math.max(8,rect.bottom-edge+8),Math.max(8,rect.height-140)));
   if(inset!==lastInset){lastInset=inset;frame.style.setProperty('--map-overlay-inset',inset+'px');}
  }
  function scheduleInset(){if(disposed||insetScheduled)return;insetScheduled=true;requestAnimationFrame(()=>{insetScheduled=false;syncInset();});}
  function scheduleResize(){if(disposed||resizeScheduled)return;resizeScheduled=true;requestAnimationFrame(()=>{resizeScheduled=false;resize();});}
  const moved=()=>{area.hidden=false;count.textContent='지도를 옮겼어요 · 이 지역에서 찾기';highlight();};map.on('moveend',moved);
  area.onclick=()=>{shown=30;render();area.hidden=true;onSearchArea?.();};
  toggle.onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden&&innerWidth<=700)close();toggle.setAttribute('aria-expanded',String(!panel.hidden));toggle.textContent=panel.hidden?'목록 열기':'목록 접기';scheduleInset();};
  host.querySelector('#map-explorer-close').onclick=()=>toggle.click();
  host.querySelector('#map-explorer-more').onclick=()=>{shown+=30;render();};
  host.querySelector('#map-selection-close').onclick=close;
  selection.addEventListener('click',e=>{if(e.target.closest('.peek-close'))close();});
  let dragged=false;host.querySelector('#map-selection-expand').onclick=()=>{if(dragged){dragged=false;return;}const expanded=selection.dataset.expanded!=='true';selection.dataset.expanded=String(expanded);host.querySelector('#map-selection-expand').setAttribute('aria-expanded',String(expanded));};
  // Only the dedicated handle starts a sheet gesture. Map and sheet body retain native gestures.
  const handle=host.querySelector('#map-selection-expand');let down;
  handle.addEventListener('pointerdown',e=>{down=e.clientY;handle.setPointerCapture?.(e.pointerId);});
  handle.addEventListener('pointerup',e=>{if(down===undefined)return;const delta=e.clientY-down;down=undefined;if(Math.abs(delta)>30){dragged=true;selection.dataset.expanded=String(delta<0);handle.setAttribute('aria-expanded',String(delta<0));}});
  handle.addEventListener('pointercancel',()=>{down=undefined;});
  selection.addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle.focus();}});
  window.addEventListener('resize',scheduleResize,{passive:true});
  window.addEventListener('scroll',scheduleInset,{passive:true});
  window.visualViewport?.addEventListener('resize',scheduleResize,{passive:true});
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(scheduleResize):null;
  for(const el of host.querySelectorAll('.map-search-toolbar,.map-category-toolbar,#registered-place-filters'))observer?.observe(el);
  requestAnimationFrame(()=>{render();resize(true);});
  return {add,clear,refresh,selectKey(key,pan=true){for(const rows of groups.values())if(rows.has(key)){select(rows.get(key),pan);return true;}return false;},close,resize,destroy(){disposed=true;observer?.disconnect();map.off('moveend',moved);window.removeEventListener('resize',scheduleResize);window.removeEventListener('scroll',scheduleInset);window.visualViewport?.removeEventListener('resize',scheduleResize);}};
 }
 return {valid,inBounds,create};
});
