const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const elements=Object.fromEntries(['home-region-form','home-region-input','home-region-apply','home-region-clear','home-region-status'].map(id=>[id,{value:'',hidden:true,disabled:false,textContent:'',focus(){},addEventListener(type,fn){this[type]=fn;}}]));
let saved=null,blocked=false,renders=0,resolver;
const ctx=vm.createContext({document:{getElementById:id=>elements[id]},localStorage:{getItem(){if(blocked)throw Error('blocked');return saved;},setItem(k,v){if(blocked)throw Error('blocked');saved=v;},removeItem(){if(blocked)throw Error('blocked');saved=null;}},geocodeRegion:async()=>await new Promise(r=>resolver=r),loadNearbyRecommendations(){renders++;}});
vm.runInContext(html.slice(html.indexOf('  const HOME_REGION_KEY='),html.indexOf('  let myRegionName =')),ctx);
vm.runInContext(html.slice(html.indexOf("  document.getElementById('home-region-form').addEventListener"),html.indexOf('  async function saveRegion(){')),ctx);
async function submit(name){elements['home-region-input'].value=name;return elements['home-region-form'].submit({preventDefault(){}});}
(async()=>{
 const valid={name:'서울 마포구',lat:37.56,lng:126.9};ctx.regionTest=valid;assert.equal(vm.runInContext('validHomeRegion(regionTest)',ctx),true);
 ctx.regionTest={...valid,lat:null};assert.equal(vm.runInContext('validHomeRegion(regionTest)',ctx),false);
 saved='{broken';assert.equal(ctx.readHomeRegion(),null);
 let p=submit('서울 마포구');resolver({lat:37.56,lng:126.9});await p;assert.equal(JSON.parse(saved).name,'서울 마포구');assert.equal(renders,1);
 p=submit('찾을 수 없는 지역');resolver(null);await p;assert.equal(JSON.parse(saved).name,'서울 마포구');assert.equal(renders,1);assert.match(elements['home-region-status'].textContent,/찾지 못/);
 p=submit('부산 해운대구');elements['home-region-clear'].click();resolver({lat:35.16,lng:129.16});await p;assert.equal(saved,null);assert.equal(vm.runInContext('homeRegion',ctx),null);assert.equal(elements['home-region-apply'].disabled,false);
 blocked=true;p=submit('서울 마포구');resolver({lat:37.56,lng:126.9});await p;assert.match(elements['home-region-status'].textContent,/저장이 차단/);assert.equal(vm.runInContext('homeRegion.name',ctx),'서울 마포구');assert.equal(ctx.readHomeRegion(),null);
 console.log('PASS: guest region validation, corrupt storage, failed lookup preservation, stale lookup after clear and blocked storage fallback');
})().catch(e=>{console.error(e);process.exitCode=1;});
