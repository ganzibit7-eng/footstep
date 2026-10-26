import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import P from '../place-presentation.js';import Conditions from '../place-conditions.js';
import Media from '../card-media.js';import {listingCopy} from '../scripts/listing-copy.mjs';

test('complete facility schedules are lossless and ambiguous time prose remains original',()=>{
 const source='[B사이트/C사이트/카라반]- 입실시간 13:00- 퇴실시간 11:00[방가로+캠핑사이트]- 입실시간 14:00- 퇴실시간 11:00';
 const result=P.structure(source);assert.equal(result.kind,'schedules');assert.equal(result.parts.map(p=>p.raw).join(''),source);
 assert.deepEqual(result.parts.map(p=>[p.label,p.checkin,p.checkout]),[['B사이트/C사이트/카라반','13:00','11:00'],['방가로+캠핑사이트','14:00','11:00']]);
 assert.equal(P.structure('[타프존]- 입실 13:00~22:00- 퇴실 11:00').parts[0].checkin,'13:00~22:00');
 for(const raw of ['설명 [사이트] 입실 13:00-퇴실 12:00','[A] 입실 13:00-퇴실 미정','[A] 입실 25:00-퇴실 11:00','[A] 입실 13:00-퇴실 11:00 추가 협의']){assert.equal(P.groupedTimes(raw),null);assert.equal(P.structure(raw).parts.map(p=>p.raw).join(''),raw);}
});

test('compact cards keep restrictions complete, never extract an isolated positive exception',()=>{
 const raw='일부구역 동반가능 · 4kg 미만 소형견만 동반 가능합니다. 캠핑장 내 산책 불가합니다.*반려견 동반 운영 정책은 현지 사정에 따라 변동 될 수 있습니다.';
 const facts=P.cardSummary([{label:'견종·크기 조건',value:'소형견 (4kg 미만)'},{label:'허용 구역·제한',value:raw}]);
 assert(facts.some(f=>f.value.includes('산책 불가')||f.derived==='full-rule'));
 assert(!facts.some(f=>f.value==='일부구역 동반가능'));
 const ambiguous='동반 가능한 공간이 있지만 특정 견종과 객실마다 별도의 규정이 적용되며 사전 협의를 해야 하는 경우도 있고 운영기관 확인이 필요합니다.';
 assert(P.cardSummary([{label:'허용 구역·제한',value:ambiguous}]).some(f=>f.derived==='full-rule'));
 const chained='일부구역 동반가능 · - 안거나 리드줄 칙용- 매너벨트 착용시 풀어놓아도 됨';
 assert(P.cardSummary([{label:'허용 구역·제한',value:chained}]).some(f=>f.derived==='full-rule'&&f.source===chained));
 const samples=P.cardSummary([{label:'구비시설',value:'반려견 전용 개별 데크, 울타리, 반려견 운동장, 화장실, 개수대, 샤워실, 취사장(세탁실)'}]);
 assert(samples.some(f=>f.label==='시설 일부'&&f.value==='반려견 전용 개별 데크 · 울타리'));
 assert(P.cardSummary([]).every(f=>!f.source&&f.derived==='unconfirmed'));
});

test('every public evidence record produces bounded source-backed previews without mutating originals',()=>{
 const records=JSON.parse(readFileSync('place-evidence.js','utf8').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]),before=createHash('sha256').update(JSON.stringify(records)).digest('hex');let preview=0,schedules=0;
 const allowed=new Set(['sites','schedules','complex-hours','facility-sample','cleaned','full-rule','unconfirmed']);
 for(const r of records){const rows=[...Conditions.get(r),...P.visitRows(r.visitInfo?.rows||[])],facts=P.cardSummary(rows,{kind:r.category});
  assert(facts.length<=3,r.id);for(const fact of facts){preview++;assert(fact.value.length<=54&&!fact.value.includes('\n'),r.id+' long preview');if(!fact.source){assert.equal(fact.derived,'unconfirmed');continue;}
   assert(rows.some(row=>row.value===fact.source||row.source===fact.source),r.id+' missing source witness');if(fact.derived)assert(allowed.has(fact.derived));else assert(P.visitRows(P.fields(rows)).some(row=>row.value.trim()===fact.value));
   if(fact.derived==='schedules'){schedules++;assert.equal(P.structure(fact.source).kind,'schedules');}
  }
 }
 assert.equal(createHash('sha256').update(JSON.stringify(records)).digest('hex'),before);assert(preview>1000);assert(schedules>0);console.log('Quality6 sourced preview facts:',preview,'facility schedules:',schedules);
});

test('collection copy belongs to its category and address shortening only removes a literal repeated prefix',()=>{
 for(const [label,word]of [['애견동반 캠핑장','사이트'],['서울 애견동반 숙소','객실'],['강원 식당·카페','실내'],['공원·관광지','출입'],['애견동반 쇼핑','출입']]){const copy=listingCopy({table:'facilities'},label);assert(copy.intro.includes(word));if(!/식당|카페/.test(label))assert(!copy.intro.includes('카페·식당·숙소'));}
 assert.equal(Media.address('서울특별시 중구 통일로 78','서울특별시 중구'),'통일로 78');
 assert.equal(Media.address('서울 중구 통일로 78','서울특별시 중구'),'서울 중구 통일로 78');
});


test('compact attribution keeps every named creator, license, destination and complete original credit',()=>{
 const photo={author:'한국관광공사(관광정보 제공기관) · 촬영자 미표기',width:940,height:625,noCrop:true};
 const raw='<a href="https://source.example/">사진: '+photo.author+' · 원문</a> · <a href="https://license.example/">이용 조건</a><p>원본 비율 유지, 촬영일 미확인</p>';
 const html=Media.credits(photo,raw);assert(html.includes('>사진: 한국관광공사</a>'));assert(html.includes(raw));assert(html.includes('https://license.example/'));
 assert.equal(Media.author({author:'한국관광공사 · 김지호'}),'한국관광공사 · 김지호');
 const licensed={author:'작가',width:1000,height:700,license:'CC BY 4.0',changes:'원본 파일 크롭 없음'};
 assert(Media.credits(licensed,raw).includes(Media.cropNote));
 assert(!Media.credits({...licensed,changes:'화면 비율에 따라 가장자리 잘림'},raw).includes(Media.cropNote));
});
