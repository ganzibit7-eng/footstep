(function(root){'use strict';
const labels={auth_failed:'로그인 요청 실패',auth_rate_limited:'인증 요청 제한',script_policy_block:'브라우저 스크립트 정책 차단',suspicious_route:'의심 경로 접근',admin_access_denied:'관리자 권한 거절',invalid_session:'만료·종료된 민감 작업 세션',invalid_request:'잘못된 민감 작업 요청',account_deleted:'계정 삭제 완료',account_delete_failed:'계정 삭제 처리 실패',submission_guard:'등록 승인 우회 방지'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(data){
 const events=Array.isArray(data?.events)?data.events:[];
 return '<p><strong>서버 기록 '+Number(data?.server_count||0).toLocaleString('ko-KR')+'건 · 브라우저 보고 '+Number(data?.browser_count||0).toLocaleString('ko-KR')+'건</strong></p><p>서버 기록은 처리 결과이며, 브라우저 보고는 조작될 수 있는 참고 신호입니다. 로그인 실패는 연결 오류일 수도 있어 공격으로 단정하지 않습니다. 최근 30일 범위·최신 100건을 표시합니다. 원본 IP·이메일·비밀번호·토큰은 저장하지 않습니다.</p>'+(events.length?'<div class="admin-table-scroll"><table><caption>보안 관련 처리·의심 신호</caption><thead><tr><th>한국 시간</th><th>근거</th><th>내용</th><th>경로</th></tr></thead><tbody>'+events.map(e=>'<tr><td>'+esc(new Date(e.created_at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}))+'</td><td>'+esc(e.source==='server'?'서버 확인':'브라우저 보고')+'</td><td>'+esc(labels[e.event]||'기타 기록')+'</td><td>'+esc(e.path)+'</td></tr>').join('')+'</tbody></table></div>':'<p>선택한 기간에 기록된 보안 신호가 없습니다.</p>')+'<p><small>이 패널은 사이트 코드와 계정 삭제 API에서 수집한 기록입니다. 사이트 실행 전 차단된 요청·정적 파일 404·전체 Supabase 인증/API 요청·대규모 DDoS는 포함하지 않습니다. 전체 공격 분석에는 호스팅과 Supabase 로그가 필요합니다. 0건은 공격이 없었다는 뜻이 아닙니다.</small></p>';
}
function createReporter(sb,getPath){const sent=new Map();return async event=>{if(!labels[event])return;const now=Date.now();if(now-(sent.get(event)||0)<60000)return;sent.set(event,now);try{await sb.functions.invoke('security-monitor',{body:{event,path:getPath().split(/[?#]/)[0]}});}catch{}};}
const api={render,createReporter};root.SecurityMonitor=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis==='undefined'?this:globalThis);
