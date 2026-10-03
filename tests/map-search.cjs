const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require.resolve('../index.html'),'utf8');const els=Object.fromEntries(['place-search-input','place-search-results','place-search-btn'].map(id=>[id,{value:'서울숲',textContent:'검색',innerHTML:'',disabled:false,style:{},setAttribute(){},removeAttribute(){},querySelectorAll(){return [];}}]));
const course={id:'c1',name:'서울숲',lat:37.5,lng:127,desc:''},facility={id:'f1',name:'서울숲 카페',address:'서울 성동구',lat:37.5,lng:127,description:'공식안내: https://korean.visitkorea.or.kr/detail/test'};
let fail=false;const ctx=vm.createContext({document:{getElementById:id=>els[id]},CourseInfo:require('../course-info'),CourseAddresses:require('../course-addresses'),allCourses:()=>[course],facilities:[facility],isHidden:()=>false,escapeHtml:s=>String(s||'').replaceAll('<','&lt;').replaceAll('>','&gt;'),toast(){},console,kakaoKeywordSearch:async()=>{if(fail)throw Error('offline');return [{place_name:'<가짜>',address_name:'서울',y:'37.5',x:'127'}];}});
const start=html.indexOf('  function registeredPlaceLabel('),end=html.indexOf('  function goToPlace(',start);vm.runInContext(html.slice(start,end),ctx);
(async()=>{
 assert.equal(ctx.localMapSearch('서울숲').length,2);assert.match(ctx.registeredPlaceLabel(facility),/공식/);assert.match(ctx.registeredPlaceLabel({description:''}),/이용자 등록/);
 await ctx.runPlaceSearch();assert.match(els['place-search-results'].innerHTML,/발자국 산책 코스/);assert.match(els['place-search-results'].innerHTML,/공식 동반 안내 자료/);assert.match(els['place-search-results'].innerHTML,/일반 장소 · 동반 여부 미확인/);assert(!els['place-search-results'].innerHTML.includes('<가짜>'));
 fail=true;await ctx.runPlaceSearch();assert.match(els['place-search-results'].innerHTML,/서울숲 카페/);assert.match(els['place-search-results'].innerHTML,/연결하지 못/);assert.equal(els['place-search-btn'].disabled,false);
 console.log('PASS: local registered lookup, source distinctions, unverified general label, escaped output and registered results preserved on provider failure');
})().catch(e=>{console.error(e);process.exitCode=1;});
