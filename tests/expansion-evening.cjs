'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),zlib=require('node:zlib'),vm=require('node:vm');
const Address=require('../course-addresses.js'),Info=require('../course-info.js');
const read=name=>JSON.parse(zlib.gunzipSync(fs.readFileSync('docs/expansion-20261003-evening/'+name+'.json.gz')));
const addresses=read('course-address-evidence'),courses=read('route-evidence'),places=read('added-places');
const routes=JSON.parse(fs.readFileSync('course-routes.js','utf8').split('const routes=')[1].split(';\nfunction get')[0]);
assert.equal(addresses.length,215);assert.equal(new Set(addresses.map(r=>r.id)).size,215);
for(const row of addresses){const c={id:row.id,name:row.name,path:routes[row.id].path};assert.equal(Address.get(c).address,Address.formatAddress(row.address));assert(Address.matches(c,row.address));assert.equal(Address.get({...c,path:[[row.lat+.001,row.lng]]}),null);assert(row.address);if(row.offsetMeters){assert(row.offsetMeters<=200);assert(row.point.includes('인근'));}else assert.equal(row.point,'출발 지점');}
const seoul=addresses.find(r=>r.address.startsWith('서울'));assert(Address.matches({id:seoul.id,name:seoul.name,path:routes[seoul.id].path},'서울특별시 '+seoul.address.split(' ')[1]));
assert(!Address.matches({id:seoul.id,name:seoul.name,path:routes[seoul.id].path},'없는동네12345'));
assert.equal(places.length,1052);assert.equal(new Set(places.map(r=>r.id)).size,1052);
for(const row of places){assert(row.address);assert(Info.sourceURL(row.description));assert.equal(Info.checkedDate(row.description),'2026-10-03');assert(row.lat>=33&&row.lat<=39.5&&row.lng>=124&&row.lng<=132);if(row.id.startsWith('gocamping_')){assert.equal(row.category,'캠핑');assert.match(row.description,/반려동물 출입 안내: (가능|소형견만 가능)/);assert.match(row.description,/예약 전/);}}
assert.equal(courses.length,3);
for(const row of courses){assert.deepEqual(routes[row.course.id].path,row.course.path);assert.equal(Info.sourceURL(row.course.description),row.route.source);assert(row.maxJump<=200);assert.equal(row.pet.conditions['동반구분'],'전구역 동반가능');if(row.course.id==='c430'){assert.match(row.course.name,/제주시/);assert.match(row.course.description,/전체 코스 경로가 아닙니다/);}if(row.course.id==='c431'){assert(row.alternativeTrackOverlap>.85);assert.deepEqual(row.parts[0],row.originalParts[0]);assert(row.meters<14000);}}
const html=fs.readFileSync('index.html','utf8');const renderer=html.split('card.innerHTML =')[1].split('card.addEventListener')[0];assert(!renderer.includes('🏛 공식 코스 안내'));assert(html.includes('${courseAddressHTML(c)}'));assert(html.includes('CourseAddresses.matches(c,listFilterState.query'));assert(html.includes('${courseEvidence(c)}'));
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].includes('const SUPABASE_URL'))new vm.Script(m[1]);
console.log('PASS: 215 searchable addresses, nearby labels, 1052 official-condition places, 3 original GPX routes, partial/alternative-track disclosure, card/detail provenance and JS syntax.');
