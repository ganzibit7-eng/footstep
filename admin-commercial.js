(function(root){'use strict';
const CHANNELS={ad_banner:'배너 클릭',advertise:'광고 안내 페이지',coupang:'쿠팡 클릭',trip:'트립닷컴 클릭'};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function normalize(data,A=root.AdminAnalytics){
 if(!data||!Array.isArray(data.channels))throw new Error('invalid_commercial');
 A.dateRange(data.date_from,data.date_to);
 const seen=new Set();const channels=data.channels.map(c=>{
  if(!CHANNELS[c.id]||seen.has(c.id))throw new Error('invalid_channel');seen.add(c.id);
  const daily=A.dailyRows(c),clicks=A.count(c.clicks),visitors=A.count(c.visitors);
  if(visitors!==null&&clicks!==null&&visitors>clicks)throw new Error('invalid_counts');
  return {id:c.id,clicks,visitors,tracking_started_at:c.tracking_started_at||null,daily};
 });
 if(seen.size!==4)throw new Error('missing_channel');
 return {...data,channels};
}
function csv(channel){
 const action=channel.id==='advertise'?'조회 횟수':'클릭 횟수';
 return '\uFEFF'+[['날짜(KST)',action,'중복 제외 브라우저 수'],...channel.daily.map(r=>[r.date,r.views??'',r.visitors??''])].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
}
function mount({client,isAdmin,viewer}){
 const doc=root.document,host=doc.getElementById('admin-commercial-panel'),A=root.AdminAnalytics;if(!host)return null;
 host.innerHTML='<h4>광고·제휴 관심 현황</h4><p>항목을 선택하면 일별 추이를 확인할 수 있어요. 브라우저 수는 실제 사람 수와 다를 수 있습니다.</p><div class="admin-tools admin-traffic-toolbar"><select id="admin-commercial-period" aria-label="광고·제휴 통계 기간"><option value="1">오늘</option><option value="7">최근 7일</option><option value="30">최근 30일</option><option value="90">최근 90일</option><option value="custom">직접 날짜 선택</option></select><form id="admin-commercial-dates" hidden><label>시작일<input id="admin-commercial-from" type="date" required></label><span class="admin-date-separator" aria-hidden="true">–</span><label>종료일<input id="admin-commercial-to" type="date" required></label><button type="submit" id="admin-commercial-apply">기간 적용</button></form><button type="button" id="admin-commercial-export" disabled>선택 항목 CSV</button><button type="button" id="admin-commercial-retry" hidden>다시 불러오기</button></div><p id="admin-commercial-status" role="status" aria-live="polite"></p><div id="admin-commercial-result" aria-busy="false"></div><p class="admin-chart-note">발자국에서 기록된 조회·클릭입니다. 관리자·작업 접속·자동 접속 신호를 제외하며, 사람 인증이나 구매·예약·수수료 실적이 아닙니다. 쿠팡 상세 내역은 아래에서 계속 볼 수 있어요.</p><details class="admin-analytics-method"><summary>집계 범위와 누락 안내</summary><p>배너는 홈의 광고·브랜드 파트너 배너 클릭, 광고 안내는 /advertise/의 페이지 조회, 트립닷컴은 제휴 예약 링크 클릭입니다. 쿠팡은 기존 상품 클릭 기록을 재사용하며 중복 수집하지 않습니다. 배너·트립닷컴은 새 집계 연결 이후부터 확인할 수 있고 이전 값은 미집계로 표시해요. 방문 통계 참여 중단·통신 실패·전송 전 페이지 종료에 따른 누락이 있을 수 있습니다. 기록 보관은 90일이며, 브라우저 삭제·기기 변경 시 별도 브라우저로 계산될 수 있습니다. 배너·트립닷컴의 날짜는 서버가 클릭을 수신한 한국 시간 날짜이며, 반복 전송은 같은 클릭으로 처리합니다. 클릭 브라우저 수는 해당 기간 안에서 중복을 제거하므로 일별 값을 더한 결과와 다를 수 있습니다.</p></details>';
 const $=id=>doc.getElementById('admin-commercial-'+id);let sequence=0,data=null,selected='ad_banner',inflight=null,inflightKey='';
 function filters(){const p=$('period').value;const args=p==='custom'?A.dateRange($('from').value,$('to').value):A.presetRange(Number(p));if((Date.parse(args.p_to)-Date.parse(args.p_from))/86400000>89)throw new Error('클릭 기록은 한 번에 최대 90일까지 조회할 수 있어요.');return args;}
 function show(){
  if(!data)return;const c=data.channels.find(x=>x.id===selected),result=$('result');
  result.innerHTML='<p class="admin-analytics-period">'+esc(data.date_from)+' – '+esc(data.date_to)+' <span>한국 시간 기준</span></p><div class="admin-commercial-cards">'+Object.entries(CHANNELS).map(([id,name])=>{const v=data.channels.find(x=>x.id===id);return '<button type="button" data-commercial-channel="'+id+'" aria-pressed="'+(id===selected)+'"><span>'+name+'</span><strong>'+(v.visitors===null?'미집계':A.format(v.visitors)+'<small>개 브라우저</small>')+'</strong><em>'+(v.clicks===null?'집계 연결 전 기간':A.format(v.clicks)+(id==='advertise'?'회 조회':'회 클릭'))+'</em></button>';}).join('')+'</div><div class="admin-commercial-chart"></div><p class="admin-chart-note">'+(c.tracking_started_at?'집계 연결일: '+esc(A.kstDate(new Date(c.tracking_started_at)))+' · 연결 전 날짜는 미집계입니다.':'기존 페이지 조회 기록 기준입니다.')+'</p>';
  A.mountChart(result.querySelector('.admin-commercial-chart'),{daily:c.daily},{title:CHANNELS[selected]+' · 일별 추이',unknownLabel:'미집계',metrics:{views:[selected==='advertise'?'조회 횟수':'클릭 횟수','회'],visitors:[selected==='advertise'?'방문 브라우저':'클릭 브라우저','개']}});
  result.querySelectorAll('[data-commercial-channel]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.commercialChannel;show();result.querySelector('[data-commercial-channel="'+selected+'"]').focus({preventScroll:true});}));
 }
 function load(){
  if(!isAdmin())return Promise.resolve(false);let args;try{args=filters();}catch(e){$('status').textContent=e.message;return Promise.resolve(false);}
  const owner=viewer(),key=JSON.stringify([owner,args]);if(inflight&&inflightKey===key)return inflight;
  const request=++sequence,current=()=>request===sequence&&owner===viewer()&&isAdmin();data=null;$('export').disabled=true;$('apply').disabled=true;$('retry').hidden=true;$('result').textContent='광고·제휴 기록을 불러오고 있어요…';$('result').setAttribute('aria-busy','true');$('status').textContent='선택 기간을 확인하고 있어요…';
  const task=(async()=>{try{const {data:d,error}=await client.rpc('admin_commercial_summary',args);if(!current())return false;if(error)throw error;data=normalize(d,A);show();$('status').textContent='확인 시각: '+A.kstTime(data.as_of);$('export').disabled=false;return true;}catch{if(current()){$('status').textContent='광고·제휴 통계를 불러오지 못했어요.';$('result').textContent='관리자 로그인과 연결을 확인한 뒤 다시 불러와 주세요.';$('retry').hidden=false;}return false;}finally{if(current()){$('result').setAttribute('aria-busy','false');$('apply').disabled=false;}}})();
  inflight=task;inflightKey=key;task.finally(()=>{if(inflight===task){inflight=null;inflightKey='';}});return task;
 }
 $('period').addEventListener('change',()=>{clear();const custom=$('period').value==='custom';$('dates').hidden=!custom;for(const id of ['from','to']){$(id).max=A.kstDate();if(!$(id).value)$(id).value=A.kstDate();}if(custom)$('status').textContent='시작일과 종료일을 선택하고 기간 적용을 눌러 주세요. 최대 90일까지 조회할 수 있어요.';else load();});
 $('dates').addEventListener('submit',e=>{e.preventDefault();load();});$('retry').addEventListener('click',load);
 $('export').addEventListener('click',()=>{if(!data||!isAdmin())return;const url=URL.createObjectURL(new Blob([csv(data.channels.find(c=>c.id===selected))],{type:'text/csv;charset=utf-8;'})),a=doc.createElement('a');a.href=url;a.download='balzaguk-'+selected+'-'+data.date_from+'_'+data.date_to+'.csv';doc.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 function clear(){sequence++;data=null;inflight=null;inflightKey='';$('result').replaceChildren();$('export').disabled=true;$('apply').disabled=false;}
 return {load,clear};
}
const api=Object.freeze({CHANNELS,normalize,csv,mount});if(typeof module==='object'&&module.exports)module.exports=api;else root.AdminCommercial=api;
})(typeof globalThis==='undefined'?this:globalThis);
