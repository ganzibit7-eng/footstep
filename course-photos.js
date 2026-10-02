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
  }
];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function get(course){return records.find(p => Object.hasOwn(p.courses, String(course?.id)) && p.courses[String(course.id)] === course.name) || null;}
  function credit(p){return `<span>${escape(p.place)} · ${escape(p.date)} 촬영</span><br><a href="${escape(p.source)}" target="_blank" rel="noopener noreferrer">사진: ${escape(p.author)} · 원본</a> · <a href="${escape(p.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(p.license)}</a><br><small>${escape(p.changes)} · 편집본도 ${escape(p.license)} 적용 · 촬영 당시 장소 모습으로 현재 상태와 다를 수 있어요.</small>`;}
  function figure(course){const p=get(course);return p?`<figure class="curated-course-photo" style="margin:20px 0"><img src="${p.src}" alt="${escape(p.place)} 실제 사진 (${p.date})" width="${p.width}" height="${p.height}" loading="lazy" decoding="async" style="display:block;width:100%;height:auto;max-height:540px;object-fit:contain;background:#eef1e9;border-radius:16px"><figcaption style="font-size:12px;line-height:1.7;margin-top:8px">${credit(p)}</figcaption></figure>`:'';}
  const api=Object.freeze({get,credit,figure});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.CoursePhotos=api;
})(typeof globalThis!=='undefined'?globalThis:this);
