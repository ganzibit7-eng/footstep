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
const compact = (value = '') => String(value).replace(/\s+/g, ' ').trim();
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
      select: '*', status: 'eq.approved', order: 'created_at.asc',
      offset: String(offset), limit: String(PAGE_SIZE),
    });
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!response.ok) throw new Error(`${table} 조회 실패: ${response.status} ${await response.text()}`);
    const batch = await response.json();
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return rows;
  }
}

function detailHtml(item, type, url) {
  const label = item.category === '숙소' ? '애견동반 숙소' : item.category === '식당카페' ? '애견동반 식당·카페' : type.label;
  const title = `${item.name} | ${label} | 발자국`;
  const description = shortDescription(item, type);
  const location = [item.address, item.category].filter(Boolean).join(' · ');
  const tags = Array.isArray(item.tags) ? item.tags.join(' · ') : '';
  const extras = [item.distance && `거리 ${item.distance}`, item.diff && `난이도 ${item.diff}`, tags].filter(Boolean).join(' · ');
  const schema = {
    '@context': 'https://schema.org', '@type': 'Place', name: item.name,
    description, url,
    ...(item.address ? { address: item.address } : {}),
    ...(Number.isFinite(Number(item.lat)) && Number.isFinite(Number(item.lng)) ? {
      geo: { '@type': 'GeoCoordinates', latitude: Number(item.lat), longitude: Number(item.lng) },
    } : {}),
    isPartOf: { '@type': 'WebSite', name: '발자국', url: `${SITE}/` },
  };
  const appLink = type.table === 'courses'
    ? `${SITE}/?course=${encodeURIComponent(item.id)}`
    : `${SITE}/#map`;
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="발자국"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/icon-512.png">
<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>
<style>body{margin:0;background:#efe6d3;color:#26221c;font-family:system-ui,-apple-system,sans-serif;line-height:1.7}.wrap{max-width:760px;margin:auto;padding:28px 20px}a{color:#1f3a2e}.brand{font-weight:800;text-decoration:none}.card{margin-top:32px;background:#fbf8f1;border:1px solid #d8cbae;border-radius:20px;padding:30px;box-shadow:0 10px 30px -18px #152922}.icon{font-size:42px}h1{color:#152922;line-height:1.25;margin:12px 0}.meta{color:#6e8f6b;font-weight:700}.cta{display:inline-block;margin-top:18px;padding:12px 20px;border-radius:999px;background:#b5502e;color:white;text-decoration:none;font-weight:800}.note{font-size:13px;color:#5b5645;margin-top:24px}</style></head>
<body><main class="wrap"><a class="brand" href="${SITE}/">🐾 발자국</a><article class="card"><div class="icon">${type.icon}</div><p class="meta">${escapeHtml(type.label)}${item.category ? ` · ${escapeHtml(item.category)}` : ''}</p><h1>${escapeHtml(item.name)}</h1>${location ? `<p><strong>위치·분류</strong><br>${escapeHtml(location)}</p>` : ''}<p>${escapeHtml(compact(item.description) || '발자국 사용자들과 함께 확인하는 반려견 생활 정보입니다.')}</p>${extras ? `<p class="meta">${escapeHtml(extras)}</p>` : ''}<a class="cta" href="${appLink}">발자국 지도에서 보기</a><p class="note">현장 운영 정보와 이용 조건은 변경될 수 있으니 방문 전에 직접 확인해 주세요.</p></article><p><a href="${SITE}/discover.html">전국 장소·산책 코스 목록</a></p></main></body></html>`;
}

function directoryHtml(groups) {
  const sections = groups.map(({ type, items }) => `<section id="${type.folder}"><h2>${type.icon} ${escapeHtml(type.label)} <small>${items.length.toLocaleString('ko-KR')}곳</small></h2><ul>${items.map((item) => `<li><a href="/${type.folder}/${safeSegment(item.id)}/">${escapeHtml(item.name)}</a>${item.category ? ` <span>${escapeHtml(item.category)}</span>` : ''}</li>`).join('')}</ul></section>`).join('');
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>전국 강아지 산책 코스·애견동반 장소 | 발자국</title><meta name="description" content="전국 강아지 산책 코스와 애견동반 식당·카페·숙소, 배변봉투함의 등록 정보를 확인하세요."><meta name="robots" content="index, follow"><link rel="canonical" href="${SITE}/discover.html"><style>body{margin:0;background:#efe6d3;color:#26221c;font-family:system-ui,-apple-system,sans-serif;line-height:1.6}.wrap{max-width:1000px;margin:auto;padding:28px 20px}a{color:#1f3a2e}.brand{font-weight:800;text-decoration:none}h1,h2{color:#152922}section{background:#fbf8f1;border:1px solid #d8cbae;border-radius:18px;padding:24px;margin:22px 0}small,span{font-size:13px;color:#6e8f6b}ul{columns:3;gap:28px;padding-left:20px}li{break-inside:avoid;margin:6px 0}@media(max-width:760px){ul{columns:1}}</style></head><body><main class="wrap"><a class="brand" href="/">🐾 발자국 홈</a><h1>전국 반려견 장소·산책 코스</h1><nav aria-label="장소 종류"><a href="#courses">강아지 산책 코스</a> · <a href="#places">애견동반 카페·숙소</a> · <a href="#bins">배변봉투함</a></nav><p>발자국에 등록되고 승인된 장소와 코스를 검색엔진과 이용자가 찾기 쉽게 정리했습니다.</p>${sections}</main></body></html>`;
}

// 조회 실패 시 기존 검색 페이지를 지우지 않습니다.
const groups = await Promise.all(types.map(async type => ({type,items:await fetchApproved(type.table)})));
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

await writeFile(path.join(ROOT, 'discover.html'), directoryHtml(groups), 'utf8');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(({ url, lastmod }) => `  <url><loc>${escapeHtml(url)}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`SEO 페이지 ${sitemap.length - 2}개와 사이트맵을 생성했습니다.`);
