# 이미지 검색 발견 경로 보완 · 2026-10-16

- 기존 주 사이트맵에 공개 코스 400곳의 실제 표시 사진을 image:image/image:loc로 연결.
- Google 공식 이미지 사이트맵 지침: https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- 사진이 있는 공개 대표 상세 페이지와 실제 로컬 사진 파일만 허용. 동반 조건, 사진 출처·저작권·촬영일은 기존 상세 설명을 유지.
- 원본 사이트맵 URL·lastmod를 유지하고, 자동 상세 생성 후에도 매번 재생성. 이미지 태그가 있어도 이전 lastmod가 보존되도록 파서 보완.
- 아이콘·관리자·회원정보·비공개 페이지는 추가하지 않음. 이미지 caption/title/license 등 폐기된 사이트맵 태그는 사용하지 않음.
- 검증: 공개 페이지 일치, 실제 이미지 포함, 파일 존재, 멱등성, noindex/누락 파일 시 쓰기 중단, 변경일 보존.
- 이미 등록한 sitemap.xml 주소를 그대로 사용. 접수·색인·검색 노출은 서로 다르며 이미지 검색 순위나 유입을 보장하지 않음.
