const assert=require('node:assert/strict');
const Conditions=require('../place-conditions.js');
const places=require('../docs/expansion-20261005-places/added-places.json');
const sky=Conditions.get(places.find(p=>p.name==='만천하 스카이워크'));
assert.match(sky[0].value,/입장 불가/);assert.match(sky[1].value,/중소형견/);assert.match(sky[2].value,/이동장/);
const park=Conditions.get(places.find(p=>p.name==='북서울꿈의숲'));
assert.match(park[0].value,/잔디광장 반려견 출입불가/);assert.match(park[0].value,/대형견/);
const unknown=Conditions.get({description:'좋은 카페'});assert.ok(unknown.every(r=>r.value.includes('미확인')));
assert.ok(!Conditions.panel({description:'동반가능 <script>alert(1)</script> · 문의: <img onerror=x>'}).includes('<script>'));
assert.match(Conditions.get({description:'동반가능동물: 대형견 불가'})[1].value,/불가/);
console.log('Place conditions: restrictions preserved, unknowns explicit, HTML escaped');

const now=Date.parse('2026-10-11T00:00:00Z');
assert.match(Conditions.freshness({description:'공식안내: https://korean.visitkorea.or.kr/a · 확인일: 2026-01-01'},now),/180일 경과/);
assert.match(Conditions.freshness({description:'공식안내: https://korean.visitkorea.or.kr/a · 확인일: 2026-10-10'},now),/당일 운영/);
for(const description of ['확인일: 2026-10-10','공식안내: https://example.invalid/a · 확인일: 2026-10-10','공식안내: https://korean.visitkorea.or.kr/a · 확인일: 2026-02-31','공식안내: https://korean.visitkorea.or.kr/a · 확인일: 2027-01-01'])assert.match(Conditions.freshness({description},now),/미확인/);
assert.match(Conditions.panel({name:'장소',id:'test'}),/정보 수정 제보/);
