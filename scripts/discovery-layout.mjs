import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';

function compactFilters(html){
 let care='';
 html=html.replace(/<p class="discovery-care">[\s\S]*?<\/p>/,p=>{care=p;return '';});
 if(care)html=html.replace('<summary>지역별 안내와 산책 가이드</summary>','<summary>지역별 안내와 산책 가이드</summary>'+care);
 if(html.includes('id="find-place"')&&!html.includes('id="place-filter-options"')){
  html=html.replace(/(<div class="search-field"><label for="place-kind">[\s\S]*?<\/select><\/div>)(<div class="search-field"><label for="place-region">[\s\S]*?<\/select><\/div>)(<div class="search-field"><label for="place-category">[\s\S]*?<\/select><\/div>)/,'<details id="place-filter-options" class="directory-filter-options" open><summary>지역·장소 종류 <span id="place-filter-selection">전체</span></summary><div class="directory-filter-fields">$1$2$3</div></details>');
 }
 // Establish the existing mobile closed state before the large JSON payload is
 // parsed, rather than collapsing a visible desktop-sized filter after paint.
 const firstPaint='<script data-directory-layout>(function(){var p=document.getElementById("place-filter-options"),q=new URLSearchParams(location.search);if(p&&window.matchMedia("(max-width:600px)").matches)p.open=false;if(["q","kind","region","category"].some(function(k){return !!q.get(k);}))document.documentElement.setAttribute("data-directory-requested","");})();</script>';
 if(html.includes('data-directory-layout'))html=html.replace(/<script data-directory-layout>[\s\S]*?<\/script>/,firstPaint);
 else if(html.includes('id="place-filter-options"'))html=html.replace(/(<details id="place-filter-options"[\s\S]*?<\/details>)/,'$1'+firstPaint);
 if(!html.includes('id="place-active-filters"'))html=html.replace('<ul id="place-results">','<p id="place-active-filters" class="directory-active-filters"></p><ul id="place-results">');
 return html.replaceAll('/place-search.js?v=20261024-polish','/place-search.js?v=20261024-third').replaceAll('/readability.css?v=20261024-polish','/readability.css?v=20261024-third-layout');
}

// Shared by the published directory and the generator. No source data or SEO changes.
export function refineDiscovery(html){
 if(html.includes('data-listing-template="quality3"'))return compactFilters(html);
 if(html.includes('id="find-place"'))html=html.replace(/\/place-search\.js\?v=[\w-]+/g,'/place-search.js?v=20261024-polish').replace(/\/readability\.css\?v=[\w-]+/g,'/readability.css?v=20261024-polish');
 if(!html.includes('id="find-place"')||html.includes('class="reading-page discovery-page"'))return compactFilters(html);
 html=html.replace('class="reading-page"','class="reading-page discovery-page"');
 html=html.replace(/<a class="brand"[^>]*>[\s\S]*?<\/a>/,'<header class="discovery-header"><a class="brand" href="/" aria-label="발자국 홈"><img src="/icon-192.png" width="26" height="26" alt="">발자국</a><a href="/#map">지도로 둘러보기 ↗</a></header>');
 html=html.replace('<h1>전국 반려견 장소·산책 코스</h1>','<h1 id="discovery-title">반려견과 함께 갈 곳</h1>');
 let directory='';
 html=html.replace(/<nav aria-label="빠른 탐색"[\s\S]*?<\/nav>/,nav=>{directory='<details class="discovery-directory"><summary>지역별 안내와 산책 가이드</summary>'+nav;return '';});
 html=html.replace('<p>지역과 장소 종류를 골라 주소·거리·설명을 비교하고, 산책 전 필요한 정보를 확인하세요.</p>','<p class="discovery-intro">지역과 동반 조건을 살펴보고, 함께 가고 싶은 곳을 찾아보세요.</p>');
 html=html.replace(/<p><a href="\/pet-care\/">[\s\S]*?<\/a><\/p>/,'<p class="discovery-care"><a href="/pet-care/">동물병원·미용·돌봄 찾기 ↗</a></p>');
 html=html.replace('<h2>동네·장소 이름으로 바로 찾기</h2>','<h2 class="search-heading">어떤 곳을 찾으세요?</h2>');
 for(const id of ['query','kind','region','category']){
  const tag=id==='query'?'input':'select';
  const pattern=new RegExp('(<label for="place-'+id+'">[\\s\\S]*?<\\/label>)(<'+tag+'\\b[^>]*'+(tag==='select'?'[\\s\\S]*?<\\/select>':'>')+')');
  html=html.replace(pattern,'<div class="search-field">$1$2</div>');
 }
 html=html.replace(/<p id="place-count"[^>]*>[\s\S]*?<\/p>/,count=>'<div class="directory-results-bar">'+count+'<label class="directory-sort" for="place-sort">정렬<select id="place-sort"><option value="photos">사진 있는 곳 먼저</option><option value="registered">등록 순</option><option value="name">이름 순</option></select></label></div>');
 html=html.replace('<section id="with-dog-regions">',directory+'<section id="with-dog-regions">');
 if(directory)html=html.replace('</main>','</details></main>');
 return compactFilters(html.replaceAll('/place-search.js?v=20261017-places','/place-search.js?v=20261024-polish'));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const file=new URL('../discover.html',import.meta.url);const html=await readFile(file,'utf8');await writeFile(file,refineDiscovery(html));console.log('Directory layout updated');
}
