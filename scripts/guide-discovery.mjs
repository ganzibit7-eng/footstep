const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const comparisonGuide={
 slug:'compare-dog-walk-courses',title:'강아지 산책 코스 비교 방법: 거리·시간·동반 조건 확인',updatedAt:'2026-10-12',
 description:'발자국에서 산책 코스 2~3개를 비교하는 방법을 안내합니다. 공식 시간과 예상 시간, 계단·경사·쉼터 미확인 표시, 자료 확인일과 반려견 동반 조건을 구분해 보세요.',
 intro:'가까운 코스 두세 개를 골랐다면 거리만 비교하지 말고 시간·편의 정보·동반 조건도 함께 살펴보세요. 아래는 발자국 화면에 표시된 정보를 읽고 출발 전 확인하는 순서입니다.',
 tips:['코스마다 비교에 담기를 눌러 최대 3개 선택','공식 안내 시간과 거리로 계산한 예상 시간을 구분','계단·경사·쉼터가 미확인이면 원문이나 운영기관에 확인','자료 확인일과 반려견 동반 가능 구역·제한 조건 확인','이 코스로 산책 준비하기를 눌러 출발점 길찾기와 준비 정보 확인'],
 sections:[
  ['1. 같은 조건으로 코스 후보를 골라요','산책코스 목록에서 지역·거리·시간 조건을 정한 뒤, 카드의 비교에 담기를 눌러 코스 2~3개를 선택하세요. 비교 보기에서 선택한 코스를 나란히 볼 수 있습니다. 검색 조건을 바꿔도 비교 선택은 남으므로 선택 해제나 전체 비우기로 정리하세요.'],
  ['2. 코스 시간의 근거를 읽어요','공식 안내 시간이 있으면 그 시간을 우선 표시합니다. 공식 시간이 없는 코스는 거리를 시속 4km로 환산한 예상 시간을 표시합니다. 이는 실제 산책 시간의 보장이 아닙니다. 휴식·경사·보행 속도에 따라 달라지고, 거리와 시간 정보가 모두 없는 코스는 시간 필터에서 제외됩니다.'],
  ['3. 미확인을 없음으로 해석하지 않아요','계단 수 미확인은 계단이 없다는 뜻이 아니며, 쉼터 미확인도 쉼터가 없다는 뜻이 아닙니다. 쉬운 난이도나 유모차 이용 안내만으로 계단 없는 경로를 판단하지 마세요. 원문에서 우회 경로나 이용 구간을 확인하고 현장 상황을 다시 살펴보세요.'],
  ['4. 자료 확인일과 동반 조건을 함께 확인해요','자료 확인일은 안내 자료를 검토한 날짜이며 현장 방문일이 아닙니다. 반려견 동반 가능 구역, 실내 출입, 목줄·이동장 조건과 당일 통제는 달라질 수 있습니다. 출처 링크와 안내 내용을 확인하고, 조건이 미확인이면 운영기관에 문의한 뒤 방문하세요.'],
  ['5. 지도와 산책 준비로 이어가요','비교표나 상세에서 이 코스로 산책 준비하기를 누르면 참고 코스와 출발점 길찾기를 다시 볼 수 있습니다. GPS 기록은 준비 화면만 열어서는 시작되지 않습니다. 시작 버튼을 누르고 위치 권한을 허용해야 실제 이동 경로를 기록합니다.']
 ],
 links:[['발자국에서 코스 비교하기','/#list'],['쉬운 산책 코스 보기','/courses/themes/easy/'],['지역별 코스와 동반장소','/discover.html']]
};
export function guideDirectoryHTML(guides){
 const title='강아지 산책 가이드 | 준비물·코스 비교·동반 조건 | 발자국';
 const description='산책 준비물, 코스 비교 방법, 날씨별 산책 안내와 애견동반 카페·숙소 확인사항을 발자국 가이드에서 찾아보세요.';
 const schema={'@context':'https://schema.org','@type':'CollectionPage',name:title,description,url:'https://balzaguk.com/guides/',mainEntity:{'@type':'ItemList',itemListElement:guides.map((g,i)=>({'@type':'ListItem',position:i+1,name:g.title,url:'https://balzaguk.com/guides/'+g.slug+'/'}))}};
 return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><meta name="robots" content="index,follow"><link rel="canonical" href="https://balzaguk.com/guides/"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:url" content="https://balzaguk.com/guides/"><meta property="og:site_name" content="발자국"><meta property="og:image" content="https://balzaguk.com/icon-512.png"><link rel="alternate" type="application/rss+xml" title="발자국 산책 안내" href="https://balzaguk.com/rss.xml"><style>body{margin:0;background:#fbf8f1;color:#243d30;font:15px/1.8 system-ui,sans-serif}.wrap{max-width:880px;margin:auto;padding:28px 20px 80px}a{color:#245b43}h1{font-size:30px;line-height:1.5}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.cards article{padding:20px;border:1px solid #ded6c7;border-radius:16px;background:#f2ecdf}.cards h2{font-size:18px;line-height:1.6;margin:0 0 8px}.cards p{margin:0}a:focus-visible{outline:3px solid #be714e;outline-offset:3px}@media(max-width:600px){.cards{grid-template-columns:1fr}}</style><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script></head><body><main class="wrap"><a href="/">🐾 발자국 홈</a><h1>강아지 산책 가이드</h1><p>${description}</p><p>출발 전 준비부터 함께 갈 장소 확인까지, 지금 필요한 안내를 골라보세요.</p><div class="cards"><article><h2><a href="/weekend/">주말 강아지와 갈만한 곳 5곳</a></h2><p>실제 장소 사진과 반려견 동반 조건을 함께 보고 나들이 후보를 골라보세요.</p></article>${guides.map(g=>`<article><h2><a href="/guides/${g.slug}/">${escape(g.title)}</a></h2><p>${escape(g.description)}</p></article>`).join('')}</div><p><a href="/discover.html">전국 산책 코스·동반장소 찾기 →</a></p><p><a href="/about/">발자국 소개와 자료 확인 기준</a></p></main></body></html>`;
}
