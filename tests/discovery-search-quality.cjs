const test=require('node:test'),assert=require('node:assert/strict'),S=require('../place-search.js'),records=require('./search-records.cjs')();
const item=(name,extra={})=>({kind:'courses',region:'서울',name,info:'서울특별시 성동구 12-3',conditions:'미확인',...extra});
test('place names match spacing, full width, decomposed Hangul and normal regional labels',()=>{const rows=[item('서울숲 공원길'),item('Pet-Cafe Ａ')];for(const q of ['서울숲공원길','서울숲 공원길','서울시 서울숲','서울특별시 서울숲','서울숲공원길'.normalize('NFD')])assert.equal(S.filter(rows,{q})[0].name,'서울숲 공원길',q);assert.equal(S.filter(rows,{q:'petcafe a'})[0].name,'Pet-Cafe Ａ');assert.equal(S.filter(records,{q:'서울숲공원길',kind:'courses'}).some(x=>x.path==='/courses/c31/'),true);});
test('field boundaries and numeric address hyphens are preserved; regex syntax is literal',()=>{assert.equal(S.filter([item('서',{region:'울',info:''})],{q:'서울'}).length,0);assert.equal(S.filter([item('카페')],{q:'123'}).length,0);assert.equal(S.filter([item('카페')],{q:'12-3'}).length,1);assert.equal(S.filter([item('[.*] 가게'),item('가게')],{q:'[.*]'}).length,1);assert.equal(S.filter([item('a'.repeat(80))],{q:'(a+)+'}).length,0);});
test('relevance is deterministic name matching and preserves explicit alternative sorting',()=>{const rows=[item('다른 곳',{conditions:'서울숲 소개'}),item('서울숲 공원길'),item('서울숲'),item('작은 서울숲')];assert.deepEqual(S.ordered(rows,'relevance','서울숲').map(x=>x.name),['서울숲','서울숲 공원길','작은 서울숲','다른 곳']);assert.equal(S.ordered(rows,'registered','서울숲'),rows);assert.deepEqual(rows.map(x=>x.name),['다른 곳','서울숲 공원길','서울숲','작은 서울숲']);});
test('legacy ordinary searches retain every previous match and unknown conditions never pass the evidence filter',()=>{for(const q of ['서울','강릉','숙소','공원','12-3']){const old=records.filter(x=>[x.name,x.region,x.info,x.conditions].join(' ').toLocaleLowerCase('ko').includes(q));const next=new Set(S.filter(records,{q}).map(x=>x.path));for(const x of old)assert(next.has(x.path),q+' '+x.path);}assert.equal(S.filter([{...item('카페'),kind:'facilities',facts:[{label:'체중',value:'미확인'}]}],{pet:'known'}).length,0);const r=item('변경 전');assert.equal(S.filter([r],{q:'변경전'}).length,1);r.name='변경 후';assert.equal(S.filter([r],{q:'변경전'}).length,0);});


test('course duration ranges have exclusive boundaries and never accept unknown or ambiguous facts',()=>{
 const rows=[30,31,60,61,120,121].map(n=>item('길 '+n,{facts:[{label:'평지 예상 시간',value:n+'분'}]}));
 rows.push(item('미상',{facts:[{label:'평지 예상 시간',value:'미확인'}]}),item('범위',{facts:[{label:'공식 안내 시간',value:'30~60분'}]}),item('거리뿐',{info:'2km · 쉬움',facts:[]}),item('카페',{kind:'facilities',facts:[{label:'공식 안내 시간',value:'20분'}]}));
 for(const [duration,expected] of [['30',[30]],['60',[31,60]],['120',[61,120]],['over120',[121]]])assert.deepEqual(S.filter(rows,{duration}).map(r=>Number(r.name.split(' ')[1])),expected);
 assert.equal(S.filter(rows,{duration:'__proto__'}).length,rows.length);
});
test('official duration wins over estimated time; difficulty is a labelled registration, never name inference',()=>{
 const row=item('쉬운 길 20분',{facts:[{label:'평지 예상 시간',value:'20분'},{label:'공식 안내 시간',value:'90분'},{label:'등록 난이도',value:'보통'}]});
 assert.deepEqual(S.courseFacts(row),{minutes:90,difficulty:'보통'});assert.equal(S.filter([row],{duration:'30'}).length,0);assert.equal(S.filter([row],{duration:'120',difficulty:'보통'}).length,1);assert.equal(S.filter([row],{duration:'120',difficulty:'쉬움'}).length,0);
 const unknown=item('쉬움 30분',{facts:[{label:'등록 난이도',value:'미확인'}]});assert.equal(S.filter([unknown],{difficulty:'쉬움'}).length,0);
});
test('compound filters retain all records without selection and match the unchanged public course facts',()=>{
 const before=JSON.stringify(records),courses=records.filter(r=>r.kind==='courses');assert.equal(courses.length,412);
 assert.equal(S.filter(records,{}).length,4618);assert.equal(S.filter(records,{kind:'courses'}).length,412);
 const selected=S.filter(records,{kind:'courses',region:'서울',duration:'60',difficulty:'쉬움',q:'서울숲공원길'});assert.equal(selected.length,1);assert.equal(selected[0].path,'/courses/c31/');
 assert.equal(S.filter(records,{kind:'courses',q:'서울숲공원길',duration:'30'}).length,0,'official 60 minutes must not be recalculated from 2km');
 assert.equal(S.filter(records,{kind:'facilities',duration:'30'}).length,0);assert.equal(JSON.stringify(records),before);
});
