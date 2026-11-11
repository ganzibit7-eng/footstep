const guidance = {
  '/places/regions/ulsan/camping/': {
    title: '울산 애견동반 캠핑장 | 소형견·예약 조건 비교 | 발자국',
    description: '울산 중구·울주군 애견동반 캠핑장을 비교하세요. 소형견 안내, 세부 체중 미확인, 예약 전에 확인할 허용 사이트와 준비물을 정리했습니다.',
    heading: '울산에서 반려견과 캠핑장을 고를 때',
    rows: [
      { url: '/places/gocamping_928/', label: '들살이오토캠핑장', detail: '등록 자료에 소형견 동반이 안내됩니다. 체중 상한과 반려견을 데리고 갈 수 있는 사이트를 확인하세요.' },
      { url: '/places/gocamping_2466/', label: '아트앤', detail: '등록 자료에 소형견 동반이 안내됩니다. 동반 마릿수와 데크·공용 공간 이용 조건을 문의하세요.' },
      { url: '/places/kto_bf05c161-06ee-4ecb-a815-2a2a1eb3102a/', label: '황방산생태야영장', detail: '울산 중구의 캠핑장입니다. 예약하려는 사이트의 반려견 허용 여부와 목줄 조건을 운영기관에 확인하세요.' },
    ],
  },
  '/courses/regions/daegu/': {
    title: '대구 강아지 산책 코스 | 앞산자락길·도심 공원 | 발자국',
    description: '대구 앞산자락길, 국채보상운동기념공원, 불로동 고분군을 거리와 경로 자료로 비교하고 반려견 동반 안내를 확인하세요.',
    heading: '산책 시간에 맞춰 대구 코스 고르기',
    rows: [
      { url: '/courses/c381/', label: '도심에서 짧게 · 국채보상운동기념공원', detail: '등록 약 0.44km입니다. 짧게 걷고 싶다면 상세에서 보행로와 공원 이용 안내를 확인하세요.' },
      { url: '/courses/osm_665502044/', label: '약 1km 보행로 · 불로동 고분군', detail: '등록 약 1.08km입니다. 현장 안내에 따라 출입할 수 있는 보행로를 확인하고 걸을 구간을 정하세요.' },
      { url: '/courses/c366/', label: '긴 코스 · 앞산자락길', detail: '등록 약 8.57km입니다. 공식 GPX가 제공되는 구간과 반려견 동반 안내를 확인한 뒤 체력에 맞춰 구간을 고르세요.' },
    ],
  },
};

function escapeHtml(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function applyRegionSearchGuidance(html) {
  const canonical = html.match(/<link rel="canonical" href="https:\/\/balzaguk\.com([^"?#]+)">/)?.[1];
  if (!Object.hasOwn(guidance, canonical) || html.includes('id="region-search-guidance"')) return html;
  const copy = guidance[canonical];
  if (!copy.rows.every(({url}) => html.includes(`data-card-source="${url}"`))) return html;

  const note = /<div class="note"><strong>(?:방문 전에 확인하세요|산책 코스 고르는 방법)<\/strong>[\s\S]*?<\/div>/;
  if (!note.test(html)) return html;
  const rows = copy.rows.map(({url, label, detail}) =>
    `<li><a href="${url}">${escapeHtml(label)}</a> · ${escapeHtml(detail)}</li>`).join('');
  const section = `<section class="note" id="region-search-guidance" aria-labelledby="region-search-heading"><h2 id="region-search-heading">${escapeHtml(copy.heading)}</h2><ul>${rows}</ul></section>`;

  return html.replace(note, () => section).replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, head => head
    .replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(copy.title)}</title>`)
    .replace(/(<meta (?:name|property)=")((?:og:|twitter:)?description|og:title|twitter:title)(" content=")[^"]*(")/g,
      (_, prefix, field, open, close) => prefix + field + open +
        escapeHtml(field.endsWith('title') ? copy.title : copy.description) + close)
    .replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,
      (original, open, json, close) => {
        const data = JSON.parse(json);
        if (!Array.isArray(data)) return original;
        const collection = data.find(node => node['@type'] === 'CollectionPage' && node.url === `https://balzaguk.com${canonical}`);
        if (!collection) return original;
        collection.name = copy.title;
        collection.description = copy.description;
        return open + JSON.stringify(data).replaceAll('<', '\\u003c') + close;
      }));
}
