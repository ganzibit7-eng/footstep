(function () {
  'use strict';

  const destinations = {
    pub1788410826322_167_ilth5f: ['gangwon', '7JaR7JaR6rWw', '양양군', 'stays', false],
    pub1788410835188_440_vymwtj: ['seoul', '6rSR7KeE6rWs', '광진구', 'cafes', true],
    pub1788410826323_376_2apxxy: ['gyeongbuk', '7Y-s7ZWt7Iuc', '포항시', 'stays', false],
    pub1788410826322_43_2kfgx8: ['jeonbuk', '6rWw7IKw7Iuc', '군산시', 'stays', false],
    pub1788410826322_19_4qvafh: ['gyeonggi', '6rmA7Y-s7Iuc', '김포시', 'stays', false],
    pub1788410835188_550_dz71qo: ['gangwon', '7JuQ7KO87Iuc', '원주시', 'cafes', true],
    pub1788410835188_16_g4vhm0: ['seoul', '6rCV7ISc6rWs', '강서구', 'cafes', true],
    pub1788410835188_521_04g8h7: ['gyeongnam', '7LC97JuQ7Iuc', '창원시', 'cafes', true],
    pub1788410826322_150_jinf20: ['jeonbuk', '66y07KO86rWw', '무주군', 'stays', false],
    pub1788410835188_112_r061hw: ['gyeongbuk', '7Y-s7ZWt7Iuc', '포항시', 'cafes', true],
    pub1788410826322_31_naigsy: ['gangwon', '6rCV66aJ7Iuc', '강릉시', 'stays', false],
    pub1788410835188_486_emi6gz: ['jeju', '7KCc7KO87Iuc', '제주시', 'cafes', true],
    pub1788410835188_691_2016i8: ['gyeonggi', '7ISx64Ko7Iuc', '성남시'],
    pub1788410826323_384_bvalxm: ['gyeonggi', '6rCA7Y-J6rWw', '가평군', 'stays', true],
    pub1788410826323_392_qgqhek: ['chungnam', '7YOc7JWI6rWw', '태안군', 'stays', true],
  };
  const match = /^\/places\/(pub[0-9]+_[0-9]+_[a-z0-9]+)\/?$/.exec(location.pathname);
  const target = match && destinations[match[1]];
  if (!target) return;

  const [region, area, label, category, hasAreaCategory] = target;
  const titles = {cafes: '카페·식당', stays: '숙소'};
  const areaPath = '/places/regions/' + region + '/areas/' + area + '/';
  const nav = document.getElementById('entry-recovery-links');
  function addLink(path, name) {
    const link = document.createElement('a');
    link.href = path;
    link.textContent = name;
    nav.append(link);
  }
  if (hasAreaCategory) addLink(areaPath + category + '/', label + ' 애견동반 ' + titles[category]);
  addLink(areaPath, label + ' 애견동반 장소');
  document.getElementById('entry-recovery').hidden = false;
})();
