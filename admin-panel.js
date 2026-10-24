(function(root){'use strict';
function create(context){
 const {sb,ADMIN_UID,adminDayKey,adminDayStart,adminReadRows,allBins,allCourses,avgRating,closeProfileModal,escapeHtml,isAdminUser,isSuperAdmin,loadData,openCourseDetail,openMemberProfile,openNickModal,requestAccountDeletion,resolveReport,reviewsFor,showPage,toast}=context;
  let adminShell=null;
  // ===== Admin (moderation) panel =====
  // ===== 승인 대기 중인 등록물 관리 =====
  function renderPendingApprovals(){
    const listEl = document.getElementById('pending-list');
    const countEl = document.getElementById('pending-count');
    if(!listEl) return;
    const pendingCourses = allCourses().filter(c => c.status === 'pending').map(c => ({ type:'course', table:'courses', id:c.id, name:c.name, author:c.author, emoji:'🐾' }));
    const pendingBins = allBins().filter(b => b.status === 'pending').map(b => ({ type:'bin', table:'bins', id:b.id, name:b.name, author:b.author, emoji:'🚮' }));
    const pendingFacilities = context.facilities.filter(f => f.status === 'pending').map(f => ({ type:'facility', table:'facilities', id:f.id, name:f.name, author:f.author, emoji: FacilityInfo.get(f.category).emoji }));
    const all = [...pendingCourses, ...pendingBins, ...pendingFacilities];
    if(countEl) countEl.textContent = all.length;
    if(!all.length){ listEl.innerHTML = '<p class="empty-admin">승인 대기 중인 항목이 없어요.</p>'; return; }
    const query=document.getElementById('admin-pending-search').value.trim().toLowerCase();
    const visible=all.filter(item=>`${item.name||''} ${item.author||''}`.toLowerCase().includes(query));
    if(!visible.length){listEl.textContent='검색 결과가 없어요.';return;}
    listEl.innerHTML = visible.map(item => `
      <div class="admin-row">
        <div class="info"><b>${item.emoji} ${escapeHtml(item.name)}</b>${item.author ? '등록: '+escapeHtml(item.author) : ''}</div>
        <div class="admin-actions">
          <button class="remove" data-approve="${escapeHtml(item.table)}:${escapeHtml(item.id)}" style="background:#DCEBD6; color:#33612F;">✅ 승인</button>
          <button class="remove" data-reject="${escapeHtml(item.table)}:${escapeHtml(item.id)}">거절</button>
        </div>
      </div>`).join('');
    listEl.querySelectorAll('[data-approve]').forEach(btn=>{
      btn.addEventListener('click', ()=> approvePending(btn.dataset.approve));
    });
    listEl.querySelectorAll('[data-reject]').forEach(btn=>{
      btn.addEventListener('click', ()=> rejectPending(btn.dataset.reject));
    });
  }
  async function approvePending(key){
    if(!isAdminUser(context.myDeviceId)){ toast('관리자만 처리할 수 있어요'); return; }
    const [table, id] = key.split(':');
    try{
      if(!['courses','bins','facilities'].includes(table)||!id)return;
      const { data, error } = await sb.from(table).update({ status: 'approved' }).eq('id', id).eq('status','pending').select('id');
      if(!error&&!data?.length){toast('이미 처리되었거나 권한이 없는 항목이에요. 새로고침해 주세요.');return;}
      if(error){ console.error(error); toast('승인 처리에 실패했어요'); return; }
      toast('승인했어요! 이제 지도에 공개돼요 🐾');
      await loadData();
      renderPendingApprovals();
      renderAdminStats();
    }catch(e){ console.error(e); toast('승인 처리에 실패했어요'); }
  }
  async function rejectPending(key){
    if(!isAdminUser(context.myDeviceId)){ toast('관리자만 처리할 수 있어요'); return; }
    if(!confirm('이 등록 요청을 거절하고 삭제할까요? 되돌릴 수 없어요.')) return;
    const [table, id] = key.split(':');
    try{
      if(!['courses','bins','facilities'].includes(table)||!id)return;
      const { data, error } = await sb.from(table).delete().eq('id', id).eq('status','pending').select('id');
      if(!error&&!data?.length){toast('이미 처리되었거나 권한이 없는 항목이에요. 새로고침해 주세요.');return;}
      if(error){ console.error(error); toast('거절 처리에 실패했어요'); return; }
      toast('거절 처리했어요');
      await loadData();
      renderPendingApprovals();
      renderAdminStats();
    }catch(e){ console.error(e); toast('거절 처리에 실패했어요'); }
  }

  function renderAdminList(){
    const el = document.getElementById('admin-list');
    if(!el) return;
    const entries = Object.keys(context.reports).filter(k => context.reports[k].count > 0);
    if(!entries.length){
      el.innerHTML = '<p class="empty-admin">현재 신고된 항목이 없어요.</p>';
      return;
    }
    el.innerHTML = entries.map(key=>{
      const [type, ...rest] = key.split('_');
      const id = rest.join('_');
      const count = context.reports[key].count;
      let title = id, sub = '';
      if(type === 'course'){
        const c = allCourses().find(x=>x.id===id);
        title = c ? c.name : '(삭제된 코스)'; sub = '산책 코스';
      } else if(type === 'bin'){
        const b = allBins().find(x=>x.id===id);
        title = b ? b.name : '(삭제된 배변봉투함)'; sub = '배변봉투함';
      } else if(type === 'facility'){
        const f = context.facilities.find(x=>String(x.id)===String(id));
        title = f ? f.name : '(삭제된 장소)'; sub = '동반 장소';
      } else if(type === 'review'){
        let found = null;
        Object.values(context.reviews).forEach(list=>{
          const m = list.find(r=>String(r.dbId)===id);
          if(m) found = m;
        });
        title = found ? found.text.slice(0,30) : '(삭제된 리뷰)'; sub = '리뷰';
      }
      return `
        <div class="admin-row">
          <div class="info"><b>${escapeHtml(title)}</b>${escapeHtml(sub)} · 신고 ${count}건${context.reports[key].reasons && context.reports[key].reasons.length ? '<br><span style="color:var(--clay-dark);font-weight:700;">사유: '+context.reports[key].reasons.map(escapeHtml).join(', ')+'</span>' : ''}</div>
          <div class="admin-actions">
            <span class="admin-badge">🚩 ${count}</span>
            <button class="keep" data-resolve="${type}|${id}|keep">문제없음</button>
            <button class="remove" data-resolve="${type}|${id}|remove">삭제</button>
          </div>
        </div>`;
    }).join('');
    el.querySelectorAll('[data-resolve]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const [type, id, action] = btn.dataset.resolve.split('|');
        resolveReport(type, id, action === 'remove' ? 'remove' : 'keep');
      });
    });
  }

  // ===== 회원 활동 관리 (관리자 전용) =====
  async function buildMemberStats(){
    const stats = {}; // owner_id -> { author, courses, bins, facilities, reviews, points }
    function bump(ownerId, field, author){
      if(!ownerId) return;
      if(!stats[ownerId]) stats[ownerId] = { author: author || '(닉네임 없음)', courses:0, bins:0, facilities:0, reviews:0, points:0 };
      if(author) stats[ownerId].author = author;
      stats[ownerId][field]++;
    }
    context.courses.forEach(c => bump(c.ownerId, 'courses', c.author));
    context.bins.forEach(b => bump(b.ownerId, 'bins', b.author));
    context.facilities.forEach(f => bump(f.owner_id, 'facilities', f.author));
    Object.values(context.reviews).forEach(list => list.forEach(r => bump(r.ownerId, 'reviews', r.name)));
    try{
      const { data } = await sb.from('points_log').select('owner_id, amount');
      (data||[]).forEach(r=>{
        if(!stats[r.owner_id]) stats[r.owner_id] = { author:'(닉네임 없음)', courses:0, bins:0, facilities:0, reviews:0, points:0 };
        stats[r.owner_id].points += r.amount;
      });
    }catch(e){ console.error(e); }
    return stats;
  }
  async function renderMemberList(){
    const el = document.getElementById('member-list');
    el.innerHTML = '<p class="empty-admin">불러오는 중...</p>';
    const stats = await buildMemberStats();
    const ids = Object.keys(stats);
    if(!ids.length){ el.innerHTML = '<p class="empty-admin">활동 내역이 있는 회원이 없어요.</p>'; return; }
    ids.sort((a,b)=> (stats[b].courses+stats[b].bins+stats[b].reviews) - (stats[a].courses+stats[a].bins+stats[a].reviews));
    el.innerHTML = ids.map(id=>{
      const s = stats[id];
      const isAdmin = id === ADMIN_UID;
      return `
        <div class="admin-row">
          <div class="info"><b>${s.author}</b>${isAdmin ? ' (관리자)' : ''} · 코스 ${s.courses} · 배변함 ${s.bins} · 시설 ${s.facilities} · 리뷰 ${s.reviews} · 🪙${s.points}P</div>
          <div class="admin-actions">
            ${isAdmin ? '' : `<button class="remove" data-wipe-member="${id}">게시물 전체 삭제</button>`}
          </div>
        </div>`;
    }).join('');
    el.querySelectorAll('[data-wipe-member]').forEach(btn=>{
      btn.addEventListener('click', ()=> wipeMemberContent(btn.dataset.wipeMember));
    });
  }
  async function wipeMemberContent(ownerId){
    if(!isAdminUser(context.myDeviceId)){ toast('관리자만 처리할 수 있어요'); return; }
    if(!confirm('이 회원이 등록한 코스·배변봉투함·동반시설·리뷰를 전부 삭제할까요? 되돌릴 수 없어요.')) return;
    try{
      await sb.from('courses').delete().eq('owner_id', ownerId);
      await sb.from('bins').delete().eq('owner_id', ownerId);
      await sb.from('facilities').delete().eq('owner_id', ownerId);
      await sb.from('reviews').delete().eq('owner_id', ownerId);
      toast('해당 회원의 게시물을 모두 삭제했어요');
      await loadData();
      renderMemberList();
    }catch(e){ console.error(e); toast('삭제 중 오류가 발생했어요'); }
  }
  async function renderAdminStats(){
    const el = document.getElementById('admin-stats');
    if(!el) return;
    el.innerHTML = '<p class="empty-admin">불러오는 중...</p>';
    try{
      const [membersRes, pointsRes, pageViewsRes] = await Promise.all([
        readSignupMembers().then(data=>({count:data.length,error:null})),
        adminReadRows('points_log','amount'),
        adminReadRows('page_views','visitor_id')
      ]);
      const userCourseCount = context.courses.filter(c=>c.ownerId).length;
      const seedCourseCount = allCourses().length - userCourseCount;
      const totalReviews = Object.values(context.reviews).reduce((s,list)=>s+list.length, 0);
      if(membersRes.error) throw membersRes.error;
      const totalMembers = membersRes.count || 0;
      const totalPointsIssued = (pointsRes.data||[]).reduce((s,r)=>s+Math.max(0,Number(r.amount)||0), 0);
      const pvRows = pageViewsRes.data || [];
      const totalPageViews = pvRows.length;
      const totalUniqueVisitors = new Set(pvRows.map(r=>r.visitor_id).filter(Boolean)).size;
      const stats = [
        { num: allCourses().length, label:'전체 코스' },
        { num: userCourseCount, label:'사용자 등록 코스' },
        { num: allBins().length, label:'배변봉투함' },
        { num: context.facilities.length, label:'동반시설' },
        { num: totalReviews, label:'리뷰 수' },
        { num: totalMembers, label:'가입 회원' },
        { num: totalPointsIssued.toLocaleString(), label:'누적 지급 포인트' },
        { num: totalUniqueVisitors.toLocaleString(), label:'누적 방문 브라우저', detail:'visitors' },
        { num: totalPageViews.toLocaleString(), label:'누적 페이지뷰', detail:'pageviews' },
      ];
      el.innerHTML = stats.map(s=>{
        const clickable = s.detail ? ' clickable' : '';
        return `<div class="stat-card${clickable}" ${s.detail ? `data-stat-detail="${s.detail}"` : ''}><div class="num">${s.num}</div><div class="label">${s.label}</div></div>`;
      }).join('');
      el.querySelectorAll('[data-stat-detail]').forEach(card=>{
        card.addEventListener('click', ()=> toggleVisitorTrend(card.dataset.statDetail));
      });
    }catch(e){
      console.error(e);
      el.innerHTML = '<p class="empty-admin">통계를 불러오지 못했어요.</p>';
    }
    renderAdminTodayStats();
    renderAdminTopCourses();
    renderHourlyStats();
  }

  // ===== 실시간 접속자 =====
  let liveVisitorInterval = null;
  async function renderLiveVisitorCount(){
    const countEl = document.getElementById('live-visitor-count');
    const updatedEl = document.getElementById('live-visitor-updated');
    if(!countEl) return;
    try{
      const fiveMinAgo = new Date(Date.now() - 5*60*1000).toISOString();
      const { data: count, error } = await sb.rpc('admin_live_traffic_count');
      if(error){ countEl.textContent = '확인 불가'; if(updatedEl) updatedEl.textContent = '권한 또는 집계 연결을 확인해 주세요'; return; }
      countEl.textContent = (count ?? 0) + '개 브라우저';
      if(updatedEl){
        const now = new Date();
        updatedEl.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')} 기준`;
      }
    }catch(e){ console.error(e); countEl.textContent = '–'; }
  }

  // ===== 시간대별(오늘) 접속 통계 =====
  async function renderHourlyStats(){
    const barsEl = document.getElementById('admin-hourly-stats');
    const labelsEl = document.getElementById('admin-hourly-labels');
    if(!barsEl || !labelsEl) return;
    try{
      const todayStart = adminDayStart();
      const { data, error } = await adminReadRows('page_views','created_at',todayStart.toISOString());
      if(error) throw error;
      const hourCounts = new Array(24).fill(0);
      (data||[]).forEach(row=>{
        const h = new Date(new Date(row.created_at).getTime()+9*3600000).getUTCHours();
        hourCounts[h]++;
      });
      const maxCount = Math.max(1, ...hourCounts);
      const nowHour = new Date(Date.now()+9*3600000).getUTCHours();
      barsEl.innerHTML = hourCounts.map((count, h)=>{
        const heightPct = Math.max(3, Math.round((count / maxCount) * 100));
        const isNow = h === nowHour;
        return `<div class="hourly-bar" data-hour="${h}" data-count="${count}" title="${h}시: ${count}건" style="flex:1; height:${heightPct}%; background:${isNow ? 'var(--clay)' : 'var(--gold)'}; border-radius:3px 3px 0 0; min-width:3px;"></div>`;
      }).join('');
      labelsEl.innerHTML = hourCounts.map((_, h)=> h % 3 === 0 ? `<span style="flex:3; text-align:center;">${h}</span>` : `<span style="flex:1;"></span>`).join('');
      const detailEl = document.getElementById('hourly-detail');
      barsEl.querySelectorAll('.hourly-bar').forEach(bar=>{
        bar.addEventListener('click', ()=>{
          const h = Number(bar.dataset.hour);
          const count = Number(bar.dataset.count);
          const nextH = (h+1) % 24;
          if(detailEl) detailEl.textContent = `🕐 ${h}시 ~ ${nextH}시 : 페이지뷰 ${count}건`;
        });
      });
      if(detailEl && !detailEl.textContent) detailEl.textContent = '막대를 눌러서 시간대별 상세를 확인해보세요';
    }catch(e){
      console.error(e);
      barsEl.innerHTML = '<p class="empty-admin" style="font-size:12px;">시간대별 통계를 불러오지 못했어요.</p>';
    }
  }

  // ===== 전체 가입 회원 목록 =====
  let allMembersCache = [];
  let memberPointsMap = {};
  let memberVisitMap = {};
  let memberLastSeenMap={};
  let memberListRequest=0;
  function memberProviderLabel(provider){return ({google:'구글',kakao:'카카오',email:'이메일',phone:'전화번호'})[provider]||'기타';}
  function memberActivityAt(member){return Math.max(memberLastSeenMap[member.owner_id]||0,Date.parse(member.last_sign_in_at)||0);}
  function getFilteredMembers(){
    const value=id=>document.getElementById(id).value;
    const q=value('all-member-search').trim().toLowerCase(),role=value('member-role-filter'),provider=value('member-provider-filter'),activity=value('member-activity-filter'),from=value('member-date-from'),to=value('member-date-to'),sort=value('member-sort');
    const now=Date.now();
    if(from&&to&&from>to)return [];
    return allMembersCache.filter(m=>{
      const age=now-Date.parse(m.created_at),admin=isAdminUser(m.owner_id),day=Number.isFinite(Date.parse(m.created_at))?adminDayKey(m.created_at):'',active=memberActivityAt(m),inactiveAge=active?now-active:Infinity;
      return `${m.nickname||''} ${m.owner_id||''} ${memberProviderLabel(m.signup_provider)}`.toLowerCase().includes(q)
        &&(role==='all'||role==='admin'&&admin||role==='member'&&!admin||role==='new'&&age>=0&&age<604800000)
        &&(provider==='all'||provider==='other'&&!['google','kakao'].includes(m.signup_provider)||provider===m.signup_provider)
        &&(activity==='all'||activity==='recent'&&active>0&&inactiveAge<=604800000||activity==='inactive'&&active>0&&inactiveAge>=2592000000||activity==='never'&&!m.last_sign_in_at)
        &&(!(from||to)||!!day)&&(!from||day>=from)&&(!to||day<=to);
    }).sort((a,b)=>sort==='lastseen'?memberActivityAt(b)-memberActivityAt(a):sort==='name'?(a.nickname||'').localeCompare(b.nickname||'','ko'):sort==='points'?(memberPointsMap[b.owner_id]||0)-(memberPointsMap[a.owner_id]||0):sort==='views'?(memberVisitMap[b.owner_id]||0)-(memberVisitMap[a.owner_id]||0):(Date.parse(b.created_at)||0)-(Date.parse(a.created_at)||0));
  }
  function renderMemberSummary(){
    const el=document.getElementById('member-summary');
    const counts=[['all','전체',allMembersCache.length],['google','구글',allMembersCache.filter(m=>m.signup_provider==='google').length],['kakao','카카오',allMembersCache.filter(m=>m.signup_provider==='kakao').length]];
    el.innerHTML=counts.map(([provider,label,count])=>`<button type="button" data-member-provider="${provider}">${label} ${count.toLocaleString()}명</button>`).join('');
    el.querySelectorAll('[data-member-provider]').forEach(button=>button.addEventListener('click',()=>{document.getElementById('member-provider-filter').value=button.dataset.memberProvider;memberPage=1;applyMemberFilters();}));
  }
  async function readSignupMembers(){
    const rows=[];let after=null;
    while(true){
      const {data,error}=await sb.rpc('admin_signup_members_v3',{p_after:after,p_limit:500});
      if(error)throw error;
      const page=data||[];rows.push(...page);
      if(page.length<500)return rows;
      const next=page[page.length-1].owner_id;
      if(next===after)throw new Error('회원 조회 커서가 진행되지 않았습니다.');
      after=next;
    }
  }
  document.getElementById('members-refresh-btn').addEventListener('click',async()=>{
    const button=document.getElementById('members-refresh-btn');if(button.disabled)return;
    button.disabled=true;try{await renderAllMemberList(true);}finally{button.disabled=false;}
  });

  let memberActivityState='loading',memberListPending=null,memberListOwner=null,memberListCheckedAt=0;
  function updateMemberActivityControls(){
    const ready=memberActivityState==='ready';
    document.getElementById('member-activity-filter').disabled=!ready;
    for(const sort of ['points','views','lastseen'])document.querySelector('#member-sort option[value="'+sort+'"]').disabled=!ready;
    document.getElementById('export-members-csv-btn').disabled=!ready;
    document.getElementById('export-members-filtered-btn').disabled=!ready;
  }
  function clearMemberInventory(){
    memberListRequest++;memberListOwner=null;memberListCheckedAt=0;memberActivityState='loading';
    allMembersCache=[];memberPointsMap={};memberVisitMap={};memberLastSeenMap={};
    for(const id of ['all-member-list','member-summary','member-filter-status','member-auto-status'])document.getElementById(id).textContent='';
    document.getElementById('all-member-count').textContent='–';updateMemberActivityControls();
  }
  function renderAllMemberList(force=false){
    if(!isAdminUser(context.myDeviceId)){clearMemberInventory();return Promise.resolve();}
    if(memberListPending?.viewer===context.myDeviceId)return memberListPending.promise;
    if(!force&&memberListOwner===context.myDeviceId&&Date.now()-memberListCheckedAt<30000){renderMemberSummary();applyMemberFilters();return Promise.resolve();}
    const pending={viewer:context.myDeviceId};memberListPending=pending;
    pending.promise=loadAllMemberList().finally(()=>{if(memberListPending===pending)memberListPending=null;});
    return pending.promise;
  }
  async function loadAllMemberList(){
    const request=++memberListRequest,viewer=context.myDeviceId;
    const current=()=>request===memberListRequest&&viewer===context.myDeviceId&&isAdminUser(context.myDeviceId);
    const el=document.getElementById('all-member-list'),countEl=document.getElementById('all-member-count');
    if(!el)return;
    if(memberListOwner!==viewer){allMembersCache=[];memberPointsMap={};memberVisitMap={};memberLastSeenMap={};}
    memberListOwner=viewer;memberActivityState='loading';updateMemberActivityControls();
    if(!allMembersCache.length)el.innerHTML='<p class="empty-admin">회원 기본 정보를 불러오는 중…</p>';
    else applyMemberFilters();
    document.getElementById('member-auto-status').textContent='회원 목록 갱신 중 · 기존 목록은 계속 볼 수 있어요.';
    // Observe errors immediately while displaying the roster independently.
    const activity=Promise.resolve(sb.rpc('admin_member_activity_summary')).then(result=>result,error=>({error}));
    try{
      const members=await readSignupMembers();if(!current())return;
      allMembersCache=members;if(countEl)countEl.textContent=members.length;
      renderMemberSummary();applyMemberFilters();
      document.getElementById('member-auto-status').textContent='회원 목록 확인 완료 · 포인트·접속 집계 확인 중';
      const result=await activity;if(!current())return;
      if(result.error)throw result.error;
      const points={},visits={},lastSeen={};
      for(const row of result.data||[]){points[row.owner_id]=Number(row.points)||0;visits[row.owner_id]=Number(row.visits)||0;const at=Date.parse(row.last_seen);if(Number.isFinite(at))lastSeen[row.owner_id]=at;}
      memberPointsMap=points;memberVisitMap=visits;memberLastSeenMap=lastSeen;memberActivityState='ready';memberListCheckedAt=Date.now();
      updateMemberActivityControls();applyMemberFilters();
      document.getElementById('member-auto-status').textContent='수동 갱신 · 마지막 확인 '+new Date().toLocaleTimeString('ko-KR',{timeZone:'Asia/Seoul'});
    }catch(e){
      if(!current())return;
      memberActivityState='error';memberListCheckedAt=0;updateMemberActivityControls();
      document.getElementById('member-auto-status').textContent=allMembersCache.length?'기본 목록은 표시 중 · 부가 정보 조회 실패 · 새로고침해 주세요.':'회원 조회 실패 · 새로고침해 주세요.';
      if(allMembersCache.length){renderMemberSummary();applyMemberFilters();}
      else{if(countEl)countEl.textContent='–';document.getElementById('member-summary').textContent='';el.innerHTML='<p class="empty-admin">회원 목록을 불러오지 못했어요. 위 새로고침 버튼으로 다시 시도해 주세요.</p>';}
      console.error(e);
    }
  }
  function daysAgoLabel(dateStr){
    if(!dateStr) return '-';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diffMs / 86400000);
    if(days <= 0) return '오늘';
    if(days === 1) return '어제';
    if(days < 30) return `${days}일 전`;
    return new Date(dateStr).toLocaleDateString('ko-KR');
  }
  function paintAllMemberList(list){
    const el = document.getElementById('all-member-list');
    if(!el) return;
    if(!list.length){ el.innerHTML = '<p class="empty-admin">조건에 맞는 회원이 없어요. 검색어나 필터를 바꿔보세요.</p>'; return; }
    el.innerHTML = list.map(m=>{
      const joined = m.created_at ? new Date(m.created_at).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'}) : '-';
      const isNew = m.created_at && (Date.now() - new Date(m.created_at).getTime()) < 7*86400000;
      const isAdmin = isAdminUser(m.owner_id);
      const points = memberPointsMap[m.owner_id] || 0;
      const activityAt=memberActivityAt(m),activitySource=activityAt&&(Date.parse(m.last_sign_in_at)||0)>=(memberLastSeenMap[m.owner_id]||0)?'로그인':'화면 조회';
      const metricPending=memberActivityState!=='ready',metricLabel=memberActivityState==='error'?'조회 실패':'확인 중';
      const lastActive=metricPending?metricLabel:activityAt?new Date(activityAt).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})+' ('+activitySource+')':'기록 없음';
      const visitCount = memberVisitMap[m.owner_id] || 0;
      return `
        <article class="admin-member-card">
          <header><span class="member-avatar" aria-hidden="true">${escapeHtml(Array.from(m.nickname||'회원')[0])}</span><div><h5>${escapeHtml(m.nickname||'(닉네임 없음)')}</h5><small>${isAdmin?(m.owner_id===ADMIN_UID?'최고 관리자':'매니저'):'일반 회원'}${isNew?' · 신규':''} · <span class="member-provider-tag">${escapeHtml(memberProviderLabel(m.signup_provider))} 가입</span></small></div></header>
          <dl><div><dt>가입 방식</dt><dd>${escapeHtml(memberProviderLabel(m.signup_provider))}</dd></div><div><dt>마지막 로그인 · 한국 시간</dt><dd>${escapeHtml(m.last_sign_in_at?new Date(m.last_sign_in_at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'기록 없음')}</dd></div><div><dt>가입일</dt><dd>${escapeHtml(joined)}</dd></div><div><dt>최근 접속 기록 · 한국 시간</dt><dd>${escapeHtml(lastActive)}</dd></div><div><dt>화면 조회</dt><dd>${metricPending?metricLabel:visitCount.toLocaleString()+'회'}</dd></div><div><dt>포인트</dt><dd>${metricPending?metricLabel:points.toLocaleString()+'P'}</dd></div></dl>
          <details><summary>회원 식별 정보</summary><code>${escapeHtml(m.owner_id)}</code><p>연결된 로그인 방식: ${escapeHtml((m.linked_providers||[]).map(memberProviderLabel).join(', ')||'확인되지 않음')}</p><p>최근 접속은 마지막 로그인과 통계에 포함된 화면 조회 중 더 최근 시각입니다. 관리자·봇 등 통계 제외 조회는 포함되지 않으며, 현재 온라인 상태와 다를 수 있어요.</p></details>
          <div class="admin-actions"><button type="button" data-member-courses="${escapeHtml(m.owner_id)}">등록 코스 보기</button><button type="button" data-member-copy="${escapeHtml(m.owner_id)}">ID 복사</button>
          ${isAdmin?'':`<button type="button" data-adjust-points="${escapeHtml(m.owner_id)}" ${metricPending?'disabled':''}>포인트 조정</button><button type="button" class="member-danger" data-force-withdraw2="${escapeHtml(m.owner_id)}" ${memberDeletionActions.has(m.owner_id)?'disabled aria-busy="true"':''}>${memberDeletionActions.has(m.owner_id)?'탈퇴 처리 중…':'회원 탈퇴시키기'}</button>`}</div>
        </article>`;
    }).join('');
    el.querySelectorAll('[data-member-courses]').forEach(btn=>btn.addEventListener('click',()=>openMemberProfile(btn.dataset.memberCourses)));
    el.querySelectorAll('[data-member-copy]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.memberCopy);toast('회원 ID를 복사했어요.');}catch(e){toast('회원 식별 정보에서 ID를 확인해 주세요.');}}));
    el.querySelectorAll('[data-force-withdraw2]').forEach(btn=>{
      btn.addEventListener('click', ()=> adminForceWithdraw(btn.dataset.forceWithdraw2));
    });
    el.querySelectorAll('[data-adjust-points]').forEach(btn=>{
      btn.addEventListener('click', ()=> adjustMemberPoints(btn.dataset.adjustPoints));
    });
  }
  const memberPointActions=new Set();
  async function adjustMemberPoints(ownerId){
    if(!isAdminUser(context.myDeviceId)){toast('관리자만 처리할 수 있어요');return;}
    const member=allMembersCache.find(m=>m.owner_id===ownerId);
    if(!member){toast('회원 목록을 새로고침한 뒤 다시 선택해 주세요.');return;}
    if(memberPointActions.has(ownerId)){toast('이 회원의 포인트를 처리하고 있어요.');return;}
    const viewer=context.myDeviceId;
    memberPointActions.add(ownerId);
    try{
      const current=memberPointsMap[ownerId]||0;
      const input=prompt(`회원: ${member.nickname||'(닉네임 없음)'}\n조회된 포인트: ${current}P\n\n지급은 양수, 차감은 음수로 정수를 입력해 주세요.`,'0');
      if(input===null)return;
      const value=input.trim(),amount=Number(value);
      if(!/^[+-]?\d+$/.test(value)||!Number.isSafeInteger(amount)||amount===0||amount < -2147483648||amount > 2147483647){toast('0이 아닌 정수를 정확히 입력해 주세요.');return;}
      const reasonInput=prompt('조정 사유를 입력해 주세요. (1~200자)',amount>0?'관리자 지급':'관리자 차감');
      if(reasonInput===null)return;
      const reason=reasonInput.trim();
      if(!reason||reason.length>200){toast('조정 사유는 1~200자로 입력해 주세요.');return;}
      if(!confirm(`${member.nickname||'(닉네임 없음)'} 님에게 ${amount>0?'+':''}${amount.toLocaleString()}P를 반영할까요?\n사유: ${reason}\n\n다른 관리자의 작업에 따라 현재 잔액은 달라질 수 있어요.`))return;
      if(viewer!==context.myDeviceId||!isAdminUser(context.myDeviceId))return;
      const {error}=await sb.rpc('admin_adjust_points',{p_owner_id:ownerId,p_amount:amount,p_reason:reason});
      if(error){console.error(error);toast('포인트 처리에 실패했어요. 최신 내역을 확인해 주세요.');return;}
      toast(`${amount>0?'+':''}${amount}P 반영 완료`);
      await renderAllMemberList(true);
    }catch(e){console.error(e);toast('응답을 확인하지 못했어요. 중복 반영을 피하려면 최신 포인트를 확인해 주세요.');}
    finally{memberPointActions.delete(ownerId);}
  }
  const memberDeletionActions=new Set();
  async function adminForceWithdraw(ownerId){
    if(!isAdminUser(context.myDeviceId)){toast('관리자만 처리할 수 있어요');return;}
    if(isAdminUser(ownerId)){toast('관리자·매니저는 먼저 권한 이전이 필요해요.');return;}
    if(memberDeletionActions.has(ownerId))return;
    const deletingViewer=context.myDeviceId;
    const member=allMembersCache.find(m=>m.owner_id===ownerId);
    if(!member){toast('회원 목록을 새로고침하고 다시 선택해주세요.');return;}
    if(!confirm(`${member.nickname||'(닉네임 없음)'} 님을 탈퇴시킬까요?\n회원 ID: ${ownerId}\n\n발자국 로그인 계정, 본인 업로드 사진, 게시물·리뷰·산책 기록과 활동 데이터를 삭제합니다. 삭제된 코스의 연결 리뷰·찜도 정리됩니다.\n외부 카카오·Google 계정과 백업·검색 캐시는 삭제하지 않습니다. 복구할 수 없으며 중간 실패 시 재시도가 필요할 수 있어요.`))return;
    if(prompt('최종 확인: "회원탈퇴"를 입력해주세요.')!=='회원탈퇴')return;
    if(context.myDeviceId!==deletingViewer||!isAdminUser(context.myDeviceId))return;
    memberDeletionActions.add(ownerId);
    const buttons=Array.from(document.querySelectorAll('[data-force-withdraw2]')).filter(b=>b.dataset.forceWithdraw2===ownerId);
    buttons.forEach(b=>{b.disabled=true;b.textContent='탈퇴 처리 중…';b.setAttribute('aria-busy','true');});
    try{
      const result=await requestAccountDeletion({confirm:'DELETE_MEMBER_ACCOUNT',user_id:ownerId});
      if(!result?.deleted){
        toast(AccountDeletionClient.message(result?.error));
        if(['recent_sign_in_required','sign_in_required'].includes(result?.error)){
          if(context.reauthenticateAdmin)context.reauthenticateAdmin();else openNickModal();
        }
        return;
      }
      if(result.user_id!==ownerId){toast('삭제 대상 확인이 일치하지 않아요. 회원 목록을 새로고침해 확인해 주세요.');return;}
      if(context.myDeviceId!==deletingViewer||!isAdminUser(context.myDeviceId))return;
      toast('회원 계정과 데이터 삭제를 완료했어요.');
      allMembersCache=allMembersCache.filter(m=>m.owner_id!==ownerId);
      delete memberPointsMap[ownerId];delete memberVisitMap[ownerId];delete memberLastSeenMap[ownerId];
      renderMemberSummary();applyMemberFilters();
      document.getElementById('all-member-count').textContent=allMembersCache.length;
      const refreshes=await Promise.allSettled([loadData(),renderAllMemberList(true),renderMemberList(),renderAdminStats()]);
      if(refreshes.some(r=>r.status==='rejected'))toast('탈퇴는 완료됐어요. 최신 목록은 새로고침해 주세요.');
    }catch(e){console.error(e);toast('연결이 끊겨 결과를 확인하지 못했어요. 목록을 확인한 뒤 재시도해주세요.');}
    finally{memberDeletionActions.delete(ownerId);buttons.forEach(b=>{b.disabled=false;b.textContent='회원 탈퇴시키기';b.removeAttribute('aria-busy');});}
  }
  function csvSafeCell(value){
    const text=String(value??'');
    return /^[\s]*[=+@-]/.test(text)||/^[\t\r\n]/.test(text) ? "'"+text : text;
  }
  function exportMembersCSV(filtered=false){
    if(!isAdminUser(context.myDeviceId)||document.getElementById('export-members-csv-btn').disabled)return;
    const list=filtered?getFilteredMembers():allMembersCache;
    if(!list.length){toast('내보낼 회원이 없어요');return;}
    const rows = [['닉네임','회원 ID','가입 방식','가입일','최근 로그인(KST)','화면 조회','포인트','배지']];
    list.forEach(m=>{
      rows.push([m.nickname||'',m.owner_id,memberProviderLabel(m.signup_provider),m.created_at?new Date(m.created_at).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'}):'',m.last_sign_in_at?new Date(m.last_sign_in_at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}):'',memberVisitMap[m.owner_id]||0,memberPointsMap[m.owner_id]||0,m.badge||'']);
    });
    const csv = '\uFEFF' + rows.map(r => r.map(v => `"${csvSafeCell(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `발자국_회원목록_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
  document.getElementById('export-members-csv-btn').addEventListener('click',()=>exportMembersCSV(false));
  document.getElementById('export-members-filtered-btn').addEventListener('click',()=>exportMembersCSV(true));
  document.getElementById('all-member-search').addEventListener('input',()=>{memberPage=1;applyMemberFilters();});

 let memberPage=1;
  function updateMemberAdvancedState(){const badge=document.getElementById('member-advanced-count');if(!badge)return;const count=Number(document.getElementById('member-activity-filter').value!=='all')+Number(!!document.getElementById('member-date-from').value)+Number(!!document.getElementById('member-date-to').value);badge.textContent=count?count+'개 적용':'접속 상태·가입일';badge.dataset.active=String(count>0);}
 function applyMemberFilters(){
    updateMemberAdvancedState();
  const list=getFilteredMembers();
  const pages=Math.max(1,Math.ceil(list.length/20));memberPage=Math.min(memberPage,pages);
  paintAllMemberList(list.slice((memberPage-1)*20,memberPage*20));
  document.getElementById('member-filter-status').textContent=`전체 ${allMembersCache.length}명 · 검색 결과 ${list.length}명 (전체 CSV / 검색 결과 CSV 선택 가능)`;
  document.getElementById('member-page-label').textContent=`${memberPage} / ${pages}`;
  document.getElementById('member-page-prev').disabled=memberPage<=1;document.getElementById('member-page-next').disabled=memberPage>=pages;
 }
 for(const id of ['member-role-filter','member-sort','member-provider-filter','member-activity-filter','member-date-from','member-date-to'])document.getElementById(id).addEventListener('change',()=>{memberPage=1;applyMemberFilters();});
 document.getElementById('member-filters-reset').addEventListener('click',()=>{for(const id of ['all-member-search','member-date-from','member-date-to'])document.getElementById(id).value='';for(const id of ['member-role-filter','member-provider-filter','member-activity-filter'])document.getElementById(id).value='all';document.getElementById('member-sort').value='new';memberPage=1;applyMemberFilters();});
 document.getElementById('member-page-prev').addEventListener('click',()=>{memberPage=Math.max(1,memberPage-1);applyMemberFilters();});
 document.getElementById('member-page-next').addEventListener('click',()=>{memberPage++;applyMemberFilters();});
 let selectAdminView=()=>{};
 (function(){
  const root=document.querySelector('#admin-overlay .modal-body');
  const today=root.querySelector('[data-accordion="today"]').closest('.admin-accordion');
  const traffic=root.querySelector('.admin-traffic-panel');
  traffic.before(today);
  // KPI and realtime blocks live outside the collapsible activity section.
  const details=document.createElement('details'),summary=document.createElement('summary');details.className='admin-section-details';summary.textContent='📈 방문 통계 · 유입 · 봇 분석 · CSV';traffic.before(details);details.append(summary,traffic);
  const anchor=root.querySelector('[data-accordion="stats"]').closest('.admin-accordion');
  for(const key of ['pending','reports','allmembers','activemembers'])anchor.before(root.querySelector(`[data-accordion="${key}"]`).closest('.admin-accordion'));
  root.querySelectorAll('.admin-accordion-head').forEach(head=>{
   const body=document.getElementById('acc-'+head.dataset.accordion),open=head.dataset.accordion==='today';
   head.setAttribute('role','button');head.tabIndex=0;head.setAttribute('aria-controls',body.id);head.setAttribute('aria-expanded',String(open));
   body.style.display=open?'':'none';head.querySelector('.accordion-arrow').textContent=open?'▾':'▸';
   head.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();head.click();}});

  });
  details.dataset.adminView='overview';
  const assignments={today:'overview',stats:'overview',hourly:'overview',top:'overview',allmembers:'members',activemembers:'members',managers:'members',pending:'review',reports:'review',bulk:'tools'};
  root.querySelectorAll('.admin-accordion-head').forEach(head=>{head.closest('.admin-accordion').dataset.adminView=assignments[head.dataset.accordion]||'tools';});
  document.getElementById('admin-affiliate-details').dataset.adminView='affiliate';document.getElementById('admin-security-details').dataset.adminView='security';
  const workspace=document.createElement('div');workspace.className='admin-workspace';today.before(workspace);const nav=document.createElement('nav');nav.className='admin-navigation';nav.setAttribute('aria-label','관리 메뉴');const content=document.createElement('div');content.className='admin-workspace-content';workspace.append(nav,content);while(workspace.nextSibling)content.append(workspace.nextSibling);
  const menus=[['overview','운영 개요','방문·활동 현황','M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z'],['members','회원 관리','회원·권한·활동','M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3M18 8a3 3 0 0 1 0 6M22 21v-3a4 4 0 0 0-3-4M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0'],['review','콘텐츠 검수','승인 대기·신고','M5 3h14v18H5zM8 8h8M8 12h8M8 16h5'],['affiliate','제휴 성과','상품 클릭 분석','M4 20V10M10 20V4M16 20v-7M22 20H2'],['security','보안 기록','접근·이상 감지','M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9V7l-9-4M8 12l3 3 5-6'],['tools','데이터 관리','공공데이터 등록','M4 5h16v14H4zM4 10h16M10 10v9']];
  const viewHeading=document.createElement("header");viewHeading.className="admin-view-heading";const viewTitle=document.createElement("h4");const viewSummary=document.createElement("p");viewHeading.append(viewTitle,viewSummary);content.prepend(viewHeading);
  const overviewKpis=document.createElement('section');overviewKpis.className='admin-overview-kpis';overviewKpis.dataset.adminView='overview';overviewKpis.setAttribute('aria-label','오늘의 핵심 운영 지표');overviewKpis.append(document.getElementById('admin-summary'),document.getElementById('admin-live-activity'));viewHeading.after(overviewKpis);
  function selectView(view,focus=false){const menu=menus.find(item=>item[0]===view);if(menu){viewTitle.textContent=menu[1];viewSummary.textContent=menu[2];adminShell?.select(menu[1],focus);}for(const section of content.querySelectorAll('[data-admin-view]'))section.hidden=section.dataset.adminView!==view;for(const button of nav.querySelectorAll('button')){button.setAttribute('aria-current',button.dataset.adminNav===view?'page':'false');}if(focus){const first=content.querySelector('[data-admin-view="'+view+'"]');const head=first?.querySelector('.admin-accordion-head');if(head&&head.getAttribute('aria-expanded')!=='true')head.click();if(first?.tagName==='DETAILS')first.open=true;content.focus({preventScroll:true});globalThis.PawUI?.enter(content);}}
  selectAdminView=selectView;
  for(const [view,label,description,path]of menus){const button=document.createElement('button');button.type='button';button.dataset.adminNav=view;button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+path+'"/></svg><span><strong>'+label+'</strong><small>'+description+'</small></span>';button.addEventListener('click',()=>selectView(view,true));nav.append(button);}content.tabIndex=-1;adminShell=globalThis.AdminConsole.create({overlay:document.getElementById('admin-overlay'),workspace,nav});selectView('overview');

 })();

  // ===== 방문자/페이지뷰 카드 클릭 시 최근 7일 추세 =====
  let visitorTrendOpenFor = null;
  async function toggleVisitorTrend(kind){
    const box = document.getElementById('visitor-trend-detail');
    if(!box) return;
    if(visitorTrendOpenFor === kind && box.style.display !== 'none'){
      box.style.display = 'none';
      visitorTrendOpenFor = null;
      return;
    }
    visitorTrendOpenFor = kind;
    box.style.display = '';
    box.innerHTML = '<p class="empty-admin" style="margin:0;">불러오는 중...</p>';
    try{
      const start = adminDayStart(6);
      const { data, error } = await adminReadRows('page_views','visitor_id, created_at',start.toISOString());
      if(error) throw error;
      const rows = data || [];
      const dayMap = {}; // 'YYYY-MM-DD' -> {views, visitors:Set}
      rows.forEach(r=>{
        const d = new Date(r.created_at);
        const key = adminDayKey(d);
        if(!dayMap[key]) dayMap[key] = { views:0, visitors:new Set() };
        dayMap[key].views++;
        dayMap[key].visitors.add(r.visitor_id);
      });
      const days = [];
      for(let i=6; i>=0; i--){
        const d = adminDayStart(i);
        const key = adminDayKey(d);
        const entry = dayMap[key] || { views:0, visitors:new Set() };
        days.push({ label: key.slice(5).replace('-','/'), views: entry.views, visitors: entry.visitors.size });
      }
      const title = kind === 'visitors' ? '최근 7일 방문자(순) 추세' : '최근 7일 페이지뷰 추세';
      const maxVal = Math.max(1, ...days.map(d => kind === 'visitors' ? d.visitors : d.views));
      box.innerHTML = `
        <div style="font-size:12.5px; font-weight:700; color:var(--pine-deep); margin-bottom:10px;">📈 ${title}</div>
        <div style="display:flex; align-items:flex-end; gap:6px; height:70px;">
          ${days.map(d=>{
            const val = kind === 'visitors' ? d.visitors : d.views;
            const h = Math.max(4, Math.round((val/maxVal)*100));
            return `<div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%;">
              <div style="font-size:10px; color:var(--pine-deep); font-weight:700; margin-bottom:2px;">${val}</div>
              <div style="width:100%; height:${h}%; background:var(--moss); border-radius:3px 3px 0 0;"></div>
            </div>`;
          }).join('')}
        </div>
        <div style="display:flex; gap:6px; margin-top:4px;">
          ${days.map(d=>`<div style="flex:1; text-align:center; font-size:10px; color:var(--muted-text);">${d.label}</div>`).join('')}
        </div>`;
    }catch(e){
      console.error(e);
      box.innerHTML = '<p class="empty-admin" style="margin:0;">추세를 불러오지 못했어요.</p>';
    }
  }

  // ===== 관리자 대시보드 상단 요약 카드 =====
  // ===== 유입 경로 =====
  // ===== 매니저(부관리자) 관리 — 최고 관리자 전용 =====
  let managersCache = [];
  async function renderManagerList(){
    const el = document.getElementById('manager-list');
    if(!el) return;
    el.innerHTML = '<p class="empty-admin">불러오는 중...</p>';
    try{
      const { data, error } = await sb.from('admins').select('*').order('created_at', { ascending:false });
      if(error) throw error;
      managersCache = data || [];
      if(!managersCache.length){
        el.innerHTML = '<p class="empty-admin">아직 지정된 매니저가 없어요.</p>';
        return;
      }
      const nicknameMap = {};
      allMembersCache.forEach(m => { nicknameMap[m.owner_id] = m.nickname; });
      el.innerHTML = managersCache.map(m=>{
        const nickname = nicknameMap[m.owner_id] || m.owner_id.slice(0,8)+'...';
        const since = m.created_at ? new Date(m.created_at).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'}) : '-';
        return `
          <div class="admin-row">
            <div class="info"><b>🔑 ${escapeHtml(nickname)}</b> · ${escapeHtml(since)}부터 매니저</div>
            <div class="admin-actions">
              <button class="remove" data-remove-manager="${escapeHtml(m.owner_id)}">매니저 해제</button>
            </div>
          </div>`;
      }).join('');
      el.querySelectorAll('[data-remove-manager]').forEach(btn=>{
        btn.addEventListener('click', ()=> removeManager(btn.dataset.removeManager));
      });
    }catch(e){
      console.error(e);
      el.innerHTML = '<p class="empty-admin">매니저 목록을 불러오지 못했어요. (SQL 마이그레이션이 적용됐는지 확인해주세요)</p>';
    }
  }
  async function addManager(ownerId, nickname){
    if(!isSuperAdmin(context.myDeviceId)){ toast('최고 관리자만 매니저를 지정할 수 있어요'); return; }
    if(ownerId === ADMIN_UID){ toast('이미 최고 관리자예요'); return; }
    if(!confirm(`"${nickname}" 님을 매니저로 지정할까요?\n관리자 화면의 모든 기능을 쓸 수 있게 돼요.`)) return;
    try{
      const { error } = await sb.from('admins').insert([{ owner_id: ownerId, added_by: context.myDeviceId }]);
      if(error){ console.error(error); toast('지정에 실패했어요'); return; }
      toast(`"${nickname}" 님을 매니저로 지정했어요 🔑`);
      document.getElementById('new-manager-search').value = '';
      document.getElementById('new-manager-results').innerHTML = '';
      renderManagerList();
    }catch(e){ console.error(e); toast('지정에 실패했어요'); }
  }
  async function removeManager(ownerId){
    if(!isSuperAdmin(context.myDeviceId)){ toast('최고 관리자만 매니저를 해제할 수 있어요'); return; }
    if(!confirm('이 매니저를 해제할까요?')) return;
    try{
      const { error } = await sb.from('admins').delete().eq('owner_id', ownerId);
      if(error){ console.error(error); toast('해제에 실패했어요'); return; }
      toast('매니저를 해제했어요');
      renderManagerList();
    }catch(e){ console.error(e); toast('해제에 실패했어요'); }
  }
  document.getElementById('new-manager-search').addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    const resultsEl = document.getElementById('new-manager-results');
    if(!q){ resultsEl.innerHTML = ''; return; }
    const managerIds = new Set(managersCache.map(m=>m.owner_id));
    const matches = allMembersCache
      .filter(m => (m.nickname||'').toLowerCase().includes(q) && m.owner_id !== ADMIN_UID && !managerIds.has(m.owner_id))
      .slice(0, 6);
    if(!matches.length){ resultsEl.innerHTML = '<p class="empty-admin" style="margin-top:8px;">일치하는 회원이 없어요.</p>'; return; }
    resultsEl.innerHTML = matches.map(m=>`
      <div class="admin-row">
        <div class="info"><b>${escapeHtml(m.nickname || '(닉네임 없음)')}</b></div>
        <div class="admin-actions"><button class="remove" data-add-manager="${escapeHtml(m.owner_id)}" data-nickname="${escapeHtml(m.nickname||'')}" style="background:var(--sand); color:var(--pine-deep);">매니저로 지정</button></div>
      </div>`).join('');
    resultsEl.querySelectorAll('[data-add-manager]').forEach(btn=>{
      btn.addEventListener('click', ()=> addManager(btn.dataset.addManager, btn.dataset.nickname));
    });
  });

  // ===== 공공데이터 CSV 일괄 등록 =====
  let bulkParsedRows = [];
  let bulkHeaders = [];
  let bulkSelectedType = 'course';
  document.getElementById('bulk-csv-input').addEventListener('change', (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    if(typeof Papa === 'undefined'){ toast('CSV 처리 도구를 불러오지 못했어요. 새로고침 후 다시 시도해주세요'); return; }
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results)=>{
        bulkParsedRows = results.data;
        bulkHeaders = results.meta.fields || [];
        if(!bulkParsedRows.length){ toast('CSV에서 데이터를 찾지 못했어요'); return; }
        populateBulkColumnSelects();
        renderBulkPreview();
        document.getElementById('bulk-import-mapping').style.display = '';
        toast(`${bulkParsedRows.length}개 행을 불러왔어요. 컬럼을 지정해주세요`);
      },
      error: (err)=>{ console.error(err); toast('CSV를 읽는 데 실패했어요. 인코딩이 UTF-8인지 확인해주세요'); }
    });
  });
  function populateBulkColumnSelects(){
    const selects = ['bulk-col-name','bulk-col-lat','bulk-col-lng','bulk-col-desc'];
    selects.forEach(id=>{
      const sel = document.getElementById(id);
      const keepEmpty = id === 'bulk-col-desc';
      sel.innerHTML = (keepEmpty ? '<option value="">— 사용 안 함 —</option>' : '') +
        bulkHeaders.map(h=>`<option value="${h}">${h}</option>`).join('');
    });
    // 흔한 공공데이터 컬럼명 자동 추정
    const guess = (cands)=> bulkHeaders.find(h => cands.some(c => h.includes(c)));
    const nameGuess = guess(['시설명','명칭','산책로명','공원명','이름']);
    const latGuess = guess(['위도','lat','LAT','Y좌표']);
    const lngGuess = guess(['경도','lng','LNG','X좌표']);
    const descGuess = guess(['소재지','주소','설명','개요']);
    if(nameGuess) document.getElementById('bulk-col-name').value = nameGuess;
    if(latGuess) document.getElementById('bulk-col-lat').value = latGuess;
    if(lngGuess) document.getElementById('bulk-col-lng').value = lngGuess;
    if(descGuess) document.getElementById('bulk-col-desc').value = descGuess;
  }
  function renderBulkPreview(){
    const nameCol = document.getElementById('bulk-col-name').value;
    const latCol = document.getElementById('bulk-col-lat').value;
    const lngCol = document.getElementById('bulk-col-lng').value;
    const descCol = document.getElementById('bulk-col-desc').value;
    const rows = bulkParsedRows.slice(0, 3);
    const el = document.getElementById('bulk-preview');
    el.innerHTML = `
      <table style="width:100%; border-collapse:collapse;">
        <tr style="font-weight:800; color:var(--pine-deep);"><td>이름</td><td>위도</td><td>경도</td><td>설명</td></tr>
        ${rows.map(r=>`<tr><td>${escapeHtml(r[nameCol]||'-')}</td><td>${escapeHtml(r[latCol]||'-')}</td><td>${escapeHtml(r[lngCol]||'-')}</td><td>${escapeHtml(descCol ? (r[descCol]||'-') : '-')}</td></tr>`).join('')}
      </table>`;
  }
  ['bulk-col-name','bulk-col-lat','bulk-col-lng','bulk-col-desc'].forEach(id=>{
    document.getElementById(id).addEventListener('change', renderBulkPreview);
  });
  document.getElementById('bulk-type-group').addEventListener('click', (e)=>{
    const el = e.target.closest('.tag-check');
    if(!el) return;
    document.querySelectorAll('#bulk-type-group .tag-check').forEach(x=>x.classList.remove('on'));
    el.classList.add('on');
    bulkSelectedType = el.dataset.bulkType;
    document.getElementById('bulk-facility-category-wrap').style.display = (bulkSelectedType === 'facility') ? '' : 'none';
  });
  let bulkSelectedFacilityCategory = '식당카페';
  document.getElementById('bulk-facility-category-group').addEventListener('click', (e)=>{
    const el = e.target.closest('.tag-check');
    if(!el) return;
    document.querySelectorAll('#bulk-facility-category-group .tag-check').forEach(x=>x.classList.remove('on'));
    el.classList.add('on');
    bulkSelectedFacilityCategory = el.dataset.bulkFacilityCategory;
  });
  document.getElementById('bulk-import-submit-btn').addEventListener('click', async ()=>{
    if(!isAdminUser(context.myDeviceId)){ toast('관리자만 처리할 수 있어요'); return; }
    const nameCol = document.getElementById('bulk-col-name').value;
    const latCol = document.getElementById('bulk-col-lat').value;
    const lngCol = document.getElementById('bulk-col-lng').value;
    const descCol = document.getElementById('bulk-col-desc').value;
    if(!nameCol || !latCol || !lngCol){ toast('이름·위도·경도 컬럼을 모두 지정해주세요'); return; }
    if(!confirm(`${bulkParsedRows.length}개 행을 "${bulkSelectedType === 'course' ? '산책 코스' : bulkSelectedType === 'bin' ? '배변봉투함' : '동반시설'}"(으)로 일괄 등록할까요?`)) return;

    const progressEl = document.getElementById('bulk-import-progress');
    const validRows = [];
    const bulkSeen=new Set();
    const existingBulk=bulkSelectedType==='course'?allCourses():bulkSelectedType==='bin'?allBins():context.facilities;
    const bulkKey=(name,lat,lng)=>name.replace(/\s+/g,'').toLowerCase()+'|'+Number(lat).toFixed(4)+'|'+Number(lng).toFixed(4);
    existingBulk.forEach(row=>bulkSeen.add(bulkKey(row.name||'',row.lat,row.lng)));
    let skipped = 0;
    bulkParsedRows.forEach((r, i)=>{
      const name = (r[nameCol]||'').trim();
      const lat = Number(String(r[latCol]||'').trim());
      const lng = Number(String(r[lngCol]||'').trim());
      if(!name || name.length>120 || !Number.isFinite(lat) || !Number.isFinite(lng) || lat<33 || lat>39.5 || lng<124 || lng>132){ skipped++; return; }
      const key=bulkKey(name,lat,lng);
      if(bulkSeen.has(key)){skipped++;return;}
      bulkSeen.add(key);
      // 충돌 걱정 없는 고유 ID (시간 + 인덱스 + 랜덤값 조합)
      const uniqueId = `pub${Date.now()}_${i}_${Math.random().toString(36).slice(2,8)}`;
      validRows.push({
        id: uniqueId,
        name,
        desc: descCol ? (r[descCol]||'') : '',
        lat, lng,
        ownerId: null,
        author: '지자체 공공데이터'
      });
    });
    if(!validRows.length){ toast('등록 가능한 행이 없어요. 컬럼 지정을 확인해주세요'); return; }

    function toPayload(row){
      if(bulkSelectedType === 'course') return { id:row.id, name:row.name, description:row.desc, lat:row.lat, lng:row.lng, owner_id:null, author:row.author };
      if(bulkSelectedType === 'bin') return { id:row.id, name:row.name, description:row.desc, lat:row.lat, lng:row.lng, owner_id:null, author:row.author };
      return { id:row.id, name:row.name, description:row.desc, category:bulkSelectedFacilityCategory, lat:row.lat, lng:row.lng, owner_id:null, author:row.author };
    }
    const table = bulkSelectedType === 'course' ? 'courses' : bulkSelectedType === 'bin' ? 'bins' : 'facilities';

    progressEl.textContent = `등록 중... 0 / ${validRows.length}`;
    const CHUNK = 200;
    let done = 0, failed = 0;
    for(let i = 0; i < validRows.length; i += CHUNK){
      const chunk = validRows.slice(i, i + CHUNK);
      try{
        const payload = chunk.map(toPayload);
        const { error } = await sb.from(table).insert(payload);
        if(error){
          // 묶음 전체가 실패하면, 문제 있는 행 하나 때문에 나머지 좋은 데이터까지 날아가지 않도록
          // 한 줄씩 다시 시도해서 살릴 수 있는 건 최대한 살림
          console.error('묶음 등록 실패, 한 줄씩 재시도:', error);
          for(const row of chunk){
            try{
              const { error: rowError } = await sb.from(table).insert([toPayload(row)]);
              if(rowError){ failed++; console.error('행 등록 실패:', row.name, rowError); }
              else done++;
            }catch(e){ failed++; console.error(e); }
          }
        } else {
          done += chunk.length;
        }
      }catch(e){ console.error(e); failed += chunk.length; }
      progressEl.textContent = `등록 중... ${Math.min(i+CHUNK, validRows.length)} / ${validRows.length}`;
    }
    progressEl.textContent = `✅ 완료! 성공 ${done}개 · 실패 ${failed}개 · 제외(중복·잘못된 값) ${skipped}개`;
    toast('공공데이터 일괄 등록이 끝났어요');
    await loadData();
    renderAdminStats();
  });
  document.getElementById('bulk-cleanup-btn').addEventListener('click', async ()=>{
    if(!isAdminUser(context.myDeviceId)){ toast('관리자만 처리할 수 있어요'); return; }
    if(!confirm('지금까지 "지자체 공공데이터"로 등록된 코스·배변봉투함·동반시설을 전부 삭제할까요?\n직접 등록한 것들은 영향 없어요. 되돌릴 수 없어요.')) return;
    const statusEl = document.getElementById('bulk-cleanup-status');
    statusEl.textContent = '삭제 중...';
    try{
      const results = await Promise.allSettled([
        sb.from('courses').delete().eq('author', '지자체 공공데이터'),
        sb.from('bins').delete().eq('author', '지자체 공공데이터'),
        sb.from('facilities').delete().eq('author', '지자체 공공데이터'),
      ]);
      const failedOps = results.filter(r => r.status === 'rejected' || (r.value && r.value.error));
      statusEl.textContent = failedOps.length ? '일부 삭제에 실패했어요. 콘솔을 확인해주세요' : '✅ 공공데이터로 등록한 항목을 모두 삭제했어요';
      toast('삭제 완료');
      await loadData();
      renderAdminStats();
    }catch(e){ console.error(e); statusEl.textContent = '삭제 중 오류가 발생했어요'; }
  });

  async function renderReferrerBreakdown(){
    const el = document.getElementById('admin-referrer-list');
    if(!el) return;
    el.innerHTML = '<p class="empty-admin">불러오는 중...</p>';
    try{
      const start = adminDayStart(6);
      const { data, error } = await adminReadRows('page_views','visitor_id, referrer',start.toISOString());
      if(error) throw error;
      const buckets = Object.create(null);
      (data||[]).forEach(r=>{
        const raw = r.referrer || '직접 방문';
        let key = raw==='직접 방문'?'직접 방문 / 출처 미상':raw;
        if(raw.startsWith('utm:')){
          const source = raw.split(' · ')[0].replace(/^utm:/,'').toLowerCase();
          if(source.includes('threads')) key = 'Threads';
          else if(source.includes('naver')) key = '네이버';
          else if(source.includes('instagram')) key = 'Instagram';
          else if(source.includes('kakao')) key = '카카오';
          else if(source.includes('google')) key = 'Google';
          else key = raw;
        }else{
          const low = raw.toLowerCase();
          if(low.includes('search.naver') || low.includes('naver.com')) key = '네이버 검색/외부';
          else if(low.includes('google.')) key = 'Google 검색/외부';
          else if(low.includes('threads.net')) key = 'Threads';
          else if(low.includes('instagram.com')) key = 'Instagram';
        }
        if(!buckets[key]) buckets[key] = {views:0,visitors:new Set()};
        buckets[key].views++;
        if(r.visitor_id) buckets[key].visitors.add(r.visitor_id);
      });
      const sorted = Object.entries(buckets)
        .map(([source,v])=>[source,v.views,v.visitors.size])
        .sort((a,b)=>b[2]-a[2] || b[1]-a[1])
        .slice(0,10);
      if(!sorted.length){ el.innerHTML = '<p class="empty-admin">아직 데이터가 없어요.</p>'; return; }
      const allVisitors = new Set((data||[]).map(r=>r.visitor_id).filter(Boolean)).size || 1;
      el.innerHTML = '<p style="font-size:12px;color:var(--muted-text);margin:0 0 12px;">순방문자 기준으로 정렬했어요. 홍보 링크에는 <code>?utm_source=threads</code>처럼 UTM을 붙이면 채널별 성과를 더 정확히 볼 수 있어요.</p>' +
      sorted.map(([source, views, visitors])=>{
        const pct = Math.round((visitors/allVisitors)*100);
        return `
          <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; gap:12px; font-size:13px; margin-bottom:4px;">
              <span style="font-weight:700; color:var(--pine-deep);">${escapeHtml(source)}</span>
              <span style="color:var(--muted-text);">${visitors}명 · ${views}뷰 (${pct}%)</span>
            </div>
            <div style="background:var(--line); border-radius:999px; height:6px; overflow:hidden;">
              <div style="width:${Math.max(2,pct)}%; height:100%; background:var(--moss);"></div>
            </div>
          </div>`;
      }).join('');
    }catch(e){
      console.error(e);
      el.innerHTML = '<p class="empty-admin">불러오지 못했어요. (SQL 마이그레이션이 아직 적용 안 됐을 수 있어요)</p>';
    }
  }

  async function renderAdminSummary(){
    const el=document.getElementById('admin-summary');if(!el)return;
    el.textContent='요약을 불러오고 있어요…';
    try{
      const [traffic,signups]=await Promise.all([
        sb.rpc('admin_traffic_summary_v2',{p_days:1}),
        sb.from('points_log').select('owner_id').eq('reason','회원가입 축하 포인트').gte('created_at',adminDayStart().toISOString())
      ]);
      if(traffic.error||signups.error)throw traffic.error||signups.error;
      const d=traffic.data;
      const cards=[
        {num:d.engaged_visitors,label:'오늘 활동 확인 브라우저',jump:'traffic'},
        {num:d.visitors,label:'오늘 방문 브라우저 · 사람 수 아님',jump:'traffic'},
        {num:d.views,label:'오늘 집계 포함 조회',jump:'hourly'},
        {num:(signups.data||[]).length,label:'오늘 가입축하 지급 건',jump:'today'}
      ];
      el.innerHTML=cards.map(c=>'<button type="button" class="stat-card clickable" data-jump="'+c.jump+'"><span class="num">'+globalThis.AdminConsole.formatCount(c.num)+'</span><span class="label">'+escapeHtml(c.label)+'</span></button>').join('')
       +'<details class="admin-stat-note"><summary>지표 해석 및 이전 집계 참고</summary><p>활동 확인은 클릭 또는 화면 노출 10초 이상 기준이며 사람 인증은 아닙니다. 2026-10-04 15:23경 이전에는 일부 광고 크롤러가 일반 브라우저로 기록되어 오늘 방문 수가 부풀려져 있을 수 있습니다. 일일 200명 목표 달성 여부는 이 숫자만으로 판단하지 않습니다.</p></details>';
      el.querySelectorAll('[data-jump]').forEach(c=>c.addEventListener('click',()=>expandAccordion(c.dataset.jump)));
    }catch(e){el.textContent='요약을 불러오지 못했어요. 새로고침해 주세요.';}
  }
  function expandAccordion(key){
    selectAdminView(['allmembers','activemembers','managers'].includes(key)?'members':['pending','reports'].includes(key)?'review':key==='bulk'?'tools':'overview');
    if(key==='traffic'){const panel=document.querySelector('.admin-traffic-panel'),details=panel.closest('details');if(details)details.open=true;panel.scrollIntoView({behavior:'smooth',block:'start'});return;}
    const body = document.getElementById('acc-' + key);
    const head = document.querySelector(`.admin-accordion-head[data-accordion="${key}"]`);
    if(!body || !head) return;
    body.style.display = '';
    head.querySelector('.accordion-arrow').textContent = '▾';
    head.setAttribute('aria-expanded','true');
    head.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  // ===== 관리자 대시보드 아코디언(섹션 펼치기/접기) =====
  document.querySelectorAll('.admin-accordion-head').forEach(head=>{
    head.addEventListener('click', ()=>{
      const key = head.dataset.accordion;
      const body = document.getElementById('acc-' + key);
      const arrow = head.querySelector('.accordion-arrow');
      const isOpen = body.style.display !== 'none';
      body.style.display = isOpen ? 'none' : '';
      head.setAttribute('aria-expanded',String(!isOpen));
      arrow.textContent = isOpen ? '▸' : '▾';
      if(key==='allmembers'&&!isOpen)renderAllMemberList();
    });
  });

  async function renderAdminTodayStats(){
    const el = document.getElementById('admin-today-stats');
    if(!el) return;
    el.innerHTML = '<p class="empty-admin">불러오는 중...</p>';
    try{
      const todayStart = adminDayStart();
      const iso = todayStart.toISOString();
      const [newCourses, newBins, newFacilities, newReviews, newWalks, newSignups, todayViews] = await Promise.all([
        sb.from('courses').select('id', { count:'exact', head:true }).gte('created_at', iso),
        sb.from('bins').select('id', { count:'exact', head:true }).gte('created_at', iso),
        sb.from('facilities').select('id', { count:'exact', head:true }).gte('created_at', iso),
        sb.from('reviews').select('id', { count:'exact', head:true }).gte('created_at', iso),
        sb.from('walks').select('id', { count:'exact', head:true }).gte('created_at', iso),
        sb.from('points_log').select('owner_id').eq('reason', '회원가입 축하 포인트').gte('created_at', iso),
        adminReadRows('page_views','visitor_id',iso),
      ]);
      for(const result of [newCourses,newBins,newFacilities,newReviews,newWalks,newSignups,todayViews]){if(result.error) throw result.error;}
      const todayVisitorRows = todayViews.data || [];
      const todayUniqueVisitors = new Set(todayVisitorRows.map(r=>r.visitor_id)).size;
      const stats = [
                                { num: newCourses.count||0, label:'오늘 새 코스' },
        { num: newBins.count||0, label:'오늘 새 배변함' },
        { num: newFacilities.count||0, label:'오늘 새 시설' },
        { num: newReviews.count||0, label:'오늘 새 리뷰' },
        { num: newWalks.count||0, label:'오늘 산책기록' },
      ];
      el.innerHTML = stats.map(s=>`<div class="stat-card"><div class="num">${s.num}</div><div class="label">${s.label}</div></div>`).join('');
    }catch(e){
      console.error(e);
      el.innerHTML = '<p class="empty-admin">불러오지 못했어요.</p>';
    }
  }
  function renderAdminTopCourses(){
    const el = document.getElementById('admin-top-courses');
    if(!el) return;
    const ranked = allCourses()
      .map(c => ({ c, reviewCount: reviewsFor(c.id).length, avg: Number(avgRating(c.id))||0 }))
      .filter(x => x.reviewCount > 0)
      .sort((a,b) => b.reviewCount - a.reviewCount || b.avg - a.avg)
      .slice(0, 5);
    if(!ranked.length){ el.innerHTML = '<p class="empty-admin">아직 리뷰가 달린 코스가 없어요.</p>'; return; }
    el.innerHTML = ranked.map((x,i)=>`
      <div class="admin-row" data-top-course="${escapeHtml(x.c.id)}" style="cursor:pointer;">
        <div class="info"><b>${i+1}. ${escapeHtml(x.c.name)}</b>리뷰 ${x.reviewCount}개 · ★ ${x.avg.toFixed(1)}</div>
      </div>`).join('');
    el.querySelectorAll('[data-top-course]').forEach(row=>{
      row.addEventListener('click', ()=>{
        document.getElementById('admin-overlay').classList.remove('show');
        if(liveVisitorInterval){ clearInterval(liveVisitorInterval); liveVisitorInterval = null; }
        showPage('map');
        setTimeout(()=> openCourseDetail(row.dataset.topCourse), 350);
      });
    });
  }


 function adminTrafficPageLink(path){
  const p=String(path||'');
  if(!/^\/[A-Za-z0-9/_-]*(\.html)?$/.test(p))return escapeHtml(p);
  const match=p.match(/^\/(courses|places)\/([A-Za-z0-9_-]+)\/?$/);
  const entry=match?(match[1]==='courses'?allCourses():context.facilities).find(c=>String(c.id)===match[2]):null;
  const labels={'/':'발자국 홈','/index.html':'발자국 홈','/discover.html':'산책 코스 탐색'};
  const title=entry?.name||labels[p]||p;
  return '<a href="'+escapeHtml(p)+'" target="_blank" rel="noopener noreferrer">'+escapeHtml(title)+' ↗</a>'+(title!==p?'<br><small>'+escapeHtml(p)+'</small>':'');
 }
 let adminBotRequest=0;
 async function renderAdminBots(){
  const el=document.getElementById('admin-bot-result'),request=++adminBotRequest;
  if(!el||!isAdminUser(context.myDeviceId))return;
  el.textContent='자동 접속 기록을 불러오고 있어요…';
  try{
   const {data,error}=await sb.rpc('admin_bot_traffic',{p_days:Number(document.getElementById('admin-traffic-period').value)});
   if(request!==adminBotRequest)return;
   if(error||!data)throw error||new Error('invalid_bot_stats');
   el.innerHTML=AdminBotPanel.render(data,adminTrafficPageLink);
  }catch(e){if(request===adminBotRequest)el.textContent='자동 접속 기록을 불러오지 못했어요. 새로고침해 주세요.';}
 }

 let adminSecurityRequest=0;
 async function renderAdminSecurity(){
  const el=document.getElementById('admin-security-result'),request=++adminSecurityRequest,viewer=context.myDeviceId;
  if(!el||!isAdminUser(viewer))return;el.textContent='보안 기록을 불러오고 있어요…';
  try{const {data,error}=await sb.rpc('admin_security_summary',{p_days:Number(document.getElementById('admin-security-period').value)});if(request!==adminSecurityRequest||viewer!==context.myDeviceId||!isAdminUser(context.myDeviceId))return;if(error||!data)throw error||new Error('missing_data');el.innerHTML=SecurityMonitor.render(data);}
  catch{if(request===adminSecurityRequest)el.textContent='보안 기록을 불러오지 못했어요. 관리자 권한과 연결을 확인해 주세요.';}
 }
 document.getElementById('admin-security-period').addEventListener('change',renderAdminSecurity);
 document.getElementById('admin-security-refresh').addEventListener('click',renderAdminSecurity);
 const affiliateAdmin=AdminAffiliate.mount({client:sb,isAdmin:()=>isAdminUser(context.myDeviceId),viewer:()=>context.myDeviceId});
 let adminTrafficData=null,adminTrafficRequest=0;
 async function renderAdminTraffic(){
  affiliateAdmin?.load();
  const request=++adminTrafficRequest,el=document.getElementById('admin-traffic-result'),button=document.getElementById('admin-traffic-export');
  adminTrafficData=null;button.disabled=true;el.textContent='통계를 불러오고 있어요…';
  try{
   const {data,error}=await sb.rpc('admin_traffic_summary_v2',{p_days:Number(document.getElementById('admin-traffic-period').value)});
   if(request!==adminTrafficRequest)return;
   if(error||!Array.isArray(data?.daily))throw error||new Error('invalid_stats');
   adminTrafficData=data;
   const num=x=>Number(x||0).toLocaleString('ko-KR'),delta=Number(data.views)-Number(data.previous_views);
   el.innerHTML=`<p><strong>조회 ${num(data.views)}회 · 방문 브라우저 ${num(data.visitors)}개 · 활동 확인 ${num(data.engaged_visitors)}개</strong><br>관리자·작업 접속 및 자동 접속 신호 ${num(data.excluded_views)}회 제외 · 원본 ${num(data.raw_views)}회<br><small>활동 확인: 화면 노출 10초 이상 또는 클릭 기록. 실제 사람 인증은 아닙니다. 2026-10-04 15:23경 이전 미분류 크롤러로 방문 브라우저 수가 부풀려질 수 있습니다. 이전 기록 ${num(data.unmeasured_views)}회는 활동·페이지 정보 미수집입니다.</small><br>이전 동일 길이 기간 대비 조회 ${delta>0?'+':''}${num(delta)}회</p><div class="admin-table-scroll"><table><caption>일별 방문 추이</caption><thead><tr><th>날짜</th><th>조회</th><th>방문 브라우저</th><th>활동 확인</th></tr></thead><tbody>${data.daily.map(r=>`<tr><td>${escapeHtml(r.date)}</td><td>${num(r.views)}</td><td>${num(r.visitors)}</td><td>${num(r.engaged)}</td></tr>`).join('')}</tbody></table></div><h4>주요 유입 경로</h4>${data.sources?.length?`<div class="admin-table-scroll"><table><thead><tr><th>경로</th><th>첫 유입 브라우저</th><th>조회</th></tr></thead><tbody>${data.sources.map(r=>`<tr><td>${escapeHtml(r.source)}</td><td>${num(r.visitors)}</td><td>${num(r.views)}</td></tr>`).join('')}</tbody></table></div>`:'<p>기록된 유입이 없어요.</p>'}<p><small>출처 없는 공유 링크·앱 접속은 직접 방문 / 출처 미상으로 기록됩니다. 유입 브라우저는 기간 내 첫 기록의 출처로 분류합니다.</small></p><h4>조회한 페이지</h4><div class="admin-table-scroll"><table><thead><tr><th>페이지</th><th>조회</th></tr></thead><tbody>${(data.paths||[]).map(r=>`<tr><td>${adminTrafficPageLink(r.path)}</td><td>${num(r.views)}</td></tr>`).join('')}</tbody></table></div><h4>홍보 캠페인</h4>${(data.campaigns||[]).length?`<div class="admin-table-scroll"><table><thead><tr><th>출처</th><th>매체</th><th>캠페인</th><th>조회</th></tr></thead><tbody>${data.campaigns.map(r=>`<tr><td>${escapeHtml(r.source)}</td><td>${escapeHtml(r.medium)}</td><td>${escapeHtml(r.campaign)}</td><td>${num(r.views)}</td></tr>`).join('')}</tbody></table></div>`:'<p>아직 UTM 캠페인 기록이 없어요.</p>'}`;
   button.disabled=false;
   renderAdminBots();
   renderAdminSecurity();
  }catch(e){if(request===adminTrafficRequest)el.textContent='통계를 불러오지 못했어요. 관리자 로그인 상태를 확인하고 새로고침해 주세요.';}
 }
 document.getElementById('admin-traffic-period').addEventListener('change',renderAdminTraffic);
 document.getElementById('admin-pending-search').addEventListener('input',renderPendingApprovals);
 document.getElementById('admin-traffic-export').addEventListener('click',()=>{
  if(!adminTrafficData||!isAdminUser(context.myDeviceId))return;
  const rows=[['날짜(KST)','조회수(내부·자동접속 신호 제외)','방문 브라우저 수','활동 확인 브라우저 수'],...adminTrafficData.daily.map(r=>[r.date,Number(r.views),Number(r.visitors),Number(r.engaged)])];
  const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'})),a=document.createElement('a');
  a.href=url;a.download=`balzaguk-traffic-${adminTrafficData.days}days.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });

  async function refreshAdminDashboard(){
    if(!isAdminUser(context.myDeviceId))return;
    const button=document.getElementById('admin-refresh-btn');
    if(button.disabled)return;
    button.disabled=true;
    try{
      await Promise.all([loadData(),renderAllMemberList(true)]);
      await Promise.all([renderAdminTraffic(),renderAdminSummary(),renderAdminStats(),renderAdminList(),renderPendingApprovals(),renderLiveVisitorCount()]);
      if(isSuperAdmin(context.myDeviceId))await renderManagerList();
      document.getElementById('admin-last-refreshed').textContent=`조회 종료: ${new Date().toLocaleTimeString('ko-KR')}`;
    }catch(e){toast('새로고침에 실패했어요. 다시 시도해 주세요.');}
    finally{button.disabled=false;}
  }
  document.getElementById('admin-refresh-btn').addEventListener('click', refreshAdminDashboard);

  async function openAdminDashboard(){
    if(!isAdminUser(context.myDeviceId)){ toast('관리자만 접근할 수 있어요'); return; }
    selectAdminView('overview');
    renderAllMemberList();
    const todayHead=document.querySelector('#admin-overlay [data-accordion="today"]');
    document.getElementById('acc-today').style.display='';
    todayHead.setAttribute('aria-expanded','true');
    todayHead.querySelector('.accordion-arrow').textContent='▾';
    renderAdminSummary();
    renderAdminStats();
    renderAdminList();
    renderPendingApprovals();
    renderMemberList();
    renderAdminTraffic();
    renderLiveVisitorCount();
    const managerWrap = document.getElementById('manager-section-wrap');
    if(managerWrap){
      managerWrap.style.display = isSuperAdmin(context.myDeviceId) ? '' : 'none';
      if(isSuperAdmin(context.myDeviceId)) renderManagerList();
    }
    const ts = document.getElementById('admin-last-refreshed');
    if(ts) ts.textContent = `마지막 새로고침: ${new Date().toLocaleTimeString('ko-KR')}`;
    if(liveVisitorInterval) clearInterval(liveVisitorInterval);
    // 실시간 접속자만 5초마다 자동 갱신 (다른 통계는 "지금 새로고침" 버튼으로 필요할 때만 갱신 — 불필요한 서버 요청 방지)
    liveVisitorInterval = setInterval(renderLiveVisitorCount, 5000);
    document.getElementById('admin-overlay').classList.add('show');
    document.querySelector('#admin-overlay .modal-inner-wrap').scrollTop=0;
    document.querySelector('#admin-overlay .modal').scrollTop=0;
  }
  document.getElementById('admin-close').addEventListener('click', ()=>{
    document.getElementById('admin-overlay').classList.remove('show');
    if(liveVisitorInterval){ clearInterval(liveVisitorInterval); liveVisitorInterval = null; }
  });
  document.getElementById('admin-overlay').addEventListener('click', (e)=>{
    if(e.target.id === 'admin-overlay'){
      document.getElementById('admin-overlay').classList.remove('show');
      if(liveVisitorInterval){ clearInterval(liveVisitorInterval); liveVisitorInterval = null; }
    }
  });



 function dispose(){adminShell?.dispose();clearMemberInventory();affiliateAdmin?.clear();if(liveVisitorInterval){clearInterval(liveVisitorInterval);liveVisitorInterval=null;}document.getElementById('admin-overlay')?.remove();}
 return Object.freeze({open:openAdminDashboard,renderReports:renderAdminList,dispose});
}
root.PawAdminPanel=Object.freeze({create});
})(typeof globalThis==='undefined'?this:globalThis);
