(function(root){
 'use strict';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const num=x=>Math.max(0,Number(x)||0).toLocaleString('ko-KR');
 const date=x=>x?new Date(x).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',hour12:false}):'–';
 const sections={home:'홈',list:'산책코스',map:'지도',walk:'산책 기록'};
 function who(r){return r.actor_id?esc(r.nickname||'닉네임 미등록 회원')+'<br><small>회원 · '+esc(r.actor_id)+'</small>':esc(r.alias)+'<br><small>비로그인 브라우저</small>';}
 function table(headers,rows){return '<div class="admin-table-scroll"><table><thead><tr>'+headers.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
 function link(r){return /^https:\/\/link\.coupang\.com\/a\/[A-Za-z0-9]+$/.test(r.url||'')?'<code>'+esc(r.url)+'</code>':'–';}
 function render(d){
  return '<p><strong>클릭 '+num(d.clicks)+'회 · 클릭 방문자 '+num(d.visitors)+'개 브라우저</strong><br>로그인 회원 '+num(d.members)+'명 · 비로그인 '+num(d.anonymous_browsers)+'개 브라우저<br>원본 '+num(d.raw_clicks)+'회 · 관리자/자동 접속 신호 등 제외 '+num(d.excluded_clicks)+'회</p>'+
   '<p><small>집계 시작: '+esc(date(d.tracking_started_at))+' (한국 시간). 시작 전 상품별 클릭은 복원할 수 없어요. 동일인의 다른 기기·브라우저는 별도 방문자로 계산하며, 로그인 회원 목록은 계정 기준으로 묶어요. 비로그인 번호로 실제 신원을 확인할 수 없어요. 발자국에서 수신한 클릭 기록이며 쿠팡 공식 클릭·구매·수익 통계와 다를 수 있어요. 관리자/작업 접속은 수집하지 않으며 알려진 자동 접속 신호는 기본 제외합니다. 기록은 90일 보관해요.</small></p>'+
   '<h4>상품·링크별 클릭</h4>'+table(['상품','제휴 링크','클릭','방문 브라우저','회원','마지막 클릭'],(d.products||[]).map(r=>[esc(r.title),link(r),num(r.clicks),num(r.visitors),num(r.members),esc(date(r.last_at))]))+
   '<h4>누가 어떤 상품을 클릭했나요?</h4><p><small>현재 필터 기준 '+num(d.people_total)+'개 계정/익명 번호 · 한 페이지 20개. 아래 상품 버튼을 누르면 해당 링크로 필터링해요.</small></p>'+table(['회원 / 익명 번호','클릭','브라우저','클릭한 상품','첫 클릭','마지막 클릭'],(d.people||[]).map(r=>[who(r),num(r.clicks),num(r.browsers),(r.products||[]).map(p=>'<button type="button" data-affiliate-filter="'+esc(p.link_id)+'">'+esc(p.title)+'</button>').join(' '),esc(date(r.first_at)),esc(date(r.last_at))]))+
   '<h4>클릭 시간과 위치</h4><p><small>한 페이지 50건 · 최신순</small></p>'+table(['시간(KST)','클릭 방문자','상품','화면 / 페이지','유입','브라우저 / 기기','분류'],(d.events||[]).map(r=>[esc(date(r.created_at)),who(r),esc(r.title),esc(sections[r.section]||r.section)+'<br><small>'+esc(r.path)+' · 홈 산책 준비물</small>',esc(r.source),esc(r.browser)+' / '+esc(r.device),r.included?'집계 포함':'자동 접속 신호 등 제외']))+
   '<h4>일별 추이</h4>'+table(['날짜(KST)','클릭','방문 브라우저'],(d.daily||[]).map(r=>[esc(r.date),num(r.clicks),num(r.visitors)]))+
   '<h4>유입 경로</h4>'+table(['유입','클릭','방문 브라우저'],(d.sources||[]).map(r=>[esc(r.source),num(r.clicks),num(r.visitors)]))+
   '<h4>클릭이 발생한 화면</h4>'+table(['화면','페이지','클릭','방문 브라우저'],(d.placements||[]).map(r=>[esc(sections[r.section]||r.section),esc(r.path),num(r.clicks),num(r.visitors)]));
 }
 function csv(rows){return '\uFEFF'+rows.map(r=>r.map(x=>{let v=String(x??'');if(/^[\s\uFEFF]*[=+@\-]|^[\t\r\n]/.test(v))v="'"+v;return '"'+v.replaceAll('"','""')+'"';}).join(',')).join('\r\n');}
 function eventRows(events){return events.map(r=>[date(r.created_at),r.actor_id?'회원':'비로그인',r.nickname||'',r.actor_id||r.alias,r.title,r.url||'',r.path,sections[r.section]||r.section,r.source,r.browser,r.device,r.included?'포함':'제외']);}
 function mount({client,isAdmin,viewer}){
  const doc=root.document,el=doc.getElementById('admin-affiliate-result');if(!el)return null;
  const $=id=>doc.getElementById('admin-affiliate-'+id);let sequence=0,data=null,eventPage=1,visitorPage=1;
  function filters(){return {p_from:$('from').value,p_to:$('to').value,p_link:$('link').value||null,p_audience:$('audience').value,p_include_excluded:$('excluded').checked,p_event_page:eventPage,p_visitor_page:visitorPage};}
  function kstToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
  $('from').value=$('to').value=kstToday();
  function valid(){const f=$('from').value,t=$('to').value;return /^\d{4}-\d{2}-\d{2}$/.test(f)&&/^\d{4}-\d{2}-\d{2}$/.test(t)&&t>=f&&(Date.parse(t)-Date.parse(f))/86400000<=89;}
  async function load(reset=false){
   if(!isAdmin())return;if(reset){eventPage=1;visitorPage=1;}const request=++sequence,owner=viewer();data=null;$('export').disabled=true;
   if(!valid()){el.textContent='시작일·종료일을 확인해 주세요. 최대 90일까지 조회할 수 있어요.';return;}
   el.textContent='쿠팡 링크 클릭 기록을 불러오고 있어요…';
   try{const {data:d,error}=await client.rpc('admin_affiliate_summary',filters());if(request!==sequence||owner!==viewer()||!isAdmin())return;
    if(error||!Array.isArray(d?.events))throw error||new Error('invalid_data');data=d;el.innerHTML=render(d);
    const selected=$('link').value;$('link').replaceChildren(new Option('전체 상품',''),...(d.catalog||[]).map(r=>new Option(r.title,r.link_id)));$('link').value=selected;
    $('events-label').textContent=eventPage+' / '+Math.max(1,Math.ceil(d.clicks/50));$('people-label').textContent=visitorPage+' / '+Math.max(1,Math.ceil(d.people_total/20));
    $('events-prev').disabled=eventPage<=1;$('events-next').disabled=eventPage*50>=d.clicks;$('people-prev').disabled=visitorPage<=1;$('people-next').disabled=visitorPage*20>=d.people_total;$('export').disabled=false;
   }catch{if(request===sequence&&owner===viewer()&&isAdmin())el.textContent='클릭 기록을 불러오지 못했어요. 관리자 권한과 연결 상태를 확인해 주세요.';}
  }
  for(const key of ['from','to','link','audience','excluded'])$(key).addEventListener('change',()=>load(true));
  $('today').addEventListener('click',()=>{$('from').value=$('to').value=kstToday();load(true);});$('refresh').addEventListener('click',()=>load());
  for(const key of ['events','people'])for(const dir of ['prev','next'])$(key+'-'+dir).addEventListener('click',()=>{if(key==='events')eventPage=Math.max(1,eventPage+(dir==='next'?1:-1));else visitorPage=Math.max(1,visitorPage+(dir==='next'?1:-1));load();});
  el.addEventListener('click',e=>{const b=e.target.closest('[data-affiliate-filter]');if(b){$('link').value=b.dataset.affiliateFilter;load(true);}});
  $('export').addEventListener('click',async()=>{
   if(!data||!isAdmin())return;const owner=viewer(),request=sequence,base={...filters(),p_cutoff:data.as_of},button=$('export');button.disabled=true;const rows=[];const expected=data.clicks;
   try{if(expected>5000){$('export-status').textContent='CSV는 최대 5,000건이에요. 날짜나 상품 필터를 좁혀 주세요.';return;}
    for(let p=1;p<=Math.max(1,Math.ceil(expected/50));p++){
     const {data:d,error}=await client.rpc('admin_affiliate_summary',{...base,p_event_page:p});if(owner!==viewer()||!isAdmin()||request!==sequence)return;
     if(error||!d?.events)throw error||new Error('missing_data');rows.push(...d.events);
    }
    const unique=Array.from(new Map(rows.map(r=>[r.event_id,r])).values());
    const output=csv([['시간(KST)','회원 여부','닉네임','계정 / 익명 번호','상품','제휴 링크','페이지','화면','유입','브라우저','기기','집계'],...eventRows(unique)]);
    const url=URL.createObjectURL(new Blob([output],{type:'text/csv;charset=utf-8;'})),a=doc.createElement('a');a.href=url;a.download='balzaguk-coupang-'+base.p_from+'-'+base.p_to+'.csv';doc.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    $('export-status').textContent=unique.length+'건 다운로드 · 조회 시점까지의 클릭 기록';
   }catch{if(owner===viewer()&&isAdmin())$('export-status').textContent='CSV 다운로드에 실패했어요. 다시 시도해 주세요.';}
   finally{if(owner===viewer()&&request===sequence&&isAdmin())button.disabled=false;}
  });
  function clear(){sequence++;data=null;el.replaceChildren();$('export').disabled=true;$('export-status').textContent='';}
  return {load,clear};
 }
 root.AdminAffiliate=Object.freeze({render,csv,eventRows,mount});
})(globalThis);
