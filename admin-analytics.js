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
function summary(data){
 const label=count(data.days)===1?'오늘':count(data.days)!==null?'최근 '+format(data.days)+'일':'선택 기간';
 return '<div class="admin-analytics-summary" aria-label="'+esc(label)+' 통계">'+[['views','집계 포함 조회','회'],['visitors','방문 브라우저','개'],['engaged_visitors','활동 확인','개']].map(([key,name,unit])=>'<div><span>'+esc(label)+' · '+name+'</span><strong>'+format(data[key])+'<small>'+unit+'</small></strong></div>').join('')+'</div><p class="admin-analytics-comparison">'+comparison(data)+'</p>'
  +'<details class="admin-analytics-method"><summary>집계 기준·제외 내역</summary><p>관리자·작업 접속 및 자동 접속 신호 '+format(data.excluded_views)+'회 제외 · 원본 '+format(data.raw_views)+'회. 활동 확인은 화면 노출 10초 이상 또는 클릭 기록이며 사람 인증은 아닙니다.</p><p>2026-10-04 15:23경 이전 미분류 크롤러로 방문 브라우저 수가 부풀려질 수 있습니다. 이전 기록 '+format(data.unmeasured_views)+'회는 활동·페이지 정보 미수집입니다.</p><p>기간 합계의 브라우저 수는 기간 안에서 중복을 제거하므로 일별 브라우저 수를 더한 값과 다를 수 있습니다. 이전 비교는 서버가 제공한 동일 기간·동일 시각까지의 조회 합계를 사용합니다.</p></details>';
}
function chartModel(rows,metric){
 if(!METRICS[metric])throw new Error('invalid_metric');
 const max=Math.max(1,...rows.map(row=>count(row[metric])??0));let path='',connected=false;
 const points=rows.map((row,index)=>{const value=count(row[metric]),x=rows.length===1?360:40+index/Math.max(1,rows.length-1)*640;if(value===null){connected=false;return {date:row.date,value:null,x,y:null};}const y=180-value/max*140;path+=(connected?' L':' M')+x.toFixed(2)+' '+y.toFixed(2);connected=true;return {date:row.date,value,x,y};});
 return {max,path,points};
}
function mountChart(host,data){
 const rows=dailyRows(data),doc=host.ownerDocument,box=doc.createElement('div');box.className='admin-traffic-chart';
 let metric='views',index=Math.max(0,rows.length-1);
 function draw(){
  const [name,unit]=METRICS[metric],model=chartModel(rows,metric);
  box.innerHTML='<div class="admin-chart-heading"><h4>일별 방문 추이</h4><div class="admin-chart-metrics" aria-label="차트 지표">'+Object.entries(METRICS).map(([key,[label]])=>'<button type="button" data-chart-metric="'+key+'" aria-pressed="'+(metric===key)+'">'+label+'</button>').join('')+'</div></div>'
   +(rows.length?'<svg viewBox="0 0 720 210" role="img" aria-label="'+name+' 일별 그래프. 아래 날짜 선택 또는 일별 수치 표에서 정확한 값을 확인하세요.">'+[40,110,180].map((y,i)=>'<line x1="40" x2="680" y1="'+y+'" y2="'+y+'" class="admin-chart-grid"/><text x="32" y="'+(y+4)+'" text-anchor="end">'+format(Math.round(model.max*(1-i/2)))+'</text>').join('')+'<path d="'+model.path+'" class="admin-chart-line"/>'+model.points.filter(p=>p.value!==null).map(p=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="4"><title>'+p.date+' · '+name+' '+format(p.value)+unit+'</title></circle>').join('')+'<text x="40" y="205">'+rows[0].date.slice(5)+'</text><text x="680" y="205" text-anchor="end">'+rows.at(-1).date.slice(5)+'</text></svg><div class="admin-chart-date"><label>날짜 선택<input type="range" min="0" max="'+(rows.length-1)+'" value="'+index+'" step="1" '+(rows.length===1?'disabled':'')+' aria-label="차트 날짜 선택"></label><p class="admin-chart-value" role="status" aria-live="polite"></p></div>':'<p class="empty-admin">표시할 일별 자료가 없어요.</p>')
   +'<p class="admin-chart-note">한국 시간 기준 · 오늘 값은 조회 시각까지 집계합니다. 미확인 값은 선을 연결하지 않습니다.</p>';
  const info=box.querySelector('.admin-chart-value'),slider=box.querySelector('input');
  function select(){const row=rows[index];if(!row)return;const text=row.date+' · '+name+' '+format(row[metric])+(row[metric]===null?' (미확인)':unit);info.textContent=text;if(slider)slider.setAttribute('aria-valuetext',text);}
  select();slider?.addEventListener('input',()=>{index=Number(slider.value);select();});
  box.querySelectorAll('[data-chart-metric]').forEach(button=>button.addEventListener('click',()=>{metric=button.dataset.chartMetric;draw();box.querySelector('[data-chart-metric="'+metric+'"]').focus({preventScroll:true});}));
 }
 draw();const method=host.querySelector('.admin-analytics-method');if(method)method.after(box);else host.prepend(box);return box;
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
const api=Object.freeze({count,format,kstTime,dailyRows,comparison,summary,chartModel,mountChart,csv,createLive});if(typeof module==='object'&&module.exports)module.exports=api;else root.AdminAnalytics=api;
})(typeof globalThis==='undefined'?this:globalThis);
