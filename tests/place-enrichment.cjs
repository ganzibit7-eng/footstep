const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),Evidence=require('../place-evidence.js'),Photos=require('../place-photos.js'),Conditions=require('../place-conditions.js');
const coverage=JSON.parse(fs.readFileSync(path.join(root,'docs/place-enrichment-20261018-batch2/summary.json'),'utf8'));
const script=fs.readFileSync(path.join(root,'place-evidence.js'),'utf8'),records=JSON.parse(script.match(/const records=(\[[\s\S]*?\]);\n/)[1]);
test('all enriched identities are public records; photographs are intact with rights, origin and dimensions',()=>{
 let photos=0,pets=0;const ids=new Set();
 for(const r of records){assert(!ids.has(r.id));ids.add(r.id);assert.equal(Evidence.get(r).id,r.id);assert.match(r.source,/^https:\/\/(api\.visitkorea\.or\.kr|gocamping\.or\.kr)\//);
  for(const change of [{name:r.name+' 다른 지점'},{address:r.address+' 다른 주소'},{lat:r.lat+0.01},{lng:r.lng+0.01},{lat:null}])assert.equal(Evidence.get({...r,...change}),null);
  if(r.pet){pets++;assert.equal(Evidence.conditions({...r,description:r.description+' 변경'}),null);const rows=Conditions.get(r).map(x=>x.value).join('\n');for(const key of ['acmpyTypeCd','acmpyPsblCpam','acmpyNeedMtr','etcAcmpyInfo','relaPosesFclty','relaAcdntRiskMtr','relaFrnshPrdlst','relaPurcPrdlst','relaRntlPrdlst']){const value=r.pet[key];if(value&&value.trim()&&!/<|&/.test(value))assert(rows.includes(value.trim()),r.name+' missing '+key);}}
  if(r.photo){photos++;const p=Photos.get(r);assert(p.noCrop);assert(p.width>=150&&p.height>=150);assert.match(p.src,/^\/assets\/place-photos\/kto-\d+(?:-[a-f0-9]{12})?\.(jpg|png)$/);assert.match(p.original,/^https:\/\/tong\.visitkorea\.or\.kr\/cms\/resource\//);assert.equal(p.licenseUrl,'https://www.data.go.kr/data/15101578/openapi.do');assert.match(p.dateNote,/미상/);assert(p.source&&p.author);const file=fs.readFileSync(path.join(root,p.src));assert.equal(crypto.createHash('sha256').update(file).digest('hex'),p.sha256);const html=Photos.figure(r);assert.match(html,/object-fit:contain/);assert.match(html,/이용 조건/);assert(!html.includes('undefined'));}
 }
 assert.equal(records.length,coverage.records);assert.equal(photos,coverage.photoPlaces);assert.equal(pets,coverage.petRecords);console.log({reviewed:3133,matched:records.length,photos,petRecords:pets,photoUnresolved:3133-photos});
});
test('current camping conditions remain bound to identity; conflicting guidance cannot become confirmed permission',()=>{
 const camps=records.filter(r=>r.camping);assert.equal(camps.length,969);assert.equal(records.filter(r=>r.caution).length,coverage.cautions);
 for(const r of camps){assert.equal(Evidence.camping({...r,description:r.description+' changed'}),null);assert.equal(Evidence.camping({...r,address:r.address+' elsewhere'}),null);assert.equal(r.camping.id,r.id);assert.match(r.camping.source,/^https:\/\/gocamping\.or\.kr\/bsite\/camp\/info\/read\.do\?c_no=\d+$/);assert(Conditions.get(r).some(row=>row.value.includes(r.camping.facts['문의처'])||!r.camping.facts['문의처']));}
 for(const r of records.filter(r=>r.caution)){assert.match(Conditions.summary(r),/재확인|출입 불가/);assert.match(Conditions.get(r)[1].value,/미확정/);assert.match(Conditions.panel(r),/role="note"/);assert.equal(Evidence.caution({...r,description:'changed'}),null);}
 const punta=records.find(r=>r.name==='푼타하우스');assert(punta);assert.equal(Evidence.caution(punta),null);
 const generic=camps.find(r=>!r.pet&&!r.caution&&r.camping.facts['반려동물 출입']==='가능');assert.match(Conditions.get(generic)[1].value,/미확인/);assert(Conditions.get(generic).some(r=>r.label==='실내·객실 출입'&&r.value.includes('미확인')));
});
test('small-dog restriction, extra conditions and unknowns do not imply permission',()=>{
 const small=Conditions.get({description:'한국관광공사 고캠핑 반려동물 출입 안내: 소형견만 가능 · 문의처: 010-1234-5678'});assert.match(small[1].value,/소형견만 가능/);assert.equal(small[3].value,'010-1234-5678');assert(small.some(x=>x.label==='실내·객실 출입'&&x.value.includes('미확인')));
 const complex=Conditions.get({description:'일부 구역 동반 가능 · 동반가능동물: 10kg 미만 소형견 · 동반 관련 상세정보: 실내 불가, 테라스만 가능 · 동반시 필요사항: 이동장 · 구비시설: 안전문 · 사고 대비사항: 응급키트 · 비치 품목: 물그릇 · 구매 품목: 간식 · 렌탈 품목: 유모차'});for(const value of ['10kg 미만','실내 불가','테라스만 가능','안전문','응급키트','물그릇','간식','유모차'])assert(complex.some(x=>x.value.includes(value)),value);
 assert(Conditions.get({description:'카페'}).every(x=>x.value.includes('미확인')));assert(!Conditions.panel({description:'동반 가능 <script>alert(1)</script> · 동반 관련 상세정보: <img onerror=x>'}).includes('<script>'));
});
test('home loads photo registry only on place demand; database and auth state do not depend on photo loading',async()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert(!/<script[^>]*src=["'][^"']*place-evidence\.js/.test(html));assert(html.includes('PlacePhotos.load().then('));assert(html.includes('.catch(()=>{});'));
 let appends=0;const context={Promise,document:{createElement(){return {remove(){}};},head:{append(script){appends++;context.PlaceEvidence=Evidence;script.onload();}}}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'place-photos.js'),'utf8'),context);await Promise.all([context.PlacePhotos.load(),context.PlacePhotos.load()]);assert.equal(appends,1);assert.equal(context.PlacePhotos.get(records.find(r=>r.photo)).src,Photos.get(records.find(r=>r.photo)).src);
});
