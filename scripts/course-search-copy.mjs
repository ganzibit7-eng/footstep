const courses = {
  c227: {
    title: '청계산 원터골 강아지 산책 | 2.5km·60분 | 발자국',
    description: '청계산입구역 2번 출구에서 원터골 등산로 입구까지 약 700m. 서울시 안내 2.5km·60분이며, 목줄 착용 시 반려견 동반이 가능합니다.',
    arrival: '서울시 안내에 따르면 신분당선 청계산입구역 2번 출구에서 원터골 등산로 입구까지 약 700m입니다. 전체 코스는 원터쉼터와 진달래능선을 지나 출발점으로 돌아옵니다.',
    access: '목줄을 착용해 주세요. 서울시는 이 코스의 유모차·휠체어 이용이 어렵다고 안내합니다.',
    source: 'https://gil.seoul.go.kr/trail/view.do?key=2405200011&sc_trailSn=44&sc_trailSeCd=SE005',
  },
  c133: {
    title: '안산자락길 강아지 산책 | 7km·계단 안내 | 발자국',
    description: '서울 안산자락길 공식 안내 7km·150분. 홍제역에서 박두진시비로 가는 방법과 자락길의 계단·경사 정보를 확인하세요.',
    arrival: '서울시는 홍제역 3번 출구에서 자락길 표지를 따라 박두진시비까지 약 15분으로 안내합니다. 지하철에서 출발한다면 이 진입 지점을 먼저 확인하세요.',
    access: '완만하고 계단 없는 길은 자락길 본선 기준입니다. 유모차나 휠체어로 이동할 경우 본선에 들어가는 길의 경사와 통제를 출발 전에 확인하세요.',
    source: 'https://gil.seoul.go.kr/trail/view.do?key=2405200007&sc_trailSn=132&sc_trailSeCd=SE001',
  },
  c33: {
    title: '남산공원 강아지 산책 | 도서관 출발 7.4km | 발자국',
    description: '남산도서관에서 시작하고 돌아오는 7.4km 순환 코스입니다. 공식 안내 150분, 목줄 착용 시 동반 가능하며 북측순환로를 확인할 수 있어요.',
    arrival: '서울시 전체 코스는 남산도서관에서 출발해 같은 곳으로 돌아오는 7.4km 순환 코스입니다. 대중교통으로 간다면 남산도서관 정류장에서 남측순환로 입구를 찾으세요.',
    access: '서울시는 목줄을 착용하면 반려견을 동반할 수 있다고 안내합니다. 전체 코스가 길게 느껴진다면 보행자 전용인 북측순환로에서 걸을 구간을 골라 보세요.',
    source: 'https://gil.seoul.go.kr/trail/view.do?key=2405200007&sc_trailSn=140',
  },
  c301: {
    title: '인왕산 숲길 강아지 산책 | 자락길·숲길 입구 | 발자국',
    description: '경복궁역 1번 출구에서 사직단까지 약 400m. 서울시 안내 2.7km·80분 코스의 자락길과 숲길 진입 지점을 확인하세요.',
    arrival: '서울시 안내에서 자락길은 사직단, 숲길은 택견수련터에서 시작합니다. 사직단은 경복궁역 1번 출구에서 사직공원 방향으로 약 400m입니다.',
    access: '목줄을 착용해 주세요. 유모차를 가져간다면 숲길의 흙길 구간과 자락길의 완만한 구간을 구분해 출발 지점을 고르세요.',
    source: 'https://gil.seoul.go.kr/trail/view.do?key=2405200007&sc_trailSn=37&sc_trailSeCd=SE001',
  },
};

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function applyCourseSearchCopy(html, id) {
  if (!Object.hasOwn(courses, id)) return html;
  const copy = courses[id];
  const url = `https://balzaguk.com/courses/${id}/`;
  const overview = /<section\b[^>]*\bid="detail-about"[^>]*>[\s\S]*?<\/section>/;
  const source = escapeHtml(copy.source);
  const existingOverview = html.match(overview)?.[0];
  if (!html.includes(`<link rel="canonical" href="${url}">`) ||
      !html.includes(`href="${source}"`) ||
      !existingOverview || existingOverview.includes('동반 확인 필요') ||
      html.includes('id="course-arrival"')) return html;

  const updated = html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, head => head
    .replace(/<title>[^<]*<\/title>/i, () => `<title>${escapeHtml(copy.title)}</title>`)
    .replace(/(<meta (?:name|property)=")((?:og:|twitter:)?description|og:title|twitter:title)(" content=")[^"]*(")/g,
      (_, prefix, name, open, close) => prefix + name + open +
        escapeHtml(name.endsWith('title') ? copy.title : copy.description) + close)
    .replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,
      (original, open, json, close) => {
        const nodes = JSON.parse(json);
        if (!Array.isArray(nodes)) return original;
        for (const node of nodes) {
          if (node.url !== url) continue;
          if (node['@type'] === 'Place') node.description = copy.description;
          if (node['@type'] === 'WebPage') {
            node.name = copy.title;
            node.description = copy.description;
          }
        }
        return open + JSON.stringify(nodes).replaceAll('<', '\\u003c') + close;
      }));

  const arrival = `<section class="detail-section" id="course-arrival"><h2>출발 위치와 동반 안내</h2>
<p>${escapeHtml(copy.arrival)}</p><p>${escapeHtml(copy.access)}</p>
<p><a href="${source}">서울시 코스 안내 보기 ↗</a> · <a href="/with-dog/seoul/">서울 산책 코스 비교</a></p></section>\n`;
  return updated.replace(overview, match => arrival + match);
}
