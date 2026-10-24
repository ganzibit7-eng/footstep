(function(root){'use strict';
// Presentation only: this controller never queries or changes service data.
function navigationState(mobile,collapsed,open){return {hidden:mobile&&!open,compact:!mobile&&collapsed,expanded:mobile?open:!collapsed};}
function formatCount(value){if(typeof value!=='number'&&!(typeof value==='string'&&/^\d+$/.test(value)))return '—';const count=Number(value);return Number.isSafeInteger(count)&&count>=0?count.toLocaleString('ko-KR'):'—';}
function create({overlay,workspace,nav}){
 const doc=overlay.ownerDocument,media=root.matchMedia('(max-width:650px)');
 let collapsed=false,open=false,label='운영 개요';
 const shell=doc.createElement('aside'),toggle=doc.createElement('button'),text=doc.createElement('span');
 shell.className='admin-nav-shell';toggle.type='button';toggle.className='admin-navigation-toggle';
 toggle.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
 toggle.append(text);nav.id='admin-console-navigation';toggle.setAttribute('aria-controls',nav.id);
 nav.before(shell);shell.append(toggle,nav);overlay.classList.add('admin-console');
 for(const button of nav.querySelectorAll('button')){const name=button.querySelector('strong').textContent;button.setAttribute('aria-label',name);button.title=name;}
 function sync(){
  const state=navigationState(media.matches,collapsed,open);
  workspace.classList.toggle('admin-nav-collapsed',state.compact);nav.hidden=state.hidden;
  toggle.setAttribute('aria-expanded',String(state.expanded));
  toggle.setAttribute('aria-label',(media.matches?(open?'관리 메뉴 닫기':'관리 메뉴 열기'):(collapsed?'사이드바 펼치기':'사이드바 접기'))+' · '+label);
  text.textContent=media.matches?label:collapsed?'메뉴':'메뉴 접기';
 }
 toggle.addEventListener('click',()=>{if(media.matches)open=!open;else collapsed=!collapsed;sync();});
 function onKey(event){if(event.key==='Escape'&&media.matches&&open){event.preventDefault();event.stopPropagation();open=false;sync();toggle.focus({preventScroll:true});}}
 shell.addEventListener('keydown',onKey);
 function onResize(){open=false;const needsFocus=media.matches&&nav.contains(doc.activeElement);sync();if(needsFocus)toggle.focus({preventScroll:true});}
 media.addEventListener('change',onResize);sync();
 return {select(name,close){label=name;if(close&&media.matches)open=false;sync();},dispose(){media.removeEventListener('change',onResize);shell.removeEventListener('keydown',onKey);}};
}
const api=Object.freeze({create,navigationState,formatCount});if(typeof module==='object'&&module.exports)module.exports=api;else root.AdminConsole=api;
})(typeof globalThis==='undefined'?this:globalThis);
