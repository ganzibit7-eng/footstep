import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import HomeExplore from '../home-explore.js';
import {controlAssetVersion} from './publish-control-polish.mjs';

const arrow='<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5"/></svg>';
export function refineWalkDirectory(html,counts,regionEntries){
 if(!Number.isSafeInteger(counts.courses)||counts.courses<0||!/^\d{4}-\d{2}-\d{2}$/.test(counts.checked))throw Error('Invalid published course snapshot');
 if(!html.includes('data-walk-directory="1"')){
  const parts=[...html.matchAll(/<section>([\s\S]*?)<\/section>/g)].map(m=>m[1]);
  if(parts.length!==5)throw Error('Unexpected walk directory sections; preserve the source');
  const regionLinks=[...parts[0].matchAll(/<a href="(\/courses\/regions\/[^"#]+\/)">([^<]+)<\/a>/g)];
  if(!regionLinks.length)throw Error('No regional course links');
  const regions=regionLinks.map(([,href,label])=>'<a href="'+href+'"><span>'+label.replace(' 강아지 산책로','')+'</span>'+arrow+'</a>').join('');
  const themes=parts[1].replace('<div class="links">','<nav class="walk-themes" aria-label="테마별 코스">').replace('</div>','</nav>');
  const body='<body class="walk-directory" data-walk-directory="1"><a class="walk-skip" href="#walk-main">본문으로 이동</a><header class="walk-header"><a class="walk-brand" href="/">발자국</a><a href="/">홈으로 '+arrow+'</a></header><main id="walk-main" class="walk-main"><header class="walk-intro"><span class="walk-kicker">가까운 길부터, 새로운 풍경까지</span><h1>우리 동네 강아지<br>산책로 찾기</h1><p>지역과 걷고 싶은 길을 골라보세요.<br>거리와 출발 위치, 반려견 동반 조건을 함께 살펴볼 수 있어요.</p><div class="walk-actions"><a class="walk-primary" href="/discover.html?kind=courses#find-place">전체 산책코스 찾기 '+arrow+'</a><a class="walk-map" href="/#map">지도에서 보기 '+arrow+'</a></div><p class="walk-count">등록된 산책코스 <strong data-walk-count></strong>개<span>공개 등록 정보 기준</span></p></header><section class="walk-regions" aria-labelledby="walk-region-title"><div class="walk-section-heading"><h2 id="walk-region-title">어느 지역에서 걸을까요?</h2><p>지역별 코스의 출발 위치와 이용 안내를 확인하세요.</p></div><nav class="walk-region-grid" aria-label="지역별 산책코스">'+regions+'</nav></section><section class="walk-theme-section">'+themes+'</section><div class="walk-reference"><section class="walk-comparison">'+parts[2]+'</section><section class="walk-faq">'+parts[3]+'</section></div><section class="walk-guides">'+parts[4]+'</section><p class="walk-snapshot">등록 정보 기준일 <time data-walk-date></time>. 현장 방문 확인일과 다릅니다. 실제 경로와 동반 조건의 확인 범위는 코스 상세에서 확인해 주세요.</p></main><footer class="walk-footer"><a href="/privacy/">개인정보처리방침</a><a href="/terms/">이용약관</a><a href="mailto:contact@balzaguk.com">문의하기</a></footer>';
  // Keep the original head, canonical, structured data and runtime scripts.
  const scripts=[...html.matchAll(/<script\b[^>]*src=[^>]*>[\s\S]*?<\/script>/g)].map(m=>m[0]).join('');
  html=html.slice(0,html.indexOf('<body'))+body+scripts+'</body></html>';
  html=html.replace(/<link rel="stylesheet" href="\/(?:readability|listing-editorial)\.css[^>]*>/g,'').replace(/<style>[\s\S]*?<\/style>/g,'').replace('</head>','<link rel="stylesheet" href="/walk-directory.css?v=20261102-preview"></head>');
 }
 // Retain the shared collection contract; this directory has its own scoped layout.
 if(!html.includes('data-listing-template="quality3"'))html=html.replace('data-walk-directory="1"','data-walk-directory="1" data-listing-template="quality3"');
 if(!html.includes('/listing-editorial.css?'))html=html.replace('<link rel="stylesheet" href="/walk-directory.css','<link rel="stylesheet" href="/listing-editorial.css?v='+controlAssetVersion('listing-editorial')+'"><link rel="stylesheet" href="/walk-directory.css');
 if(regionEntries){
  const links=regionEntries.map(({key,label})=>{
   if(!HomeExplore.regions.some(r=>r.key===key&&r.label===label))throw Error('Unknown region');
   return '<a href="/courses/regions/'+key+'/"><span>'+label+'</span>'+arrow+'</a>';
  }).join('');
  html=html.replace(/(<nav class="walk-region-grid"[^>]*>)[\s\S]*?(<\/nav>)/,'$1'+links+'$2');
 }
 return html.replace(/(<strong data-walk-count>)[\s\S]*?(<\/strong>)/,'$1'+counts.courses.toLocaleString('ko-KR')+'$2').replace(/(<time data-walk-date>)[\s\S]*?(<\/time>)/,'$1'+counts.checked+'$2');
}
export async function generateWalkDirectory(root){
 const file=path.join(root,'dog-walks/index.html'),html=await readFile(file,'utf8'),counts=JSON.parse(await readFile(path.join(root,'data/public-counts.json'),'utf8'));
 const regions=[];
 for(const region of HomeExplore.regions){
  let page;try{page=await readFile(path.join(root,'courses/regions',region.key,'index.html'),'utf8');}catch(e){if(e.code==='ENOENT')continue;throw e;}
  if(page.includes('rel="canonical" href="https://balzaguk.com/courses/regions/'+region.key+'/"')&&!/content="[^"]*noindex|http-equiv="refresh"/.test(page))regions.push(region);
 }
 if(!regions.length)throw Error('No published course regions');
 await writeFile(file,refineWalkDirectory(html,counts,regions),'utf8');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)await generateWalkDirectory(path.resolve(import.meta.dirname,'..'));
