const fs=require('node:fs'),zlib=require('node:zlib');
const courses=JSON.parse(zlib.gunzipSync(fs.readFileSync('docs/pet-access-audit-20261010/public-courses.json.gz')));
const evidence=JSON.parse(fs.readFileSync('docs/course-comfort-20261010/operator-checks.json'));
function signature(s){let h=2166136261;for(const ch of String(s))h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;return String(h);}
const records={};
for(const e of evidence){if(!e.restMentionVerified)continue;const c=courses.find(c=>c.id===e.id);const municipal=['c387','c388','c402'].includes(c.id);records[c.id]={name:c.name,descriptionSignature:signature(c.description),checked:e.checked,stairs:null,gentle:['c133','c387','c388'].includes(c.id),rest:true,note:municipal?'공원 안내에 벤치·휴식 공간이 소개돼요. 경사 안내는 공원 자료의 설명 기준이며 이 경로 전 구간의 측정값은 없어요. 개별 벤치 위치와 경로에서의 접근 거리는 미확인입니다.':'코스 자료에 쉼터 경유지가 소개돼요. 개별 시설의 위치·운영 상태와 휴식 간격은 미확인입니다.',sources:[{label:municipal?'수원시 공원 안내':'서울시 코스 안내',url:e.source}]};}
records.c133.stairs='none';records.c133.note='7km 자락길에 계단이 없고 경사가 완만한 것으로 안내돼요. 북카페·너와집·이끼숲 주변 쉼터가 소개돼요. 진입로와 별도 등산로는 이 안내에 포함되지 않아요.';records.c133.sources.push({label:'서울시 안산자락길 기사 · 2026.05.14',url:'https://mediahub.seoul.go.kr/archives/2018076'});
let code=fs.readFileSync('course-comfort.js','utf8');code=code.replace(/const records=.*; \/\/ GENERATED_COMFORT_RECORDS/,`const records=${JSON.stringify(records)}; // GENERATED_COMFORT_RECORDS`);fs.writeFileSync('course-comfort.js',code);
fs.writeFileSync('docs/course-comfort-20261010/facts.json',JSON.stringify(records,null,2)+'\n');console.log('Comfort facts:',Object.keys(records).length);
