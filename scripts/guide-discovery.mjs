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
 // Group existing, published guides by reader intent without changing URLs or inventing content.
 const topics=[
  {id:'regional-walks',title:'지역별 산책 코스 비교',description:'공식 GPX 경로 범위와 동반 자료를 함께 확인하며 산책 후보를 비교하세요.',slugs:['gyeonggi-lake-gpx-walks','incheon-gpx-dog-walks','yeoju-yeogang-gpx-walks']},
  {id:'plan-a-walk',title:'거리와 준비물부터 고르기',description:'짧은 산책부터 코스 2~3개 비교까지, 오늘 걸을 길을 정해 보세요.',slugs:['compare-dog-walk-courses','dog-walk-distance','dog-walk-time','dog-walk-checklist']},
  {id:'weather-and-seasons',title:'계절·날씨에 맞는 산책',description:'더위·비·추위처럼 산책 전 확인할 조건을 골라 보세요.',slugs:['summer-dog-walk','rainy-day-dog-walk','winter-dog-walk']},
  {id:'dog-friendly-places',title:'함께 들를 장소 확인',description:'카페·숙소의 실내 동반 범위와 이용 조건을 방문 전에 확인하세요.',slugs:['dog-friendly-cafe-checklist','dog-friendly-stay-checklist']}
 ];
 const bySlug=new Map(guides.map(guide=>[guide.slug,guide])),used=new Set();
 const groups=topics.map(topic=>{
  const items=topic.slugs.map(slug=>bySlug.get(slug)).filter(Boolean);
  items.forEach(item=>used.add(item.slug));
  return {...topic,items};
 }).filter(group=>group.items.length);
 const remaining=guides.filter(guide=>!used.has(guide.slug));
 if(remaining.length)groups.push({id:'more-guides',title:'더 알아보기',description:'추가된 산책 안내도 살펴보세요.',items:remaining});
 const guideCard=guide=>'<article><h3><a href="/guides/'+escape(guide.slug)+'/">'+escape(guide.title)+'</a></h3><p>'+escape(guide.description)+'</p></article>';
 const jumpNav=groups.map(group=>'<a href="#'+group.id+'">'+escape(group.title)+'</a>').join('');
 const sections=groups.map(group=>'<section class="topic" id="'+group.id+'" aria-labelledby="'+group.id+'-title"><div class="topic-head"><h2 id="'+group.id+'-title">'+escape(group.title)+'</h2><p>'+escape(group.description)+'</p></div><div class="cards">'+group.items.map(guideCard).join('')+'</div></section>').join('');
 const style='body{margin:0;background:#fbf8f1;color:#243d30;font:15px/1.8 system-ui,sans-serif}a{color:#245b43}.wrap{max-width:960px;margin:auto;padding:28px 20px 80px}.back{font-weight:700;text-decoration:none}h1{font-size:clamp(26px,4vw,36px);line-height:1.4;margin:22px 0 12px}.lead{max-width:700px;color:#4e6255}.jump,.shortcuts{display:flex;gap:9px;flex-wrap:wrap;margin:22px 0}.jump a,.shortcuts a{display:inline-flex;padding:8px 13px;background:#eef4ed;border:1px solid #d3e1d3;border-radius:999px;text-decoration:none;font-weight:650}.shortcuts a{background:#234c38;color:#fff;border-color:#234c38}.topic{margin:36px 0;scroll-margin-top:20px}.topic-head{margin-bottom:15px}.topic-head h2{font-size:23px;line-height:1.5;margin:0 0 5px}.topic-head p{margin:0;color:#586c5f}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.cards article,.weekend{padding:20px;border:1px solid #ded6c7;border-radius:18px;background:#f2ecdf}.cards h3,.weekend h2{font-size:18px;line-height:1.6;margin:0 0 8px}.cards p,.weekend p{margin:0}.weekend{margin-top:20px;background:#ecf4e8}.note{font-size:13px;color:#607164;margin:24px 0}a:focus-visible{outline:3px solid #be714e;outline-offset:3px}@media(max-width:600px){.cards{grid-template-columns:1fr}.wrap{padding:22px 16px 60px}.jump,.shortcuts{gap:8px}.jump a,.shortcuts a{font-size:13px;padding:8px 11px}}';
 return '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+'</title><meta name="description" content="'+escape(description)+'"><meta name="robots" content="index,follow"><link rel="canonical" href="https://balzaguk.com/guides/"><meta property="og:title" content="'+escape(title)+'"><meta property="og:description" content="'+escape(description)+'"><meta property="og:type" content="website"><meta property="og:url" content="https://balzaguk.com/guides/"><meta property="og:site_name" content="발자국"><meta property="og:image" content="https://balzaguk.com/balzaguk-og-20261024.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="alternate" type="application/rss+xml" title="발자국 산책 안내" href="https://balzaguk.com/rss.xml"><style>'+style+'</style><script type="application/ld+json">'+JSON.stringify(schema).replaceAll('<','\\u003c')+'</script></head><body><main class="wrap"><a class="back" href="/">🐾 발자국 홈</a><h1>강아지 산책 가이드</h1><p class="lead">'+escape(description)+'</p><p class="lead">지금 필요한 주제를 선택하거나 지역별 코스 안내로 바로 이동해 보세요.</p><nav class="jump" aria-label="가이드 주제 바로가기">'+jumpNav+'</nav><nav class="shortcuts" aria-label="산책 코스 바로 찾기"><a href="/dog-walks/">전국 산책로 찾기</a><a href="/courses/themes/short-under-2km/">2km 이하 짧은 코스</a><a href="/courses/regions/gyeonggi/">경기 산책로</a><a href="/courses/regions/incheon/">인천 산책로</a><a href="/discover.html">전체 코스·동반장소</a></nav><p class="note">등록 거리와 예상 시간은 참고 정보입니다. 동반 조건, 실제 출입구와 현장 통제는 출발 전에 확인해 주세요.</p>'+sections+'<article class="weekend"><h2><a href="/weekend/">주말 강아지와 갈만한 곳 5곳</a></h2><p>실제 장소 사진과 등록된 반려견 동반 조건을 함께 보고 나들이 후보를 골라보세요.</p></article><p><a href="/about/">발자국 소개와 자료 확인 기준</a></p></main></body></html>';
}
