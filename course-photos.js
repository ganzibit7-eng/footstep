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
    "checked": "2026-10-02"
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
    "checked": "2026-10-02"
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
    "checked": "2026-10-02"
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
    "checked": "2026-10-02"
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
    "checked": "2026-10-02"
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
    "checked": "2026-10-02"
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
    "checked": "2026-10-02"
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
    "checked": "2026-10-02"
  }
];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function get(course){return records.find(p => Object.hasOwn(p.courses, String(course?.id)) && p.courses[String(course.id)] === course.name) || null;}
  function credit(p){return `<span>${escape(p.place)} · ${escape(p.date)} 촬영</span><br><a href="${escape(p.source)}" target="_blank" rel="noopener noreferrer">사진: ${escape(p.author)} · 원본</a> · <a href="${escape(p.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(p.license)}</a><br><small>${escape(p.changes)} · 촬영 당시 장소 모습으로 현재 상태와 다를 수 있어요.</small>`;}
  function figure(course){const p=get(course);return p?`<figure class="curated-course-photo" style="margin:20px 0"><img src="${p.src}" alt="${escape(p.place)} 실제 사진 (${p.date})" width="1200" height="800" loading="lazy" decoding="async" style="display:block;width:100%;height:auto;max-height:440px;object-fit:cover;border-radius:16px"><figcaption style="font-size:12px;line-height:1.7;margin-top:8px">${credit(p)}</figcaption></figure>`:'';}
  const api=Object.freeze({get,credit,figure});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.CoursePhotos=api;
})(typeof globalThis!=='undefined'?globalThis:this);
