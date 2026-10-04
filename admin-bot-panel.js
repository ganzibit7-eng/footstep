/* Rendered only after the administrator-only RPC succeeds. */
window.AdminBotPanel={
 render(data,link){
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=n=>Number(n||0).toLocaleString('ko-KR');
  const names={google_ads_crawler:'Google 광고 크롤러',meta_crawler:'Meta 크롤러',naver_crawler:'네이버 Yeti',automation_signal:'기타 자동 접속 신호'};
  const name=k=>esc(names[k]||k);
  const time=t=>new Date(t).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'});
  const table=(headers,rows)=>`<div class="admin-table-scroll"><table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${headers.length}">해당 기간 기록이 없어요.</td></tr>`}</tbody></table></div>`;
  return `<h4>봇·자동 접속 상세</h4><p><strong>원본 조회 ${num(data.total_views)}회 중 자동 접속 ${num(data.bot_views)}회 (${data.total_views?((data.bot_views/data.total_views)*100).toFixed(1):'0'}%)</strong></p><p><small>요청의 크롤러 이름·자동화 신호로 분류한 결과입니다. 운영사 인증이나 사람 인증은 아닙니다. 조회는 페이지 기록 기준이며 반복 API 전송 횟수와 다릅니다. Google 광고·Meta·Yeti의 상세 분류는 2026-10-04 15:23경부터 적용됩니다. 이전 브라우저 기록에는 미분류 봇이 포함될 수 있습니다.</small></p>`
   +table(['종류','조회','브라우저 식별자','마지막 기록'],(data.kinds||[]).map(r=>[name(r.client_kind),num(r.views),num(r.browsers),esc(time(r.last_seen))]))
   +'<details><summary>판별 기준 보기</summary><p>Google 광고: Mediapartners-Google / AdsBot-Google<br>Meta: meta-externalagent / meta-externalfetcher / facebookexternalhit / Facebot<br>네이버: Yeti/<br>기타: bot·crawler·spider·headless 등 또는 브라우저 자동화 신호. 활동이 없다는 이유만으로 봇 처리하지 않습니다.</p></details>'
   +'<h4>시간대별 원본과 제외 건수 · 한국 시간</h4>'+table(['시간','원본 조회','봇·자동 접속','집계 포함'],(data.hours||[]).map(r=>[esc(r.hour_kst),num(r.views),num(r.bots),num(r.included)]))
   +'<h4>봇이 조회한 페이지 · 상위 30개</h4>'+table(['페이지','종류','조회'],(data.paths||[]).map(r=>[link(r.path),name(r.client_kind),num(r.views)]))
   +'<details><summary>최근 자동 접속 기록 · 최대 50개</summary>'+table(['시간(KST)','페이지','종류','활동(초)','클릭'],(data.recent||[]).map(r=>[esc(time(r.created_at)),link(r.path),name(r.client_kind),num(r.active_seconds),num(r.click_count)]))+'</details>';
 }
};
