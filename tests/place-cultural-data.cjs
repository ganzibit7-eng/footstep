const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),z=require('zlib'),vm=require('vm');
const Evidence=require('../place-evidence.js'),Conditions=require('../place-conditions.js');
const matched=JSON.parse(z.gunzipSync(fs.readFileSync('docs/place-enrichment-20261019f/matched.json.gz')));
const norm=s=>String(s||'').normalize('NFKC').replace(/\([^)]*\)|[\s.,]/g,'').replace(/전북특별자치도/,'전라북도').replace(/강원특별자치도/,'강원도');
test('all cultural references match public identity, address and coordinates',()=>{
 assert.equal(matched.length,1213);
 for(const {place:p,row:r} of matched){const info=Evidence.culture(p);assert(info);assert.equal(norm(p.address),norm(r['도로명주소']));assert(Math.hypot((+r['위도']-p.lat)*111000,(+r['경도']-p.lng)*88000)<150);assert.equal(info.written,r['최종작성일']);for(const key of Object.keys(info.facts))assert.equal(info.facts[key],r[key]);for(const patch of [{name:p.name+' 다른 지점'},{address:p.address+' 2층'},{lat:p.lat+0.01},{lng:null},{description:p.description+' 변경'}])assert.equal(Evidence.culture({...p,...patch}),null);}
});
test('historical references never change current conditions or freshness',()=>{
 const context={URL,PlaceEvidence:{...Evidence,culture:()=>null}};vm.createContext(context);vm.runInContext(fs.readFileSync('place-conditions.js','utf8'),context);
 for(const {place:p} of matched){assert.equal(JSON.stringify(Conditions.get(p)),JSON.stringify(context.PlaceConditions.get(p)));assert.equal(Conditions.freshness(p),context.PlaceConditions.freshness(p));const panel=Conditions.culturePanel(p);assert(panel.includes('과거에 작성된 참고 자료'));assert(panel.includes(Evidence.culture(p).written));assert(panel.includes('현재 동반 허용·크기·요금이 확인된 정보가 아니'));assert(panel.includes('반려견 실내·객실 출입 허용을 뜻하지 않습니다'));assert(!Conditions.source(p).includes('15111389'));}
});
test('negative access and escaped source values cannot become indoor dog permission',()=>{
 const context={PlaceEvidence:{culture:()=>({written:'2022-11-30',checked:'2026-10-19',facts:{'반려동물 동반 가능정보':'N','입장 가능 동물 크기':'<img onerror=x>','장소(실내) 여부':'Y','장소(실외)여부':'N'}})}};vm.createContext(context);vm.runInContext(fs.readFileSync('place-conditions.js','utf8'),context);const html=context.PlaceConditions.culturePanel({});assert(html.includes('동반 불가로 기재'));assert(html.includes('&lt;img onerror=x&gt;'));assert(!html.includes('<img'));assert(!html.includes('실내 출입 가능'));assert(html.includes('현재 허용 여부는 재확인 필요'));
});
