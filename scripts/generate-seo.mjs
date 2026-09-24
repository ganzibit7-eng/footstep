import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SITE = 'https://balzaguk.com';
const SUPABASE_URL = 'https://euwujrpjtwsrxhiytego.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RcJxSk1kYXkqeyptw7sCXw_zJhQ0DJJ';
const PAGE_SIZE = 1000;

const types = [
  { table: 'courses', folder: 'courses', label: '강아지 산책 코스', icon: '🐕' },
  { table: 'facilities', folder: 'places', label: '애견동반 장소', icon: '🏡' },
  { table: 'bins', folder: 'bins', label: '반려견 배변봉투함', icon: '🧻' },
];

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const safeSegment = (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, '-');
const compact = (value = '') => String(value ?? '').replace(/\s+/g, ' ').trim();
const shortDescription = (item, type) => {
  const detail = compact([item.address,item.description,item.distance].filter(Boolean).join(' · '));
  const label = item.category === '숙소' ? '애견동반 숙소' : item.category === '식당카페' ? '애견동반 식당·카페' : type.label;
  const base = `${item.name} ${label} 정보`;
  return (detail ? `${base}. ${detail}` : base).slice(0, 155);
};
const dateOnly = (value) => {
  const d = value ? new Date(value) : new Date();
  return Number.isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
};

async function fetchApproved(table) {
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const params = new URLSearchParams({
      select: table === 'courses' ? 'id,name,description,lat,lng,tags,diff,distance,created_at' : table === 'facilities' ? 'id,name,description,lat,lng,address,category,created_at' : 'id,name,description,lat,lng,created_at', status: 'eq.approved', order: 'created_at.asc,id.asc',
      offset: String(offset), limit: String(PAGE_SIZE),
    });
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      headers: { apikey: SUPABASE_KEY }, signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`${table} 조회 실패: ${response.status} ${await response.text()}`);
    const batch = await response.json();
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return rows;
  }
}

