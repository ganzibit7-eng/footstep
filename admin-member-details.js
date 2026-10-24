(function(root){'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function dateTime(v){if(!v)return '기록 없음';const d=new Date(v);return Number.isNaN(d.getTime())?'확인 불가':new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',dateStyle:'medium',timeStyle:'short',hourCycle:'h23'}).format(d)+' KST';}
function integer(v){return (typeof v==='number'||typeof v==='string'&&/^[+-]?\d+$/.test(v))&&Number.isSafeInteger(Number(v))?Number(v):null;}
function number(v,unit=''){const n=integer(v);return n===null?'미확인':n.toLocaleString('ko-KR')+unit;}
async function authorize(client,viewer){const user=await client.auth.getUser();if(user.error||user.data?.user?.id!==viewer||user.data.user.is_anonymous)throw new Error('admin_identity_required');const role=await client.rpc('is_admin',{uid:viewer});if(role.error||role.data!==true)throw new Error('admin_role_required');}
const PAGE_SIZE=20;
function cursorFor(kind,row){
 if(!row||row.id===null||row.id===undefined)throw new Error('missing_history_cursor');
 const id=String(row.id);
 if(kind==='points'){
  if(!/^\d+$/.test(id)||typeof row.id==='number'&&!Number.isSafeInteger(row.id))throw new Error('invalid_history_cursor');
  return {id};
 }
 const at=row.created_at;
 if(at!==null&&at!==undefined&&(!/^\d{4}-\d{2}-\d{2}T[\d:.]+(?:Z|[+-]\d{2}:\d{2})$/.test(at)||!Number.isFinite(Date.parse(at))))throw new Error('invalid_history_date');
 return {id,at:at??null};
}
async function readPage(client,id,kind,cursor=null){
 if(!['courses','points'].includes(kind))throw new Error('invalid_history_kind');
 let query=kind==='courses'?client.from('courses').select('id,name,status,created_at',cursor?{}:{count:'exact'}).eq('owner_id',id).order('created_at',{ascending:false,nullsFirst:false}).order('id',{ascending:false}):client.from('points_log').select('id,amount,reason,created_at').eq('owner_id',id).order('id',{ascending:false});
 if(cursor){
  if(kind==='points')query=query.lt('id',cursor.id);
  else if(cursor.at===null)query=query.is('created_at',null).lt('id',cursor.id);
  else{
   const quoted='"'+cursor.id.replace(/\\/g,'\\\\').replace(/"/g,'\\"')+'"';
   query=query.or('created_at.lt.'+cursor.at+',and(created_at.eq.'+cursor.at+',id.lt.'+quoted+'),created_at.is.null');
  }
 }
 const result=await query.limit(PAGE_SIZE+1);
 if(result.error||!Array.isArray(result.data))throw result.error||new Error('invalid_history_rows');
 const rows=result.data.slice(0,PAGE_SIZE),hasMore=result.data.length>PAGE_SIZE;
 return {ok:true,rows,count:kind==='courses'&&!cursor?integer(result.count):null,hasMore,cursor:hasMore?cursorFor(kind,rows.at(-1)):null};
}
async function readActivity(client,id){
 const tasks=[()=>client.from('walks').select('id',{count:'exact',head:true}).eq('owner_id',id),()=>readPage(client,id,'courses'),()=>readPage(client,id,'points')];
 const results=await Promise.allSettled(tasks.map(run=>Promise.resolve().then(run)));
 return Object.fromEntries(['walks','courses','points'].map((key,i)=>{const result=results[i];if(result.status==='rejected'||!result.value||result.value.error)return [key,{ok:false}];if(key==='walks'){const count=integer(result.value.count);return [key,{ok:count!==null&&count>=0,count}];}return [key,result.value];}));
}
function createController({client,viewer,isAdmin,getSnapshot,view}){
 let generation=0,selected=null,pending=null,disposed=false,data=null;
 const pages=new Map();
 function close(){generation++;selected=null;pending=null;data=null;pages.clear();}
 function open(id){
  if(disposed||!isAdmin()||!getSnapshot(id))return Promise.resolve(false);
  if(pending&&selected===id)return pending;
  selected=id;data=null;pages.clear();const request=++generation,owner=viewer();view.begin();
  const current=()=>!disposed&&request===generation&&owner===viewer()&&isAdmin()&&!!getSnapshot(id);
  const task=(async()=>{try{await authorize(client,owner);if(!current())return false;view.basic(getSnapshot(id));const result=await readActivity(client,id);if(!current())return false;data=result;view.result(data);return Object.values(data).every(x=>x.ok);}catch(error){if(current())view.error();return false;}finally{if(current())view.settled();}})();
  pending=task;task.finally(()=>{if(pending===task)pending=null;});return task;
 }
 function more(kind){
  if(disposed||pending||!isAdmin()||!data?.[kind]?.ok||!data[kind].hasMore||!getSnapshot(selected))return Promise.resolve(false);
  if(pages.has(kind))return pages.get(kind);
  const request=generation,id=selected,owner=viewer(),previous=data[kind];
  const current=()=>!disposed&&request===generation&&id===selected&&owner===viewer()&&isAdmin()&&!!getSnapshot(id);
  view.pageBegin?.(kind);
  const task=(async()=>{try{
   await authorize(client,owner);if(!current())return false;
   const next=await readPage(client,id,kind,previous.cursor);if(!current())return false;
   if(next.hasMore&&JSON.stringify(next.cursor)===JSON.stringify(previous.cursor))throw new Error('history_cursor_stalled');
   const ids=new Set(previous.rows.map(r=>String(r.id))),added=next.rows.filter(r=>!ids.has(String(r.id)));
   data[kind]={...next,rows:previous.rows.concat(added),count:previous.count};view.result(data,kind);return true;
  }catch(error){if(current())view.pageError?.(kind);return false;}finally{if(current())view.pageSettled?.(kind);}})();
  pages.set(kind,task);task.finally(()=>{if(pages.get(kind)===task)pages.delete(kind);});return task;
 }
 return {open,more,close,dispose(){disposed=true;close();}};
}
function basics(member){
 const field=(label,value)=>'<div><dt>'+label+'</dt><dd>'+esc(value)+'</dd></div>';
 return '<div class="admin-member-identity"><span>회원 정보</span><h4>'+esc(member.nickname||'(닉네임 없음)')+'</h4><p>'+esc(member.role)+' · '+esc(member.provider)+' 가입</p></div><dl class="admin-detail-fields">'+field('가입일',dateTime(member.createdAt))+field('마지막 로그인',dateTime(member.lastSignIn))+field('최근 접속 기록',member.activityReady?dateTime(member.lastSeen):'미확인')+field('포인트 · 목록 기준',member.activityReady?number(member.points,'P'):'미확인')+field('화면 조회 · 목록 기준',member.activityReady?number(member.visits,'회'):'미확인')+'</dl><p class="admin-detail-note">기본 정보·포인트·접속 집계는 회원 목록 확인 시점의 자료입니다. '+esc(member.checkedAt?dateTime(member.checkedAt):'추가 집계 확인 필요')+'</p><details class="admin-detail-id"><summary>회원 식별 정보</summary><code>'+esc(member.id)+'</code><p>연결된 로그인: '+esc(member.linkedProviders||'미확인')+'</p></details>';
}
function historyHTML(kind,data){
 const failed='<p class="admin-detail-error">조회하지 못했어요. 다른 항목의 결과는 유지됩니다.</p>';
 if(!data.ok)return failed;
 const rows=data.rows,heading=kind==='courses'?number(data.count,'개')+' · '+rows.length+'개 표시':rows.length+'건 표시';
 const list=kind==='courses'?(rows.length?'<ul>'+rows.map(r=>'<li><strong>'+esc(r.name||'이름 미확인')+'</strong><small>'+esc(({approved:'공개',pending:'검토 대기',rejected:'비공개'})[r.status]||'상태 미확인')+' · '+esc(dateTime(r.created_at))+'</small></li>').join('')+'</ul>':'<p class="admin-detail-note">등록한 코스가 없어요.</p>'):(rows.length?'<ol>'+rows.map(r=>'<li><div><strong>'+esc(r.reason||'사유 미기록')+'</strong><small>'+esc(dateTime(r.created_at))+'</small></div><b>'+esc(number(r.amount,'P'))+'</b></li>').join('')+'</ol>':'<p class="admin-detail-note">저장된 포인트 내역이 없어요.</p>');
 return '<p class="admin-detail-page-count">'+heading+'</p>'+list+(kind==='points'?'<p class="admin-detail-note">최신 내역부터 표시합니다. 내역의 합계는 전체 잔액이 아닙니다.</p>':'')+(data.hasMore?'<button type="button" class="admin-detail-more" data-history-more="'+kind+'">'+(kind==='courses'?'코스':'포인트 내역')+' 20건 더 보기</button>':rows.length?'<p class="admin-detail-end" tabindex="-1">마지막 내역입니다.</p>':'')+'<p class="admin-detail-page-status" role="status"></p>';
}
function activityHTML(data){
 const failed='<p class="admin-detail-error">조회하지 못했어요. 다른 항목의 결과는 유지됩니다.</p>';
 const walks=data.walks.ok?'<strong class="admin-detail-count">'+number(data.walks.count,'회')+'</strong><p class="admin-detail-note">서버에 저장된 산책 건수 · 경로 좌표는 조회하지 않습니다.</p>':failed;
 return '<section><h4>저장한 산책</h4>'+walks+'</section><section data-member-history="courses"><h4>등록 코스</h4><div>'+historyHTML('courses',data.courses)+'</div></section><section data-member-history="points"><h4>포인트 내역</h4><div>'+historyHTML('points',data.points)+'</div></section>';
}
function create({overlay,client,viewer,isAdmin,getSnapshot}){
 const doc=overlay.ownerDocument,panel=overlay.querySelector('.admin-panel'),layer=doc.createElement('div');layer.className='admin-member-detail-layer';layer.hidden=true;
 layer.innerHTML='<aside class="admin-member-drawer" role="dialog" aria-modal="true" aria-labelledby="admin-member-detail-title"><header><div><span>MEMBER</span><h3 id="admin-member-detail-title">회원 상세</h3></div><button type="button" class="admin-detail-close" aria-label="회원 상세 닫기">✕</button></header><div class="admin-detail-toolbar"><p role="status" aria-live="polite"></p><button type="button" class="admin-detail-refresh">활동 내역 다시 확인</button></div><div class="admin-member-drawer-body"><div class="admin-detail-basic"></div><div class="admin-detail-activity"></div></div></aside>';
 overlay.append(layer);const body=layer.querySelector('.admin-member-drawer-body'),basic=layer.querySelector('.admin-detail-basic'),activity=layer.querySelector('.admin-detail-activity'),status=layer.querySelector('[role=status]'),refresh=layer.querySelector('.admin-detail-refresh'),closeButton=layer.querySelector('.admin-detail-close');
 let selected=null,opener=null,wasInert=false;
 function pageNodes(kind){const section=activity.querySelector('[data-member-history="'+kind+'"]');return {section,button:section?.querySelector('[data-history-more]'),note:section?.querySelector('.admin-detail-page-status')};}
 const controller=createController({client,viewer,isAdmin,getSnapshot,view:{
  begin(){basic.innerHTML='';activity.innerHTML='<p class="admin-detail-loading">권한과 회원 내역을 확인하고 있어요…</p>';refresh.disabled=true;status.textContent='조회 중';body.setAttribute('aria-busy','true');},
  basic(m){basic.innerHTML=basics(m);},
  result(data,kind){
   if(kind){const {section,button}=pageNodes(kind),focused=doc.activeElement===button,top=body.scrollTop;section.querySelector('div').innerHTML=historyHTML(kind,data[kind]);if(focused)(section.querySelector('[data-history-more]')||section.querySelector('.admin-detail-end'))?.focus({preventScroll:true});body.scrollTop=top;pageNodes(kind).note.textContent='추가 내역을 확인했어요.';}
   else activity.innerHTML=activityHTML(data);
   status.textContent=(Object.values(data).every(x=>x.ok)?'내역 확인':'일부 내역 조회 실패')+' · '+dateTime(new Date());
  },
  pageBegin(kind){const {section,button,note}=pageNodes(kind);section?.setAttribute('aria-busy','true');if(button){button.disabled=true;button.textContent='내역 확인 중…';}if(note)note.textContent='';},
  pageError(kind){const {button,note}=pageNodes(kind);if(button)button.textContent='다시 시도';if(note)note.textContent='추가 조회에 실패했어요. 기존 내역은 유지됩니다. 권한과 연결 상태를 확인해 주세요.';},
  pageSettled(kind){const {section,button}=pageNodes(kind);section?.setAttribute('aria-busy','false');if(button)button.disabled=false;},
  error(){basic.innerHTML='';activity.innerHTML='<p class="admin-detail-error">관리자 권한 또는 연결 상태를 확인한 뒤 다시 시도해 주세요.</p>';status.textContent='조회 실패';},
  settled(){refresh.disabled=false;body.setAttribute('aria-busy','false');}
 }});
 activity.addEventListener('click',event=>{const button=event.target.closest('[data-history-more]');if(button&&!button.disabled)controller.more(button.dataset.historyMore);});

 function close(restore=true){controller.close();selected=null;layer.hidden=true;basic.innerHTML='';activity.innerHTML='';panel.inert=wasInert;if(restore){const target=opener?.isConnected&&opener.getClientRects().length?opener:overlay.querySelector('.admin-navigation-toggle');target?.focus({preventScroll:true});}}
 closeButton.addEventListener('click',()=>close());refresh.addEventListener('click',()=>{if(selected)controller.open(selected);});layer.addEventListener('click',e=>{if(e.target===layer)close();});
 layer.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}if(e.key==='Tab'){const targets=Array.from(layer.querySelectorAll('button:not(:disabled),summary,a[href],[tabindex="0"]')).filter(el=>el.getClientRects().length);const first=targets[0],last=targets.at(-1);if(e.shiftKey&&doc.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&doc.activeElement===last){e.preventDefault();first?.focus();}}});
 return {open(id,button){if(!isAdmin()||!getSnapshot(id))return;if(layer.hidden){wasInert=panel.inert;opener=button||doc.activeElement;}selected=id;layer.hidden=false;panel.inert=true;body.scrollTop=0;closeButton.focus({preventScroll:true});return controller.open(id);},close,dispose(){close(false);controller.dispose();layer.remove();}};
}
const api=Object.freeze({dateTime,integer,basics,activityHTML,historyHTML,readActivity,readPage,cursorFor,createController,create});if(typeof module==='object'&&module.exports)module.exports=api;else root.AdminMemberDetails=api;
})(typeof globalThis==='undefined'?this:globalThis);
