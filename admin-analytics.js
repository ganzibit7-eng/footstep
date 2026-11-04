(function(root){'use strict';
const METRICS={views:['집계 포함 조회','회'],visitors:['방문 브라우저','개'],engaged:['활동 확인 브라우저','개']};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function count(value){if(typeof value!=='number'&&!(typeof value==='string'&&/^\d+$/.test(value)))return null;const n=Number(value);return Number.isSafeInteger(n)&&n>=0?n:null;}
const format=value=>count(value)===null?'—':count(value).toLocaleString('ko-KR');
function kstTime(value){const date=new Date(value);return Number.isNaN(date.getTime())?'확인 불가':new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(date)+' KST';}
function dailyRows(data){
 if(!Array.isArray(data?.daily))throw new Error('invalid_daily');
 let previous='';return data.daily.map(row=>{
  const date=String(row.date||''),parsed=new Date(date+'T00:00:00Z');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(parsed.getTime())||parsed.toISOString().slice(0,10)!==date||date<=previous)throw new Error('invalid_daily_date');
  previous=date;return {date,views:count(row.views),visitors:count(row.visitors),engaged:count(row.engaged)};
 });
}
function comparison(data){
 const current=count(data.views),previous=count(data.previous_views);
 if(current===null||previous===null)return '이전 기간 비교 자료 없음';
 const delta=current-previous,change=(delta>0?'+':'')+delta.toLocaleString('ko-KR');
 const percent=previous>0?' · '+(delta>0?'+':'')+(delta/previous*100).toFixed(1)+'%':'';
 return '이전 동기간 대비 조회 '+change+'회'+percent+(previous===0?' · 이전 0회':'');
}
function ratio(numerator,denominator){const a=count(numerator),b=count(denominator);return a===null||b===null||b===0||a>b?null:(a/b*100).toFixed(1)+'%';}
function interestCount(row){const total=count(row.measured_views),active=count(row.engaged_views);return total>0&&active!==null&&active<=total?format(active):'미집계';}
function experienceHTML(data){
 const x=data?.experience||{},rate=ratio(x.search_visitors,x.measured_visitors),detailRate=ratio(x.detail_views,x.measured_views);
 const measured=count(x.measured_visitors),engaged=count(data.engaged_visitors),valid=measured!==null&&engaged!==null&&engaged<=measured;
 const activityRate=valid?ratio(engaged,measured):null,unconfirmed=valid?measured-engaged:null;
 const rows=[['기록된 검색 제출',count(x.searches)===null?'미집계':format(x.searches)+'회'],['검색 사용 브라우저 비율',rate===null?'미집계':rate],['분류된 상세 조회 비중',detailRate===null?'미집계':detailRate],['자동 접속 신호 조회',count(data.automation_views)===null?'미집계':format(data.automation_views)+'회'],['활동 기준 충족 비율',activityRate===null?'미집계':activityRate],['활동 기준 미충족 브라우저',unconfirmed===null?'미집계':format(unconfirmed)+'개']];
 return '<section class="admin-experience"><h4>검색과 상세 탐색</h4><div class="admin-analytics-summary">'+rows.map(([label,value])=>'<div><span>'+label+'</span><strong>'+esc(value)+'</strong></div>').join('')+'</div><p class="admin-chart-note">자동 접속 신호·관리자·작업 접속을 제외한 기록 기준입니다. 일반 브라우저로 분류됐다는 뜻이며 실제 사람으로 인증된 수치는 아닙니다. 활동 기준 미충족은 클릭과 10초 이상 화면 노출 기록이 없는 브라우저로, 봇이나 이탈로 단정하지 않습니다.</p><p class="admin-chart-note">상세 비중 = <strong>분류된 상세 조회 횟수 ÷ 일반 분류 전체 조회 횟수</strong>. 방문자 비율·이동 순서·가입 전환율이 아닙니다. 활동 기준 미충족 조회도 포함됩니다.</p><details class="admin-analytics-method"><summary>미집계 전환·해석 한계</summary><p>검색 이용률은 같은 분류의 기록 브라우저 중 검색을 제출한 비율입니다. 상세 주소는 현재 등록된 장소·코스와 전문업소 상세 URL로 구분합니다. 2026-10-26 이전 검색 제출은 일부 누락될 수 있습니다.</p><p>지도 보기·길찾기 구분 클릭률, 회원가입 버튼 클릭→실제 가입 완료 전환율, 정확한 이탈 단계는 미집계입니다. 기존 일반 링크 클릭을 해당 전환으로 간주하지 않습니다. 2026-11-01부터 화면 노출 10초 도달 시와 첫 클릭을 즉시 전송하도록 보완했습니다. 이전 누락을 소급 복원하지 않으며 종료·네트워크 차단에 따른 누락 가능성은 남아 있습니다. 평균 활동 시간과 활동 확인 조회는 관심도 참고값이며 사람 인증이나 이탈률이 아닙니다. 새 개인정보나 이벤트는 수집하지 않았습니다.</p></details></section>';
}
function summary(data){
 const label=data.date_from&&data.date_to?data.date_from.replaceAll('-','.')+' – '+data.date_to.replaceAll('-','.') : count(data.days)===1?'오늘':count(data.days)!==null?'최근 '+format(data.days)+'일':'선택 기간';
 return (data.date_from?'<p class="admin-analytics-period">'+esc(label)+' <span>한국 시간 기준</span></p>':'')+'<div class="admin-analytics-summary" aria-label="'+esc(label)+' 통계">'+[['views','집계 포함 조회','회'],['visitors','방문 브라우저','개'],['engaged_visitors','활동 확인','개']].map(([key,name,unit])=>'<div><span>'+esc(data.date_from?name:label+' · '+name)+'</span><strong>'+format(data[key])+'<small>'+unit+'</small></strong></div>').join('')+'</div><p class="admin-analytics-comparison">'+comparison(data)+'</p>'
  +'<p class="admin-chart-note">'+(data.is_partial===false?'선택한 날짜의 하루 전체 집계입니다.':'한국 시간 '+esc(kstTime(data.to))+'까지 집계 · 오늘은 진행 중입니다. 오늘의 수치를 이전 날짜 하루 전체와 직접 비교하지 마세요.')+'</p><details class="admin-analytics-method"><summary>집계 기준·제외 내역</summary><p>관리자·작업 접속 및 자동 접속 신호 '+format(data.excluded_views)+'회 제외 · 원본 '+format(data.raw_views)+'회. 활동 확인은 화면 노출 10초 이상 또는 클릭 기록이며 사람 인증은 아닙니다.</p><p>2026-10-04 15:23경 이전 미분류 크롤러로 방문 브라우저 수가 부풀려질 수 있습니다. 이전 기록 '+format(data.unmeasured_views)+'회는 활동·페이지 정보 미수집입니다.</p><p>기간 합계의 브라우저 수는 기간 안에서 중복을 제거하므로 일별 브라우저 수를 더한 값과 다를 수 있습니다. 이전 비교는 서버가 제공한 동일 기간·동일 시각까지의 조회 합계를 사용합니다.</p></details>';
}
function chartModel(rows,metric,width=720){
 if(!METRICS[metric])throw new Error('invalid_metric');
 const max=Math.ceil(Math.max(2,...rows.map(row=>count(row[metric])??0))/2)*2;let path='',connected=false;
 const points=rows.map((row,index)=>{const value=count(row[metric]),x=rows.length===1?width/2:64+index/Math.max(1,rows.length-1)*(width-104);if(value===null){connected=false;return {date:row.date,value:null,x,y:null};}const y=180-value/max*140;path+=(connected?' L':' M')+x.toFixed(2)+' '+y.toFixed(2);connected=true;return {date:row.date,value,x,y};});
 return {max,path,points};
}
function nearestIndex(x,length,width=720){return length<2?0:Math.max(0,Math.min(length-1,Math.round((x-64)/(width-104)*(length-1))));}
function kstDate(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
function dateRange(from,to,today=kstDate()){
 const valid=v=>{const d=new Date(v+'T00:00:00Z');return /^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===v;};
 if(!valid(from)||!valid(to))throw new Error('시작일과 종료일을 모두 선택해 주세요.');
 if(from>to)throw new Error('종료일은 시작일보다 빠를 수 없어요.');
 if(to>today)throw new Error('미래 날짜의 통계는 조회할 수 없어요.');
 const days=(Date.parse(to)-Date.parse(from))/86400000+1;
 if(days>366)throw new Error('한 번에 최대 366일까지 조회할 수 있어요.');
 return {p_from:from,p_to:to};
}
function presetRange(days,today=kstDate()){
 if(![1,7,30,90].includes(days))throw new Error('지원하지 않는 통계 기간이에요.');
 const from=new Date(Date.parse(today+'T00:00:00Z')-(days-1)*86400000).toISOString().slice(0,10);return dateRange(from,today,today);
}
let chartSequence=0;
function mountChart(host,data,options={}){
 const chartMetrics=options.metrics||METRICS,chartId='admin-chart-'+(++chartSequence);
 const rows=dailyRows(data),doc=host.ownerDocument,box=doc.createElement('div');box.className='admin-traffic-chart';box.style.setProperty('--admin-chart-columns',String(Object.keys(chartMetrics).length));
 let metric='views',index=Math.max(0,rows.length-1),width=Math.max(220,host.clientWidth||720);
 function draw(){
  const [name]=chartMetrics[metric],model=chartModel(rows,metric,width);
  box.innerHTML='<div class="admin-chart-heading"><h4>'+esc(options.title||'일별 방문 추이')+'</h4><div class="admin-chart-metrics" aria-label="차트 지표">'+Object.entries(chartMetrics).map(([key,[label]])=>'<button type="button" data-chart-metric="'+key+'" aria-pressed="'+(metric===key)+'">'+label+'</button>').join('')+'</div></div>'
   +(rows.length?'<p class="admin-chart-hint" id="'+chartId+'-hint">그래프를 눌러 날짜별 수치를 확인하세요. 키보드에서는 좌우 방향키로 이동할 수 있어요.</p><svg viewBox="0 0 '+width+' 220" tabindex="0" role="group" aria-label="'+name+' 날짜별 그래프" aria-describedby="'+chartId+'-hint '+chartId+'-value">'+[40,110,180].map((y,i)=>'<line x1="64" x2="'+(width-40)+'" y1="'+y+'" y2="'+y+'" class="admin-chart-grid"/><text x="48" y="'+(y+4)+'" text-anchor="end">'+format(Math.round(model.max*(1-i/2)))+'</text>').join('')+'<path d="'+model.path+'" class="admin-chart-line"/>'+model.points.filter(p=>p.value!==null).map(p=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="3" aria-hidden="true"/>').join('')+'<line class="admin-chart-cursor" y1="30" y2="180"/><circle class="admin-chart-selected" r="6"/><text x="40" y="212">'+rows[0].date.slice(5)+'</text>'+(rows.length>1?'<text x="'+(width-40)+'" y="212" text-anchor="end">'+rows.at(-1).date.slice(5)+'</text>':'')+'</svg><div class="admin-chart-readout"><div class="admin-chart-readout-head"><time class="admin-chart-day"></time><div class="admin-chart-day-controls"><button type="button" data-chart-step="-1" aria-label="이전 날짜">이전</button><button type="button" data-chart-step="1" aria-label="다음 날짜">다음</button></div></div><div class="admin-chart-value" id="'+chartId+'-value" role="status" aria-live="polite"></div></div>':'<p class="empty-admin">표시할 일별 자료가 없어요.</p>')
   +'<p class="admin-chart-note">한국 시간 기준 · 오늘 값은 조회 시각까지 집계합니다. 미확인 값은 선을 연결하지 않습니다.</p>';
  const info=box.querySelector('.admin-chart-value'),svg=box.querySelector('svg');
  function select(next=index){
   index=Math.max(0,Math.min(rows.length-1,next));const row=rows[index];if(!row)return;
   box.querySelector('.admin-chart-day').textContent=row.date.replaceAll('-','.');
   info.innerHTML=Object.entries(chartMetrics).map(([key,[label,unit]])=>'<div'+(key===metric?' class="is-selected"':'')+'><span>'+label+'</span><strong>'+format(row[key])+'<small>'+(row[key]===null?(options.unknownLabel||'미확인'):unit)+'</small></strong></div>').join('');
   const point=model.points[index],cursor=box.querySelector('.admin-chart-cursor'),dot=box.querySelector('.admin-chart-selected');
   cursor.setAttribute('x1',point.x);cursor.setAttribute('x2',point.x);dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.y??180);dot.style.display=point.value===null?'none':'';
   box.querySelectorAll('[data-chart-step]').forEach(b=>{b.disabled=Number(b.dataset.chartStep)<0?index===0:index===rows.length-1;});
  }
  select();
  svg?.addEventListener('click',event=>{const r=svg.getBoundingClientRect();const scale=Math.min(r.width/width,r.height/220),left=r.left+(r.width-width*scale)/2;select(nearestIndex((event.clientX-left)/scale,rows.length,width));});
  svg?.addEventListener('keydown',event=>{const next={ArrowLeft:index-1,ArrowRight:index+1,Home:0,End:rows.length-1}[event.key];if(next!==undefined){event.preventDefault();select(next);}});
  box.querySelectorAll('[data-chart-step]').forEach(b=>b.addEventListener('click',()=>select(index+Number(b.dataset.chartStep))));
  box.querySelectorAll('[data-chart-metric]').forEach(button=>button.addEventListener('click',()=>{metric=button.dataset.chartMetric;draw();box.querySelector('[data-chart-metric="'+metric+'"]').focus({preventScroll:true});}));
 }
 draw();const comparison=host.querySelector('.admin-analytics-comparison');if(comparison)comparison.after(box);else host.prepend(box);
 const Resize=doc.defaultView?.ResizeObserver;if(Resize){const observer=new Resize(entries=>{if(!box.isConnected){observer.disconnect();return;}const next=Math.max(220,Math.round(entries[0].contentRect.width));if(Math.abs(next-width)>1){width=next;draw();}});observer.observe(box);}return box;
}
function csv(data){const rows=[['날짜(KST)','조회수(내부·자동접속 신호 제외)','방문 브라우저 수','활동 확인 브라우저 수'],...dailyRows(data).map(r=>[r.date,r.views??'',r.visitors??'',r.engaged??''])];return '\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');}
function createLive({fetchCount,render,isCurrent,now=()=>new Date()}){
 let active=false,generation=0,pending=null,last=null,updated=null;
 function start(){active=true;generation++;pending=null;}
 function stop(){active=false;generation++;pending=null;}
 function update(){
  if(!active||!isCurrent())return Promise.resolve(false);if(pending)return pending;
  const request=generation;render({status:'loading',value:last,updated});
  const task=(async()=>{try{const result=await fetchCount();if(!active||request!==generation||!isCurrent())return false;const value=count(result.data);if(result.error||value===null)throw new Error('live_unavailable');last=value;updated=now();render({status:'ready',value:last,updated});return true;}catch(error){if(active&&request===generation&&isCurrent())render({status:'error',value:last,updated});return false;}})();
  pending=task;task.finally(()=>{if(pending===task)pending=null;});return task;
 }
 return {start,stop,update};
}
const api=Object.freeze({count,format,kstTime,kstDate,dateRange,presetRange,nearestIndex,dailyRows,comparison,summary,chartModel,mountChart,csv,createLive,ratio,experienceHTML,interestCount});if(typeof module==='object'&&module.exports)module.exports=api;else root.AdminAnalytics=api;
})(typeof globalThis==='undefined'?this:globalThis);