const REGIONS = [
 ['seoul','서울',['서울','서울특별시']],['busan','부산',['부산','부산광역시']],
 ['daegu','대구',['대구','대구광역시']],['incheon','인천',['인천','인천광역시']],
 ['gwangju','광주',['광주','광주광역시']],['daejeon','대전',['대전','대전광역시']],
 ['ulsan','울산',['울산','울산광역시']],['sejong','세종',['세종','세종특별자치시']],
 ['gyeonggi','경기',['경기','경기도']],['gangwon','강원',['강원','강원도','강원특별자치도']],
 ['chungbuk','충북',['충북','충청북도']],['chungnam','충남',['충남','충청남도']],
 ['jeonbuk','전북',['전북','전라북도','전북특별자치도']],['jeonnam','전남',['전남','전라남도']],
 ['gyeongbuk','경북',['경북','경상북도']],['gyeongnam','경남',['경남','경상남도']],
 ['jeju','제주',['제주','제주도','제주특별자치도']],
];
// Older imports stored the address at the start of the description, before ' · '.
const addressFor = item => {
 const address=compact(item.address);
 if(address) return address;
 const candidate=compact(item.description).split(' · ')[0];
 return REGIONS.some(r=>r[2].includes(candidate.split(' ')[0])) && candidate.includes(' ') ? candidate : '';
};
const regionFor = item => REGIONS.find(r => r[2].includes(addressFor(item).split(' ')[0]));
const detailPath = (item,type) => `/${type.folder}/${safeSegment(item.id)}/`;
const HUB_SIZE = 48;
let searchHubs = [];
function buildHubs(groups){
 const g=groups.find(g=>g.type.table==='facilities'), hubs=[];
 for(const [slug,label,category] of [['cafes','애견동반 식당·카페','식당카페'],['stays','애견동반 숙소','숙소']]){
  const items=g.items.filter(i=>i.category===category);
  if(items.length>=3) hubs.push({path:`/places/${slug}/`,label,type:g.type,items});
 }
 for(const [slug,label] of REGIONS){
  const items=g.items.filter(i=>regionFor(i)?.[0]===slug);
  if(items.length>=3) hubs.push({path:`/places/regions/${slug}/`,label:`${label} 애견동반 카페·식당·숙소`,type:g.type,items});
 }
 const courses=groups.find(g=>g.type.table==='courses');
 for(const [slug,label,tag,intro] of [
  ['shade','그늘 많은 강아지 산책 코스','그늘많음','등록된 그늘많음 태그를 기준으로 모았습니다. 나무 그늘의 범위는 시간과 계절에 따라 달라지므로 산책 시간과 현장 기온을 함께 확인하세요.'],
  ['grass','잔디 있는 강아지 산책 코스','잔디바닥','등록된 잔디바닥 태그를 기준으로 모았습니다. 잔디 출입 가능 구역과 반려견 동반 규정을 확인하고, 산책 후 발과 털을 살펴주세요.'],
  ['step-free','계단 없는 강아지 산책 코스','계단없음','등록된 계단없음 태그를 기준으로 모았습니다. 계단이 없더라도 경사와 노면 상태는 다를 수 있으므로 등록 거리와 설명을 함께 비교하세요.']
 ]){
  const items=courses.items.filter(i=>Array.isArray(i.tags)&&i.tags.includes(tag));
  if(items.length>=3) hubs.push({path:`/courses/themes/${slug}/`,label,intro,type:courses.type,items});
 }
 for(const [slug,region] of REGIONS){
  for(const [kind,label,category] of [['cafes','애견동반 식당·카페','식당카페'],['stays','애견동반 숙소','숙소']]){
   const items=g.items.filter(i=>regionFor(i)?.[0]===slug&&i.category===category);
   if(items.length>=3) hubs.push({path:`/places/regions/${slug}/${kind}/`,label:`${region} ${label}`,type:g.type,items,
    intro:category==='숙소'?`${region}에서 반려견과 묵을 숙소를 찾을 때는 등록 주소와 설명부터 비교하세요. 예약 전 반려견 크기·마릿수 제한, 추가 비용, 이용 가능한 공용 공간을 숙소에 확인하세요.`:`${region}에서 강아지와 갈 식당이나 카페를 찾을 때는 주소와 장소 설명을 비교하세요. 실내·테라스 동반 여부와 이동장 조건, 영업시간은 방문 전 매장에 확인하세요.`});
  }
 }
 return hubs;
}
const hubLinks = (item,type) => searchHubs.filter(h=>h.type.table===type.table && h.items.some(i=>i.id===item.id));
function hubHtml(hub,page){
 const pagePath=hub.path+(page>1?`page/${page}/`:''), url=SITE+pagePath;
 const items=hub.items.slice((page-1)*HUB_SIZE,page*HUB_SIZE), total=Math.ceil(hub.items.length/HUB_SIZE);
 const title=hub.label+(page>1?` - ${page}페이지`:'')+' | 발자국';
 const isCourse=hub.type.table==='courses';
 const description=`${hub.label} ${hub.items.length}곳의 ${isCourse?'거리·난이도·등록 태그':'주소와 장소 설명'}을 비교하세요. 발자국 지도에서 위치를 확인하고 반려견과의 ${isCourse?'산책':'방문'}을 준비하세요.`;
 const schema=[{'@context':'https://schema.org','@type':'CollectionPage',name:title,url,description},
 {'@context':'https://schema.org','@type':'ItemList',itemListElement:items.map((item,i)=>({'@type':'ListItem',position:(page-1)*HUB_SIZE+i+1,url:SITE+detailPath(item,hub.type),name:item.name}))},
 {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
 {'@type':'ListItem',position:1,name:'발자국',item:SITE+'/'},
 {'@type':'ListItem',position:2,name:'전국 장소·산책 코스',item:SITE+'/discover.html'},
 {'@type':'ListItem',position:3,name:title,item:url}]}];
 return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
 <title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${url}">
 <meta name="robots" content="index,follow,max-image-preview:large"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/icon-512.png">
 <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>
 <style>body{margin:0;background:#fbf8f1;color:#183c30;font-family:system-ui,-apple-system,sans-serif;line-height:1.7}main{max-width:960px;margin:auto;padding:24px 18px}h1{font-size:clamp(25px,6vw,36px);line-height:1.35}a{color:#315b43}nav{display:flex;flex-wrap:wrap;gap:12px}ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:14px}li{padding:20px;border:1px solid #dedecf;border-radius:18px;background:#fff}li h2{font-size:19px;margin:0 0 8px}li p{margin:8px 0;overflow-wrap:anywhere;font-size:14px}.note{padding:18px;background:#eef2e7;border-radius:16px}.pagination a,.pagination strong{padding:8px 14px;min-height:28px;border:1px solid #dedecf;border-radius:10px}.pagination{margin:28px 0}</style></head>
 <body><main><nav aria-label="현재 위치"><a href="/">발자국 홈</a><a href="/discover.html">전국 장소·산책 코스</a></nav>
 <h1>${escapeHtml(hub.label)}</h1><p>${escapeHtml(description)}</p><div class="note"><strong>${isCourse?"산책 코스 고르는 방법":"방문 전에 확인하세요"}</strong><p>${escapeHtml(hub.intro || "반려견 동반 가능 공간, 크기·마릿수 제한, 이동장 사용 여부와 추가 요금을 장소에 직접 문의하세요. 등록 정보는 현장 운영과 다를 수 있습니다.")}</p></div>
 <p>전체 ${hub.items.length}곳 · ${page}/${total}페이지</p><ul>${items.map(item=>`<li><h2><a href="${detailPath(item,hub.type)}">${escapeHtml(item.name)}</a></h2><p>${escapeHtml(isCourse?[item.distance && `거리 ${item.distance}`,item.diff && `난이도 ${item.diff}`].filter(Boolean).join(" · "):item.category)}</p><p>${escapeHtml(isCourse?(Array.isArray(item.tags)?item.tags.join(" · "):""):(item.address || "주소 미등록"))}</p><p>${escapeHtml(compact(item.description).slice(0,180))}</p></li>`).join('')}</ul>
 <nav class="pagination" aria-label="목록 페이지">${Array.from({length:total},(_,i)=>i+1).map(n=>n===page?`<strong aria-current="page">${n}</strong>`:`<a href="${hub.path+(n>1?`page/${n}/`:'')}">${n}</a>`).join('')}</nav>
 <p><a href="/#map">발자국 지도에서 주변 장소 찾기</a></p></main></body></html>`;
}
function detailHtml(item, type, url) {
  const label = item.category === '숙소' ? '애견동반 숙소' : item.category === '식당카페' ? '애견동반 식당·카페' : type.label;
  const region = regionFor(item);
  const title = `${item.name} | ${region ? region[1]+' ' : ''}${label} | 발자국`;
  const hubs = hubLinks(item, type);
  const description = shortDescription(item, type);
  const location = [item.address, item.category].filter(Boolean).join(' · ');
  const tags = Array.isArray(item.tags) ? item.tags.join(' · ') : '';
  const extras = [item.distance && `거리 ${item.distance}`, item.diff && `난이도 ${item.diff}`, tags].filter(Boolean).join(' · ');
  const schema = {
    '@context': 'https://schema.org', '@type': 'Place', name: item.name,
    description, url,
    ...(item.address ? { address: item.address } : {}),
    ...(item.lat != null && item.lng != null && item.lat !== '' && item.lng !== '' && Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lng)) ? {
      geo: { '@type': 'GeoCoordinates', latitude: Number(item.lat), longitude: Number(item.lng) },
    } : {}),

  };
  const appLink = type.table === 'courses'
    ? `${SITE}/?course=${encodeURIComponent(item.id)}`
    : `${SITE}/#map`;
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="발자국"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/icon-512.png">
<script type="application/ld+json">${JSON.stringify([schema, {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'발자국',item:SITE+'/'},{'@type':'ListItem',position:2,name:type.label,item:SITE+'/discover.html#'+type.folder},{'@type':'ListItem',position:3,name:item.name,item:url}]}]).replaceAll('<', '\\u003c')}</script>
<style>body{margin:0;background:#efe6d3;color:#26221c;font-family:system-ui,-apple-system,sans-serif;line-height:1.7}.wrap{max-width:760px;margin:auto;padding:28px 20px}a{color:#1f3a2e}.brand{font-weight:800;text-decoration:none}.card{margin-top:32px;background:#fbf8f1;border:1px solid #d8cbae;border-radius:20px;padding:30px;box-shadow:0 10px 30px -18px #152922}.icon{font-size:42px}h1{color:#152922;line-height:1.25;margin:12px 0}.meta{color:#6e8f6b;font-weight:700}.cta{display:inline-block;margin-top:18px;padding:12px 20px;border-radius:999px;background:#b5502e;color:white;text-decoration:none;font-weight:800}.note{font-size:13px;color:#5b5645;margin-top:24px}</style></head>
<body><main class="wrap"><a class="brand" href="${SITE}/">🐾 발자국</a><nav aria-label="관련 장소 목록">${hubs.map(h=>`<a href="${h.path}">${escapeHtml(h.label)}</a>`).join(' · ')}</nav><article class="card"><div class="icon">${type.icon}</div><p class="meta">${escapeHtml(type.label)}${item.category ? ` · ${escapeHtml(item.category)}` : ''}</p><h1>${escapeHtml(item.name)}</h1>${location ? `<p><strong>위치·분류</strong><br>${escapeHtml(location)}</p>` : ''}<p>${escapeHtml(compact(item.description) || '발자국 사용자들과 함께 확인하는 반려견 생활 정보입니다.')}</p>${extras ? `<p class="meta">${escapeHtml(extras)}</p>` : ''}<a class="cta" href="${appLink}">발자국 지도에서 보기</a><p class="note">현장 운영 정보와 이용 조건은 변경될 수 있으니 방문 전에 직접 확인해 주세요.</p></article><p><a href="${SITE}/discover.html">전국 장소·산책 코스 목록</a></p></main></body></html>`;
}

function directoryHtml(groups) {
  const sections = groups.map(({ type, items }) => `<section id="${type.folder}"><h2>${type.icon} ${escapeHtml(type.label)} <small>${items.length.toLocaleString('ko-KR')}곳</small></h2><ul>${items.map((item) => `<li><a href="/${type.folder}/${safeSegment(item.id)}/">${escapeHtml(item.name)}</a>${item.category ? ` <span>${escapeHtml(item.category)}</span>` : ''}</li>`).join('')}</ul></section>`).join('');
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>전국 강아지 산책 코스·애견동반 장소 | 발자국</title><meta name="description" content="전국 강아지 산책 코스와 애견동반 식당·카페·숙소, 배변봉투함의 등록 정보를 확인하세요."><meta name="robots" content="index, follow"><link rel="canonical" href="${SITE}/discover.html"><style>body{margin:0;background:#efe6d3;color:#26221c;font-family:system-ui,-apple-system,sans-serif;line-height:1.6}.wrap{max-width:1000px;margin:auto;padding:28px 20px}a{color:#1f3a2e}.brand{font-weight:800;text-decoration:none}h1,h2{color:#152922}section{background:#fbf8f1;border:1px solid #d8cbae;border-radius:18px;padding:24px;margin:22px 0}small,span{font-size:13px;color:#6e8f6b}ul{columns:3;gap:28px;padding-left:20px}li{break-inside:avoid;margin:6px 0}@media(max-width:760px){ul{columns:1}}</style></head><body><main class="wrap"><a class="brand" href="/">🐾 발자국 홈</a><h1>전국 반려견 장소·산책 코스</h1><nav aria-label="장소 종류"><a href="#courses">강아지 산책 코스</a> · <a href="#places">애견동반 카페·숙소</a> · <a href="#bins">배변봉투함</a></nav><p>지역과 장소 종류를 골라 주소·거리·설명을 비교하고, 산책 전 필요한 정보를 확인하세요.</p><section><h2>테마별 산책 코스·지역별 애견동반 장소</h2><ul>${searchHubs.map(h=>`<li><a href="${h.path}">${escapeHtml(h.label)}</a> <small>${h.items.length}곳</small></li>`).join('')}</ul></section>${sections}</main></body></html>`;
}

