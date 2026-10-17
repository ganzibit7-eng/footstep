# 네이버 검색 표시 변경 점검 — 2026-10-17

공식 공지: https://blog.naver.com/naver_webmaster/224442540254
공식 게시일: 2026-10-15 16:20. 서치어드바이저 홈페이지 링크와 공식 블로그 본문을 브라우저에서 확인했다.

- 10월 15일부터 통합검색의 검색결과 표시 형식을 통일한다.
- 확대 표시되는 파비콘은 32px 이상을 권장한다.
- 사이트 이동경로는 사이트 정보의 둘째 줄에 표시한다.
- 주소·평점·리뷰·식당 등 부가정보는 핵심 항목을 요약한다. 일부 항목은 표시되지 않을 수 있다.
- HowTo 전용 검색결과 노출을 종료한다. 기존 마크업 제거는 필요하지 않으며, 이 종료는 수집·색인·순위에 영향을 주지 않는다고 공지한다. 이를 다른 모든 변경의 순위 영향 보장으로 확대 해석하지 않는다.

추가 공식 지침:
- https://searchadvisor.naver.com/guide/markup-favicon
- https://searchadvisor.naver.com/guide/structured-data-breadcrumb
- https://searchadvisor.naver.com/guide/structured-data-intro
- https://developers.google.com/search/docs/appearance/favicon-in-search

## 실제 점검과 보완

기존 192×192 PNG와 기본 favicon.ico(192×192)는 크기가 충분하다. 기존 자산과 주소를 유지하면서 공개 HTML 4,348개에 같은 절대 URL의 icon 링크를 하나씩 지정했다. 홈의 상대 URL 및 상세·지역·안내 페이지의 누락을 수정했다. 자동 재생성 뒤에도 같은 지정을 적용하며 검사를 배포 흐름에 포함했다.

전체 공개 페이지에서 JSON-LD 4,348블록의 JSON 구문, BreadcrumbList 4,343개의 이름·계층 번호·공개 연결 주소, Place 3,578개의 실제 제목·URL·좌표 범위를 확인했다. 평점·리뷰·영업시간을 임의로 추가하지 않았다. 기존 구조화 데이터 유형과 값은 유지한다. 네이버의 구조화 데이터 지원 중단만을 이유로 FAQ·HowTo를 삭제하지 않는다.

검사: `node --test tests/search-markup.mjs tests/search-discovery.mjs tests/image-sitemap.mjs`

이 검사는 로컬 공개 HTML의 일관성 점검이며 네이버 검색결과에서 실제 아이콘·부가정보가 표시되었다는 증거가 아니다. 네이버 수집·표시·순위·클릭률·방문자 수는 별도 검증이 필요하다. 배포와 알림 접수도 색인·상위 노출을 보장하지 않는다.
