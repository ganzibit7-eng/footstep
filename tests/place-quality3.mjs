import searchRecords from './search-records.cjs';
import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import Presentation from '../place-presentation.js';import Conditions from '../place-conditions.js';
import {sameArea,sameAreaEntries,nearbyEntries} from '../scripts/place-recommendations.mjs';
import {listingFacts} from '../scripts/listing-editorial.mjs';
const records=JSON.parse(readFileSync('place-evidence.js','utf8').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]);
test('listing summaries retain the distinction between verified walking geometry and unconfirmed pet access',()=>{
 const facts=listingFacts({id:'unconfirmed',description:'공식 경로 자료',distance:'2km',diff:'쉬움',tags:['동반 확인 필요']},{table:'courses'});
 assert.equal(facts[0].label,'동반 확인 필요');assert(facts[0].value.includes('운영기관에 확인'));
});
test('Misan site partitions retain all four numbered ranges, exclusions and the global small-dog exception',()=>{
 const r=records.find(r=>r.name==='미산분교 캠핑장'),s=Presentation.structure(r.pet.acmpyPsblCpam);
 assert.equal(s.kind,'sites');assert.equal(s.parts.map(p=>p.raw).join(''),s.source);
 assert.deepEqual(s.parts.filter(p=>p.kind==='site').map(p=>p.label),['1~9번','10~16번','17~19번(몽골천막에 4면 가림막 사이트)','20~25번']);
 assert(s.parts.find(p=>p.label==='10~16번').body.includes('중·소형견 불가'));assert(s.parts.find(p=>p.label==='20~25번').body.includes('대형견 불가'));
 assert(s.parts.find(p=>p.kind==='notice').raw.includes('마사토 사이트와 블럭 사이트는 소형견만'));
 assert.deepEqual(Presentation.times(r.visitInfo.rows.find(x=>x.label==='운영시간').value).rows,[{label:'입실 시간',value:'14:00'},{label:'퇴실 시간',value:'12:00'}]);
 for(const raw of ['입실 14:00 이후 협의 / 퇴실 12:00','입실 미정-퇴실 12:00'])assert.equal(Presentation.times(raw),null);
 assert.equal(Presentation.structure('사이트별 규정은 번호 없이 운영기관에 문의').kind,'text');
});
test('every source condition is losslessly partitioned and every concise factual summary has a source witness',()=>{
 const before=createHash('sha256').update(JSON.stringify(records)).digest('hex');let partitions=0;
 for(const r of records){const rows=[...Conditions.get(r),...Presentation.visitRows(r.visitInfo?.rows||[])];for(const row of rows){const s=Presentation.structure(row.value);assert.equal(s.parts.map(p=>p.raw).join(''),row.value,r.id+' '+row.label);if(s.kind!=='text')partitions++;}
  const facts=Presentation.summary(rows);assert(facts.length<=3);for(const fact of facts){if(!fact.source)continue;assert(rows.some(row=>row.value===fact.source));if(fact.label!=='사이트별 조건')assert(Presentation.visitRows(Presentation.fields(rows)).some(row=>row.value.trim()===fact.value));}
 }
 assert.equal(createHash('sha256').update(JSON.stringify(records)).digest('hex'),before);assert(partitions>10);console.log('Lossless structured source fields:',partitions);
});
test('explicit operating and caution labels do not turn an address into a pet access rule',()=>{
 const raw='경상북도 구미시 금오산로 87-34 · 운영: 화~일 12:00~22:00 · 주의: 마당, 1층만 입장 가능, 목줄, 배변봉투';
 const parsed=Presentation.explicitFields(raw);assert.equal(parsed.parts.map(p=>p.raw).join(''),raw);
 const facts=Presentation.summary([{label:'허용 구역·제한',value:raw}]);
 assert(facts.some(f=>f.label==='운영시간'&&f.value==='화~일 12:00~22:00'));
 assert(facts.some(f=>f.label==='방문·이용 안내'&&f.value==='마당, 1층만 입장 가능, 목줄, 배변봉투'));
 assert(!facts.some(f=>f.value.includes('금오산로')));assert(facts.every(f=>f.source===raw));
 assert(!Presentation.explicitFields('운영기관에 문의 · 동반 가능 여부 미확인').labelled);
});
test('recommendations distinguish Suwon from Gapyeong, normalize region aliases and reject invalid points',()=>{
 const a={id:'a',name:'수원',address:'경기도 수원시 영통구',lat:37.28,lng:127.06},b={id:'b',name:'가평',address:'경기 가평군',lat:37.83,lng:127.51},c={id:'c',name:'수원 공원',address:'경기 수원시 영통구',lat:37.281,lng:127.061};
 assert(!sameArea(a,b));assert(sameArea(a,c));assert(sameArea({address:'강원특별자치도 인제군'},{address:'강원 인제군'}));
 assert.deepEqual(sameAreaEntries(a,[a,b,c]).map(x=>x.id),['c']);assert.deepEqual(nearbyEntries(a,[a,b,c,{id:'bad',lat:0,lng:0}]).map(x=>x.other.id),['c']);
 const h=readFileSync('courses/c387/index.html','utf8');assert(!h.slice(h.indexOf('</article>')).includes('/courses/c397/'),'Gapyeong must not appear as the Suwon course recommendation');
});
test('all detail and all collection pages use the quality templates and keep canonical metadata',()=>{
 const files=execFileSync('git',['ls-files','-z','--','*.html'],{encoding:'utf8',maxBuffer:10000000}).split('\0').filter(Boolean);let details=0,lists=0;
 for(const file of files){const h=readFileSync(file,'utf8'),url=h.match(/rel="canonical" href="https:\/\/balzaguk.com([^"?#]*)"/)?.[1];if(!url||url==='/')continue;
  if(h.includes('data-detail-template=')){assert(h.includes('data-detail-template="editorial-v3"'),file);assert(h.includes('detail-editorial.js?v=20261026-quality3'));details++;continue;}
  if(/"@type"\s*:\s*"CollectionPage"/.test(h)||h.includes('id="find-place"')){assert(h.includes('data-listing-template="quality3"'),file);assert(h.includes('listing-editorial.css?v=20261026-quality8'));lists++;}
 }
 assert.equal(details,22317);assert(lists>500);console.log('Quality coverage:',JSON.stringify({details,lists}));
 const home=readFileSync('index.html','utf8');assert(!home.includes('listing-editorial.css'));assert(!home.includes('place-presentation.js'));
});
test('the camping detail, visit facts, source grouping and directory summary agree with the original',()=>{
 const r=records.find(r=>r.name==='미산분교 캠핑장'),h=readFileSync('places/'+r.id+'/index.html','utf8');
 assert.equal((h.match(/class="detail-site-row"/g)||[]).length,4);assert(h.includes('중·소형견 불가'));assert(h.includes('마사토 사이트와 블럭 사이트는 소형견만'));
 assert(h.includes('<span>입실 시간</span>'));assert(h.includes('<span>퇴실 시간</span>'));assert(h.includes('14:00'));assert(h.includes('12:00'));assert(h.includes(r.visitInfo.rows.find(x=>x.label==='운영시간').value));
 assert.equal((h.match(/id="detail-gallery-sources"/g)||[]).length,1);assert(!h.includes('class="detail-photo-credit"'));
 const data=searchRecords(),entry=data.find(x=>x.path==='/places/'+r.id+'/');
 assert(entry.facts.some(x=>x.label==='사이트별 조건'));for(const f of entry.facts){assert(f.value.length<=86);assert(!f.value.endsWith('...'));if(f.label==='시설 일부')assert(f.value.split(' · ').every(value=>h.includes(value)));else assert(h.includes(f.value));}
});