// 조회 실패 시 기존 검색 페이지를 지우지 않습니다.
const groups = await Promise.all(types.map(async type => ({type,items:await fetchApproved(type.table)})));
for(const group of groups) if(group.type.table==='facilities') group.items=group.items.map(item=>({...item,address:addressFor(item)}));
searchHubs = buildHubs(groups);
for (const { folder } of types) await rm(path.join(ROOT, folder), { recursive: true, force: true });
const sitemap = [{ url: `${SITE}/`, lastmod: new Date().toISOString().slice(0, 10) }, { url: `${SITE}/discover.html`, lastmod: new Date().toISOString().slice(0, 10) }];
for (const {type,items} of groups) {
  for (const item of items) {
    const segment = safeSegment(item.id);
    const dir = path.join(ROOT, type.folder, segment);
    const url = `${SITE}/${type.folder}/${segment}/`;
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), detailHtml(item, type, url), 'utf8');
    sitemap.push({ url, lastmod: dateOnly(item.created_at) });
  }
}

for (const hub of searchHubs) {
  for(let page=1;page<=Math.ceil(hub.items.length/HUB_SIZE);page++){
    const relative=hub.path+(page>1?`page/${page}/`:'');
    const dir=path.join(ROOT,relative.slice(1));
    await mkdir(dir,{recursive:true});
    await writeFile(path.join(dir,'index.html'),hubHtml(hub,page),'utf8');
    sitemap.push({url:SITE+relative});
  }
}
await writeFile(path.join(ROOT, 'discover.html'), directoryHtml(groups), 'utf8');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(({ url, lastmod }) => `  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`SEO 페이지 ${sitemap.length - 2}개와 사이트맵을 생성했습니다.`);
