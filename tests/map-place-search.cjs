const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
let removed=0,markers=0;const popups=[];const count={textContent:''};
const ctx={map:{},facilityLayer:{clearLayers(){removed++;}},facilityDataState:'loading',facilityDataAvailable:false,facilities:[],myDeviceId:null,
 document:{getElementById:id=>id==='facility-filter-count'?count:id==='facility-search-results'?null:{value:'',addEventListener(){}}},isHidden:(_,id)=>id==='hidden',
 CourseInfo:{cleanDescription:s=>s||'',sourceURL:()=>null},FacilityInfo:{get:()=>({emoji:'🐾',poi:'cafe'})},PlaceConditions:{panel:()=>'<p>전체 조건 · 미확인</p>',summary:()=> '미확인 · 방문 전 문의'},poiIcon:()=>null,
 registeredPlaceLabel:()=>'',escapeHtml:String,kakaoLinkTo:()=>'',L:{marker(){markers++;return {bindPopup(html){popups.push(html);return this;},addTo(){return this;}}}}};
vm.createContext(ctx);vm.runInContext(html.slice(html.indexOf('  function validPlaceCoordinates('),html.indexOf('  window.__deleteFacility')),ctx);
for(const [lat,lng,valid] of [[null,127,false],['',127,false],[' ',127,false],[undefined,127,false],[91,127,false],[37,181,false],['37.5','127',true],[0,0,true]])assert.equal(ctx.validPlaceCoordinates({lat,lng}),valid);
const rows=[{id:'good',name:'서울 카페',address:'성동구',category:'식당카페',lat:37,lng:127},{id:'missing',name:'서울 카페',lat:null,lng:127},{id:'hidden',name:'서울 카페',lat:37,lng:127}];
assert.equal(ctx.filterRegisteredFacilities(rows,'식당카페','성동구 서울').length,1);
assert.equal(ctx.filterRegisteredFacilities(rows,'숙소','').length,0);
ctx.renderFacilityMap();assert.match(count.textContent,/불러오는 중/);assert.equal(markers,0);
ctx.facilityDataState='error';ctx.renderFacilityMap();assert.match(count.textContent,/불러오지 못/);
ctx.facilityDataAvailable=true;ctx.facilityDataState='ready';ctx.facilities=rows;ctx.renderFacilityMap();assert.match(count.textContent,/1곳/);assert.equal(markers,1);
ctx.facilityDataState='loading';ctx.renderFacilityMap();assert.match(count.textContent,/최신 정보 확인 중/);
ctx.facilityDataState='error';ctx.renderFacilityMap();assert.match(count.textContent,/이전 정보 표시/);
assert.match(ctx.registeredFacilityStatus('ready',true,0,true),/검색 조건/);
assert.equal(removed,5,'Each place update clears only its own layer');
console.log('PASS: missing/out-of-range coordinates, multiword matching, hidden/category filters, initial loading/error, retained stale data and isolated place layer updates.');

assert(popups.every(html=>html.includes("미확인 · 방문 전 문의")&&html.includes("전체 조건 · 미확인")&&html.includes("map-popup-details")),"popup must preserve uncertainty and full conditions behind its disclosure");
assert(popups.every(html=>(html.match(/동반 조건·상세 안내 ↗/g)||[]).length===1),"single clear detail destination");
