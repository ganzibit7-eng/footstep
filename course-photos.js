/* Curated location photographs. Credits and adaptations retain the stated image license. */
(function(root){
  'use strict';
  const records = [
  {
    "courses": {
      "c33": "서울 남산공원 산책로"
    },
    "src": "/assets/course-photos/c33.webp",
    "place": "남산공원 입구",
    "date": "2023-11-12",
    "author": "Toobigtokale",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Namsan_Park_Entrance.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Namsan_Park_Entrance.jpg",
    "title": "Namsan Park Entrance.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 1200,
    "height": 900
  },
  {
    "courses": {
      "c31": "서울 서울숲 공원길"
    },
    "src": "/assets/course-photos/c31.webp",
    "place": "서울숲 산책길",
    "date": "2009-11-26",
    "author": "Enigma7seven",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Seoulforest_001.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/5/59/Seoulforest_001.jpg",
    "title": "Seoulforest 001.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 1024,
    "height": 768
  },
  {
    "courses": {
      "c324": "서울 한양도성 순성길 낙산구간"
    },
    "src": "/assets/course-photos/c324.webp",
    "place": "낙산공원 한양도성",
    "date": "2016-09-17",
    "author": "KO BYUNGSUK",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:%ED%95%9C%EC%96%91%EB%8F%84%EC%84%B1%EB%82%99%EC%82%B0%EA%B5%AC%EA%B0%84.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/b/b0/%ED%95%9C%EC%96%91%EB%8F%84%EC%84%B1%EB%82%99%EC%82%B0%EA%B5%AC%EA%B0%84.jpg",
    "title": "한양도성낙산구간.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 1200,
    "height": 791
  },
  {
    "courses": {
      "c314": "서울 하늘공원 하늘길"
    },
    "src": "/assets/course-photos/c314.webp",
    "place": "하늘공원 억새밭길",
    "date": "2013-11-13",
    "author": "Vanessaliam",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Haneul-Park.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/60/Haneul-Park.jpg",
    "title": "Haneul-Park.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 1200,
    "height": 900
  },
  {
    "courses": {
      "c321": "서울 경의선숲길공원"
    },
    "src": "/assets/course-photos/c321.webp",
    "place": "경의선숲길",
    "date": "2025-05-10",
    "author": "Striker9498",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "https://commons.wikimedia.org/wiki/File:20250510_%EA%B2%BD%EC%9D%98%EC%84%A0%EC%88%B2%EA%B8%B8_4.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/9/9f/20250510_%EA%B2%BD%EC%9D%98%EC%84%A0%EC%88%B2%EA%B8%B8_4.jpg",
    "title": "20250510 경의선숲길 4.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 1200
  },
  {
    "courses": {
      "c311": "서울 홍제천"
    },
    "src": "/assets/course-photos/c311.webp",
    "place": "홍제천 인공폭포",
    "date": "2023-10-31",
    "author": "Huntsmanleader",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Hongjecheon_Artificial_Waterfall_2023-10-31.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/f/f5/Hongjecheon_Artificial_Waterfall_2023-10-31.jpg",
    "title": "Hongjecheon Artificial Waterfall 2023-10-31.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 1200,
    "height": 900
  },
  {
    "courses": {
      "c289": "서울 불광천"
    },
    "src": "/assets/course-photos/c289.webp",
    "place": "불광천",
    "date": "2023-04-03",
    "author": "Mobius6",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "source": "https://commons.wikimedia.org/wiki/File:Bulgwangcheon_20230403_015.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/9/95/Bulgwangcheon_20230403_015.jpg",
    "title": "Bulgwangcheon 20230403 015.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 1200,
    "height": 800
  },
  {
    "courses": {
      "c286": "서울 성북천",
      "c238": "서울 홍릉 두물길"
    },
    "src": "/assets/course-photos/c286.webp",
    "place": "성북천·청계천 합류부",
    "date": "2013-11-21",
    "author": "Korea.net / 해외문화홍보원 (전한)",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "https://commons.wikimedia.org/wiki/File:KOCIS_Korea_Cheonggyecheon_2013_02_%2810988642386%29.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/2/2e/KOCIS_Korea_Cheonggyecheon_2013_02_%2810988642386%29.jpg",
    "title": "KOCIS Korea Cheonggyecheon 2013 02 (10988642386).jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 1200,
    "height": 741
  },
  {
    "courses": {
      "c318": "서울 갈산 생태순환길"
    },
    "src": "/assets/course-photos/c318.webp",
    "place": "갈산근린공원",
    "date": "2014-11",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/48267",
    "original": "https://data.si.re.kr/sites/default/files/photos/05S02902Ac6000.jpg",
    "title": "갈산근린공원 (05S02902Ac6000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c244": "서울 강서 물새길"
    },
    "src": "/assets/course-photos/c244.webp",
    "place": "강서한강공원",
    "date": "2020-02",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/56892",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06D00613Ba80000.jpg",
    "title": "강서한강공원 (06D00613Ba80000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c322": "서울 개운산공원길"
    },
    "src": "/assets/course-photos/c322.webp",
    "place": "개운산",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/61318",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06Q00307Ab20000.jpg",
    "title": "개운산 (06Q00307Ab20000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c331": "서울 개화산 둘레길"
    },
    "src": "/assets/course-photos/c331.webp",
    "place": "강서둘레길",
    "date": "2020-01",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/56879",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06D00508Ac80000.jpg",
    "title": "강서둘레길 (06D00508Ac80000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c315": "서울 경춘선 숲길"
    },
    "src": "/assets/course-photos/c315.webp",
    "place": "경춘선숲길",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/58286",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06I00312Ac30000.jpg",
    "title": "경춘선숲길 (06I00312Ac30000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c317": "서울 계남근린공원 자락길"
    },
    "src": "/assets/course-photos/c317.webp",
    "place": "계남제1근린공원 (자락길 주변)",
    "date": "2020-02",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/62019",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06S00306Ad80000.jpg",
    "title": "계남근린공원 (06S00306Ad80000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c272": "서울 신정산 생태길"
    },
    "src": "/assets/course-photos/c272.webp",
    "place": "계남근린공원",
    "date": "2020-02",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/62020",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06S00307Ad80000.jpg",
    "title": "계남근린공원 (06S00307Ad80000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c259": "서울 방죽·샘터공원 산책길",
      "c323": "서울 강동고덕산길"
    },
    "src": "/assets/course-photos/c259.webp",
    "place": "고덕산 무장애자락길",
    "date": "2020-05",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/56445",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06B02603Db10000.jpg",
    "title": "고덕산 무장애자락길 (06B02603Db10000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c255": "서울 포이 산책길"
    },
    "src": "/assets/course-photos/c255.webp",
    "place": "구룡산 전망쉼터",
    "date": "2020-06",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/60586",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06O00210Aa10000.jpg",
    "title": "구룡산 (06O00210Aa10000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c288": "서울 서울둘레길 구룡산구간"
    },
    "src": "/assets/course-photos/c288.webp",
    "place": "구룡산",
    "date": "2020-06",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/60583",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06O00207Aa30000.jpg",
    "title": "구룡산 (06O00207Aa30000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c320": "서울 궁산 역사문화 둘레길"
    },
    "src": "/assets/course-photos/c320.webp",
    "place": "궁산근린공원",
    "date": "2020-01",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/56938",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06D01406Ac30000.jpg",
    "title": "궁산근린공원 (06D01406Ac30000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c243": "서울 난지 갈대바람길"
    },
    "src": "/assets/course-photos/c243.webp",
    "place": "난지한강공원 자전거공원 일대",
    "date": "2020-03",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/59902",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06M00803Ba20000.jpg",
    "title": "난지한강공원 (06M00803Ba20000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 593
  },
  {
    "courses": {
      "c258": "서울 성동구 매봉산 치유숲길",
      "c262": "서울 매봉산 전망대 산책길",
      "c334": "서울숲 남산길 응봉근린공원 구간"
    },
    "src": "/assets/course-photos/c258.webp",
    "place": "매봉산공원 숲길",
    "date": "2020-05",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/64035",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06X01504Ab40000.jpg",
    "title": "매봉산공원 (06X01504Ab40000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c261": "서울 명일 산책길"
    },
    "src": "/assets/course-photos/c261.webp",
    "place": "명일근린공원",
    "date": "2020-05",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/56436",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06B02404Ac50000.jpg",
    "title": "명일근린공원 (06B02404Ac50000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c252": "서울 배봉두메십리길"
    },
    "src": "/assets/course-photos/c252.webp",
    "place": "배봉산",
    "date": "2020-05",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/59051",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06K00812Ab50000.jpg",
    "title": "배봉산 (06K00812Ab50000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c330": "서울 백련산 초록숲길"
    },
    "src": "/assets/course-photos/c330.webp",
    "place": "백련근린공원(백련산)",
    "date": "2020-03",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/60375",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06N01005Ac30000.jpg",
    "title": "백련근린공원(백련산) (06N01005Ac30000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c290": "서울 봉제산 둘레길 사색구간"
    },
    "src": "/assets/course-photos/c290.webp",
    "place": "봉제산근린공원 자연체험학습원 (사색구간 주변)",
    "date": "2020-02",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/57030",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06D03204Ac80000.jpg",
    "title": "봉제산근린공원 (06D03204Ac80000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c246": "서울 생각숲길"
    },
    "src": "/assets/course-photos/c246.webp",
    "place": "불광근린공원",
    "date": "2020-03",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/62964",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06V01406Ac10000.jpg",
    "title": "불광근린공원 (06V01406Ac10000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c274": "서울 불암산 산책길",
      "c277": "서울 불암산 설화길"
    },
    "src": "/assets/course-photos/c274.webp",
    "place": "불암산 둘레길 (산책길·설화길 주변)",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/58456",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06I02109Ac70000.jpg",
    "title": "불암산둘레길 (06I02109Ac70000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c312": "서울 현충원 외곽 산책길",
      "c283": "서울 현충원 한강 나들길"
    },
    "src": "/assets/course-photos/c312.webp",
    "place": "서달산 숲속 계단길",
    "date": "2019-12",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/59618",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06L02404Ab10000.jpg",
    "title": "서달산 (06L02404Ab10000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c159": "서울 서리풀공원 산책로"
    },
    "src": "/assets/course-photos/c159.webp",
    "place": "서리풀공원",
    "date": "2020-06",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/60779",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06O02810Ac40000.jpg",
    "title": "서리풀공원 (06O02810Ac40000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c292": "서울 능골산 산책길"
    },
    "src": "/assets/course-photos/c292.webp",
    "place": "서서울호수공원",
    "date": "2020-01",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/62082",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06S01101Ac70000.jpg",
    "title": "서서울호수공원 (06S01101Ac70000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c287": "서울 성내천"
    },
    "src": "/assets/course-photos/c287.webp",
    "place": "성내천",
    "date": "2020-06",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/61840",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06R02210Bb10000.jpg",
    "title": "성내천 (06R02210Bb10000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 595
  },
  {
    "courses": {
      "c223": "둘리쌍문근린공원 산책로"
    },
    "src": "/assets/course-photos/c223.webp",
    "place": "쌍문근린공원",
    "date": "2014-12",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/46365",
    "original": "https://data.si.re.kr/sites/default/files/photos/05J02102Ac3000.jpg",
    "title": "쌍문근린공원 (05J02102Ac3000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c270": "서울 아차산성길",
      "c271": "서울 아차산 둘레길"
    },
    "src": "/assets/course-photos/c270.webp",
    "place": "아차산생태공원",
    "date": "2020-05",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/57574",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06F02304Ac10000.jpg",
    "title": "아차산생태공원 (06F02304Ac10000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c239": "서울 서초구 양재천"
    },
    "src": "/assets/course-photos/c239.webp",
    "place": "서초구 양재천 산책길",
    "date": "2020-06",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/60873",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06O04016Bb10000.jpg",
    "title": "양재천 (06O04016Bb10000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c269": "서울 용왕산 순환길"
    },
    "src": "/assets/course-photos/c269.webp",
    "place": "용왕정",
    "date": "2020-02",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/62182",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06S02702Ac30000.jpg",
    "title": "용왕정 (06S02702Ac30000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c225": "우장산 숲속 탐방로"
    },
    "src": "/assets/course-photos/c225.webp",
    "place": "우장산공원",
    "date": "2009-11",
    "author": "서울 2009/2010 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/40502",
    "original": "https://data.si.re.kr/sites/default/files/photos/04D01502ac2000.jpg",
    "title": "우장산공원 (04D01502ac2000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 600,
    "height": 399
  },
  {
    "courses": {
      "c234": "일자산 숲길"
    },
    "src": "/assets/course-photos/c234.webp",
    "place": "일자산허브천문공원",
    "date": "2020-06",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/56534",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06B04107Ac20000.jpg",
    "title": "일자산허브천문공원 (06B04107Ac20000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c299": "서울 장안벚꽃길"
    },
    "src": "/assets/course-photos/c299.webp",
    "place": "중랑천체육공원",
    "date": "2019-11",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/59243",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06K02917Bb10000.jpg",
    "title": "중랑천체육공원 (06K02917Bb10000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c325": "서울 천장산 산책로"
    },
    "src": "/assets/course-photos/c325.webp",
    "place": "청량근린공원",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/61595",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06Q04804Ac60000.jpg",
    "title": "청량근린공원 (06Q04804Ac60000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c278": "서울 인왕산 자락길",
      "c301": "서울 인왕산 숲길"
    },
    "src": "/assets/course-photos/c278.webp",
    "place": "청운공원과 시인의언덕",
    "date": "2014-10",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/49423",
    "original": "https://data.si.re.kr/sites/default/files/photos/05W12304Ac2000.jpg",
    "title": "청운공원과 시인의언덕 (05W12304Ac2000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c297": "서울 초안산 생태 탐방로"
    },
    "src": "/assets/course-photos/c297.webp",
    "place": "초안산근린공원",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/58949",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06J03707Ac20000.jpg",
    "title": "초안산근린공원 (06J03707Ac20000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c226": "한우물길"
    },
    "src": "/assets/course-photos/c226.webp",
    "place": "한우물",
    "date": "2020-01",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/58240",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06H03405Ad80000.jpg",
    "title": "한우물 (06H03405Ad80000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c236": "오패산 나들길",
      "c257": "서울 오패산 자락길"
    },
    "src": "/assets/course-photos/c236.webp",
    "place": "오패산 오동근린공원",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/56759",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06C02904Ac80000.jpg",
    "title": "오동근린공원 (06C02904Ac80000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c298": "서울 중랑천 탐방로"
    },
    "src": "/assets/course-photos/c298.webp",
    "place": "중랑천",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/58900",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06J02913Bb50000.jpg",
    "title": "중랑천 (06J02913Bb50000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c172": "서울 선유도길"
    },
    "src": "/assets/course-photos/c172.webp",
    "place": "선유도공원 산책길",
    "date": "2014-08-24",
    "author": "travel oriented",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Seonyudo_Park.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Seonyudo_Park.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Seonyudo Park",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 960,
    "height": 642
  },
  {
    "courses": {
      "c280": "서울 세검정 계곡 숲길"
    },
    "src": "/assets/course-photos/c280.webp",
    "place": "백사실계곡 별서터 연못",
    "date": "2017-05-28",
    "author": "Chapchap123",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Baeksasil-2.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Baeksasil-2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Baeksasil-2",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 960,
    "height": 640
  },
  {
    "courses": {
      "c294": "서울 구로올레길 천왕산구간"
    },
    "src": "/assets/course-photos/c294.webp",
    "place": "푸른수목원 산책길",
    "date": "2018-05-27",
    "author": "Shinfull",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Pureun_Arboretum_in_spring.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/3/38/Pureun_Arboretum_in_spring.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Pureun Arboretum in spring",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 960,
    "height": 596
  },
  {
    "courses": {
      "c81": "서울 북서울꿈의숲 나들길"
    },
    "src": "/assets/course-photos/c81.webp",
    "place": "북서울꿈의숲 연못 일대",
    "date": "2010-02-07",
    "author": "Seongbin Im",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Dream_Forest_Park.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/7/76/Dream_Forest_Park.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Dream Forest Park",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 960,
    "height": 281
  },
  {
    "courses": {
      "c227": "청계산 원터골 산책길"
    },
    "src": "/assets/course-photos/c227.webp",
    "place": "청계산",
    "date": "2020-06",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/60959",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06O04811Ab60000.jpg",
    "title": "청계산 (06O04811Ab60000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c332": "서울 수락벽운계곡길"
    },
    "src": "/assets/course-photos/c332.webp",
    "place": "수락산 벽운계곡",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/58550",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06I03607Ab30000.jpg",
    "title": "수락산 벽운계곡 (06I03607Ab30000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c279": "서울 수락산 소망길"
    },
    "src": "/assets/course-photos/c279.webp",
    "place": "학림사",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/58713",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06I06201Ca82000.jpg",
    "title": "학림사 (06I06201Ca82000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 610
  },
  {
    "courses": {
      "c304": "서울 오동공원 공원길"
    },
    "src": "/assets/course-photos/c304.webp",
    "place": "월곡 오동근린공원 전망",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/61495",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06Q03203Ad40000.jpg",
    "title": "오동근린공원 (06Q03203Ad40000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c254": "서울 관악산 무장애숲길"
    },
    "src": "/assets/course-photos/c254.webp",
    "place": "관악산 호수공원",
    "date": "2015-02",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/45666",
    "original": "https://data.si.re.kr/sites/default/files/photos/05E00601Ac8000.jpg",
    "title": "관악산호수공원 (05E00601Ac8000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c284": "서울 한양도성 역사문화 탐방로"
    },
    "src": "/assets/course-photos/c284.webp",
    "place": "인왕산 한양도성 성곽길",
    "date": "2015-03",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/49297",
    "original": "https://data.si.re.kr/sites/default/files/photos/05W10211Cb4000.jpg",
    "title": "인왕산과성곽 (05W10211Cb4000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c248": "서울 서오릉고개 녹지연결로"
    },
    "src": "/assets/course-photos/c248.webp",
    "place": "서오릉 녹지연결로",
    "date": "2020-03",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/63009",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06V01906Ac62000.jpg",
    "title": "서오릉 녹지연결로 (06V01906Ac62000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 597
  },
  {
    "courses": {
      "c308": "서울 양화나루길"
    },
    "src": "/assets/course-photos/c308.webp",
    "place": "망원정 마당",
    "date": "2015-01",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/46863",
    "original": "https://data.si.re.kr/sites/default/files/photos/05M02601Ac4000.jpg",
    "title": "망원정 (05M02601Ac4000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c133": "서울 안산자락길",
      "c327": "서울 안산 초록숲길"
    },
    "src": "/assets/course-photos/c133.webp",
    "place": "안산 봄 풍경 (자락길·초록숲길 주변)",
    "date": "2015-04",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/47142",
    "original": "https://data.si.re.kr/sites/default/files/photos/05N02503Aa4000.jpg",
    "title": "안산 (05N02503Aa4000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c51": "서울 여의도 한강 공원길"
    },
    "src": "/assets/course-photos/c51.webp",
    "place": "여의도공원 산책길 (코스 경유지)",
    "date": "2020-02",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/62439",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06T03508Ad30000.jpg",
    "title": "여의도공원 (06T03508Ad30000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c313": "서울 한양도성 순성길 남산구간"
    },
    "src": "/assets/course-photos/c313.webp",
    "place": "장충동 한양도성 성곽길",
    "date": "2015-03",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/50054",
    "original": "https://data.si.re.kr/sites/default/files/photos/05X10605Cb1000.jpg",
    "title": "한양도성_장충동 (05X10605Cb1000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c253": "서울 국사봉길"
    },
    "src": "/assets/course-photos/c253.webp",
    "place": "국사봉 쉼터",
    "date": "2010-03",
    "author": "서울 2009/2010 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/40553",
    "original": "https://data.si.re.kr/sites/default/files/photos/04E00302ac4000.jpg",
    "title": "국사봉 (04E00302ac4000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c305": "서울 오금공원 산책길"
    },
    "src": "/assets/course-photos/c305.webp",
    "place": "오금공원",
    "date": "2015-04",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/48037",
    "original": "https://data.si.re.kr/sites/default/files/photos/05R03206Ac4000.jpg",
    "title": "오금공원 (05R03206Ac4000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 675
  },
  {
    "courses": {
      "c268": "서울 궁동산 둘레길"
    },
    "src": "/assets/course-photos/c268.webp",
    "place": "궁동근린공원",
    "date": "2020-03",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/60339",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06N00306Ac20000.jpg",
    "title": "궁동근린공원 (06N00306Ac20000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c250": "서울 삼청공원 순환산책길",
      "c328": "서울 북악 하늘 나들길"
    },
    "src": "/assets/course-photos/c250.webp",
    "place": "삼청공원 숲길",
    "date": "2014-12",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/49072",
    "original": "https://data.si.re.kr/sites/default/files/photos/05W06302Ac1000.jpg",
    "title": "삼청공원 (05W06302Ac1000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c83": "서울 응봉산 산책로"
    },
    "src": "/assets/course-photos/c83.webp",
    "place": "응봉산 전망",
    "date": "2019-12",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/61192",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06P02421Ab50000.jpg",
    "title": "응봉산 (06P02421Ab50000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c263": "서울 매봉산 자락길"
    },
    "src": "/assets/course-photos/c263.webp",
    "place": "마포 매봉산 자락길",
    "date": "2020-03",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/60020",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06M02602Ad40000.jpg",
    "title": "매봉산자락길 (06M02602Ad40000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c326": "서울 인왕산 전망길"
    },
    "src": "/assets/course-photos/c326.webp",
    "place": "인왕산 소나무숲 전경 (코스 주변)",
    "date": "2008-04-29",
    "author": "Gaël Chardon",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Korea-Seoul-Inwangsan-11.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Korea-Seoul-Inwangsan-11.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Korea-Seoul-Inwangsan-11 / IMG_9612",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 960,
    "height": 720
  },
  {
    "courses": {
      "c237": "용마산 팔각정길"
    },
    "src": "/assets/course-photos/c237.webp",
    "place": "용마산 정상으로 오르는 암릉",
    "date": "2013-10-26",
    "author": "Kellnerp",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Trail_leading_to_peak_of_Yongmasan_(%EC%9A%A9%EB%A7%88%EC%82%B0).JPG",
    "original": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Trail_leading_to_peak_of_Yongmasan_%28%EC%9A%A9%EB%A7%88%EC%82%B0%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Trail leading to peak of Yongmasan (용마산)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 960,
    "height": 639
  },
  {
    "courses": {
      "c242": "서울 당현천"
    },
    "src": "/assets/course-photos/c242.webp",
    "place": "당현천",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/58365",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06I01110Bb60000.jpg",
    "title": "당현천 (06I01110Bb60000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c296": "서울 고덕천 산책길"
    },
    "src": "/assets/course-photos/c296.webp",
    "place": "고덕천",
    "date": "2020-05",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/56373",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06B01305Ac80000.jpg",
    "title": "고덕천 (06B01305Ac80000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c309": "서울 안양천 벚나무길"
    },
    "src": "/assets/course-photos/c309.webp",
    "place": "안양천",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/58223",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06H03117Bb62000.jpg",
    "title": "안양천 (06H03117Bb62000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c240": "서울 반포 수변길"
    },
    "src": "/assets/course-photos/c240.webp",
    "place": "반포한강공원",
    "date": "2020-06",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/60685",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06O01902Ba62000.jpg",
    "title": "반포한강공원 (06O01902Ba62000)",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c241": "서울 뚝섬 숲속길"
    },
    "src": "/assets/course-photos/c241.webp",
    "place": "뚝섬한강공원 나무그늘 (숲속길 주변)",
    "date": "2026-04-16",
    "author": "Motoko C. K.",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Ttukseom_Hangang_Park_20260416_4.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Ttukseom_Hangang_Park_20260416_4.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Ttukseom Hangang Park 20260416 4",
    "changes": "공개 사진의 웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 960,
    "height": 640
  },
  {
    "courses": {
      "c245": "서울 호암산 능선길"
    },
    "src": "/assets/course-photos/c245.webp",
    "place": "호암산 능선길 경유지 · 호암산성 석구상 주변",
    "date": "2014-11",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/46162",
    "original": "https://data.si.re.kr/sites/default/files/photos/05H03701Ca0000.jpg",
    "title": "호암산성 터 · 05H03701Ca0000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c247": "서울 문화비축기지 산책로"
    },
    "src": "/assets/course-photos/c247.webp",
    "place": "문화비축기지 내부 야외 공원",
    "date": "2020-03",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/60032",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06M02709Ac80000.jpg",
    "title": "문화비축기지 · 06M02709Ac80000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c265": "서울 독산 자락길"
    },
    "src": "/assets/course-photos/c265.webp",
    "place": "독산 자락길 경유지 · 금천체육공원 산책로",
    "date": "2020-01",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/58089",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06H01306Ac80000.jpg",
    "title": "금천체육공원 · 06H01306Ac80000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c267": "서울 까치산길"
    },
    "src": "/assets/course-photos/c267.webp",
    "place": "까치산근린공원 솔밭로 65 일대 산책로",
    "date": "2015-01",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/photo/05L00803Ac1000",
    "original": "https://data.si.re.kr/sites/default/files/photos/05L00803Ac1000.jpg",
    "title": "까치산근린공원 · 05L00803Ac1000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c285": "서울 호압사 산책길"
    },
    "src": "/assets/course-photos/c285.webp",
    "place": "호압사 산책길 경유지 · 호압사 경내",
    "date": "2014-11",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/46167",
    "original": "https://data.si.re.kr/sites/default/files/photos/05H03802Ca0000.jpg",
    "title": "호압사 · 05H03802Ca0000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 900,
    "height": 601
  },
  {
    "courses": {
      "c291": "서울 벚꽃십리길"
    },
    "src": "/assets/course-photos/c291.webp",
    "place": "벚꽃십리길 신정교 북측 · 안양천생태공원 겨울 풍경",
    "date": "2020-02",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/62144",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06S02111Ac80000.jpg",
    "title": "안양천생태공원 · 06S02111Ac80000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c295": "서울 공암나루길"
    },
    "src": "/assets/course-photos/c295.webp",
    "place": "공암나루길 경유지 · 허가바위 옆 산책로",
    "date": "2020-01",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/57146",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06D05106Ab40000.jpg",
    "title": "허가바위 · 06D05106Ab40000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c302": "서울 우이천"
    },
    "src": "/assets/course-photos/c302.webp",
    "place": "우이천 쌍한교 주변 수변 산책공간",
    "date": "2020-04",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/56798",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06C03511Bb42000.jpg",
    "title": "우이천 · 06C03511Bb42000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 900,
    "height": 605
  },
  {
    "courses": {
      "c306": "서울 영등포 수변둘레길"
    },
    "src": "/assets/course-photos/c306.webp",
    "place": "영등포 수변둘레길 · 안양천 목동교 부근 벚꽃 둑방길",
    "date": "2015-04",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/48386",
    "original": "https://data.si.re.kr/sites/default/files/photos/05T02701Bb6000.jpg",
    "title": "안양천 · 05T02701Bb6000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 900,
    "height": 601
  },
  {
    "courses": {
      "c307": "서울 염창산 산책길"
    },
    "src": "/assets/course-photos/c307.webp",
    "place": "염창산 염창공원 숲길",
    "date": "2009-12",
    "author": "서울 2009/2010 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/40499",
    "original": "https://data.si.re.kr/sites/default/files/photos/04D01402ac2000.jpg",
    "title": "염창공원 · 04D01402ac2000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 600,
    "height": 399
  },
  {
    "courses": {
      "c228": "청와대 앞길"
    },
    "src": "/assets/course-photos/c228.webp",
    "place": "청와대로 보행로 · 청와대 앞길",
    "date": "2020-02",
    "author": "서울 2019/2020 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/63784",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06W09207Dc70000.jpg",
    "title": "청와대앞길 · 06W09207Dc70000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 900,
    "height": 600
  },
  {
    "courses": {
      "c235": "봉산 능선 산책길"
    },
    "src": "/assets/course-photos/c235.webp",
    "place": "봉산 능선 산책길 경유지 · 봉산정 주변 전망광장",
    "date": "2015-03",
    "author": "서울 2014/2015 도시형태와 경관, 서울특별시 · 서울연구원",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://data.si.re.kr/node/48706",
    "original": "https://data.si.re.kr/sites/default/files/photos/05V01001Ad2000.jpg",
    "title": "봉산도시자연공원 · 05V01001Ad2000",
    "changes": "웹용 축소·WebP 변환",
    "checked": "2026-10-02",
    "width": 600,
    "height": 401
  },
  {
    "courses": {
      "c337": "양양 낙산해변 해안 산책길"
    },
    "src": "/assets/course-photos/c337.webp",
    "place": "낙산해변",
    "date": "2026-06-23 12:40:22",
    "author": "Grapesurgeon",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3ANaksan_Beach_01.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Naksan_Beach_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "File:Naksan Beach 01.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 960,
    "height": 720
  },
  {
    "courses": {
      "c338": "속초 대포항 산책길"
    },
    "src": "/assets/course-photos/c338.webp",
    "place": "대포항",
    "date": "2022-12-10 12:56:19",
    "author": "Mobius6",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3ADaepo_Port_%28Sokcho%29_20221210_001.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/9/90/Daepo_Port_%28Sokcho%29_20221210_001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "File:Daepo Port (Sokcho) 20221210 001.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 960,
    "height": 640
  },
  {
    "courses": {
      "c339": "속초해변 해안 산책길"
    },
    "src": "/assets/course-photos/c339.webp",
    "place": "속초해변",
    "date": "2019-02-18",
    "author": "BBA97",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3ASokcho_Beach_2019.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/7/73/Sokcho_Beach_2019.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "File:Sokcho Beach 2019.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 720,
    "height": 960
  },
  {
    "courses": {
      "c340": "속초 아바이마을 산책길"
    },
    "src": "/assets/course-photos/c340.webp",
    "place": "아바이마을",
    "date": "2009-05-24 12:41:56",
    "author": "Marie",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AAbai_Village.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/8/82/Abai_Village.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "File:Abai Village.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 960,
    "height": 720
  },
  {
    "courses": {
      "c341": "속초 영랑호 호반 산책길"
    },
    "src": "/assets/course-photos/c341.webp",
    "place": "영랑호",
    "date": "2018-10-04 17:38:30",
    "author": "Christophe95",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File%3AYeongnangho.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Yeongnangho.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "File:Yeongnangho.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-02",
    "width": 960,
    "height": 643
  },
  {
    "courses": {
      "c370": "석촌호수 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c370.webp",
    "place": "석촌호수",
    "date": "2015-10-20 15:30:48",
    "author": "Jocelyndurrey",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EC%84%9D%EC%B4%8C_%ED%98%B8%EC%88%98%EA%B3%B5%EC%9B%90_%EA%B8%B8_(3).jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/7/7e/%EC%84%9D%EC%B4%8C_%ED%98%B8%EC%88%98%EA%B3%B5%EC%9B%90_%EA%B8%B8_%283%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "석촌 호수공원 길 (3).jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 960,
    "height": 540
  },
  {
    "courses": {
      "c374": "월미산 보행로 산책 코스",
      "c432": "중구 인천둘레길 13코스 월미산"
    },
    "src": "/assets/course-photos/c374.webp",
    "place": "월미산 광장 전경 (둘레길 주변)",
    "date": "2013-07-20 19:34:30",
    "author": "김만호",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EC%9B%94%EB%AF%B8%EC%82%B0_%EA%B4%91%EC%9E%A5.JPG",
    "original": "https://upload.wikimedia.org/wikipedia/commons/c/c8/%EC%9B%94%EB%AF%B8%EC%82%B0_%EA%B4%91%EC%9E%A5.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "월미산 광장.JPG",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09",
    "width": 960,
    "height": 303
  },
  {
    "courses": {
      "c377": "성남 중앙공원 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c377.webp",
    "place": "성남 중앙공원",
    "date": "Taken on 12 May 2015, 13:03:08",
    "author": "Jocelyndurrey\n\n This photo was taken with LG G3",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EC%84%B1%EB%82%A8%EC%A4%91%EC%95%99%EA%B3%B5%EC%9B%90_%EA%B8%B8.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/9/96/%EC%84%B1%EB%82%A8%EC%A4%91%EC%95%99%EA%B3%B5%EC%9B%90_%EA%B8%B8.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "성남중앙공원 길.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 675,
    "height": 1200
  },
  {
    "courses": {
      "c379": "돌산공원 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c379.webp",
    "place": "돌산공원",
    "date": "2018-04-14 18:53:13",
    "author": "Choi2451",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Dolsan_Bridge_seen_from_Dolsan_Park,_Yeosu.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/5/57/Dolsan_Bridge_seen_from_Dolsan_Park%2C_Yeosu.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Dolsan Bridge seen from Dolsan Park, Yeosu.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 960,
    "height": 467
  },
  {
    "courses": {
      "c350": "포항 호미반도 해안둘레길 4코스 호미길"
    },
    "src": "/assets/course-photos/c350.webp",
    "place": "호미곶 해맞이공원 (코스 경유지)",
    "date": "2024-01-13 16:33:45",
    "author": "Mobius6",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Homigot_20240113_001.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Homigot_20240113_001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Homigot 20240113 001.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 960,
    "height": 640
  },
  {
    "courses": {
      "c356": "울산 간절곶소망길 2코스 낭만의길",
      "c357": "울산 간절곶소망길 3코스 소망의길",
      "c354": "울산 간절곶소망길 5코스 행복의길",
      "c358": "울산 간절곶소망길 4코스 사랑의길"
    },
    "src": "/assets/course-photos/c356.webp",
    "place": "간절곶 해안 풍경 · 소망길 여러 코스의 연결 지점",
    "date": "2018-08-16 12:51:24",
    "author": "Choi2451",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Ganjeolgot,_Ulsan_on_August_16th,_2018.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Ganjeolgot%2C_Ulsan_on_August_16th%2C_2018.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Ganjeolgot, Ulsan on August 16th, 2018.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09",
    "width": 960,
    "height": 720
  },
  {
    "courses": {
      "c359": "목포 유달산둘레길"
    },
    "src": "/assets/course-photos/c359.webp",
    "place": "유달산 주변 풍경",
    "date": "Taken on 15 April 2018, 17:19:46",
    "author": "Matt872000\n\n This photo was taken with Nikon D5300",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Yudalsan_20180415_171946.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/0/02/Yudalsan_20180415_171946.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Yudalsan 20180415 171946.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 960,
    "height": 450
  },
  {
    "courses": {
      "c360": "익산 미륵산 둘레길"
    },
    "src": "/assets/course-photos/c360.webp",
    "place": "미륵산 주변 풍경",
    "date": "2025-02-24",
    "author": "LandAndTree",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Iksan_Mireuksan_20250224_(01).jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/6d/Iksan_Mireuksan_20250224_%2801%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Iksan Mireuksan 20250224 (01).jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 960,
    "height": 640
  },
  {
    "courses": {
      "c361": "인천둘레길 1코스 계양산"
    },
    "src": "/assets/course-photos/c361.webp",
    "place": "계양산 주변 풍경",
    "date": "2026-06-07 11:22:26",
    "author": "Jjw",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:20260607_Gyeyangsan_mountain.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/b/b8/20260607_Gyeyangsan_mountain.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "20260607 Gyeyangsan mountain.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 960,
    "height": 540
  },
  {
    "courses": {
      "c387": "광교호수공원 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c387.webp",
    "place": "광교호수공원",
    "date": "Taken on 5 October 2014, 12:31:12",
    "author": "Jocelyndurrey\n\n This photo was taken with LG G3",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EA%B4%91%EA%B5%90%ED%98%B8%EC%88%98%EA%B3%B5%EC%9B%90_(1).jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/61/%EA%B4%91%EA%B5%90%ED%98%B8%EC%88%98%EA%B3%B5%EC%9B%90_%281%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "광교호수공원 (1).jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 1000,
    "height": 563
  },
  {
    "courses": {
      "c398": "제천 의림지 호반 GPX 구간"
    },
    "src": "/assets/course-photos/c398.webp",
    "place": "의림지 호반 풍경",
    "date": "2016-06-23 19:16",
    "author": "Kyle Magnuson from Los Angeles, United States",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Uirimji_Reservoir_(3)_(32813000084).jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/1/15/Uirimji_Reservoir_%283%29_%2832813000084%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Uirimji Reservoir (3) (32813000084).jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 1000,
    "height": 750
  },
  {
    "courses": {
      "c401": "은파호수공원 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c401.webp",
    "place": "은파호수공원 산책길",
    "date": "2018-04-28 05:17:08",
    "author": "AveryHooper",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Eunpa_Lake_Trails.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/2/26/Eunpa_Lake_Trails.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Eunpa Lake Trails.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 1000,
    "height": 666
  },
  {
    "courses": {
      "c404": "동탄호수공원 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c404.webp",
    "place": "동탄호수공원 일대 풍경",
    "date": "2019-09-24",
    "author": "Nicing",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EB%A0%88%EC%9D%B4%ED%81%AC%EA%BC%AC%EB%AA%A8_%EC%A0%84%EA%B2%BD_(5).jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/f/f8/%EB%A0%88%EC%9D%B4%ED%81%AC%EA%BC%AC%EB%AA%A8_%EC%A0%84%EA%B2%BD_%285%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "레이크꼬모 전경 (5).jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 960,
    "height": 608
  },
  {
    "courses": {
      "c407": "울산대공원 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c407.webp",
    "place": "울산대공원 현충탑 주변 풍경",
    "date": "Taken on 24 May 2017 16:19:27",
    "author": "Dongchan0417",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EC%9A%B8%EC%82%B0%EB%8C%80%EA%B3%B5%EC%9B%90_%ED%98%84%EC%B6%A9%ED%83%91_20170524_161927.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/c/c3/%EC%9A%B8%EC%82%B0%EB%8C%80%EA%B3%B5%EC%9B%90_%ED%98%84%EC%B6%A9%ED%83%91_20170524_161927.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "울산대공원 현충탑 20170524 161927.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 1000,
    "height": 750
  },
  {
    "courses": {
      "c408": "올림픽공원 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c408.webp",
    "place": "올림픽공원",
    "date": "2017-09-18 10:47:26",
    "author": "Teemeah",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Seoul_Olympic_Park_2017_5.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Seoul_Olympic_Park_2017_5.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Seoul Olympic Park 2017 5.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 1000,
    "height": 750
  },
  {
    "courses": {
      "c410": "동락공원 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c410.webp",
    "place": "동락공원",
    "date": "2020-04-02",
    "author": "Ivisy6952",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EB%8F%99%EB%9D%BD%EA%B3%B5%EC%9B%90.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/c/ce/%EB%8F%99%EB%9D%BD%EA%B3%B5%EC%9B%90.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "동락공원.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 1000,
    "height": 1000
  },
  {
    "courses": {
      "c414": "제주 사계해변 GPX 선택 구간"
    },
    "src": "/assets/course-photos/c414.webp",
    "place": "사계해변",
    "date": "2026-05-05 17:06:53",
    "author": "Grapesurgeon",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Sagye_Beach_01.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/5/56/Sagye_Beach_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Sagye Beach 01.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 1000,
    "height": 750
  },
  {
    "courses": {
      "c416": "강릉 사근진해변 GPX 선택 구간"
    },
    "src": "/assets/course-photos/c416.webp",
    "place": "사근진해변",
    "date": "2016-05-28 12:34:39",
    "author": "최광모 (Choe Kwangmo)",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:2016%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EA%B0%95%EC%9B%90%EB%8F%84_%EA%B0%95%EB%A6%89%EC%8B%9C_%EC%82%AC%EA%B7%BC%EC%A7%84%ED%95%B4%EB%B3%80_DSC01263.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/0/03/2016%EB%85%84_5%EC%9B%94_28%EC%9D%BC_%EA%B0%95%EC%9B%90%EB%8F%84_%EA%B0%95%EB%A6%89%EC%8B%9C_%EC%82%AC%EA%B7%BC%EC%A7%84%ED%95%B4%EB%B3%80_DSC01263.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "2016년 5월 28일 강원도 강릉시 사근진해변 DSC01263.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 960,
    "height": 640
  },
  {
    "courses": {
      "c369": "일산호수공원 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c369.webp",
    "place": "일산호수공원",
    "date": "2013-08-08",
    "author": "travel oriented",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Goyang_Lake_Park.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/1/16/Goyang_Lake_Park.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Goyang Lake Park.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-03",
    "width": 1000,
    "height": 667
  },
  {
    "courses": {
      "c402": "만석공원 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c402.webp",
    "place": "만석공원 호수 주변 산책 공간",
    "date": "2020-09-20",
    "author": "kepper",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EB%A7%8C%EC%84%9D%EA%B3%B5%EC%9B%90_%ED%95%9C_%EB%B0%94%ED%80%B4_(2020.09.20)_03.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/4/42/%EB%A7%8C%EC%84%9D%EA%B3%B5%EC%9B%90_%ED%95%9C_%EB%B0%94%ED%80%B4_%282020.09.20%29_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "만석공원 한 바퀴 (2020.09.20) 03.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900
  },
  {
    "courses": {
      "c376": "대왕암공원 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c376.webp",
    "place": "대왕암공원 해안 산책 구간",
    "date": "2016-06-18",
    "author": "Shinfull",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Daewangam_Park.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/3/35/Daewangam_Park.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Daewangam Park.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 692
  },
  {
    "courses": {
      "c365": "세종호수공원 C코스"
    },
    "src": "/assets/course-photos/c365.webp",
    "place": "세종호수공원 호숫가 산책 공간",
    "date": "2019-06-09",
    "author": "*Youngjin",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Sejong_lake_park_190609_01.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Sejong_lake_park_190609_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Sejong lake park 190609 01.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 800
  },
  {
    "courses": {
      "c395": "제주 송악산 해안 둘레길 GPX 구간"
    },
    "src": "/assets/course-photos/c395.webp",
    "place": "송악산 해안 둘레길에서 바라본 바다",
    "date": "2014-03-05",
    "author": "Lcarrion88",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Songaksan.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Songaksan.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Songaksan.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 773
  },
  {
    "courses": {
      "c362": "포천 산정호수 둘레길"
    },
    "src": "/assets/course-photos/c362.webp",
    "place": "산정호수 둘레길 겨울 풍경",
    "date": "2016-12-14",
    "author": "Explicit",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Sanjeong_Lake_(%ED%8F%AC%EC%B2%9C_%EC%82%B0%EC%A0%95%ED%98%B8%EC%88%98),_December_2016.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Sanjeong_Lake_%28%ED%8F%AC%EC%B2%9C_%EC%82%B0%EC%A0%95%ED%98%B8%EC%88%98%29%2C_December_2016.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Sanjeong Lake (포천 산정호수), December 2016.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 675
  },
  {
    "courses": {
      "c385": "자유공원(인천) 보행로 산책 코스"
    },
    "src": "/assets/course-photos/c385.webp",
    "place": "자유공원 보행로",
    "date": "2008-06-01",
    "author": "Dohuskor",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Jayuwalkway.jpg#Licensing",
    "source": "https://commons.wikimedia.org/wiki/File:Jayuwalkway.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/8/8d/Jayuwalkway.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Jayuwalkway.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900
  },
  {
    "courses": {
      "c427": "여주시 여강길 8코스 파사성길"
    },
    "src": "/assets/course-photos/c427.webp",
    "place": "여강길 8코스 경유지 · 파사성 성벽",
    "date": "2011-02-09",
    "author": "Eggmoon",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Pasaseong_Castle_at_Yeoju,_Korea_04.JPG",
    "original": "https://upload.wikimedia.org/wikipedia/commons/0/02/Pasaseong_Castle_at_Yeoju%2C_Korea_04.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Pasaseong Castle at Yeoju, Korea 04.JPG",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 800
  },
  {
    "courses": {
      "c419": "종로구 서울한양도성 6코스 인왕산구간"
    },
    "src": "/assets/course-photos/c419.webp",
    "place": "한양도성 인왕산 구간",
    "date": "2008-04-29",
    "author": "Gaël Chardon",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Korea-Seoul-Inwangsan-12.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Korea-Seoul-Inwangsan-12.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Korea-Seoul-Inwangsan-12.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900
  },
  {
    "courses": {
      "c433": "경주시 보문호반길"
    },
    "src": "/assets/course-photos/c433.webp",
    "place": "보문호 호반 풍경",
    "date": "2012-05-03",
    "author": "ProjectManhattan",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Bomun_Lake.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Bomun_Lake.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Bomun Lake.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900
  },
  {
    "courses": {
      "c434": "포천시 한탄강 주상절리길 1코스 구라이길"
    },
    "src": "/assets/course-photos/c434.webp",
    "place": "구라이길 출발부 · 비둘기낭폭포",
    "date": "2017-05-06",
    "author": "Jjw",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Columnar_jointed_basalt_in_Bidulginang(Dove%27s_pocket)_Fall_at_Pocheon,_Gyeonggi-do,_South_Korea,_image_1.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/0/03/Columnar_jointed_basalt_in_Bidulginang%28Dove%27s_pocket%29_Fall_at_Pocheon%2C_Gyeonggi-do%2C_South_Korea%2C_image_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Columnar jointed basalt in Bidulginang(Dove's pocket) Fall at Pocheon, Gyeonggi-do, South Korea, image 1.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 800
  },
  {
    "courses": {
      "c347": "여주 여강길 3-1코스 (강천섬길)"
    },
    "place": "강천섬 잔디마당",
    "author": "경기도",
    "date": "촬영 시기 미상",
    "dateNote": "출처의 2000년 표기는 촬영일로 확정하지 않음",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=37107",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91/%ED%8F%AC%ED%86%A0%EA%B0%A4%EB%9F%AC%EB%A6%AC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91%ED%8F%AC%ED%84%B8_2228_%5B%EC%97%AC%EC%A3%BC%5D%20%EA%B0%95%EC%B2%9C%EC%84%AC.jpg",
    "title": "경기관광포털_2228_[여주] 강천섬.jpg",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c347.webp",
    "width": 760,
    "height": 570,
    "sourceSha256": "e935a3572252905d27b2cf5f2c2a40bfe9e7a664ddd7f37b8839296dec9bb69f",
    "assetSha256": "b02ef51c6279c2cca38b11c4bb8b8cb476efd81e036af05390efb3cabcc38ca4",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c352": "포항 호미반도 해안둘레길 2코스 선바우길"
    },
    "place": "호미반도 선바우와 해안 데크길",
    "author": "한국관광공사",
    "date": "2020",
    "dateNote": "출처 페이지 촬영연도 표기",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=37909",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC/%EC%82%AC%EC%A7%84%EC%A0%84%EB%AC%B8%EA%B0%80/%EC%82%AC%EC%A7%84%EA%B0%A4%EB%9F%AC%EB%A6%AC_0243_%ED%98%B8%EB%AF%B8%EB%B0%98%EB%8F%84%20%ED%95%B4%EC%95%88%EB%91%98%EB%A0%88%EA%B8%B8.jpg",
    "title": "사진갤러리_0243_호미반도 해안둘레길.jpg",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c352.webp",
    "width": 760,
    "height": 507,
    "sourceSha256": "9352466d6a293dcb9dedd2d85b89ef7c9810b63551670b54a0e2204a0fdb6b95",
    "assetSha256": "01c41fee9132c17629dcf756b4516cc12affe6ddb5524713a545db20fac4c7cd",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c384": "뿌리공원 보행로 산책 코스"
    },
    "place": "뿌리공원 전경",
    "author": "김민아·대전광역시",
    "date": "2018",
    "dateNote": "출처 페이지 촬영연도 표기",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=36758",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%EB%8C%80%EC%A0%84%EA%B4%91%EC%97%AD%EC%8B%9C/%EB%AC%B4%EC%8A%A8%20%EC%82%AC%EC%A7%84%EC%9D%BC%EA%B9%8C/%EA%B3%B5%EB%AA%A8%EC%A0%84_0178_%EB%BF%8C%EB%A6%AC%EA%B3%B5%EC%9B%90%20%EC%A0%84%EA%B2%BD.jpg",
    "title": "공모전_0178_뿌리공원 전경.jpg",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c384.webp",
    "width": 760,
    "height": 412,
    "sourceSha256": "0eb7e9adbc879ea3775bd0fb11d41ad7a6a360f22677718996e6a0fdc797f6e7",
    "assetSha256": "a4c149999af39d60cf33710e1ae5f09f7b97a716a765a58a93ac74ace6710f7e",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c386": "영덕해맞이공원 보행로 산책 코스"
    },
    "place": "영덕해맞이공원 창포말등대와 전망데크",
    "author": "한국관광공사",
    "date": "2020",
    "dateNote": "출처 페이지 촬영연도 표기",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=37892",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC/%EC%82%AC%EC%A7%84%EC%A0%84%EB%AC%B8%EA%B0%80/%EC%82%AC%EC%A7%84%EA%B0%A4%EB%9F%AC%EB%A6%AC_0067_%EC%98%81%EB%8D%95%20%ED%95%B4%EB%A7%9E%EC%9D%B4%EA%B3%B5%EC%9B%90.jpg",
    "title": "사진갤러리_0067_영덕 해맞이공원.jpg",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c386.webp",
    "width": 427,
    "height": 640,
    "sourceSha256": "daa52fea5169b01daea6fdd3a766dc317f62f90342a44aff926941141100147c",
    "assetSha256": "a8101784a115db11a4da3c1ac03c6f2fd2b04fe146eabb22d7339b2c30e02423",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c393": "아산 곡교천 은행나무길"
    },
    "place": "아산 곡교천 은행나무길",
    "author": "아산시",
    "date": "2020",
    "dateNote": "출처 페이지 촬영연도 표기",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=58281",
    "original": "https://www.kogl.or.kr/upload_recommend/2023New/%EA%B3%B5%EA%B3%B5%EB%88%84%EB%A6%AC/thumnail/%EA%B3%B5%EA%B3%B5%EB%88%84%EB%A6%AC%20%EC%8D%B8%EB%84%A4%EC%9D%BC%20%EB%B3%80%ED%99%98/13.%20%EC%95%84%EC%82%B0%EC%8B%9C/02.%20%EC%BD%98%ED%85%90%EC%B8%A0/01.%20%EB%AC%B8%ED%99%94%EA%B4%80%EA%B4%91/%EC%95%84%EC%82%B0%EC%8B%9C%EB%AC%B8%ED%99%94%EA%B4%80%EA%B4%91_0086_%EC%95%84%EC%82%B0%20%EC%9D%80%ED%96%89%EB%82%98%EB%AC%B4%EA%B8%B8_detail_thumnail.jpg",
    "title": "아산시문화관광_0086_아산 은행나무길_detail_thumnail.jpg",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c393.webp",
    "width": 700,
    "height": 466,
    "sourceSha256": "c79c5dece6e0398129ecdc795a937e9beb71760c6bd75233badd52303988a09f",
    "assetSha256": "5b34178ab7df63e65a84370c49ab85944c361174d61311544b49f1dae3db9eee",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c343": "여주 여강길 3코스 바위늪구비길"
    },
    "place": "여강길 경유지 · 신륵사 입구",
    "author": "경기도",
    "date": "촬영 시기 미상",
    "dateNote": "공공누리 제공 사진 · 촬영일 미상",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=37113",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91/%ED%8F%AC%ED%86%A0%EA%B0%A4%EB%9F%AC%EB%A6%AC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91%ED%8F%AC%ED%84%B8_2292_%5B%EC%97%AC%EC%A3%BC%5D%20%EC%8B%A0%EB%A5%B5%EC%82%AC.JPG",
    "title": "경기관광포털_2292_[여주] 신륵사.JPG",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c343.webp",
    "width": 760,
    "height": 507,
    "sourceSha256": "4487698ab74e1c94c669379078941ad33d8f2302f878cb72cbe7e78e2233c955",
    "assetSha256": "c2cc03f9933f7b9101dbf24284fef0355f013bedc7ba7b994ad219696b2fa653",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c380": "다산생태공원 보행로 산책 코스"
    },
    "place": "다산생태공원 입구와 잔디마당",
    "author": "최병용 기자·경기도",
    "date": "2023-09-14",
    "dateNote": "촬영일 미상 · 출처 페이지 공개일 기준",
    "source": "https://gnews.gg.go.kr/news/news_detail.do?number=202309141628417534C094",
    "original": "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/202309/20230914042841795704989.jpg",
    "title": "다산생태공원 입구와 잔디마당",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c380.webp",
    "width": 966,
    "height": 451,
    "sourceSha256": "0eb87df04f22047a6e8ede1d356c1a2dac4652c8e54e90cb2421903f3c52a585",
    "assetSha256": "3a80ccd42ea92bed463041b8daaab43d0384c367513a3789e23ca2cdb0d5f5d6",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c383": "설봉공원 보행로 산책 코스"
    },
    "place": "설봉공원 호반 산책로",
    "author": "조영진 기자·경기도",
    "date": "2015-07-22",
    "dateNote": "촬영일 미상 · 출처 페이지 공개일 기준",
    "source": "https://gnews.gg.go.kr/news/news_detail.do?number=201507221041136438C083",
    "original": "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/201507/20150722104113256603504.jpg",
    "title": "설봉공원 호반 산책로",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c383.webp",
    "width": 677,
    "height": 403,
    "sourceSha256": "981221cd098b5852d2b67ae61e0ff0f8006bb6acc2c50d871c4816c5997905cc",
    "assetSha256": "376f28caf4659baaeef8815e2b63abafba762f5dbfcb0d3d4715f2a2588c890c",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c397": "가평 호명호수 호반 GPX 구간"
    },
    "place": "호명호수 호반 풍경",
    "author": "경기도블로그·경기도",
    "date": "2016-04-14",
    "dateNote": "촬영일 미상 · 출처 페이지 공개일 기준",
    "source": "https://gnews.gg.go.kr/news/news_detail.do?number=201604141310357788C093",
    "original": "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/201604/20160414131035393155720.jpg",
    "title": "호명호수 호반 풍경",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c397.webp",
    "width": 773,
    "height": 513,
    "sourceSha256": "81875e1c228399a5b51360b6ee8380d5bd3463dc991d61735dedc10519ff9c8f",
    "assetSha256": "5dcdc9d648e38dcce96734ccf11b5e0d4322064573302db81960bfa282ac37d7",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c388": "서호공원 보행로 산책 코스"
    },
    "place": "서호공원 산책길에서 바라본 축만제",
    "author": "이서영 기자·경기도",
    "date": "2018-11-19",
    "dateNote": "촬영일 미상 · 출처 페이지 공개일 기준",
    "source": "https://gnews.gg.go.kr/news/news_detail.do?number=201811191637434991C083",
    "original": "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/201811/20181119163743457164080.jpg",
    "title": "서호공원 산책길에서 바라본 축만제",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c388.webp",
    "width": 800,
    "height": 578,
    "sourceSha256": "60e341b41be29f0d9487aaf7eec4ad06622cc51bf22b64874ae48e809205a784",
    "assetSha256": "34e1bcaf9f16832cd892fab34a7aac42ece8a96ab4f5ff3687269e1fb6153b8f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c371": "동백호수공원 보행로 산책 코스"
    },
    "place": "용인 동백호수공원 밤풍경",
    "author": "이유주 기자·경기도",
    "date": "2024-08-30",
    "dateNote": "촬영일 미상 · 출처 페이지 공개일 기준",
    "source": "https://gnews.gg.go.kr/news/news_detail.do?number=202408301444221218C076",
    "original": "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/202408/2024083004285540937187.jpg",
    "title": "용인 동백호수공원 밤풍경",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c371.webp",
    "width": 1024,
    "height": 472,
    "sourceSha256": "3d2b04983bae8fa3c694e7fef7cc0faa1ed650b25c5e8cfe2f152c90ebb8f119",
    "assetSha256": "c08513a7ac9309bed5c07ce06935d7826cd4dc4d4effefeee4d226a16fe3b3c3",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c431": "여주시 여강길 4코스 5일장터길"
    },
    "place": "여강길 4코스 강변 산책길 풍경",
    "author": "경기도블로그·경기도",
    "date": "2016-04-18",
    "dateNote": "촬영일 미상 · 출처 페이지 공개일 기준",
    "source": "https://gnews.gg.go.kr/news/news_detail.do?number=201604181300571673C094",
    "original": "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/201604/20160418130057271797103.jpg",
    "title": "여강길 4코스 강변 산책길 풍경",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c431.webp",
    "width": 773,
    "height": 1149,
    "sourceSha256": "b124dcd75083b6c5398ab83271fab64dd3469df54f2eec9eb885f9889c182933",
    "assetSha256": "14f119e995d0a15fd827b1cc7e046fea665a7ded03dc43d3be6702183c7e715f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c372": "물의 정원 보행로 산책 코스"
    },
    "place": "물의 정원 북한강변 산책 공간",
    "author": "이창룡·경기도블로그·경기도",
    "date": "2017-08-28",
    "dateNote": "2017-08-28 공개 · 촬영일 미상",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://gnews.gg.go.kr/news/news_detail.do?number=201708281551093103C094",
    "original": "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/201708/20170828155109772223555.jpg",
    "title": "경기도 사진 찍기 좋은 곳 북한강 물의 정원",
    "src": "/assets/course-photos/c372.webp",
    "width": 900,
    "height": 600,
    "sourceSha256": "dc962d94e3e32f352260c0df5d4aa6f7465bbfb77cc6c4ca07c35d61ad35c288",
    "assetSha256": "ba14ac430f12aac009f903346749960e4f67b4b5cbccd0729919a4f845b5f375",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c381": "국채보상운동기념공원 보행로 산책 코스"
    },
    "place": "국채보상운동기념공원 달구벌대종 전경",
    "author": "대구광역시",
    "date": "2020",
    "dateNote": "출처 페이지 촬영연도 표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=63291",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/20240610/02.%20%EB%8C%80%EA%B5%AC%EA%B4%91%EC%97%AD%EC%8B%9C%EC%B2%AD/04.%20%EB%8C%80%EA%B5%AC%EC%82%AC%EC%A7%84%20%EC%95%84%EC%B9%B4%EC%9D%B4%EB%B8%8C/2705_%EC%95%84%EC%B9%B4%EC%9D%B4%EB%B8%8C_%EA%B5%AD%EC%B1%84%EB%B3%B4%EC%83%81%EC%9A%B4%EB%8F%99%EA%B8%B0%EB%85%90%EA%B3%B5%EC%9B%90%20%EB%8B%AC%EA%B5%AC%EB%B2%8C%EB%8C%80%EC%A2%85%20%EC%A0%84%EA%B2%BD.jpg",
    "title": "국채보상운동기념공원 달구벌대종 전경",
    "src": "/assets/course-photos/c381.webp",
    "width": 760,
    "height": 507,
    "sourceSha256": "967bb63a2d991f48194e918a885d898af05a89ba636e04a569e0f21395b7c6e0",
    "assetSha256": "ca47d178e4b5dda71e0053ac8492cc6f514a16b00a30fa6195c86d07fd4c7b7a",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c411": "제주 광치기해변 GPX 선택 구간"
    },
    "place": "광치기해변에서 바라본 성산일출봉",
    "author": "Republic of  Korea from Seoul, Republic of Korea",
    "date": "2014-11-27",
    "source": "https://commons.wikimedia.org/wiki/File:Jeju_Island_20141127_25_(15892738751).jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Jeju_Island_20141127_25_%2815892738751%29.jpg",
    "title": "Jeju Island 20141127 25 (15892738751).jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "src": "/assets/course-photos/c411.webp",
    "width": 1200,
    "height": 743,
    "sourceSha256": "657eea994e0a64cd464dcd9e1f41fed3ec05db6103912e1ad6a67e741060a4e9",
    "assetSha256": "944582648d127a72e07a6ae03ee63c948a0afec958a2aa183234f2f88ac836ac",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c335": "서울 진경산수화길",
      "c429": "종로구 골목길탐방코스 인왕산자락예술가길"
    },
    "place": "수성동계곡에서 바라본 인왕산 (코스 경유지)",
    "author": "Republic of  Korea from Seoul, Republic of Korea",
    "date": "2016-11-02",
    "source": "https://commons.wikimedia.org/wiki/File:Inwangsan_Mountain_20161102_01_(30091798783).jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/3/38/Inwangsan_Mountain_20161102_01_%2830091798783%29.jpg",
    "title": "Inwangsan Mountain 20161102 01 (30091798783).jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "src": "/assets/course-photos/c335.webp",
    "width": 848,
    "height": 1200,
    "sourceSha256": "c8fd1fb54afaa3c595e1ffb709df4b9c69e941965bdd73e4dfbb5a28d466e673",
    "assetSha256": "a46a9670e48c631825e0789464ddc3632ea85383f2bc727da2872b10052dee02",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c418": "경주시 파도소리길"
    },
    "place": "양남 주상절리 해안 (파도소리길 경유지)",
    "author": "Serena Kang",
    "date": "2017-05-04",
    "source": "https://commons.wikimedia.org/wiki/File:Gyeongju_Yangnam_Jusangjeolli_Cliff.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/63/Gyeongju_Yangnam_Jusangjeolli_Cliff.jpg",
    "title": "Gyeongju Yangnam Jusangjeolli Cliff.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "src": "/assets/course-photos/c418.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "5ce041a05171bd87c0f1519db3668c029d663bd2e5a11badbf6a0e4b263db113",
    "assetSha256": "5aba7aad2b95aa06af4cfe9ed72e6f700ef8e2aba11d6695a34bc48d1aa96d98",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c425": "강릉시 바우길 17코스 안반데기 운유길"
    },
    "place": "안반데기 운유길 경유지의 고랭지 밭 풍경",
    "author": "Choi Kwang-mo",
    "date": "2020-07-12",
    "source": "https://commons.wikimedia.org/wiki/File:20200711_163410_items_places_in_south_korea_IMG_3406.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/0/05/20200711_163410_items_places_in_south_korea_IMG_3406.jpg",
    "title": "20200711 163410 items places in south korea IMG 3406.jpg",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "dateNote": "촬영일은 원본 메타데이터 기준; 파일명 날짜와 차이가 있음",
    "src": "/assets/course-photos/c425.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "a313ecb143bb2e88916d2e084c7df0e6286c37f858cff30701a8f710175d9e59",
    "assetSha256": "d382667f785c1b238182156124de5d13f17691d8e5d955f2955a5016ad3cb426",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c382": "우암사적공원 보행로 산책 코스"
    },
    "place": "우암사적공원 인함각",
    "author": "김원일 · 대전광역시",
    "date": "2016",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=36698",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%EB%8C%80%EC%A0%84%EA%B4%91%EC%97%AD%EC%8B%9C/%EB%AC%B4%EC%8A%A8%20%EC%82%AC%EC%A7%84%EC%9D%BC%EA%B9%8C/%EA%B3%B5%EB%AA%A8%EC%A0%84_0118_%EC%9A%B0%EC%95%94%EC%82%AC%EC%A0%81%EA%B3%B5%EC%9B%90%20%EC%9D%B8%ED%95%A8%EA%B0%81.jpg",
    "title": "공모전_0118_우암사적공원 인함각.jpg",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c382.webp",
    "width": 760,
    "height": 507,
    "sourceSha256": "a095b18cc64a7d857af55ba7a75be0a71d890564ab141289b1522bc93fe9ce58",
    "assetSha256": "ea54caefa67e090a3367177fa694cbd043503621d259c232be27d6379ffd7f38",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c394": "부산 절영해안산책로 GPX 구간"
    },
    "place": "절영해안산책로",
    "author": "부산광역시",
    "date": "2020",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=14613",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%EC%A7%80%EC%97%AD%EB%B3%84%EA%B4%80%EA%B4%91%EC%A7%80/%EB%B6%80%EC%82%B0%EA%B4%91%EC%97%AD%EC%8B%9C/%EB%B6%80%EC%82%B0%EC%97%AC%ED%96%89%EC%82%AC%EC%A7%84/1022.jpg",
    "title": "1022.jpg",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c394.webp",
    "width": 760,
    "height": 428,
    "sourceSha256": "eba8db2d16efc09d3a1ff93dcb32867a0f3207c58caea14045eec426ab71d4c6",
    "assetSha256": "c270929601b391867e0a9924934f8f76b2e9a8ae20cc109115675adc397119c9",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c420": "김포시 문수산 등산로 1코스",
      "c421": "김포시 문수산 등산로 2코스",
      "c422": "김포시 문수산 등산로 3코스"
    },
    "place": "문수산성 성벽과 산길 (문수산 등산로 주변)",
    "author": "경기도",
    "date": "촬영 시기 미상",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=37006",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91/%ED%8F%AC%ED%86%A0%EA%B0%A4%EB%9F%AC%EB%A6%AC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91%ED%8F%AC%ED%84%B8_0862_%5B%EA%B9%80%ED%8F%AC%5D%20%EB%AC%B8%EC%88%98%EC%82%B0%EC%84%B1.jpg",
    "title": "경기관광포털_0862_[김포] 문수산성.jpg",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "dateNote": "출처의 2000년 표기는 촬영일로 확정하지 않음",
    "src": "/assets/course-photos/c420.webp",
    "width": 760,
    "height": 507,
    "sourceSha256": "32ea3cda38549bfe325185c4d807cef1dba23bf6fc9d7129ddb588de49ab80c2",
    "assetSha256": "92aa7507108b474cc70198296be5513665156d25bdeb4373985a8f01f22e96f8",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c342": "여주 여강길 1코스 옛나루터길"
    },
    "place": "여강길 옛나루터길 일대 갈대 풍경",
    "author": "이종민 · 경기도뉴스포털",
    "date": "촬영 시기 미상",
    "dateNote": "2009-11-02 기사 게재; 촬영일 미표기",
    "source": "https://gnews.gg.go.kr/news/news_detail.do?newsType=N&number=200911021004274463C049&s_code=C049",
    "original": "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/200911/20091102100427033191975.jpg",
    "title": "은모래 금모래 반짝이는 여강길",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c342.webp",
    "width": 500,
    "height": 220,
    "sourceSha256": "08404f9d3d808e491234ffe2c711e64ccbbd8dc252ff0cf9aa31cc7c1f0fd4c6",
    "assetSha256": "8dbc8334362d6e0d5449c3eb0c8c8f8be4105e9dfee6fcd58699a275a5e5051c",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c266": "서울 대모산 숲길"
    },
    "place": "대모산 도시자연공원 숲길 (촬영 당시 겨울 모습)",
    "date": "2019-12",
    "author": "서울연구원",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://data.si.re.kr/node/55879",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06A02502Aa10000.jpg",
    "title": "대모산자연도시공원",
    "src": "/assets/course-photos/c266.webp",
    "width": 900,
    "height": 600,
    "sourceSha256": "46a5e3ff7eb5e4050a9a737ee8277e18c145225d98fac5b9193996312913386d",
    "assetSha256": "de1dfd8c44cfbd91ba33ca7a99ec0342866cff07b94472a021d19aa6769a6e32",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c256": "서울 일자산 치유의 숲길"
    },
    "place": "일자산 자연공원 숲길 (치유의 숲길 주변)",
    "date": "2020-06",
    "author": "서울연구원",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://data.si.re.kr/node/56331",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06B00209Ac20000.jpg",
    "title": "강동그린웨이",
    "src": "/assets/course-photos/c256.webp",
    "width": 900,
    "height": 600,
    "sourceSha256": "8db4800eb3c955a279ffabb02064c694e877de5d2ad2560862201e60bb224798",
    "assetSha256": "1d7aa15146e9547d3612caf570e4a1329a0bbc834f0156c6fb308c052684fbfe",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c264": "서울 망우산 사색의길",
      "c319": "서울 망우리 사잇길"
    },
    "place": "망우리 역사문화공원 산책로와 묘역 주변 (촬영 당시 모습)",
    "date": "2010-05",
    "author": "서울연구원",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://data.si.re.kr/node/44756",
    "original": "https://data.si.re.kr/sites/default/files/photos/04Y01006ac0000.jpg",
    "title": "망우리공동묘지",
    "src": "/assets/course-photos/c264.webp",
    "width": 600,
    "height": 401,
    "sourceSha256": "b279de176c20bf04703eb67780d7c1c105b5901db08a4f9c460bd770fd967933",
    "assetSha256": "86940ccc940b645f38fbca2b91213126fb3d54f9713a47953173a22c5d5943bb",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c300": "서울 장미테마길 중랑천"
    },
    "place": "중랑천 장미거리 아치 산책로 (촬영 당시 겨울 모습)",
    "date": "2014-12",
    "author": "서울연구원",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://data.si.re.kr/node/50216",
    "original": "https://data.si.re.kr/sites/default/files/photos/05Y01702Ac0000.jpg",
    "title": "장미거리",
    "src": "/assets/course-photos/c300.webp",
    "width": 600,
    "height": 401,
    "sourceSha256": "350b8f7de14afb0c439780068bad834a882f4ed04c56d11a950756ab5b790644",
    "assetSha256": "b3097a30bbcad716cb945407e386e1746fbf54523772826a6be9189f3f567205",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000004081": "서울 강서구 개화산자락길(무장애 숲길)"
    },
    "place": "개화산 둘레길 무장애 데크 (촬영 당시 겨울 모습)",
    "date": "2020-01",
    "author": "서울연구원",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://data.si.re.kr/node/56872",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06D00501Ac60000.jpg",
    "title": "강서둘레길",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004081.webp",
    "width": 900,
    "height": 600,
    "sourceSha256": "1a8f7f3cb204d600546a99e383442832098ab7972564eab1878dd4b162762334",
    "assetSha256": "aede74ac278cf1958ab9528b00b235713798bba916726b7c748f04663e443bfc",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c282": "서울 천상병산길"
    },
    "place": "수락산 만남의광장 숲길 (천상병산길 경유지 주변)",
    "date": "2020-04",
    "author": "서울연구원",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://data.si.re.kr/node/58569",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06I03903Ac50000.jpg",
    "title": "수락산 만남의광장",
    "src": "/assets/course-photos/c282.webp",
    "width": 900,
    "height": 600,
    "sourceSha256": "722f62c2ae7c2857f77e5d1a64405c8308c86b1d3f6ab82ab65c1c82d0038d40",
    "assetSha256": "7d42973abe38480a928636bde3ff9b38c497e08c0a2a23067b49c8c7b33fecd4",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c373": "등나무근린공원 보행로 산책 코스"
    },
    "place": "등나무근린공원 보행로 (촬영 당시 봄 모습)",
    "date": "2020-04",
    "author": "서울연구원",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://data.si.re.kr/node/58400",
    "original": "https://data.si.re.kr/sites/default/files/photos6/06I01509Ac42000.jpg",
    "title": "등나무 근린공원",
    "src": "/assets/course-photos/c373.webp",
    "width": 900,
    "height": 596,
    "sourceSha256": "1490bf3b37b29adf1542ceab559df055751d30c532e7ca69339e8fc97bb0b53d",
    "assetSha256": "a61b29abf0ba1a51d9ba6c535726d8bcd8e85e3e0195d66ce87501924552d782",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c367": "부산 낙동강 하구 생태길 2코스 삼락 물억새길"
    },
    "place": "삼락생태공원 연꽃과 정자 풍경 (여름 참고사진)",
    "date": "2023-12-08",
    "author": "부산광역시",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://www.busan.go.kr/galmaetgil/notice02/1602279",
    "original": "https://www.busan.go.kr/comm/getFile?srvcId=BBSTY3&upperNo=1602279&fileTy=ATTACH&fileNo=1",
    "title": "[갈맷길 플라워 포인트] 삼락생태공원",
    "dateNote": "2023-12-08 게시일 · 촬영일 미표기",
    "src": "/assets/course-photos/c367.webp",
    "width": 1200,
    "height": 800,
    "sourceSha256": "d955cd1abafd6a90fefb21b5ae068861df965137bf3bf23c45d380ac8886c7f8",
    "assetSha256": "abb4dbab445f8a7e4fdeca5bc5d132127238dca34697a0ff9fc03aca3bbcebe1",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c368": "부산 낙동강 하구 생태길 1코스 삼락 맹꽁이길"
    },
    "place": "삼락생태공원 벚꽃 산책 풍경 (봄철 참고사진)",
    "date": "2020",
    "author": "부산광역시",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=14128",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/지역별관광지/부산광역시/부산여행사진/537.jpg",
    "title": "삼락생태공원",
    "src": "/assets/course-photos/c368.webp",
    "width": 760,
    "height": 507,
    "sourceSha256": "bc7994a368ea7d52814fcf5b69f248eea47e035861b900fbbaa2a6f3fc6fdf87",
    "assetSha256": "9457d41795d1331a6d110ca385589ba56834e12bf1d7bc38beb9ff45d0590bd7",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c400": "고모호수공원 보행로 산책 코스"
    },
    "place": "고모호수공원 수변 산책로와 호수 (여름 참고사진)",
    "date": "2025-03-09",
    "author": "경기뉴스광장 유애형 기자",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://gnews.gg.go.kr/news/news_detail.do?number=202503090155538509C094&s_code=C094",
    "original": "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/202503/20250309015553377336553.jpg",
    "title": "고모호수공원 여름 풍경",
    "dateNote": "2025-03-09 게시일 · 촬영일 미표기",
    "src": "/assets/course-photos/c400.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "ba27128a4d491f61d2c1c324e66659bb4bed9ef1e3a07fe050f4affe087ccf56",
    "assetSha256": "bab420cfb0571db145170f89273909ce898d92bf6000331498953f90e3f9e77f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c430": "제주시 해안누리길 닭머르해안길 (공식 GPX 제공 구간)"
    },
    "place": "닭머르해안길 신촌포구 주변 풍경",
    "date": "2019-11",
    "author": "ⓒ한국관광공사 사진갤러리-김지호",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://korean1.visitkorea.or.kr/kor/nphotogallery/photo.kto?func_name=photo_view&newphotoDTO.photo_code=2719019201911001k",
    "original": "https://tong.visitkorea.or.kr/cms/resource_photo/25/2643225_image2_1.jpg",
    "title": "닭머르해안길",
    "src": "/assets/course-photos/c430.webp",
    "width": 680,
    "height": 453,
    "sourceSha256": "e583e845fa664b7f1115ea9c9ab76b023b660e6e4dfc232dd3d7b91c41daaf07",
    "assetSha256": "e7dc022935e830af9a977480dc44d61325a8395f84003ed3a2274fd85f42695a",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001649": "경남 양산시 황산강 베랑길"
    },
    "place": "황산강 베랑길 낙동강 수변 데크",
    "date": "2026-10-09",
    "author": "한국관광공사(두루누비) · 양산시 제공",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://yangsan.go.kr/tour/contents.do?mid=0301010300",
    "original": "https://yangsan.go.kr/tour/img/sub/03/img010103_01.jpg",
    "title": "황산강 베랑길",
    "dateNote": "2026-10-09 출처 확인일 · 촬영일 미표기",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001649.webp",
    "width": 1035,
    "height": 510,
    "sourceSha256": "ad21cf4b1aa18e088b1ab27c34c11e8c90881330afcbf7810c9ba173d429adc5",
    "assetSha256": "3232f0d0d4604bf5038cf42f27e25bc9605213fa323d60b9b0383b0ab840a164",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001517": "경북 영덕군 해안누리길 고래불 명사이십리길"
    },
    "place": "고래불해수욕장 입구 광장과 조형물 (코스 경유지 참고사진)",
    "date": "2023-03-16",
    "dateNote": "2023-03-16 게시일 · 촬영일 미표기",
    "author": "한국농어촌공사 웰촌",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://www.welchon.com/web/lay1/program/S1T23C24/travelHistory/view.do?bbs_idx=2211636",
    "original": "https://www.welchon.com/upload/editor/images/000019/20230316091148837_VY88QVOT.jpg",
    "title": "영덕 인량전통테마마을에서 느끼는 봄의 정취 · 고래불해수욕장",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001517.webp",
    "width": 900,
    "height": 600,
    "sourceSha256": "e6f0fbf87a7ba4495820161ca353e8415fdc4038853301b609e4cbb63164988e",
    "assetSha256": "7ad0a8d013979dd60cfa4c05034b02723831ea439c252f80b0f6a406684653ab",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c364": "완주 경천애인징검다리길"
    },
    "place": "완주 오복마을 구룡천 징검다리 (경천애인징검다리길 경유지)",
    "date": "2021-12-30",
    "dateNote": "2021-12-30 게시일 · 촬영일 미표기",
    "author": "한국농어촌공사 웰촌 · 완주 오복마을",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://www.welchon.com/web/lay1/program/S1T23C24/travelHistory/view.do?bbs_idx=2210538",
    "original": "https://www.welchon.com/upload/namo/images/000253/20211230104343110_0EZ4FE22.jpg",
    "title": "당신이 꿈꾸던 농촌마을, 완주 오복마을 · 구룡천 징검다리",
    "src": "/assets/course-photos/c364.webp",
    "width": 1200,
    "height": 801,
    "sourceSha256": "96c37db6cf129054e8404ae801e67ac1009d876c605103f122168f30f5e4ef41",
    "assetSha256": "1c159c041a134927d7c5c8534a49f2f63dda479059968674297e5c3bf688c5a3",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003493": "경북 문경시 선유동천 나들길 1코스"
    },
    "place": "선유동천 나들길 1코스 입구 표석과 보행로",
    "date": "2026-10-09",
    "dateNote": "2026-10-09 출처 확인일 · 촬영일 미표기",
    "author": "문경시 · 경상북도 제공",
    "license": "공공누리 제3유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType3.do",
    "source": "https://www.gb.go.kr/Main/finace/page.do?mnu_uid=16163",
    "original": "https://www.gb.go.kr/Main/Images1/section/forest/status/sub02/sub01_02_04_img01.jpg",
    "title": "선유동천 나들길",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003493.jpg",
    "width": 821,
    "height": 368,
    "sourceSha256": "a378092170b2e4bf5e2499d5b38e14be8a864b7af9f574b63b37f711e0d10a51",
    "assetSha256": "a378092170b2e4bf5e2499d5b38e14be8a864b7af9f574b63b37f711e0d10a51",
    "changes": "원본 그대로 · 비율 유지",
    "checked": "2026-10-09",
    "noCrop": true
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000004458": "경기 양평군 물소리길 1코스 문화유적길"
    },
    "place": "물소리길 1코스 경유지 · 한음 이덕형 신도비",
    "date": "2021-04-28",
    "dateNote": "2021-04-28 게시일 · 촬영일 미표기",
    "author": "이난희 · 경기도블로그",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://gnews.gg.go.kr/news/news_detail.do?number=202104280925513374C094&s_code=C094",
    "original": "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/202104/20210428092551814295069.jpg",
    "title": "물소리길 1코스 경유지 · 한음 이덕형 신도비",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004458.webp",
    "width": 966,
    "height": 544,
    "sourceSha256": "51d4e3c1ccd6ae9dd29dbea7cc17fbf01421cc740a8584ba8c7ef446e095077d",
    "assetSha256": "f925c11c33d35c7326260ec266ba14c0e579d38c9a08138e69e052ce327656a8",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000004390": "경기 양평군 물소리길 3코스 강변이야기길"
    },
    "place": "물소리길 3코스 경유지 · 양평 물안개공원 인공폭포",
    "date": "2024-05-03",
    "dateNote": "2024-05-03 게시일 · 촬영일 미표기",
    "author": "이재형 · 경기도뉴스포털",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://gnews.gg.go.kr/news/news_detail.do?number=202405031418053516C094&s_code=C094",
    "original": "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/202405/20240503022452271939193.jpg",
    "title": "물소리길 3코스 경유지 · 양평 물안개공원 인공폭포",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004390.webp",
    "width": 966,
    "height": 725,
    "sourceSha256": "ba453eeca6e892463e93074f15e8345e777411a6832123201d8454511f015c0a",
    "assetSha256": "508be55e5127f47ae02dd650af5c2e2be1716ebc212c41735ebd18da40b4a99f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c403": "덕봉산 해안생태탐방로 보행로 산책 코스"
    },
    "place": "덕봉산 해안생태탐방로 전망·보행 데크",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=2720434",
    "original": "https://tong.visitkorea.or.kr/cms/resource_photo/15/3542015_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c403.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "4a2227e9c0aecaf062aee2205a2df1ab106877dce13880c812cbd45093697bf6",
    "assetSha256": "742153c4860b16c786897336602096fdeb72f964e8c6764af33a567526181683",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c405": "경천섬 보행로 산책 코스"
    },
    "place": "경천섬공원 전경 (주변 전망대에서 촬영한 참고사진)",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=2756567",
    "original": "https://tong.visitkorea.or.kr/cms/resource/33/3407833_image2_1.png",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c405.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "6d2280482a47493d42e48f3afa1edcac5cefdc6e50feb3c01232ec122670fe2b",
    "assetSha256": "d68d997e1c174d008e562dac40645202b0e8cb01a9f6c4207052d80683d397f6",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c378": "삼사해상공원 보행로 산책 코스"
    },
    "place": "삼사해상공원 경북대종 주변",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=126143",
    "original": "https://tong.visitkorea.or.kr/cms/resource/55/4076755_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c378.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "d83cda7a9d1184ffbbc6976e93019489fffd353284a7265b07b3f3cb978f8292",
    "assetSha256": "d8250f179619a25e968931c79a0a47c9c6dfe33c7cb96caddb821e9580b065fb",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c375": "정안천생태공원 보행로 산책 코스"
    },
    "place": "정안천 메타세쿼이아길 (2024년 보도자료 사진)",
    "source": "https://www.gongju.go.kr/prog/saeolNews/sub04_02_01/view.do?newsEpctNo=17623",
    "original": "https://eminwon.gongju.go.kr/emwp/jsp/ofr/FileDown.jsp",
    "author": "공주시 의당면",
    "date": "2024-05-31 게시일 · 촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c375.webp",
    "width": 720,
    "height": 960,
    "sourceSha256": "940974eba59897ddf12e307c323bc290f7deb87d6f43a3c8c4200f08a8548fae",
    "assetSha256": "586bc1441ebfa574a34e0337d5a8ee94edfcdd7c2b4bfe4ae120b353310c95ad",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c329": "서울 북악산 하늘길"
    },
    "place": "북악산 하늘길 주변 팔각정에서 바라본 전망 (2014년 참고사진)",
    "source": "https://data.si.re.kr/photo/05q01704ad4000",
    "original": "https://data.si.re.kr/sites/default/files/photos/05Q01704Ad4000.jpg",
    "author": "서울연구원",
    "date": "2014-09",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c329.webp",
    "width": 600,
    "height": 401,
    "sourceSha256": "c547341a033ee883deeb2695712e3d02bf43dd776b81393229cd5a953f4447ab",
    "assetSha256": "89a72c2f53bbef22b01ed18e623edfeabbcaa9cac8b4a1d6d34e6b3df4e9b77a",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c251": "서울 불암산 자락길"
    },
    "place": "불암산 산세 (자락길 주변 산의 2009년 겨울 참고사진)",
    "source": "https://data.si.re.kr/photo/04i01008aa4000",
    "original": "https://data.si.re.kr/sites/default/files/photos/04I01008aa4000.jpg",
    "author": "서울연구원",
    "date": "2009-12",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c251.webp",
    "width": 600,
    "height": 401,
    "sourceSha256": "a2e8264b1e6ce12652e3a1a3b7776bad769fc1685dc283c1a57779e327d20af0",
    "assetSha256": "ae043fe5fc54d0ac806657602f19c1f505f9064a993b10f5e1971b65683fc972",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c406": "완산공원 보행로 산책 코스"
    },
    "place": "완산공원 꽃동산 봄 풍경 (코스 주변 계절 참고사진)",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=126627",
    "original": "https://tong.visitkorea.or.kr/cms/resource/45/3529545_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c406.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "2d4cc53f082ed0a297c1bad5d9cd94d850429d03066d5d96a95c1e1362ac9185",
    "assetSha256": "22ddc6620702f0329e7d6fb121972b1ceb72813aa53c17afca80db9eec35daec",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c415": "동해 한섬해변 GPX 선택 구간"
    },
    "place": "한섬해변 감성바닷길 보행 데크",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=2710184",
    "original": "https://tong.visitkorea.or.kr/cms/resource/34/3353534_image2_1.jpg",
    "author": "강원관광 / 한국관광공사 제공",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c415.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "12e5410c5b171b7dd9ed4e2b5bda3d5cd735d2005abe0a5988cd68fbe6499c43",
    "assetSha256": "02a31fe26ca46810726dd6374e7e1d6796ac43e0e909452f2bd06344b349922a",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c399": "제천 비룡담 저수지 GPX 구간"
    },
    "place": "비룡담저수지 수변 데크와 마법의 성",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=3025007",
    "original": "https://tong.visitkorea.or.kr/cms/resource/84/3024984_image2_1.JPG",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c399.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "ec76d2d34e1e667fc68b4c3c45fae12e8b4a1ab2ad15d2aab023350ae9392d5e",
    "assetSha256": "8dad74e0ce7728def5276aa999f58cb6481c916cf2aabeb3ab7bb905925e669f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c417": "강릉 순포해변 GPX 선택 구간"
    },
    "place": "순포해변 해안 전경",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=2775497",
    "original": "https://tong.visitkorea.or.kr/cms/resource/02/2921902_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c417.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "d0b3514f3880448770d170f53c194fb97d86a217b86f939182e7b8aaa0556d86",
    "assetSha256": "3036db827c10e4be29b65c7fba2a6c91af1f74a50abd8fe4e43bea5fdfdbc4d7",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c412": "삼척 이사부길 GPX 선택 구간",
      "c424": "삼척시 이사부길"
    },
    "place": "삼척 이사부길 해안 보행 데크와 표지 조형물",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=2610236",
    "original": "https://tong.visitkorea.or.kr/cms/resource/07/3503607_image2_1.jpg",
    "author": "삼척시 공식 블로그 / 한국관광공사 제공",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c412.webp",
    "width": 940,
    "height": 705,
    "sourceSha256": "752cbdf0d9b6ba90fabb9caf5755e5ed7dff1be03bfb48b3f9d43d008cc14049",
    "assetSha256": "54c3f06e1e80637d05f0c281940b1a85bee964e4c8aa1cda3d195f9c1f5eb033",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c366": "대구 앞산자락길"
    },
    "place": "앞산자락길 고산골 메타세쿼이아 산책길",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=2366115",
    "original": "https://tong.visitkorea.or.kr/cms/resource/96/3519596_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c366.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "87a39e525ba06400b1b5278b14e959092e2aba4c72d11b47b119fc7cca071135",
    "assetSha256": "faaf9f73b026fd93489d4dc8bfe0c34c745417d40f72deee27cbd5d7b355f2c0",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c391": "거창 감악산 물맞이길 3코스 전망대 가는길"
    },
    "place": "거창 감악산 전망대 주변에서 바라본 산세 (전망 참고사진)",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=1576464",
    "original": "https://tong.visitkorea.or.kr/cms/resource/93/4007893_image2_1.jpg",
    "author": "다님 9기 김덕식 / 한국관광공사 제공",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c391.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "4c950f7c90ba49acac7636aee301d17c745079e8ac5388081592601258c8b638",
    "assetSha256": "a4ecd3ba8e4ff3d28635aff9031d4f3b0418fdb041e845ee24dc55d740fe695b",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "osm_1036807544": "합천군 신소양체육공원 보행로 산책 코스"
    },
    "place": "신소양체육공원 핑크뮬리 산책길 (가을 계절 참고사진)",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=2744501",
    "original": "https://tong.visitkorea.or.kr/cms/resource/73/3565873_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/osm_1036807544.webp",
    "width": 940,
    "height": 705,
    "sourceSha256": "cfc11a736ba62775e8181890d069517b1ac85274fbfcd0616879266d06ff4cb2",
    "assetSha256": "b5309089af1b855f1d627ddce5bd66a489b7fb73915458574161c0e54250b012",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=126117",
    "original": "https://tong.visitkorea.or.kr/cms/resource/16/4059616_image2_1.jpg",
    "courses": {
      "duru_T_CRS_MNG0000004913": "경남 창원시 주남저수지 탐방길  주남저수지 둘레길"
    },
    "place": "주남저수지 탐방 데크와 저수지 전경",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004913.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "7bfbe7a557333b8b659b4e499fb20790fb13fb6585c7ea68c64f017eeb6746b0",
    "assetSha256": "749caf94ffce6a0c1270f85012ae5576cb823f39a6f53413f40b1b87020a1eac",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=2750713",
    "original": "https://tong.visitkorea.or.kr/cms/resource/16/3339216_image2_1.jpg",
    "courses": {
      "duru_T_CRS_MNG0000004470": "경남 창원시 봉암수원지둘레길 순환코스"
    },
    "place": "봉암수원지 둘레길 주변 저수지 전경",
    "author": "창원시청 / 한국관광공사 제공",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004470.webp",
    "width": 940,
    "height": 457,
    "sourceSha256": "7740c50a7f1bd3901ea871f23a93f76ae54521f81f836afdf021e43c9537a556",
    "assetSha256": "8d7dac3ee4ed20b6547a49ab0edfb9861e35fdfe4e7f7b8e7cadae8d1ede273a",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "source": "https://www.nculture.org/cul/localCultureDetail.do?contentType=G&targetId=126845",
    "original": "https://tong.visitkorea.or.kr/cms/resource/89/3350089_image2_1.jpg",
    "courses": {
      "duru_T_CRS_MNG0000001092": "경기 오산시 오산 도보여행코스 독산성길"
    },
    "place": "독산성길 경유지 · 독산성 성벽과 보행 계단",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001092.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "a53e696e13055af97ccc9f0c468b9f161ae0f514dd42e499e281ba1593d67081",
    "assetSha256": "c3c17cea7e47a491dd931697d96cf47411a00f6c1048eef5a80fdac934178803",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-09"
  },
  {
    "courses": {
      "c249": "서울 생태공원 둘레길"
    },
    "place": "우면산자연생태공원 수변 산책공간",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2757831&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/96/3540696_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c249.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "ba3352a89a6fc28d28abdf31acac18c004c93ee651c49fadde8beac86ffd404e",
    "assetSha256": "cdbddbc92fdf70ae0e6cb8aef92c0421aebcc899e5959055f7be768047d9e875",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c363": "포천 청계호수 산책로"
    },
    "place": "청계호수 수면과 주변 숲 전경",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=125527&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/83/3519783_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c363.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "8b217854feae6d840dc8ab58177849251c3aec51821efce0c4ac8ae14cf1b2e4",
    "assetSha256": "953b733da7a284cc410dafdbad6af24db80bf9c32e0434f9056d6846587b9764",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c409": "중외공원 보행로 산책 코스"
    },
    "place": "중외공원 야외 공원 공간",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=126324&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/55/3514755_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c409.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "ae05a178c9fd0a0107603d991468e7c3e2a063373c859342f5dce32b14627e36",
    "assetSha256": "bd6328ab5d758fa797b51b81b93a0bbafc5cf5ba12dacb1f7c8d07a09424f4a1",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c423": "밀양시 밀양아리랑길 추화산성길"
    },
    "place": "추화산성 경유지 · 봉수대 주변",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2793017&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/03/3499803_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c423.webp",
    "width": 940,
    "height": 705,
    "sourceSha256": "e5428a0873e32df1cef212dd39bbfb9a54314471326cdd54b0fec62e00e5d5dd",
    "assetSha256": "708db875c704fb5915adf05cbb150a8b6a7e1996cb9fc8e6f36be1b28be68cf9",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c351": "포항 호미반도 해안둘레길 3코스 구룡소길"
    },
    "place": "구룡소길 경유지 · 구룡소 해안 암석",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2614482&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/77/2614477_image2_1.bmp",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c351.webp",
    "width": 700,
    "height": 394,
    "sourceSha256": "fe7449b399c85ed28d60c7f38b0650efd6bba7dd9701067ab311b9f58eac6050",
    "assetSha256": "330a808ad67023919576dcd30e9bfb0019fcb729d6ef8e73714da115ed2986a8",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c353": "포항 호미반도 해안둘레길 1코스 연오랑세오녀길"
    },
    "place": "연오랑세오녀길 경유지 · 귀비고 주변",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2633900&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/40/2638640_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c353.webp",
    "width": 700,
    "height": 467,
    "sourceSha256": "4e2f815c21f6b9960951b0aa0e18d25bd6acf0991e7be4226440d2712834199a",
    "assetSha256": "e04f282d8ab23fb8b0452e310b3c522b4fb91d84ea20691758db3620ee133729",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c355": "울산 간절곶소망길 1코스 연인의길"
    },
    "place": "연인의길 시작 구간 · 진하해수욕장",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=126096&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/33/3060633_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c355.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "c4757aa11c182d08d7576007ad296b3912d2d97c5f777aed57ef8b98481d7c1a",
    "assetSha256": "c353f81da5a45f5c71ce8349ca3712f577faa085795c5cf22eaf997e8031174f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c389": "거창 감악산 물맞이길 1코스 물 맞으러 가는 길"
    },
    "place": "감악산 정상 주변 전망 · 경유지 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=1576464&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/93/4007893_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c389.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "4c950f7c90ba49acac7636aee301d17c745079e8ac5388081592601258c8b638",
    "assetSha256": "a4ecd3ba8e4ff3d28635aff9031d4f3b0418fdb041e845ee24dc55d740fe695b",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c413": "동해 대진해변 GPX 선택 구간"
    },
    "place": "동해시 대진 해수욕장 · 해변 전경",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2774430&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/33/2774433_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c413.webp",
    "width": 699,
    "height": 466,
    "sourceSha256": "c4727aafb7baab5bada375a0171adfaf6a3f25a1e666e2e21ab2d370a155aa38",
    "assetSha256": "e9aa1872665972e81ece0bcbf3a99738397a63d4d26a3567a695245d45cbe72c",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001463": "전남 장성군 편백숲 트레킹길 4코스[임도]"
    },
    "place": "축령산 편백숲 · 주변 숲 경관 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=127394&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/47/3546847_image2_1.JPG",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001463.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "40f40fbc917921ac1ab0e60fbf48aecedbca4633d06fe79b3e903bd749b608ac",
    "assetSha256": "b882b80e114ee95b95fff43d0ae69f4f7b1fda3f9f773d4c945930b92533d502",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003721": "세종 세종특별자치시 원수산 둘레길 1코스"
    },
    "place": "원수산 둘레길 출발 구간 · 습지생태원 보행 데크",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2758472&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/49/2758449_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003721.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "86c760b80b0dc65ac024d2b1540d5e3e868ea525710a49a5fd88a15f1fdf9f70",
    "assetSha256": "07dd928646340470345517b7101f07e228f3de2ffa520d9f287f222c8cdc21d9",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003094": "강원 원주시 원주굽이길 1코스 배부른산길"
    },
    "place": "배부른산 숲속 보행 계단 · 경유지 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=3069902&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/90/3069890_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003094.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "5df59c944d393c7e691f44ce29117f72636b958499674f56f3d836e0b7009ff0",
    "assetSha256": "df978f5fb5acc3788cfeaa4ea1a89d6ea6b920eba56e34d9b17bc400e6e94fb2",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000023": "강원 평창군 happy700길 매화마을 녹색길"
    },
    "place": "매화마을 녹색길 숲길",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2702539&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/36/3410236_image2_1.JPG",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000023.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "89b412dc2522e1fc28dd7aff24dd0bdb6d8a71a6a6e77c724492eeb308a9eae8",
    "assetSha256": "42224157ee35b88e7f9d4ea6882ca6f664e38151a69bfb63129ba7d53684aef0",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003656": "경남 사천시 이순신바닷길 4코스 실안 노을길"
    },
    "place": "실안 노을길 경유지 · 실안해안도로 보행로",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2791454&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/81/3515581_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003656.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "655055f2b2ffa6a27779b7675dba94fc1f754dc71c3508f75e939ab09bb3538e",
    "assetSha256": "d444a64453d3ddf942ad4cf7529fa6787e80fe00faef2b8b6da187d05473ae48",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000663": "전남 화순군 무등산자락 무돌길 10길 수만리길"
    },
    "place": "수만리길 경유지 · 수만리들국화마을 주변",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=129368&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/56/3590556_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000663.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "edefd82f6b8e2f8a885d7a123f186edd6091819f36de7395f3ce88be0292ab2f",
    "assetSha256": "7cead6fd8b90066b83c6dd3c6daaca2eb17495a07ad7974cfcfef72e19918ebe",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000664": "전남 화순군 무등산자락 무돌길 11길 화순산림길"
    },
    "place": "화순산림길 주변 · 수만리생태숲공원 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2754463&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/31/2754531_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000664.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "613c934fcbe5874403c37a3b66e70403e31f544a3455fa19cdf2d05c881ce18b",
    "assetSha256": "c4790d0156157023a34f7e609d4a4f8cf6d918f77c0a479c7764d4e403408b34",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000665": "전남 화순군 무등산자락 무돌길 12길 만연길"
    },
    "place": "만연산 봄 풍경 · 주변 산 경관 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=128990&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/98/2604598_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000665.webp",
    "width": 700,
    "height": 467,
    "sourceSha256": "8259cb65cfb3a1f0e070129db091924c943375cd0bb19dbb34acfcf9e7f82f0a",
    "assetSha256": "bc9ff4b5faef9a620906d621f244ad30a14d5486ad7c38d7d8fb73d1aa4d9667",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c426": "여주시 여강길 7코스 부처울습지길"
    },
    "place": "부처울습지길 종착 구간 · 당남리섬 유채꽃 계절 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2743841&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/61/3540461_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c426.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "814bab30b9c0a7a6c46189240413c17d4a05854383da8f3515688fb15896fc81",
    "assetSha256": "3f5cb0caa6b5f6fec23981fd5c1998a2f9c18c0cbf9b422208e49327918a8536",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000002276": "충북 충주시 비내길 1코스"
    },
    "place": "비내길 관광공사 안내 사진 · 강변 구간 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2434847&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/50/3504950_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000002276.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "11634fef553ead50780a76792c12858103f5e3db13826a855b4a9d8b59b86492",
    "assetSha256": "61dcf980e4337bf6e429fb715031e67fcc0337605e3815218a840b49d902c644",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003667": "광주 동구 도심건강길 3코스 푸른길"
    },
    "place": "푸른길 경유지 · 푸른길분수공원",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2774008&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/09/3528409_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003667.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "4eaf3e513aadc665b34a46085e3ccfa9ce9ea8089a0d5934b259cd69fd183f6a",
    "assetSha256": "ed1fa736b291487ab464929d2f0b362e0187d8ba099da1536689763f69019692",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c293": "서울 긴고랑길"
    },
    "place": "긴고랑길에서 바라본 계곡과 동네의 저녁 풍경",
    "source": "https://commons.wikimedia.org/wiki/File:%EC%95%84%EC%B0%A8%EC%82%B0,_%EA%B8%B4%EA%B3%A0%EB%9E%91.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/69/%EC%95%84%EC%B0%A8%EC%82%B0%2C_%EA%B8%B4%EA%B3%A0%EB%9E%91.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/%EC%95%84%EC%B0%A8%EC%82%B0%2C_%EA%B8%B4%EA%B3%A0%EB%9E%91.jpg/1280px-%EC%95%84%EC%B0%A8%EC%82%B0%2C_%EA%B8%B4%EA%B3%A0%EB%9E%91.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Cho han bum",
    "date": "2017-02-27 18:03:41",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "coordinates": [
      {
        "lat": 37.562837,
        "lon": 127.096145,
        "primary": "",
        "globe": "earth"
      }
    ],
    "title": "File:아차산, 긴고랑.jpg",
    "src": "/assets/course-photos/c293.webp",
    "width": 1200,
    "height": 675,
    "sourceSha256": "f9cfbce222d3011c3f504afb2cdd15e35c2fee7df0152696e495ed41df37e87c",
    "assetSha256": "1733c7caf2db4cfb9c588a1fc8f5770e3497b3807c92b12ccfd05038ebe39d8f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c276": "서울 월드컵공원 메타세쿼이아길"
    },
    "place": "메타세쿼이아길 보행로 주변 · 야간 벤치와 나무길",
    "source": "https://commons.wikimedia.org/wiki/File:Bench_(%EB%B2%A4%EC%B9%98)_-_panoramio.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/0/07/Bench_%28%EB%B2%A4%EC%B9%98%29_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Bench_%28%EB%B2%A4%EC%B9%98%29_-_panoramio.jpg/1280px-Bench_%28%EB%B2%A4%EC%B9%98%29_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "골뱅이",
    "date": "24 October 2010 (original upload date)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "coordinates": [
      {
        "lat": 37.563042,
        "lon": 126.888046,
        "primary": "",
        "globe": "earth"
      }
    ],
    "title": "File:Bench (벤치) - panoramio.jpg",
    "src": "/assets/course-photos/c276.webp",
    "width": 1200,
    "height": 872,
    "sourceSha256": "b2af95211b57963df8f7aa609eb24041ecf1e45a3a07f2801a08a00f5fec2c87",
    "assetSha256": "69ed95eedc1a3fd14163787982339b71a64f233190c1eddc26c6d8eba29f3fa9",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c316": "서울 관악산 도란도란 걷는 길"
    },
    "place": "도란도란 걷는 길 경유지 · 관악정 주변 숲속 시내",
    "source": "https://commons.wikimedia.org/wiki/File:%EA%B4%80%EC%95%85%EC%A0%95_%EA%B3%BC%EB%85%81%EA%B3%BC_%EC%82%AC%EB%8C%80_%EC%82%AC%EC%9D%B4%EC%9D%98_%EC%8B%9C%EB%82%B4_-_panoramio.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/68/%EA%B4%80%EC%95%85%EC%A0%95_%EA%B3%BC%EB%85%81%EA%B3%BC_%EC%82%AC%EB%8C%80_%EC%82%AC%EC%9D%B4%EC%9D%98_%EC%8B%9C%EB%82%B4_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/%EA%B4%80%EC%95%85%EC%A0%95_%EA%B3%BC%EB%85%81%EA%B3%BC_%EC%82%AC%EB%8C%80_%EC%82%AC%EC%9D%B4%EC%9D%98_%EC%8B%9C%EB%82%B4_-_panoramio.jpg/1280px-%EA%B4%80%EC%95%85%EC%A0%95_%EA%B3%BC%EB%85%81%EA%B3%BC_%EC%82%AC%EB%8C%80_%EC%82%AC%EC%9D%B4%EC%9D%98_%EC%8B%9C%EB%82%B4_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "FlesYm",
    "date": "Taken on 15 August 2010",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "coordinates": [
      {
        "lat": 37.457463,
        "lon": 126.933436,
        "primary": "",
        "globe": "earth"
      }
    ],
    "title": "File:관악정 과녁과 사대 사이의 시내 - panoramio.jpg",
    "src": "/assets/course-photos/c316.webp",
    "width": 900,
    "height": 1200,
    "sourceSha256": "8168174e950a97ed5fa4b8d9e072670a424a2a01d10a1ebd7dd83f97cbbc8ef8",
    "assetSha256": "aa943e540b1b5a334e97e52a19dd2fa6e5b8fab22adb44c63b932ec29fd14daf",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005101": "부산 동래구 얼쑤옛길 2코스 동래읍성 장대길"
    },
    "place": "동래읍성 장대길 경유지 · 장영실과학동산",
    "source": "https://commons.wikimedia.org/wiki/File:Jang_Yeong-sil_Science_Garden_13-11832.JPG",
    "original": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Jang_Yeong-sil_Science_Garden_13-11832.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Jang_Yeong-sil_Science_Garden_13-11832.JPG/1280px-Jang_Yeong-sil_Science_Garden_13-11832.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Steve46814",
    "date": "2013-11-06 16:31:40",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "coordinates": [
      {
        "lat": 35.20915306,
        "lon": 129.08995,
        "primary": "",
        "globe": "earth"
      }
    ],
    "title": "File:Jang Yeong-sil Science Garden 13-11832.JPG",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005101.webp",
    "width": 1200,
    "height": 639,
    "sourceSha256": "517c6c6d9d264c18d9af00b4b09a4611c34946d797890312c2441ae0df1a822f",
    "assetSha256": "8cdb55f9de99761f9c9766d286e0454ae03eb26cb1e30daf2866a67288636e2e",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001198": "전남 장흥군 이청준 한승원 문학길 2코스 이청준 소설문학길"
    },
    "place": "이청준 소설문학길 경유지 · 회진면 해안 풍경",
    "source": "https://commons.wikimedia.org/wiki/File:Hoejin-myeon_February_27_2022.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Hoejin-myeon_February_27_2022.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Hoejin-myeon_February_27_2022.jpg/1280px-Hoejin-myeon_February_27_2022.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Harmy123",
    "date": "2022-02-27 16:42:43",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "coordinates": [
      {
        "lat": 34.46825,
        "lon": 126.94068889,
        "primary": "",
        "globe": "earth"
      }
    ],
    "title": "File:Hoejin-myeon February 27 2022.jpg",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001198.webp",
    "width": 1200,
    "height": 1179,
    "sourceSha256": "6a2cfa969af5052fa80e5ba0f767e3d2b45a3a8facac57bf48f09f37c464a9ff",
    "assetSha256": "7a0661797275966486b6b4c947e79c9acc55f743a98907359f8f9011f018502e",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005441": "경기 성남시 성남누비길 6구간 청계산길"
    },
    "place": "성남누비길 청계산 구간 · 전망 보행 공간",
    "source": "https://commons.wikimedia.org/wiki/File:View_from_Cheonggyesan_in_2026.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/f/f0/View_from_Cheonggyesan_in_2026.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/View_from_Cheonggyesan_in_2026.jpg/1280px-View_from_Cheonggyesan_in_2026.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Sadopaul",
    "date": "2026-09-05 12:10:54",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "coordinates": [
      {
        "lat": 37.421236,
        "lon": 127.044133,
        "primary": "",
        "globe": "earth"
      }
    ],
    "title": "File:View from Cheonggyesan in 2026.jpg",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005441.webp",
    "width": 1200,
    "height": 370,
    "sourceSha256": "c2f50ac9a6c2891fcb1c2832fd56aabaee2a021b1cf47871ed29432c5a85251b",
    "assetSha256": "2750173b0b486451886b66d21940e6563478c882285d891c500ff80404cf82b0",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001099": "광주 북구 오월인권길 횃불코스"
    },
    "place": "오월인권길 경유지 · 옛 전남도청 외관",
    "source": "https://commons.wikimedia.org/wiki/File:Former_Provincial_government_main_building_of_Jeollanam-do_20190521_083242.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Former_Provincial_government_main_building_of_Jeollanam-do_20190521_083242.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Former_Provincial_government_main_building_of_Jeollanam-do_20190521_083242.jpg/1280px-Former_Provincial_government_main_building_of_Jeollanam-do_20190521_083242.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "LERK",
    "date": "Taken on 21 May 2019 08:32:42 KST (UTC+9)",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "coordinates": [
      {
        "lat": 35.14727778,
        "lon": 126.91986111,
        "primary": "",
        "globe": "earth"
      }
    ],
    "title": "File:Former Provincial government main building of Jeollanam-do 20190521 083242.jpg",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001099.webp",
    "width": 1200,
    "height": 675,
    "sourceSha256": "f8d7e6bde805965bb6087173a5cef40537b5baa497c88b1a43cbd3c0787bb202",
    "assetSha256": "7fa59fa07fc0423248440d024d0f47feab947d51a160d96c81cef31ac657d353",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005390": "강원 원주시 원주굽이길 원4코스 명봉산진달래길"
    },
    "place": "명봉산진달래길 출발 구간 · 동화마을수목원 방문자센터",
    "source": "https://commons.wikimedia.org/wiki/File:20250412_%EC%9B%90%EC%A3%BC_%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EC%9B%A8%EC%A0%9C_11.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/d/dd/20250412_%EC%9B%90%EC%A3%BC_%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EC%9B%A8%EC%A0%9C_11.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/20250412_%EC%9B%90%EC%A3%BC_%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EC%9B%A8%EC%A0%9C_11.jpg/1280px-20250412_%EC%9B%90%EC%A3%BC_%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EC%9B%A8%EC%A0%9C_11.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "웨제",
    "date": "2025-04-12 16:22:14",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "coordinates": [
      {
        "lat": 37.314342,
        "lon": 127.855767,
        "primary": "",
        "globe": "earth"
      }
    ],
    "title": "File:20250412 원주 포토워크 웨제 11.jpg",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005390.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "f8f8cbc7f144bfa9b2d8edd64da3011b686bd82d9c243d7f763320a9710e691a",
    "assetSha256": "8a3256a445fd4dc01f6381cca27f4f244818056f75debab129ddbec65d354dd9",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005505": "대구 중구 경제신화 도보길"
    },
    "place": "경제신화 도보길 경유지 · 대구은행파크 외관",
    "source": "https://commons.wikimedia.org/wiki/File:Daegu_Bank_Park_with_mascots.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/64/Daegu_Bank_Park_with_mascots.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Daegu_Bank_Park_with_mascots.jpg/1280px-Daegu_Bank_Park_with_mascots.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Haena96",
    "date": "2024-07-27 17:26:11",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "coordinates": [
      {
        "lat": 35.880178,
        "lon": 128.588836,
        "primary": "",
        "globe": "earth"
      }
    ],
    "title": "File:Daegu Bank Park with mascots.jpg",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005505.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "866d5f9387ef80fbde65c38544c8ff95fc3518712ba308861cb49d062b51849b",
    "assetSha256": "9912bc17d6af724af4cd301a1c58d4a79c20c49662d8523271e66e04d861015f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005547": "경기 가평군 경기 둘레길 가평 23코스"
    },
    "place": "경기 둘레길 가평 23코스 · 신청평대교 주변 도로 · 2015년 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:ROK_National_Route_37_-_Sincheongpyeong_Bridge_Gyeongchunro_Direction(2015_Summer_Evening).jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/8/80/ROK_National_Route_37_-_Sincheongpyeong_Bridge_Gyeongchunro_Direction%282015_Summer_Evening%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/ROK_National_Route_37_-_Sincheongpyeong_Bridge_Gyeongchunro_Direction%282015_Summer_Evening%29.jpg/1280px-ROK_National_Route_37_-_Sincheongpyeong_Bridge_Gyeongchunro_Direction%282015_Summer_Evening%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Jhcbs1019\n\n This photo was taken with Samsung WB350F",
    "date": "Taken on 7 July 2015, 19:49:46",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "coordinates": [
      {
        "lat": 37.71840552,
        "lon": 127.41070206,
        "primary": "",
        "globe": "earth"
      }
    ],
    "title": "File:ROK National Route 37 - Sincheongpyeong Bridge Gyeongchunro Direction(2015 Summer Evening).jpg",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005547.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "33362842708b6afafc3c1d9c3013cf021953651a7c3654509b80a9e01b29f7b2",
    "assetSha256": "48263733e4672412cbbacf4ee8e06b33e0125f9fcf281cc7fb7f26cdc7a6ba67",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001076": "전북 순창군 예향천리 마실길 순창 3코스"
    },
    "place": "순창 마실길 3코스 경유지 · 장군목 인증센터",
    "source": "https://commons.wikimedia.org/wiki/File:Janggunmok_Certification_Center.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/4/43/Janggunmok_Certification_Center.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Janggunmok_Certification_Center.jpg/1280px-Janggunmok_Certification_Center.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Kstevens97",
    "date": "2026-04-19 16:05:26",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "coordinates": [
      {
        "lat": 35.460517,
        "lon": 127.201398,
        "primary": "",
        "globe": "earth"
      }
    ],
    "title": "File:Janggunmok Certification Center.jpg",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001076.webp",
    "width": 900,
    "height": 1200,
    "sourceSha256": "e7d533779f85cf8b7bccfee567cf65842fd16a607435749e0886b8c065dc2c46",
    "assetSha256": "94b4943c69503534415916df03958ac326fe29bb1f49459bb6b3e4e21d7e1e70",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "osm_665502044": "동구 대구 불로동 고분군 보행로 산책 코스"
    },
    "src": "/assets/course-photos/osm_665502044.webp",
    "place": "불로동 고분군 산책길",
    "date": "2018-01-27",
    "author": "샬럿 Han",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EB%8C%80%EA%B5%AC_%EB%B6%88%EB%A1%9C%EB%8F%99_%EA%B3%A0%EB%B6%84%EA%B5%B0_%EC%96%B8%EB%8D%95_%EB%82%98%EB%AC%B4.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/1/1d/%EB%8C%80%EA%B5%AC_%EB%B6%88%EB%A1%9C%EB%8F%99_%EA%B3%A0%EB%B6%84%EA%B5%B0_%EC%96%B8%EB%8D%95_%EB%82%98%EB%AC%B4.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "대구 불로동 고분군 언덕 나무.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900,
    "sourceSha256": "6870022a21644065f6b5ae3de80eaf6580d30ce39c892b081b02cb3ed96ec87f",
    "assetSha256": "8073a7b95f98a86d1c548a4967b67e1be7606afefb031bde1ed435d97a7232db"
  },
  {
    "courses": {
      "osm_832185825": "양평군 양평 두물머리 보행로 산책 코스"
    },
    "src": "/assets/course-photos/osm_832185825.webp",
    "place": "양평 두물머리 강변",
    "date": "2014",
    "author": "Rhie Cudanin",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Eerie_Dumulmeori_(76234361).jpeg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/c/c4/Eerie_Dumulmeori_%2876234361%29.jpeg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Eerie Dumulmeori (76234361).jpeg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 761,
    "dateNote": "촬영일 미상 · 2014년 이전 공개",
    "sourceSha256": "718d90493702d01baf5e274911e4cab0ff585ccd830a286e6b2f3733ecdae4cf",
    "assetSha256": "d39449e5f19017fdb9d0145f8799e693992998b251522001d16c3c1a35a8d781"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000475": "대구 중구 대구 중구 골목투어 2코스 근대문화골목"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000475.webp",
    "place": "근대문화골목 · 계산성당 외관",
    "date": "2013-05-25",
    "author": "Himuka tachibana",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kyesan_Cathedral_Front.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Kyesan_Cathedral_Front.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Kyesan Cathedral Front.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 900,
    "height": 1200,
    "sourceSha256": "f8918bf5060136fe92dd72ff5107c94ed020531fb334917e9dd1178b043b4cf0",
    "assetSha256": "24be3e8639b97c922f2651362380a96b53cf212d182ca7f0baf3f7aafd1c5520"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003696": "대전 중구 역사문화길 뿌리공원 둘레길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003696.webp",
    "place": "뿌리공원 야외 정자",
    "date": "2016-03-26",
    "author": "Sarang",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Template:PD-self",
    "source": "https://commons.wikimedia.org/wiki/File:Gazebo_in_Ppuri_Park.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/1/19/Gazebo_in_Ppuri_Park.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Gazebo in Ppuri Park.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 836,
    "sourceSha256": "404d2da5281ea708824207fbee05f52e6fa6b25f066343d5f3d74ffea2035064",
    "assetSha256": "097ee32b78e0834ffb48ed218fb5b8b604e86f33365ecae7ac000c8591682038"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003273": "부산 동래구 얼쑤옛길 1코스 동래읍성 뿌리길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003273.webp",
    "place": "동래읍성 뿌리길 · 동래읍성 북문",
    "date": "2009-06-06",
    "author": "Oh Dong-geon",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:North_Gate_of_the_Dongnae_eupseong_site.JPG",
    "original": "https://upload.wikimedia.org/wikipedia/commons/3/38/North_Gate_of_the_Dongnae_eupseong_site.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "North Gate of the Dongnae eupseong site.JPG",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900,
    "sourceSha256": "a1d092ea1ef1fd9d971074c5ba67a5a5872afda72ba2540e8eb1a69021ca8bc7",
    "assetSha256": "b4f9a18d768c5f72ccd60fcbe5ab9b1ef1fd1d925f6951563108a268528d28f8"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001262": "제주 서귀포시 제주올레길 10-1코스(가파도 올레)"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001262.webp",
    "place": "가파도 올레 주변 경관",
    "date": "2012-04-14",
    "author": "Naturehead",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Gapado_scenery.JPG",
    "original": "https://upload.wikimedia.org/wikipedia/commons/4/49/Gapado_scenery.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Gapado scenery.JPG",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 803,
    "sourceSha256": "bd928d42c7362d39169ebab96a65864ed38923d33350f558863c36eae0f256cb",
    "assetSha256": "8ddf464f88f3a0b8971c63c75d200040b195fcc54debb2933f5634f8f35d7ddf"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001026": "경북 경주시 양동마을 녹색길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001026.webp",
    "place": "양동마을 전통가옥과 마을길",
    "date": "2011-07-17",
    "author": "Schölla Schwarz",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Yang_Dong_Farm_Houses_in_the_Sun_-_panoramio.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/2/22/Yang_Dong_Farm_Houses_in_the_Sun_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Yang Dong Farm Houses in the Sun - panoramio.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 603,
    "sourceSha256": "9bacbe10f17090f716cdc4c47e4abaa5ff786d91dd12166687ed40b40b10301c",
    "assetSha256": "3a635096f26ad0b2108b4cf601c430e8fbf960dd4b160f6ed2d0a3268a11e797"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005449": "서울 종로구 골목길탐방코스 김마리아길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005449.webp",
    "place": "김마리아길 출발부 · 연동교회 외관",
    "date": "2022-10-24",
    "author": "칼빈500",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EC%97%B0%EB%8F%99%EA%B5%90%ED%9A%8C(AMJ).jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/7/78/%EC%97%B0%EB%8F%99%EA%B5%90%ED%9A%8C%28AMJ%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "연동교회(AMJ).jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 675,
    "sourceSha256": "a391039d963ea9c1559699fb97acce55d81b0fbfa0433afb7b7d8d301980b8d0",
    "assetSha256": "b580638b7f567e6db0a62dc49269eab3608e3b8983eebd879b1ea9913aed9f77"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003809": "제주 제주시 제주 지질트레일 김녕코스"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003809.webp",
    "place": "김녕 지질트레일 · 김녕성세기해변",
    "date": "2015-08-25",
    "author": "Bohyunlee",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EA%B9%80%EB%85%95%EC%84%B1%EC%84%B8%EA%B8%B0%ED%95%B4%EB%B3%80.JPG",
    "original": "https://upload.wikimedia.org/wikipedia/commons/a/a6/%EA%B9%80%EB%85%95%EC%84%B1%EC%84%B8%EA%B8%B0%ED%95%B4%EB%B3%80.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "김녕성세기해변.JPG",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900,
    "sourceSha256": "e21482837ad2dc90bd303b2e897ce530e9c43ad9f57af2643d04d980cd768794",
    "assetSha256": "a29d60f0a0d76c62ec3dfb9da9573ec02407e77cdd1446288723f50503b8ff4f"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000243": "강원 강릉시 관동팔경 녹색경관길 안목 남항진 해변길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000243.webp",
    "place": "안목 남항진 해변길 · 안목해변",
    "date": "2022-04-30",
    "author": "Mobius6",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Anmok_Beach_20220430_001.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/7/71/Anmok_Beach_20220430_001.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Anmok Beach 20220430 001.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 750,
    "sourceSha256": "d969cb443ac4fb29a10478f105db924a32db554b80fb07e938ecee7c55895a2e",
    "assetSha256": "e225401ffc57184e9c87b91ddcaa07317b010570351c7c9f06b8f1176c489711"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000004911": "경기 화성시 화성실크로드 2-1코스 제비꼬리길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004911.webp",
    "place": "제비꼬리길 · 제부해변",
    "date": "2022-07-01",
    "author": "Moonhayun",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:The_Jebu_Beach.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/d/d0/The_Jebu_Beach.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "The Jebu Beach.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900,
    "sourceSha256": "0feef05fa3ab852ea5877b8330835bb0fb188fbca925699bfe5c37cad0922ad7",
    "assetSha256": "6c6cb29d71fe7fd3127e3d69fc8dc3f65b47816475c199a215778e2a7474bc6c"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005104": "경북 성주군 성주 별고을길 2코스"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005104.webp",
    "place": "별고을길 출발부 · 성밖숲",
    "date": "2017-05-22",
    "author": "최옥석",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EC%84%B1%EC%A3%BC_%EA%B2%BD%EC%82%B0%EB%A6%AC_%EC%84%B1%EB%B0%96%EC%88%B2.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/f/f5/%EC%84%B1%EC%A3%BC_%EA%B2%BD%EC%82%B0%EB%A6%AC_%EC%84%B1%EB%B0%96%EC%88%B2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "성주 경산리 성밖숲.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 800,
    "sourceSha256": "019968264f9eae666bb983ef019915a803f9624e4d3aeff1997a1516745ac810",
    "assetSha256": "5ae6a2411931d81aeaa05b0dc835088a929d986ea0dadadf7807ab36dcba6b4d"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001097": "광주 서구 오월인권길 열정코스"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001097.webp",
    "place": "5·18기념공원",
    "date": "2020-02-01",
    "author": "기여자",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:518%EA%B8%B0%EB%85%90%EA%B3%B5%EC%9B%90.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/7/7e/518%EA%B8%B0%EB%85%90%EA%B3%B5%EC%9B%90.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "518기념공원.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900,
    "sourceSha256": "507d15b044806275f2416f8b45ef63de64882eb9a604b36ddb47ae4e2f2a9f0c",
    "assetSha256": "a0022f35fb09ac6b7d6b1d5ee7985dd73734490d51958e760c9e4faa88b4607d"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005452": "서울 종로구 골목길탐방코스 익선동 A코스"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005452.webp",
    "place": "익선동 A코스 · 한옥 골목",
    "date": "2020-10-01",
    "author": "S h y numis",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Ikseon-dong_%EC%9D%B5%EC%84%A0%EB%8F%99_October_1_2020_1.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/c/c6/Ikseon-dong_%EC%9D%B5%EC%84%A0%EB%8F%99_October_1_2020_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Ikseon-dong 익선동 October 1 2020 1.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 800,
    "sourceSha256": "a44f3f9a51c8bab8df51ae5b163895342f2fe1159b919080a17b4899730f9702",
    "assetSha256": "7835d8835296ed5ef2077a84b4a95b280181d1cdbb1a44c194cf34b3bea4cbf7"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003523": "울산 동구 해안누리길 대왕암길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003523.webp",
    "place": "울산 대왕암공원",
    "date": "2018-08-17",
    "author": "Choi2451",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Daewangam_Park_on_August_17th,_2018.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/66/Daewangam_Park_on_August_17th%2C_2018.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Daewangam Park on August 17th, 2018.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900,
    "sourceSha256": "603226b5bdef9ead9a3113a4e868cf42475e3f58f26cdaea4873b01a983b1bf2",
    "assetSha256": "849071cf178ff88716cb461a061f84f2482be6c5ffcc66c7ded1a890f687e45b"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001641": "경남 합천군 황강마실길 1코스 황강마실길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001641.webp",
    "place": "황강마실길 · 함벽루",
    "date": "2023-03-12",
    "author": "Dittwjfsdgkvkdjg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:%ED%95%A8%EB%B2%BD%EB%A3%A81.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/d/d2/%ED%95%A8%EB%B2%BD%EB%A3%A81.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "함벽루1.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 675,
    "sourceSha256": "d9df02452bedbd7a35a8e16a3dc12590450627efbd6fbf693cdaeaba96d23ad2",
    "assetSha256": "d41937bd17281a6b168fb9512e5bbec883e54abc72a9858b4c4a338d30e13adc"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003710": "부산 영도구 부산원도심 스토리투어 영도다리길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003710.webp",
    "place": "영도다리길 · 영도대교",
    "date": "2020-05-23",
    "author": "Mobius6",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Yeongdo_Bridge_20200523_005.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/67/Yeongdo_Bridge_20200523_005.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Yeongdo Bridge 20200523 005.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 800,
    "sourceSha256": "0dc747ec384cac4f7d5d78bfac8238690deca0f5f641178eecac1a1b6d7bd879",
    "assetSha256": "d321a645d46f9cbc45769e84e24a6afeeb822fb5848fe94be193d1c0c31a0b7e"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005453": "서울 종로구 골목길탐방코스 익선동 B코스"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005453.webp",
    "place": "익선동 B코스 · 탑골공원 입구",
    "date": "2018-10-18",
    "author": "GtDX8NNO3Efn2oF6q0s3",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Entrance_to_Tapgol_Park.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Entrance_to_Tapgol_Park.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Entrance to Tapgol Park.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 675,
    "sourceSha256": "f11890647204eb4bf28006b79456a604d124f106142c62a87f8bd236972968da",
    "assetSha256": "68c92e83c1b088c4cec9863eaef49c7dedca79e7dabd237c1909e62670647d5d"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001380": "충남 서천군 철새나그네길 2코스 해지게길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001380.webp",
    "place": "해지게길 출발부 · 마량리 동백나무숲",
    "date": "2017-01-03",
    "author": "Mailzzang+aus",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Maryang_Camellia_Forest_in_Winter.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/4/40/Maryang_Camellia_Forest_in_Winter.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Maryang Camellia Forest in Winter.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 675,
    "sourceSha256": "d9b2d854eca83f3b59156f55593e62d95218b009a6c45b0c62e66d5c7a839f18",
    "assetSha256": "2c3b8b65b71c03d8bdcc7afa0e074015479495edca69fce4ce6b6b8ace20126b"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003446": "강원 강릉시 관동팔경 녹색경관길 정동진 해안산악길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003446.webp",
    "place": "정동진 해안산악길 출발부 · 정동진 해변",
    "date": "2008-03-22",
    "author": "Loewelad",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Jeongdongjin_Beach.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Jeongdongjin_Beach.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Jeongdongjin Beach.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 340,
    "sourceSha256": "797ff38c30c7dbd8d102fd3fd5caf6a30d215a300c03a6759b6b2f1fc7bc8c23",
    "assetSha256": "8a6a1fe39f1a34f0a4fc2dbb0b20e5d1331453539de00da2b26f0da2e6b8ec65"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005448": "서울 종로구 골목길탐방코스 창신동 B코스(봉제마을)"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005448.webp",
    "place": "창신동 봉제마을 · 이음피음 봉제역사관 외관",
    "date": "2020-08-11",
    "author": "오모군",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Entrance_to_Sewing_Street_Museum_of_Changsin-dong.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/d/db/Entrance_to_Sewing_Street_Museum_of_Changsin-dong.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Entrance to Sewing Street Museum of Changsin-dong.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900,
    "sourceSha256": "b73e2756581918c7d034ba6a3436baf5ff786c2418b30e4dc6af7cee2d360ade",
    "assetSha256": "beb80864ebf41af666890a6ad10d201a0f414072704c1ab8f63384c4487136ba"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003653": "경남 창녕군 송현이길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003653.webp",
    "place": "송현이길 · 창녕 교동·송현동 고분군",
    "date": "2007-01-27",
    "author": "Visviva",
    "license": "Public domain",
    "licenseUrl": "https://commons.wikimedia.org/wiki/Template:PD-self",
    "source": "https://commons.wikimedia.org/wiki/File:Changnyeong_upper_tombs_wide.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Changnyeong_upper_tombs_wide.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "Changnyeong upper tombs wide.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 900,
    "sourceSha256": "c32499e26a88615f1cf0b0074009f27d858f3993f50659136f0ca00bab6b6fb3",
    "assetSha256": "03639d1a23c143d7d1aabaabb63776d342aaf295b08cac73ac004cd13604e261"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003713": "부산 사하구 해안누리길 몰운대길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003713.webp",
    "place": "몰운대 해안 풍경",
    "date": "1972-06-26",
    "author": "Korea Heritage Service",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EB%AA%B0%EC%9A%B4%EB%8C%80.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/c/cd/%EB%AA%B0%EC%9A%B4%EB%8C%80.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "몰운대.jpg",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-04",
    "width": 750,
    "height": 517,
    "sourceSha256": "9ff4e703133b29c56af4cd199cb4aa5215c563d6a42336c18b80f0dfcea51cee",
    "assetSha256": "f344485db5874252999b4e2b94c6da4bc582c95fcb9677e8359d80083c7ca45d"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000478": "대구 중구 대구 중구 골목투어 5코스 남산 100년 향수길"
    },
    "place": "남산 향수길 · 성모당 외관",
    "date": "2016-09-14",
    "author": "최옥석",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EC%84%B1%EB%AA%A8%EB%8B%B9.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/4/4e/%EC%84%B1%EB%AA%A8%EB%8B%B9.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "성모당.jpg",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 800,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000478.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "bcd7e8f3814e918799faff152781f035ec445876f95d8701e973f2d28ea6ea80",
    "assetSha256": "c6a9a1647f21a34a41aefd4d98a79eea451daeefa0ebe1d9b066d0abf9df2a11"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000002859": "광주 남구 양림동 둘레길"
    },
    "place": "양림동 둘레길 · 이장우 가옥 정원",
    "date": "2025-06-28",
    "author": "NZ 토끼들",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%EC%9D%B4%EC%9E%A5%EC%9A%B0_%EA%B0%80%EC%98%A52_-_%EC%A0%95%EC%9B%90.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/4/4b/%EC%9D%B4%EC%9E%A5%EC%9A%B0_%EA%B0%80%EC%98%A52_-_%EC%A0%95%EC%9B%90.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "이장우 가옥2 - 정원.jpg",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 560,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000002859.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "d0a8e6c5fd808a985e962be9375015a4a0ddc361ccfa4ce40a5d02db805c623f",
    "assetSha256": "ba894a4cc10fd3db6167adeb7a9b2c0debdf9509e1eb1521e7d86b334e59b41d"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000960": "강원 인제군 소양강둘레길 2코스 내린길"
    },
    "place": "소양강둘레길 강변 경관",
    "date": "2020",
    "dateNote": "2020년 촬영",
    "author": "한국관광공사",
    "license": "공공누리 제3유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=58767",
    "original": "https://www.kogl.or.kr/upload_recommend/2023New/%EA%B3%B5%EA%B3%B5%EB%88%84%EB%A6%AC/thumnail/%EA%B3%B5%EA%B3%B5%EB%88%84%EB%A6%AC%20%EC%8D%B8%EB%84%A4%EC%9D%BC%20%EB%B3%80%ED%99%98/15.%20%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC/02.%20%EC%BD%98%ED%85%90%EC%B8%A0/%EA%B1%B7%EA%B8%B0%EC%97%AC%ED%96%89%EA%B8%B8_0997_2020_%EA%B0%95%EC%9B%90_%EC%9D%B8%EC%A0%9C_%EC%86%8C%EC%96%91%EA%B0%95%EB%91%98%EB%A0%88%EA%B8%B8_076_detail_thumnail.jpg",
    "title": "소양강둘레길 강변 경관",
    "checked": "2026-10-04",
    "noCrop": true,
    "evidence": {
      "collection": "58767",
      "photoIndex": 75,
      "sourceInstitution": "한국관광공사",
      "licenseType": "3"
    },
    "width": 700,
    "height": 1049,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000960.jpg",
    "changes": "제공 이미지 그대로 표시 · 비율 유지",
    "sourceSha256": "955946671bb63adf947f5477197407502345aba3ddd3ebc116aca6e24e607a14",
    "assetSha256": "955946671bb63adf947f5477197407502345aba3ddd3ebc116aca6e24e607a14"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001310": "충북 증평군 증평둘레길 삼기저수지 등잔길"
    },
    "place": "삼기저수지와 등잔길 일대",
    "date": "",
    "dateNote": "촬영 시기 미상",
    "author": "충청북도 증평군",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=84029",
    "original": "https://www.kogl.or.kr/upload_recommend/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%EC%B6%A9%EC%B2%AD%EB%B6%81%EB%8F%84%20%EC%A6%9D%ED%8F%89%EA%B5%B0/%EC%9D%B4%EB%AF%B8%EC%A7%80/%EC%82%BC%EA%B8%B0%EC%A0%80%EC%88%98%EC%A7%801_thumnailList_1579.jpg",
    "title": "삼기저수지와 등잔길 일대",
    "checked": "2026-10-04",
    "noCrop": false,
    "evidence": {
      "collection": "84029",
      "photoIndex": 0,
      "sourceInstitution": "충청북도 증평군",
      "licenseType": "1"
    },
    "width": 640,
    "height": 425,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001310.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "0b6c30c6180af6117f54f5ef7a69f1307471633f5a608e203842c3bbd66136a5",
    "assetSha256": "3757b52f0017208a9396e5da99f63afa88fd32398aa7202d2573d3ef777e482d"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001464": "경기 평택시 평택호관광지 수변테크 사색의길"
    },
    "place": "평택호 관광지 수변 풍경",
    "date": "2000",
    "dateNote": "2000년 촬영",
    "author": "경기도",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=37210",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91/%ED%8F%AC%ED%86%A0%EA%B0%A4%EB%9F%AC%EB%A6%AC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91%ED%8F%AC%ED%84%B8_3598_%5B%ED%8F%89%ED%83%9D%5D%20%ED%8F%89%ED%83%9D%ED%98%B8%EA%B4%80%EA%B4%91%EB%8B%A8%EC%A7%80.jpg",
    "title": "평택호 관광지 수변 풍경",
    "checked": "2026-10-04",
    "noCrop": false,
    "evidence": {
      "collection": "37210",
      "photoIndex": 0,
      "sourceInstitution": "경기도",
      "licenseType": "1"
    },
    "width": 427,
    "height": 640,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001464.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "67f83cdc46077d8283db99ca20b22dd4a430cd4f3b637e907523c720cb889c3b",
    "assetSha256": "3d1cbfd9cd66ab815559d56e17a7826e9e23dfd46335593493794d7b5cb24a97"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001383": "충남 서천군 철새나그네길 5코스 해찬솔길"
    },
    "place": "해찬솔길 · 송림 산림욕장",
    "date": "2024",
    "dateNote": "2024년 촬영",
    "author": "충남문화관광재단",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=86502",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%EC%9D%B4%EB%AF%B8%EC%A7%80/%ED%92%8D%EA%B2%BD/%ED%92%8D%EA%B2%BD/%EC%86%A1%EB%A6%BC%EA%B0%AF%EB%B2%8C1.jpg",
    "title": "해찬솔길 · 송림 산림욕장",
    "checked": "2026-10-04",
    "noCrop": false,
    "evidence": {
      "collection": "86502",
      "photoIndex": 0,
      "sourceInstitution": "충남문화관광재단",
      "licenseType": "1"
    },
    "width": 600,
    "height": 338,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001383.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "bcf355481e9b70609f73327cf8f6d1d2a52a20ef1a3b52afcd76847948df6326",
    "assetSha256": "c1eadbf7f6212bb30bfe0caaefd395325c0702fb2b678c260e9415fe8609bce8"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000479": "대구 동구 대구올레(팔공산올레길) 1코스 북지장사 가는길"
    },
    "place": "북지장사 가는길 · 북지장사 야외",
    "date": "2019",
    "dateNote": "2019년 촬영",
    "author": "대구광역시",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=63493",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/20240610/02.%20%EB%8C%80%EA%B5%AC%EA%B4%91%EC%97%AD%EC%8B%9C%EC%B2%AD/01.%20DAEGU%20VIEW/0097_%EA%B3%A0%ED%99%94%EC%A7%88%EB%8C%80%EA%B5%AC_%EB%8F%99%EA%B5%AC%2C%20%EB%B6%81%EC%A7%80%EC%9E%A5%EC%82%AC.jpg",
    "title": "북지장사 가는길 · 북지장사 야외",
    "checked": "2026-10-04",
    "noCrop": false,
    "evidence": {
      "collection": "63493",
      "photoIndex": 0,
      "sourceInstitution": "대구광역시",
      "licenseType": "1"
    },
    "width": 760,
    "height": 507,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000479.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "6c317ac6e64409c1b960908a729540e5b26d76bd6ab1446b16385c0dcf3a435d",
    "assetSha256": "84d89ef8610ca5408f477f92024f7871c86cd922ba1421c565faf84480f3eb95"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003437": "경기 안양시 경기옛길 삼남길 2코스 인덕원길"
    },
    "place": "인덕원길 경유지 · 백운호수 수변길",
    "date": "2018",
    "dateNote": "2018년 촬영",
    "author": "경기도",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=37160",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91/%ED%8F%AC%ED%86%A0%EA%B0%A4%EB%9F%AC%EB%A6%AC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91%ED%8F%AC%ED%84%B8_2842_%5B%EC%9D%98%EC%99%95%5D%20%EB%B0%B1%EC%9A%B4%ED%98%B8%EC%88%98.jpg",
    "title": "인덕원길 경유지 · 백운호수 수변길",
    "checked": "2026-10-04",
    "noCrop": false,
    "evidence": {
      "collection": "37160",
      "photoIndex": 0,
      "sourceInstitution": "경기도",
      "licenseType": "1"
    },
    "width": 760,
    "height": 507,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003437.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "6c0797353d2d3f0ed1a5b8ec8fc0de7d153fb9ce06850ada819d034cf10742f4",
    "assetSha256": "ae0bfe5b948d4f5f51b03401ec958aae6fba147c2065fed16a87041477a5debb"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001457": "대구 동구 팔공산 왕건길 6코스 호연지기길"
    },
    "place": "왕건길 6코스 경유지 · 첨백당",
    "date": "2015",
    "dateNote": "2015년 촬영",
    "author": "국가유산청",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=1423",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%EC%A7%80%EC%97%AD%EB%B3%84%EB%AC%B8%ED%99%94%EC%9E%AC/%EB%8C%80%EA%B5%AC%EA%B4%91%EC%97%AD%EC%8B%9C/%EB%8F%99%EA%B5%AC/thumb_%EB%AC%B8%ED%99%94%EC%9E%AC%EC%9E%90%EB%A3%8C%EC%A0%9C13%ED%98%B8_%EC%B2%A8%EB%B0%B1%EB%8B%B9_%EB%8C%80%EB%AC%B8.jpg",
    "title": "왕건길 6코스 경유지 · 첨백당",
    "checked": "2026-10-04",
    "noCrop": false,
    "evidence": {
      "collection": "1423",
      "photoIndex": 1,
      "sourceInstitution": "국가유산청",
      "licenseType": "1"
    },
    "width": 760,
    "height": 507,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001457.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "b3269b19705dc091b8c83fd770f929f7d793e60cd37203bb1f4cf4911fdd6ef3",
    "assetSha256": "282aba7b488ab3dceefa90d869bafc9234c5c01937dcc71cccbdf928831bbffa"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005077": "대구 동구 안심창조밸리 천천둘레길"
    },
    "place": "천천둘레길 · 안심습지",
    "date": "2019",
    "dateNote": "2019년 촬영",
    "author": "대구광역시",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=63497",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/20240610/02.%20%EB%8C%80%EA%B5%AC%EA%B4%91%EC%97%AD%EC%8B%9C%EC%B2%AD/01.%20DAEGU%20VIEW/0086_%EA%B3%A0%ED%99%94%EC%A7%88%EB%8C%80%EA%B5%AC_%EB%8F%99%EA%B5%AC%2C%20%EC%95%88%EC%8B%AC%EC%8A%B5%EC%A7%80.jpg",
    "title": "천천둘레길 · 안심습지",
    "checked": "2026-10-04",
    "noCrop": false,
    "evidence": {
      "collection": "63497",
      "photoIndex": 0,
      "sourceInstitution": "대구광역시",
      "licenseType": "1"
    },
    "width": 760,
    "height": 543,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005077.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "56f5726fdfb33f00ef155bf7cab50a52babe8f11528fc1486c655b2cbc10aa54",
    "assetSha256": "7a213ece8ec97742a8fdeba35945bcd8c4168343a2c7576723373cc8bed91d47"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003772": "전북 부안군 변산마실길 2코스 노루목 상사화길"
    },
    "place": "변산마실길 2코스 · 고사포해수욕장",
    "date": "2023",
    "dateNote": "2023년 촬영",
    "author": "전북특별자치도 부안군",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=177583",
    "original": "https://www.kogl.or.kr/upload_recommend/%EC%9D%B4%EB%AF%B8%EC%A7%80/%EA%B4%80%EA%B4%91%2C%EC%B6%95%EC%A0%9C/%EA%B4%80%EA%B4%91%2C%EC%B6%95%EC%A0%9C/%EA%B3%A0%EC%82%AC%ED%8F%AC%ED%95%B4%EC%88%98%EC%9A%95%EC%9E%A5_thumnailList_10916.jpg",
    "title": "변산마실길 2코스 · 고사포해수욕장",
    "checked": "2026-10-04",
    "noCrop": false,
    "evidence": {
      "collection": "177583",
      "photoIndex": 0,
      "sourceInstitution": "전북특별자치도 부안군",
      "licenseType": "1"
    },
    "width": 640,
    "height": 427,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003772.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "0a76d2af3ce165fb87a7e6dea3eda26a8f506700bc51eb5407675b8a63a67fbc",
    "assetSha256": "54d5e735b5023fca4d4dffb271ee670ba3f9d27349de988edbe89d7103b950c9"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005450": "서울 종로구 골목길탐방코스 3.1운동길 A코스"
    },
    "place": "3·1운동길 · 중앙고등학교 동관",
    "date": "2015",
    "dateNote": "2015년 촬영",
    "author": "국가유산청",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=1555",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%EC%A7%80%EC%97%AD%EB%B3%84%EB%AC%B8%ED%99%94%EC%9E%AC/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C/%EC%A2%85%EB%A1%9C/thumb_%EC%82%AC%EC%A0%81%EC%A0%9C283%ED%98%B8_%EC%84%9C%EC%9A%B8%EC%A4%91%EC%95%99%EA%B3%A0%EB%93%B1%ED%95%99%EA%B5%90%EB%8F%99%EA%B4%80_%EB%8F%99%EA%B4%80.jpg",
    "title": "3·1운동길 · 중앙고등학교 동관",
    "checked": "2026-10-04",
    "noCrop": false,
    "evidence": {
      "collection": "1555",
      "photoIndex": 0,
      "sourceInstitution": "국가유산청",
      "licenseType": "1"
    },
    "width": 757,
    "height": 600,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005450.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "602b945307b323f2108f337840d2a59b57ce7d9cc5d4a8689c7e0f93bf94ebff",
    "assetSha256": "de4b5e8d9c20454200e29b8bf6b69ed8f0f80e4dceb6de4d03edb25e61d9bc28"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000002684": "부산 동구 초량 이바구길"
    },
    "place": "초량 이바구길 · 168계단",
    "date": "2020",
    "dateNote": "2020년 촬영",
    "author": "한국관광공사",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=38058",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%ED%95%9C%EA%B5%AD%EA%B4%80%EA%B4%91%EA%B3%B5%EC%82%AC/%EC%82%AC%EC%A7%84%EC%A0%84%EB%AC%B8%EA%B0%80/%EC%82%AC%EC%A7%84%EA%B0%A4%EB%9F%AC%EB%A6%AC_2643_168%EA%B3%84%EB%8B%A8%20%EB%AA%A8%EB%85%B8%EB%A0%88%EC%9D%BC.jpg",
    "title": "초량 이바구길 · 168계단",
    "checked": "2026-10-04",
    "noCrop": false,
    "evidence": {
      "collection": "38058",
      "photoIndex": 0,
      "sourceInstitution": "한국관광공사",
      "licenseType": "1"
    },
    "width": 760,
    "height": 507,
    "src": "/assets/course-photos/duru_T_CRS_MNG0000002684.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "07bc74a84017d6f01acd35b022d3fbde90af1c9dff9f32597871cd95a32042e9",
    "assetSha256": "ebd160139c5ef86a9355bcf76acbcab60bad975c4ff47c710edaf541bc0026eb"
  },
  {
    "courses": {
      "osm_1196816794": "경주시 빛누리정원 보행로 산책 코스"
    },
    "place": "경주 빛누리정원 야간 전경",
    "date": "2020",
    "dateNote": "2020-12-22 공개 · 촬영일 미상",
    "author": "경주시청",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/license.do",
    "source": "https://www.gyeongju.go.kr/news/page.do?mnu_uid=1342&parm_bod_uid=203373&step=258",
    "original": "https://www.gyeongju.go.kr/upload//board/board_1342/bod_203373//683D8742E8944A899B70B66C0049B7EA.jpg",
    "title": "전국 최대 LED 테마꽃정원, 경주 빛누리정원 개장",
    "checked": "2026-10-04",
    "width": 1200,
    "height": 675,
    "src": "/assets/course-photos/osm_1196816794.webp",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "sourceSha256": "2fd00663a12170ac71e34d261293769458b2ba4008d33148a337e0d888124e2b",
    "assetSha256": "fab7508b7075fdaddbf2a474e0b23da91f44f95c49b7a4350cddb4fe35a4b394"
  },
  {
    "courses": {
      "osm_1217000590": "산청군 산청 동의보감촌 보행로 산책 코스"
    },
    "src": "/assets/course-photos/osm_1217000590.webp",
    "place": "동의보감촌 야외 산책 공간",
    "date": "2013-09-27",
    "dateNote": "2013-09-27 촬영 · 엑스포 당시 모습",
    "author": "Korea.net·해외문화홍보원·전한",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "https://commons.wikimedia.org/wiki/File:KOCIS_Korea_Sancheong_Traditional_Medicine_EXPO_12_(9993929455).jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/6d/KOCIS_Korea_Sancheong_Traditional_Medicine_EXPO_12_%289993929455%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "KOCIS Korea Sancheong Traditional Medicine EXPO 12 (9993929455)",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-05",
    "width": 1200,
    "height": 694,
    "sourceSha256": "6a4a349c6217d23d56b537211bab818e000712202f8abb283440748d02d58952",
    "assetSha256": "def2877b1c7ac5ee36b9300b756569fef3a3ec497bac5ca30d8af5eee0ed8d6e"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003643": "경남 산청군 동의보감 허준순례길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003643.webp",
    "place": "동의보감촌 야외 산책 공간",
    "date": "2013-09-27",
    "dateNote": "2013-09-27 촬영 · 엑스포 당시 모습",
    "author": "Korea.net·해외문화홍보원·전한",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "source": "https://commons.wikimedia.org/wiki/File:KOCIS_Korea_Sancheong_Traditional_Medicine_EXPO_12_(9993929455).jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/6d/KOCIS_Korea_Sancheong_Traditional_Medicine_EXPO_12_%289993929455%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "title": "KOCIS Korea Sancheong Traditional Medicine EXPO 12 (9993929455)",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-05",
    "width": 1200,
    "height": 694,
    "sourceSha256": "6a4a349c6217d23d56b537211bab818e000712202f8abb283440748d02d58952",
    "assetSha256": "def2877b1c7ac5ee36b9300b756569fef3a3ec497bac5ca30d8af5eee0ed8d6e"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005254": "전북 고창군 운곡습지생태길 1코스"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005254.webp",
    "place": "운곡습지 생태길 · 오베이골 산책로",
    "date": "2014-10-07",
    "dateNote": "2014-10-07 창작일 표기",
    "author": "박정병·한국저작권위원회",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "source": "https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?menuNo=200018&wrtSn=11051620",
    "original": "https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=11051620&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM2L2RpZ2lfMTEwNTE2MjBfMDEyMDE0MTEwNzA2&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006",
    "title": "운곡습지 _00002",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-05",
    "width": 1110,
    "height": 740,
    "sourceSha256": "f4874238bcb9bb8749b1feafc34dec4674c658770419427091ebd27083b7fd43",
    "assetSha256": "835a34bf655408a56345120eddedfb95f36ca633f40bd215b2601dc04b26f85c"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000002714": "충북 영동군 양산팔경 금강둘레길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000002714.webp",
    "place": "충북 영동 송호 국민관광지005",
    "date": "2016-11-09",
    "dateNote": "2016-11-09 창작일 표기",
    "author": "박동식·한국저작권위원회",
    "license": "기증저작물 자유이용",
    "licenseUrl": "https://gongu.copyright.or.kr/gongu/main/contents.do?menuNo=200092",
    "source": "https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13272501&menuNo=200018",
    "original": "https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13272501&filePath=L2Rpc2sxL25ld2RhdGEvMjAyMC85OC9DTFMxMDAwNi8xMzI3MjUwMV9XUlRfOThfQ0xTMTAwMDZfMjAyMDEyMThfMQ==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006",
    "title": "충북 영동 송호 국민관광지005",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-05",
    "width": 1110,
    "height": 740,
    "sourceSha256": "6bc888943063f65c1c5d213118a6da414f92f7aef70613c7d8c780e2ce817c66",
    "assetSha256": "575979c7bb93fd665cf3d35b946e8ba8da0adb42ae5dfed6eab6462efe245265"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000433": "충남 당진시 바다사랑길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000433.webp",
    "place": "하늘에서 내려본 당진 삽교호 방조제_1",
    "date": "2020-09-21",
    "dateNote": "2020-09-21 창작일 표기",
    "author": "이정운·채재혁·이원호·한국저작권위원회",
    "license": "기증저작물 자유이용",
    "licenseUrl": "https://gongu.copyright.or.kr/gongu/main/contents.do?menuNo=200092",
    "source": "https://gongu.copyright.or.kr/gongu/wrt/wrt/view.do?wrtSn=13274926&menuNo=200018",
    "original": "https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=13274926&filePath=L2Rpc2sxL25ld2RhdGEvMjAyMC85OC9DTFMxMDAwNi8xMzI3NDkyNl9XUlRfOThfQ0xTMTAwMDZfMjAyMDEyMThfMQ==&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10006",
    "title": "하늘에서 내려본 당진 삽교호 방조제_1",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-05",
    "width": 987,
    "height": 740,
    "sourceSha256": "a0d6a4e3200b8c340bf3c24107f5b7066c032e3e3bbb36086b2f79c631ded99e",
    "assetSha256": "69ebc1c8a632971d242b22a7281bae175487f76e9a89dcc5b21309d43f840b25"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000250": "강원 강릉시 관동팔경 녹색경관길 헌화로"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000250.webp",
    "place": "헌화로 해안 경관",
    "date": "2023",
    "dateNote": "2023-09-18 공개 · 촬영일 미상",
    "author": "한국농어촌공사·웰촌",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://www.welchon.com/web/lay1/program/S1T23C24/travelHistory/view.do?bbs_idx=2212067",
    "original": "https://www.welchon.com/upload/editor/images/000045/20230918140338569_00SQB2FO.jpg",
    "title": "백두대간의 품에 안긴 채 휴식을, 강릉 왕산한옥마을",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-05",
    "width": 720,
    "height": 480,
    "sourceSha256": "6984684f61d6c7a7a631e2d51bff995c0fb9218286f39e1cee0c10a30657193c",
    "assetSha256": "d5cfd9fb3d77fe970959073ad20877e66bccdd3a4cc5d6529c675dbe9d4ee8ed"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003887": "충북 괴산군 산막이옛길"
    },
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003887.webp",
    "place": "산막이옛길 진입로",
    "date": "2019",
    "dateNote": "2019-07-26 공개 · 촬영일 미상",
    "author": "한국농어촌공사·웰촌",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "source": "https://www.welchon.com/web/lay1/program/S1T23C24/travelHistory/view.do?bbs_idx=2207704",
    "original": "https://www.welchon.com/upload/namo/images/000167/20190726110344699_KCRCDI7B.jpg",
    "title": "청정 자연에서 옥수수 따고, 올갱이 잡고 충북 괴산 둔율올갱이마을",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-05",
    "width": 940,
    "height": 627,
    "sourceSha256": "abb0e2af4d9bdedff5229bf0efce7ce3f28f343c7fa5d7df6d15a860fe9a4de5",
    "assetSha256": "a58fcb474b10210d5aa04220fe77469ecf5c424b0e6658c09132f69bf3816c1d"
  },
  {
    "courses": {
      "c281": "서울 산사길"
    },
    "place": "산사길 경유지 · 북한산 숲 체험장 보행길",
    "source": "https://commons.wikimedia.org/wiki/File:Bukhansan_Forest_Education_Park_(%EB%B6%81%ED%95%9C%EC%82%B0_%EC%88%B2_%EC%B2%B4%ED%97%98%EC%9E%A5)_-_panoramio_-_%EA%B3%A8%EB%B1%85%EC%9D%B4.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/9/95/Bukhansan_Forest_Education_Park_%28%EB%B6%81%ED%95%9C%EC%82%B0_%EC%88%B2_%EC%B2%B4%ED%97%98%EC%9E%A5%29_-_panoramio_-_%EA%B3%A8%EB%B1%85%EC%9D%B4.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "골뱅이",
    "date": "2010년 공개 · 촬영일 미표기",
    "dateNote": "25 September 2010 (original upload date)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "title": "File:Bukhansan Forest Education Park (북한산 숲 체험장) - panoramio - 골뱅이.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Bukhansan_Forest_Education_Park_%28%EB%B6%81%ED%95%9C%EC%82%B0_%EC%88%B2_%EC%B2%B4%ED%97%98%EC%9E%A5%29_-_panoramio_-_%EA%B3%A8%EB%B1%85%EC%9D%B4.jpg/1280px-Bukhansan_Forest_Education_Park_%28%EB%B6%81%ED%95%9C%EC%82%B0_%EC%88%B2_%EC%B2%B4%ED%97%98%EC%9E%A5%29_-_panoramio_-_%EA%B3%A8%EB%B1%85%EC%9D%B4.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/c281.webp",
    "width": 1200,
    "height": 799,
    "sourceSha256": "82292705016b360869f00a4a90fc7a803dabc3770b7a36876b6a921b047f2e59",
    "assetSha256": "8cf7204009fc6f12955cccdaf8f5bacbb6f2fd068ab073e87dca4a0fd7b4660f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c303": "서울 용마산 자락길"
    },
    "place": "용마산 자락길 주변 · 시루봉보루에서 바라본 경관 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:Gyomun-dong_and_Sutaek-dong_from_Sirubong_boru.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/1/14/Gyomun-dong_and_Sutaek-dong_from_Sirubong_boru.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "Sadopaul",
    "date": "2026-05-24",
    "dateNote": "2026-05-24 15:36:05",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "title": "File:Gyomun-dong and Sutaek-dong from Sirubong boru.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Gyomun-dong_and_Sutaek-dong_from_Sirubong_boru.jpg/1280px-Gyomun-dong_and_Sutaek-dong_from_Sirubong_boru.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/c303.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "be8d460b5ef098f01d4c2822d4421f8e76f36a18de2a50125d65926628d37621",
    "assetSha256": "6b3f07833ee14fecd754b5a4f0e83f782d129aeb1562f1bdcf62ff910e33cbec",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005473": "충북 단양군 느림보강물길 4코스 상상의거리"
    },
    "place": "상상의거리 주변 · 단양읍 남한강 경관 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:HanR-Dan1.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/b/b7/HanR-Dan1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "Dittwjfsdgkvkdjg",
    "date": "2024-05-08",
    "dateNote": "2024-05-08 09:07:28",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "title": "File:HanR-Dan1.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/HanR-Dan1.jpg/1280px-HanR-Dan1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005473.webp",
    "width": 1200,
    "height": 675,
    "sourceSha256": "cad1c761afb676a8c6fa54ee5b8c52ba882fba09914694e668d5679d2fb54d13",
    "assetSha256": "b36b2fa44adcc9e7f08188c50ff452db3bf4013325166378b5f876629329fb22",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005474": "충북 단양군 느림보강물길 5코스 수양개역사문화길"
    },
    "place": "수양개역사문화길 주변 · 남한강과 흥월리층 경관 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:DHan-Oh.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/8/87/DHan-Oh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "Dittwjfsdgkvkdjg",
    "date": "2024-05-08",
    "dateNote": "2024-05-08 08:48:20",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "title": "File:DHan-Oh.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/DHan-Oh.jpg/1280px-DHan-Oh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005474.webp",
    "width": 1200,
    "height": 675,
    "sourceSha256": "f2aa392e9f7e447e76216d5f1d6624aef8202ac0c5dad931475a3e9b0c3516b1",
    "assetSha256": "ef88bb2bbf185c2f7c3c0c061f699460cb666ab9904c80520e3e074083d31fa3",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000004910": "경기 양평군 물소리길 6코스 용문산 은행나무길"
    },
    "place": "물소리길 6코스 경유지 · 김병호 고가 주변",
    "source": "https://commons.wikimedia.org/wiki/File:Kim_Byeongho%27s_House_002.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Kim_Byeongho%27s_House_002.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "Jjw",
    "date": "2021-06-27",
    "dateNote": "2021-06-27 12:27:47",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "title": "File:Kim Byeongho's House 002.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Kim_Byeongho%27s_House_002.jpg/1280px-Kim_Byeongho%27s_House_002.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004910.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "3574cdd45f89b54dba169aa6d2d8ef5c530878123b1de65eeaac14e57481deac",
    "assetSha256": "d070354294b91d3990adf651b7d404f67746f9e808d223dca791e5de12f67a97",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005521": "강원 원주시 치악산둘레길 11코스 한가터길"
    },
    "place": "한가터길 종점 주변 · 치악산국립공원 입구 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:20250412_%EC%9B%90%EC%A3%BC_%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EC%9B%A8%EC%A0%9C_4.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/c/cc/20250412_%EC%9B%90%EC%A3%BC_%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EC%9B%A8%EC%A0%9C_4.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "웨제",
    "date": "2025-04-12",
    "dateNote": "2025-04-12 13:33:56",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "title": "File:20250412 원주 포토워크 웨제 4.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/20250412_%EC%9B%90%EC%A3%BC_%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EC%9B%A8%EC%A0%9C_4.jpg/1280px-20250412_%EC%9B%90%EC%A3%BC_%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EC%9B%A8%EC%A0%9C_4.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005521.webp",
    "width": 900,
    "height": 1200,
    "sourceSha256": "470df73661efab839ee92a4e8f47bfff521b3927b4beae12a0ac090c7cc56537",
    "assetSha256": "a165dea478bc352f461b80b58d0756e8732b8b38440d9709dcbe0c6db654b1be",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005544": "경기 가평군 경기 둘레길 가평 20코스"
    },
    "place": "가평 20코스 주변 · 경강교 보행로 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:Gyeonggang_Bridge.JPG",
    "original": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Gyeonggang_Bridge.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "hyolee2",
    "date": "2015-04-05",
    "dateNote": "Taken on 5 April 2015, 09:13 (according to Exif data)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "title": "File:Gyeonggang Bridge.JPG",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Gyeonggang_Bridge.JPG/1280px-Gyeonggang_Bridge.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005544.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "f8fe85b7670614f1130ead8679db8850ea256b87157087e442905276b2cf7207",
    "assetSha256": "7a09703a9865be2802361e3426b64e992d2419983f6eec855365ed9ebf5547ff",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005545": "경기 가평군 경기 둘레길 가평 21코스"
    },
    "place": "가평 21코스 주변 · 문화로 가로수길 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:Munhwa-ro,_Gapyeong-eup,_Gapyeong-gun,_Gyeonggi-do,_South_Korea_-_panoramio.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/3/37/Munhwa-ro%2C_Gapyeong-eup%2C_Gapyeong-gun%2C_Gyeonggi-do%2C_South_Korea_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "Phong Phat G",
    "date": "2015년 공개 · 촬영일 미표기",
    "dateNote": "24 February 2015 (original upload date)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "title": "File:Munhwa-ro, Gapyeong-eup, Gapyeong-gun, Gyeonggi-do, South Korea - panoramio.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Munhwa-ro%2C_Gapyeong-eup%2C_Gapyeong-gun%2C_Gyeonggi-do%2C_South_Korea_-_panoramio.jpg/1280px-Munhwa-ro%2C_Gapyeong-eup%2C_Gapyeong-gun%2C_Gyeonggi-do%2C_South_Korea_-_panoramio.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005545.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "a5957f90c5643765c77a46e70ee80de2dc33febc8edc9361b809d8aaa94fb1ff",
    "assetSha256": "604c04a1e30e61890e8d8c082470ba8253e39f49da32dcb3a16718d7a6af3e6f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005593": "경기 김포시 경기 둘레길 김포 58코스"
    },
    "place": "김포 58코스 출발점 주변 · 김포 장릉 숲 경관 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:JangNeung_in_Gimpo_City.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/9/9b/JangNeung_in_Gimpo_City.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "kykoh",
    "date": "2011-06-06",
    "dateNote": "2011-06-06 12:03",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "title": "File:JangNeung in Gimpo City.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9b/JangNeung_in_Gimpo_City.jpg/1280px-JangNeung_in_Gimpo_City.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005593.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "6cc8b18f6d3f38b0dadd87aecd27335da088cf8fe4e02b9cdeabef5a69906091",
    "assetSha256": "d668cdf0a0e6dbc1f95dad6faa8fca8da476a68da892913cc2cd07720a7e7e52",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005595": "경기 김포시 경기 둘레길 김포 60코스 "
    },
    "place": "김포 60코스 종점 구간 · 김포함상공원 주변",
    "source": "https://commons.wikimedia.org/wiki/File:20250927_%EC%95%A0%EA%B8%B0%EB%B4%89%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EA%B9%80%ED%8F%AC%ED%95%A8%EC%83%81%EA%B3%B5%EC%9B%90_%EC%B9%B4%EB%8B%89_03.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/8/8f/20250927_%EC%95%A0%EA%B8%B0%EB%B4%89%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EA%B9%80%ED%8F%AC%ED%95%A8%EC%83%81%EA%B3%B5%EC%9B%90_%EC%B9%B4%EB%8B%89_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "카닉",
    "date": "2025-09-27",
    "dateNote": "2025-09-27 13:26:38",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "title": "File:20250927 애기봉포토워크 김포함상공원 카닉 03.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/20250927_%EC%95%A0%EA%B8%B0%EB%B4%89%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EA%B9%80%ED%8F%AC%ED%95%A8%EC%83%81%EA%B3%B5%EC%9B%90_%EC%B9%B4%EB%8B%89_03.jpg/1280px-20250927_%EC%95%A0%EA%B8%B0%EB%B4%89%ED%8F%AC%ED%86%A0%EC%9B%8C%ED%81%AC_%EA%B9%80%ED%8F%AC%ED%95%A8%EC%83%81%EA%B3%B5%EC%9B%90_%EC%B9%B4%EB%8B%89_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005595.webp",
    "width": 900,
    "height": 1200,
    "sourceSha256": "6c35d624f34fbc195a27b898630914716afedf681314d0abe92b5887f2a53dce",
    "assetSha256": "8431dc5e9ca854b4c5a17a837e5a3d206b154964dc39b0a4d0528d0d01b5464f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000004480": "경기 성남시 성남누비길 2구간 검단산길"
    },
    "place": "검단산길 출발 구간 · 남한산성 남문",
    "source": "https://commons.wikimedia.org/wiki/File:%EB%82%A8%ED%95%9C%EC%82%B0%EC%84%B1_%EB%82%A8%EB%AC%B8.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/9/99/%EB%82%A8%ED%95%9C%EC%82%B0%EC%84%B1_%EB%82%A8%EB%AC%B8.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "Jocelyndurrey",
    "date": "2015-05-17",
    "dateNote": "Taken on 17 May 2015, 15:26:54",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "title": "File:남한산성 남문.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/%EB%82%A8%ED%95%9C%EC%82%B0%EC%84%B1_%EB%82%A8%EB%AC%B8.jpg/1280px-%EB%82%A8%ED%95%9C%EC%82%B0%EC%84%B1_%EB%82%A8%EB%AC%B8.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004480.webp",
    "width": 1200,
    "height": 675,
    "sourceSha256": "9d064b819cf86305b8e450ef1c2bab8956709601f9076b51764cf6345c09de6a",
    "assetSha256": "2cfc8276f65763fd6225c132b3ad894d498c2c364acdff7a86f5df350a8c78e3",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000004479": "경기 성남시 성남누비길 4구간 불곡산길"
    },
    "place": "불곡산길 종점 주변 · 동막천 산책로",
    "source": "https://commons.wikimedia.org/wiki/File:%EB%8F%99%EB%A7%89%EC%B2%9C_%EC%82%B0%EC%B1%85%EA%B8%B8.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/f/fc/%EB%8F%99%EB%A7%89%EC%B2%9C_%EC%82%B0%EC%B1%85%EA%B8%B8.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "Bykim2012",
    "date": "2026-06-28",
    "dateNote": "2026-06-28 18:41:01",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "title": "File:동막천 산책길.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/%EB%8F%99%EB%A7%89%EC%B2%9C_%EC%82%B0%EC%B1%85%EA%B8%B8.jpg/1280px-%EB%8F%99%EB%A7%89%EC%B2%9C_%EC%82%B0%EC%B1%85%EA%B8%B8.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004479.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "c7ac27b55aa8656332dc0b8bdb323743353fab8141c54be7d39f40dc008d102f",
    "assetSha256": "762d73306385948ffe4f3fcd672daaa9dbdf33fa99ac34bf92f03fb65366770f",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001087": "강원 삼척시 오랍드리 산소길 1코스 봉수대길"
    },
    "place": "봉수대길 주변 · 삼척 봄 경관 · 2009년 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:Korea-Samcheok-Rural_scenery_in_spring-01.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Korea-Samcheok-Rural_scenery_in_spring-01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "pcamp",
    "date": "2009-03-14",
    "dateNote": "2009-03-14 11:52",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "title": "File:Korea-Samcheok-Rural scenery in spring-01.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Korea-Samcheok-Rural_scenery_in_spring-01.jpg/1280px-Korea-Samcheok-Rural_scenery_in_spring-01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001087.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "e7ff55c6ffc99af26b6ca19810454adc481004cfa3557a47610146db4a3d6ea9",
    "assetSha256": "20072ce3c0afa20089d785de94e3c63465c25743f00430a434e20350188acecf",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000004393": "경기 양평군 물소리길 2코스 터널이 있는 기찻길"
    },
    "place": "물소리길 2코스 출발점 · 신원역 외부 · 2012년 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:K131_Sinwon_01.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/2/21/K131_Sinwon_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "분당선M",
    "date": "2012-06-24",
    "dateNote": "2012-06-24",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "title": "File:K131 Sinwon 01.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/K131_Sinwon_01.jpg/1280px-K131_Sinwon_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004393.webp",
    "width": 1200,
    "height": 675,
    "sourceSha256": "d2ade146afaa2555736097a2d0dc87974afda42a7b5eb082275b16c5a091608c",
    "assetSha256": "22f7b3c5b0bd571d42a0d20f955f3abb9ed4dd213cae0988142c3f869b02b44c",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005698": "경기 양평군 물소리길 8코스"
    },
    "place": "물소리길 8코스 출발점 · 일신역 외부 · 2013년 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:Ilsin_station_20131123_080713.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Ilsin_station_20131123_080713.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "안우석",
    "date": "2013-11-23",
    "dateNote": "2013-11-23 08:07:13",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "title": "File:Ilsin station 20131123 080713.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Ilsin_station_20131123_080713.jpg/1280px-Ilsin_station_20131123_080713.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005698.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "026f7ece788eabe85d8bc51d745fe40f081e6503f6a8cd6d9d2d6160a70ea567",
    "assetSha256": "11e11a375b107405b3a98092fb4c21c5127f8b526109104117f2196463645b12",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005697": "경기 양평군 물소리길 7코스"
    },
    "place": "물소리길 7코스 종점 주변 · 지평리전투기념관 외부 참고사진",
    "source": "https://commons.wikimedia.org/wiki/File:Jipyeongri_Battle_Memorial_002.jpg",
    "original": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Jipyeongri_Battle_Memorial_002.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original",
    "author": "Jjw",
    "date": "2021-06-27",
    "dateNote": "2021-06-27 11:29:17",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "title": "File:Jipyeongri Battle Memorial 002.jpg",
    "download": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Jipyeongri_Battle_Memorial_002.jpg/1280px-Jipyeongri_Battle_Memorial_002.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005697.webp",
    "width": 1200,
    "height": 900,
    "sourceSha256": "d24926ea15f686ba588b074ebe30b353fa93d8e7fb7c15d4911d37002c7e15c7",
    "assetSha256": "38b99d76be4f997eb91cbcac3ac8401a0883ee89d2e96b7eba61c8f88d3598e6",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c336": "서울 지양산 둘레길"
    },
    "place": "지양산 숲 쉼터 · 가을 경관 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2612198&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/28/3539028_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c336.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "e1e8aedd5b732a68c21410d279e863979d0b703793a6a70a6ea96606a06691cf",
    "assetSha256": "39d3c879b25413f5ae11b3ce939a6366b3e54005c4b909cc5330821d5d49936c",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c310": "서울 수락산 동막골길"
    },
    "place": "동막골길 경유지 · 수암사 주변 숲과 쉼터",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=761264&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/10/739110_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c310.webp",
    "width": 699,
    "height": 466,
    "sourceSha256": "2be4475be2f5578db9379285ecab57eb1018d158fbe20d58fe394244ae18aca7",
    "assetSha256": "84252ddd0e9e061264f7933ec4d58ed8424259129b69be36a88b815ec7bbed2a",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001323": "경남 하동군 지리산둘레길 13스(하동읍-서당)"
    },
    "place": "지리산둘레길 하동읍-서당 구간 숲길",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2787291&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/02/4092602_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001323.webp",
    "width": 940,
    "height": 705,
    "sourceSha256": "cea28e0f4dfe7c6d21abc599ef349efdeed762058946eed49f8f72ea9ab2c1fb",
    "assetSha256": "58e048322554603b4986f079dfa50b54d52a9d13a919b2930be9de310e740f13",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000376": "전남 구례군 남도이순신길 백의종군로 02코스 서시천 꽃길따라 뚝방 마실길"
    },
    "place": "서시천 꽃길 경유지 · 서시천체육공원 보행로",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=3006025&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/42/3529942_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000376.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "dfeb856eb53dd5e821bcfca3cc0179f3a382a9ac643156fe9e1509923e3f3141",
    "assetSha256": "7be2a5ed973daad0f9b9cadfc3a62f8e23f6542ceae1c37bfe31b31226aed237",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000000377": "전남 구례군 남도이순신길 백의종군로 03코스 섬진강 벚꽃길"
    },
    "place": "섬진강 벚꽃길 · 구례 강변 벚꽃 계절 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=2648994&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/89/4064089_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000000377.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "418b4cab00a9f2484e156f38d462fbc99c1da008cfccae742e772c78c3649578",
    "assetSha256": "7fd8a8642f59c426abd0b0f17685660078a35851c692848a75956ccd60455012",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005234": "인천 옹진군 인천둘레길 16코스 장봉도"
    },
    "place": "장봉도 16코스 주변 · 한들해수욕장 해변 경관 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=129251&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/69/4062069_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005234.webp",
    "width": 940,
    "height": 627,
    "sourceSha256": "0eddcf9ee62b3b8ec9b8d95ba4c5847f115c644cd7eae3e3e834fef3eeef18ce",
    "assetSha256": "bdccd5b0e6ddb0bd46ade242d9d32b72bcf7290240a2fdb626d0baaf27be3c94",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c390": "거창 감악산 물맞이길 2코스 고행의 둘레길"
    },
    "place": "거창 감악산 전망 · 물맞이길 주변 산 경관 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=1576464&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/90/4007890_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c390.webp",
    "width": 940,
    "height": 705,
    "sourceSha256": "cc1a361be6bb2ae2cb38c595397a0dedc1d38517cf9db46e01958054773c917d",
    "assetSha256": "bc42375f58dd7063bc20ebb4f69f775da39da3c3f974563c1e9e4faa009d8c16",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000004384": "광주 북구 무등산자락 무돌길 3길 덕령숲길"
    },
    "place": "덕령숲길 종점 주변 · 충장사 보행로 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=126383&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/83/3516483_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004384.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "22b420885ad2fe5c7beb5e5d378dba47f4c487ed8f33eacce5c19664b7de7b98",
    "assetSha256": "7c4e41a3984112c94f2b2a0e6920277a9d6ba957a3278a7e5d6aec267b339e7a",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003400": "광주 북구 무등산자락 무돌길 4길 원효계곡길"
    },
    "place": "원효계곡길 출발점 주변 · 충장사 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=126383&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/85/3516485_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003400.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "ef2c62da6283aced34f0a90da34902df0e38ef772ba0067f88c9f8c0687844ee",
    "assetSha256": "5978ac9f9180a9b6f117764b60272b0fc63f11630505fcc36881980e9384e150",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000001643": "경남 합천군 황강마실길 3코스 생태하천길"
    },
    "place": "황강마실길 3구간 · 핫들생태공원 작약꽃 계절 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=3015558&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource_photo/44/3514244_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000001643.webp",
    "width": 940,
    "height": 705,
    "sourceSha256": "76c9c3ce53ae839992f0440cd3ad6670678a1a5cf03dade82c44f0d9e13c9b65",
    "assetSha256": "0b2f14ff503132ea2f5fa90687609f2d79db574cd293a2210d42a64e22923ee4",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c224": "대모산 숲이 좋은 길"
    },
    "place": "대모산 숲속야생화원 · 주변 숲길 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=3076460&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/11/3524511_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c224.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "707132ea9d52b10528e3f43be48d5cac5af15602f6853b32873aab167698c7b1",
    "assetSha256": "ec8ee5d7006a1c6b2b561345df721b5a1bf98f53abb4d3c1d04c24ab8e0b24e0",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000005577": "경기 안성시 경기 둘레길 안성 42코스"
    },
    "place": "안성 42코스 주변 · 미리내성지 녹지 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=127556&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/73/3558773_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000005577.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "8cc5ad7d310f7c7debed8a05262f4831fda832414ba3c8c353f4f59be7418d0b",
    "assetSha256": "8902c46aa6e8313acbbdff2f7aaf9f0471313b9b4e3a294dbf3f76eddf4fdb70",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000003439": "경기 연천군 차탄천 에움길"
    },
    "place": "차탄천 에움길 · 차탄천 주상절리와 강변 경관",
    "source": "https://www.yeoncheon.go.kr/archive/record/detail/460.do",
    "original": "https://www.yeoncheon.go.kr/archive/archive/attach/00000/460/thumbnail/2000_20220311125027414.jpg",
    "author": "연천군",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000003439.webp",
    "width": 1024,
    "height": 685,
    "sourceSha256": "98836ae77973a6d554c01a2b1b3c945ac61df251b6c2b088b93e7b498e4f3aa9",
    "assetSha256": "6122f3c415e114d502131ca92445537b42c1a5f08c5f742915443db9217df0dc",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c392": "거창 감악산 물맞이길 4코스 심신도량 하는 길"
    },
    "place": "심신도량 하는 길 출발 구간 · 거창 연수사",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=337502&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/02/3588902_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c392.webp",
    "width": 940,
    "height": 619,
    "sourceSha256": "cd30f1b634784fe10e818b3e001d845fac1e30f16684349a4b1aa63ad1073a0e",
    "assetSha256": "6ed621604d47f6ce7000506337d2147f4d58dc72d43b963949f60a8dabd12f25",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "duru_T_CRS_MNG0000004252": "울산 북구 강동사랑길 7-A코스"
    },
    "place": "강동사랑길 7-A코스 주변 · 어물동 마애여래좌상 참고사진",
    "source": "https://www.nculture.org/cul/localCultureDetail.do?targetId=128187&contentType=G",
    "original": "https://tong.visitkorea.or.kr/cms/resource/92/3522992_image2_1.jpg",
    "author": "한국관광공사",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/duru_T_CRS_MNG0000004252.webp",
    "width": 940,
    "height": 626,
    "sourceSha256": "927f80b8ac834e1e2e4d75cb88d474df1477782f3ab11db258ebc1fd964a52a5",
    "assetSha256": "f4d284f189380e02a223de1569cd543a08071607e76f5a4d1f4bbc5ff6de1fa8",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  },
  {
    "courses": {
      "c344": "여주 여강길 6코스 왕터쌀길"
    },
    "place": "왕터쌀길 출발점 주변 · 여주 세종대왕릉 숲길 참고사진",
    "source": "https://www.kogl.or.kr/recommend/recommendDivView.do?division=img&recommendIdx=37112",
    "original": "https://www.kogl.or.kr/upload_recommend/thumb_V/%ED%82%A4%EC%9B%8C%EB%93%9C%20%EC%A0%80%EC%9E%91%EB%AC%BC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91/%ED%8F%AC%ED%86%A0%EA%B0%A4%EB%9F%AC%EB%A6%AC/%EA%B2%BD%EA%B8%B0%EA%B4%80%EA%B4%91%ED%8F%AC%ED%84%B8_2270_%5B%EC%97%AC%EC%A3%BC%5D%20%EC%84%B8%EC%A2%85%EB%8C%80%EC%99%95%EB%A6%89.JPG",
    "author": "경기도·경기관광포털",
    "date": "촬영일 미표기",
    "license": "공공누리 제1유형",
    "licenseUrl": "https://www.kogl.or.kr/info/licenseType1.do",
    "src": "/assets/course-photos/c344.webp",
    "width": 760,
    "height": 507,
    "sourceSha256": "f4a9dc878d49e262d62f21d717ab5b33e2ca7439d4c72cd5e7f154fa78e9f17a",
    "assetSha256": "a56474a2dcb19170ccc47be23eaa02876490add2e96693ebf1536a3c913cb2a1",
    "changes": "웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
    "checked": "2026-10-10"
  }
];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function get(course){return records.find(p => Object.hasOwn(p.courses, String(course?.id)) && p.courses[String(course.id)] === course.name) || null;}
  function dateLabel(p){return p.dateNote || (p.date ? p.date+' 촬영' : '촬영 시기 미상');}
  function licenseNote(p){return p.noCrop ? '제공 이미지의 비율과 내용을 유지합니다.' : /BY-SA/.test(p.license) ? '편집본에도 '+p.license+' 적용' : '사진 이용 조건은 위 출처에서 확인할 수 있어요.';}
  function credit(p){return `<span>${escape(p.place)} · ${escape(dateLabel(p))}</span><br><a href="${escape(p.source)}" target="_blank" rel="noopener noreferrer">사진: ${escape(p.author)} · 원본</a> · <a href="${escape(p.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(p.license)}</a><br><small>${escape(p.changes)} · ${escape(licenseNote(p))} · 촬영 당시 장소 모습으로 현재 상태와 다를 수 있어요.</small>`;}
  function cardCredit(p){return `<div class="photo-credit-attribution"><a href="${escape(p.source)}" target="_blank" rel="noopener noreferrer">사진: ${escape(p.author)} · 원본</a> · <a href="${escape(p.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(p.license)}</a><span class="photo-credit-edit">${p.noCrop?'비율 유지':'웹용 표시'}</span></div><details><summary>사진 정보</summary><div class="photo-credit-details">${escape(p.place)} · ${escape(dateLabel(p))}<br>${escape(p.changes)} · ${escape(licenseNote(p))}<br>촬영 당시 장소 모습으로 현재 상태와 다를 수 있어요.</div></details>`;}
  function figure(course){const p=get(course);return p?`<figure class="curated-course-photo" style="margin:20px 0"><img src="${p.src}" alt="${escape(p.place)} 실제 사진 (${p.date})" width="${p.width}" height="${p.height}" loading="lazy" decoding="async" style="display:block;width:100%;height:auto;max-height:540px;object-fit:contain;background:#eef1e9;border-radius:16px"><figcaption style="font-size:12px;line-height:1.7;margin-top:8px">${credit(p)}</figcaption></figure>`:'';}
  const api=Object.freeze({get,credit,cardCredit,figure,dateLabel});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.CoursePhotos=api;
})(typeof globalThis!=='undefined'?globalThis:this);
