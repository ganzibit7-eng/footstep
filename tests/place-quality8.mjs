import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import P from '../place-presentation.js';import M from '../card-media.js';
import {essentialFacts,gallery} from '../scripts/detail-editorial.mjs';

test('explicit facility lists preserve source characters and never split parentheses or fees',()=>{
 for(const raw of ['개별 바비큐- 바비큐- 샤워실- 캠핑장- 개별 테라스- 매점','화장실, 개수대, 취사장(전기, 가스)','대여 요금 10,000원, 주차장']){const result=P.facilityItems(raw);assert(result);assert.equal(result.parts.map(p=>p.raw).join(''),raw);assert.equal(result.source,raw);}
 assert(P.facilityItems('화장실, 개수대, 취사장(전기, 가스)').items.includes('취사장(전기, 가스)'));
 for(const raw of ['시설은 사정에 따라 이용할 수 없습니다.','샤워실, 이용 조건은 문의하세요','샤워실, 개수대(유료','화장실) , 주차장','문의'])assert.equal(P.facilityItems(raw),null);
 const facts=P.cardSummary([{label:'구비시설',value:'개별 바비큐- 바비큐- 샤워실- 캠핑장- 개별 테라스- 매점'}]);assert(facts.some(f=>f.label==='시설 일부'&&f.value==='개별 바비큐 · 바비큐'));
});

test('photo context changes only known editorial boilerplate, not rights or source quotations',()=>{
 const generic='장소 참고사진 · 메뉴·시설 사진은 반려견의 해당 시설 출입 허용을 뜻하지 않습니다.';
 for(const kind of ['park','stay','camping','course']){const formatted=M.photoContext('작가 이름 · CC BY 4.0 '+generic,kind);assert(!formatted.includes('메뉴'));assert(formatted.includes('작가 이름 · CC BY 4.0'));}
 assert.equal(M.photoContext(generic),generic,'home/default presentation remains intact');assert.equal(M.photoContext(generic,'식당카페'),generic);
 const quote='공식 소개: 공원 내부 카페에서 메뉴를 판매합니다.';assert.equal(M.photoContext(quote,'park'),quote);
});

test('shared gallery caveats appear once while each creator, license and date remain available',()=>{
 const note='촬영 당시 제공 사진으로 현재 모습·동반 허용 구역을 보장하지 않습니다.';
 const nodes=['A','B'].map((author,i)=>'<figure><img src="/photo'+i+'.jpg" width="900" height="600"><figcaption><a href="https://source.example/'+i+'">작가 '+author+'</a> · <a href="https://license.example/'+i+'">CC BY 4.0</a><br>촬영 2026-10-0'+(i+1)+'<br>'+note+'</figcaption></figure>');
 const original=nodes.join(''),html=gallery(nodes,'park');assert.equal(nodes.join(''),original);assert.equal(html.split(note).length-1,1);
 for(const author of ['A','B'])assert(html.includes('작가 '+author));for(const day of ['2026-10-01','2026-10-02'])assert(html.includes(day));assert(html.includes('https://license.example/0'));assert(html.includes('https://license.example/1'));
});

test('first-screen facts prioritize complete access rules and known operations without invented values',()=>{
 const pet=[{label:'견종·크기 조건',value:'10kg 이하'},{label:'허용 구역·제한',value:'야외만 동반 가능'},{label:'필수 준비물',value:'목줄 착용'}],hours=[{label:'운영시간',value:'10:00~18:00'}];
 const r=essentialFacts('park',pet,hours,[]);assert.equal(r[0].value,'야외만 동반 가능');assert(r.some(f=>f.value==='10:00~18:00'));assert(r.length<=3);
 const long='조건은 객실과 이용 구역에 따라 다르게 적용될 수 있고 일부 구역은 출입이 금지되어 있으므로 예약 전에 확인해야 합니다.';
 assert(essentialFacts('stay',[...pet,{label:'세부 출입 조건',value:long}],hours,[]).some(f=>f.derived==='full-rule'));
 assert.equal(essentialFacts('stay',pet,hours,[],{caution:true})[0].derived,'conflict');
 assert(essentialFacts('park',[],[],[]).every(f=>f.derived==='unconfirmed'));
});

test('published examples contain structured facilities and category-appropriate photo context',()=>{
 const camp=readFileSync('places/kto_27ea733c-7e93-4f91-be36-33e0b1911a12/index.html','utf8');assert(camp.includes('detail-facility-list'));assert(camp.includes('취사장(세탁실)'));
 const park=readFileSync('places/kto_new_20261020_2930334/index.html','utf8').match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];assert(!park.includes('메뉴·시설 사진'));assert(park.includes('공원·관광지 참고사진'));assert(park.includes('10:00~22:00'));
});
