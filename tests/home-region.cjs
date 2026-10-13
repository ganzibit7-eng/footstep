const assert=require('node:assert/strict'),Home=require('../home-explore.js');
const courses=[
 {id:'seoul',name:'서울 공원',diff:'쉬움',address:'서울특별시 성동구',minutes:20,comfort:true},
 {id:'busan',name:'부산 공원',diff:'쉬움',address:'부산광역시 해운대구',minutes:30,comfort:true},
 {id:'unknown',name:'서울이라는 설명만 있는 코스',diff:null,address:'',minutes:null,comfort:false},
 {id:'gyeonggi',name:'서울 인근 경기 코스',diff:'보통',address:'경기도 수원시',minutes:null,comfort:false}
];
const tools={address:c=>({address:c.address}),query:(c,q)=>[c.name,c.address].join(' ').includes(q),minutes:c=>c.minutes,comfort:(c,state)=>!state.stairs||c.comfort};
assert.equal(Home.regionKey(courses[2],tools.address(courses[2])),'','never infer a region from description or proximity');
assert.equal(Home.regionKey(courses[3],tools.address(courses[3])),'gyeonggi');
assert.equal(Home.regionKey({name:'전남 정원'},{address:'전남광주통합특별시 순천시'}),'jeonnam');
assert.equal(Home.regionKey({name:'지역 미상'},{address:'전남광주통합특별시'}),'');
assert.equal(Home.regionKey({name:'해변'},{address:'엘시티, 중동, 해운대구, 부산광역시, 대한민국'}),'busan');
assert.equal(Home.regionKey({name:'공원'},{address:'전남광주통합특별시 북구 운암동'}),'gwangju');
assert.equal(Home.regionKey({name:'공원'},{address:'전남광주통합특별시 목포시 죽교동'}),'jeonnam');
assert.equal(Home.regionKey({name:'부산 언급'},{address:'주소 미확인'}),'');
const state={region:'seoul',query:'',diff:'all',maxMinutes:0,comfort:{}};
assert.deepEqual(Home.filter(courses,state,tools).map(c=>c.id),['seoul']);
assert.deepEqual(Home.filter(courses,{...state,query:'부산'},tools),[],'a query must not escape the selected province');
assert.deepEqual(Home.filter(courses,{...state,region:'gyeonggi',maxMinutes:40},tools),[],'unknown duration must not match a time ceiling');
assert.deepEqual(Home.filter(courses,{...state,region:'gyeonggi',comfort:{stairs:true}},tools),[],'unknown comfort must not count as confirmed');
assert.deepEqual(Home.filter(courses,{...state,region:'all',diff:'쉬움',maxMinutes:25},tools).map(c=>c.id),['seoul']);
assert.deepEqual(Home.filter(courses,{...state,region:'bad'},tools),[]);
assert.equal(Home.filter(courses,{...state,region:'all'},tools).length,4);
let value=null;const storage={getItem:()=>value,setItem:(key,next)=>{value=next;},removeItem:()=>{value=null;}};
assert.equal(Home.readSelection(storage),'');assert.equal(Home.writeSelection('seoul',storage),true);assert.equal(Home.readSelection(storage),'seoul');
assert.equal(Home.writeSelection('bad',storage),false);assert.equal(Home.readSelection(storage),'seoul');value='<script>';assert.equal(Home.readSelection(storage),'');
const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};assert.equal(Home.readSelection(blocked),'');assert.equal(Home.writeSelection('busan',blocked),false);
assert.equal(Home.regions.length,17);assert.equal(Home.valid('all'),true);
Home.writeSelection('gwangju',storage);assert.equal(Home.readSelection(storage),'gwangju');assert.equal(Home.clearSelection(storage),true);assert.equal(Home.readSelection(storage),'','reselect must survive reload without restoring previous region');Home.writeSelection('busan',storage);assert.equal(Home.readSelection(storage),'busan');assert.equal(Home.clearSelection({removeItem(){throw Error('blocked');}}),false);
console.log('PASS: strict address region, province/query intersection, unknown time/comfort exclusion, combined-region ambiguity, all 17 selections, invalid/blocked storage fallback');
