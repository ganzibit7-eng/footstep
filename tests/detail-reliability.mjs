import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {createHash} from 'node:crypto';
import {detailReliability,cardReliability,factLabel} from '../scripts/detail-reliability.mjs';
import {searchHead} from '../scripts/search-head.mjs';
import {applyPublicCounts} from '../scripts/update-public-counts.mjs';
import {createRequire} from 'node:module';const require=createRequire(import.meta.url),Search=require('../place-search.js');
test('generic pet targets are not weight evidence; exact facts and originals remain',()=>{
 const head='<article data-detail-template="editorial-v3" data-detail-kind="dining">',row='<span>견종·크기 조건</span> <strong>반려동물</strong>',original='<details class="detail-source-notes"><div>'+row+' 실내·객실 출입 이번에 대조한 공식 동반 자료</div></details>';
 const h=head+'<div class="detail-essentials">'+row+'</div><section class="detail-section" id="detail-conditions">'+row+'<p class="detail-unconfirmed">실내·객실 출입</p></section><div class="detail-source-links"><a href="https://example.com">이번에 대조한 공식 동반 자료</a></div>'+original;
 const n=detailReliability(h);assert(n.includes('<span>동반 대상</span> <strong>반려동물</strong>'));assert(n.includes(original));assert(n.includes('실내 출입 범위'));assert(n.includes('>동반 안내 원문</a>'));assert.equal(detailReliability(n),n);
 const summary=head+'<div class="detail-essentials"><p><span>견종·크기 조건</span><strong>반려동물</strong></p><p><span>구역</span><strong>전구역</strong></p></div>';
 assert(!detailReliability(summary).includes('반려동물'));assert(detailReliability(summary).includes('전구역'));
 assert.equal(factLabel({label:'견종·크기 조건',value:'10kg 이하'}),'견종·크기 조건');assert.equal(factLabel({label:'견종·크기 조건',value:'반려견'}),'동반 대상');
 const item=value=>({kind:'facilities',facts:[{label:'견종·크기 조건',value}]});
 for(const v of ['반려동물','반려견','미확인','문의','고캠핑 공식 안내: 동반 가능'])assert.equal(Search.companionKnown(item(v)),false,v);
 for(const v of ['10kg 이하','소형견','전 견종 동반 가능'])assert.equal(Search.companionKnown(item(v)),true,v);
 assert(Search.companionKnown({kind:'facilities',facts:[{label:'세부 출입 조건',value:'소형견(10kg미만)까지 가능'}]}));
 assert(!Search.companionKnown({kind:'facilities',facts:[{label:'세부 출입 조건',value:'뛰어놀 수 있는 마당이 있어 어린이와 함께하는 나들이에도 좋다. ※반려동물 동반 가능'}]}));
 assert(Search.companionKnown({kind:'facilities',facts:[{label:'세부 출입 조건',value:'마당에서는 반려견 동반도 가능하다.'}]}));
 assert.equal(Search.factLabel(item('반려동물').facts[0]),'동반 대상');
 const raw='<p>현장 확인</p><dl class="premium-card-facts"><div><dt>현장 확인</dt><dd>시설 위치·작동·수거 여부는 상세 안내를 확인해 주세요.</dd></div></dl>';
 assert(cardReliability(raw).startsWith('<p>현장 확인</p>'));assert(cardReliability(raw).includes('<dt>방문 전 확인</dt>'));
});
function fixture(){
 const source=fs.readFileSync('route-experience.js','utf8'),a=source.indexOf(' function tileFeedback('),b=source.indexOf(' const routeButton=',a);let timer,redraws=0,focused=0,events;
 const layer={on:e=>events=e,off(){},redraw(){redraws++;events.tileloadstart({tile:fresh});}},fresh={id:'fresh'},note={},retry={hidden:true,disabled:false,setAttribute(){},addEventListener(n,f){this.click=f;},removeEventListener(){}},document={activeElement:null};
 const ctx={document,setTimeout:f=>(timer=f,1),clearTimeout(){timer=null;}};vm.runInNewContext(source.slice(a,b)+';this.install=tileFeedback;',ctx);
 const dispose=ctx.install(layer,note,retry,{focus(){focused++;}});
 return {events,note,retry,fresh,document,dispose,expire:()=>timer(),get redraws(){return redraws},get focused(){return focused}};
}
test('background failure never removes the route; explicit retries ignore stale tiles and remain repeatable',()=>{
 const f=fixture(),old={};f.events.tileloadstart({tile:old});assert(f.retry.disabled);f.events.tileerror({tile:old});assert(!f.retry.hidden);assert.match(f.note.textContent,/배경 지도 일부/);
 f.retry.click();f.retry.click();assert.equal(f.redraws,1);f.events.tileload({tile:old});assert(f.retry.disabled,'old response cannot finish the new load');f.events.tileerror({tile:f.fresh});assert(!f.retry.disabled);f.retry.click();assert.equal(f.redraws,2);f.document.activeElement=f.retry;f.events.tileload({tile:f.fresh});assert(f.retry.hidden);assert.equal(f.focused,1);assert.match(f.note.textContent,/현재 화면/);f.dispose();
});
test('background timeout and offscreen errors are recoverable without a false success',()=>{
 const f=fixture(),a={};f.events.tileloadstart({tile:a});f.expire();assert(!f.retry.hidden);assert.match(f.note.textContent,/불러오지 못/);f.events.tileunload({tile:a});assert(f.retry.hidden);assert.equal(f.note.textContent,'');f.events.tileerror({tile:a});assert.equal(f.note.textContent,'');f.dispose();
});
test('home content and all search records stay intact apart from approved correction wiring and private export protection',()=>{
 const normalize=h=>h.replaceAll('\r\n','\n').replace(/experience\.css\?v=[\w-]+/g,'experience.css?v=approved-header').replace(/admin-loader\.js\?v=[\w-]+/g,'admin-loader.js?v=approved-inbox').replace(/\n*<link rel="stylesheet" href="\/correction-request\.css\?v=[\w-]+">\n*/g,'\n').replace(/<script defer src="\/correction-request\.js\?v=[\w-]+"><\/script>/g,'').replace(/<button type="button" id="course-correction-open"[^>]*>정보 정정 요청<\/button>/g,'').replace(/    \/\/ Content correction entry \(detail only\)\.[\s\S]*?    \/\/ End content correction entry\.\n/,'').replace(/  async function openNotifications\(\)\{[\s\S]*?(?=  async function shareCourse)/,'').replace(/^  let accountExportGeneration = 0;\n/m,'').replace(/^    if\(\(session\?\.user\?\.id \|\| null\)!==myDeviceId\)accountExportGeneration\+\+;\n/m,'').replace(/^    accountExportGeneration\+\+;\n/m,'').replace(/  async function exportMyData\(\)\{[\s\S]*?(?=  document.getElementById\('export-data-btn'\).addEventListener)/,'');
 // Baseline includes the approved shopping removal and home-stay photo changes. Export/session guards remain excluded.
 // Export behavior and real session invalidation are covered by private-export.cjs.
 // A hash keeps this protection valid in Actions' shallow checkout as well.
 const h=normalize(fs.readFileSync('index.html','utf8'));
 const readJSON=file=>JSON.parse(fs.readFileSync(file,'utf8'));
 const audit='docs/pet-access-full-20261111/';
 let homeBeforeAudit=h;
 for(const hotel of readJSON(audit+'amendments.json')){
  if(!hotel.oldCondition)continue;
  const pattern=new RegExp('(<article class="home-place-card" data-place-id="'+hotel.id+'">[\\s\\S]*?<p class="home-place-condition">)[^<]*(</p>)');
  homeBeforeAudit=homeBeforeAudit.replace(pattern,(_,a,b)=>a+hotel.oldCondition+b);
 }
 homeBeforeAudit=homeBeforeAudit.replace('course-info.js?v=20261111-pet-audit','course-info.js?v=20261111-walk-access').replace('place-conditions.js?v=20261111-pet-audit','place-conditions.js?v=20261105-contact').replace(/place-photos\.js\?v=(?:20261111-pet-audit|20261112-verified|20261113-venue-evidence|20261113-venue-followup)/,'place-photos.js?v=20261026-context9');
 homeBeforeAudit=homeBeforeAudit.replaceAll('hero-park.css?v=20261111-stat-solid','hero-park.css?v=20261103-route-icon').replace(/(id="hero-stat-courses">[\d,]+)곳/,(_,number)=>number+'개').replace("if(heroCourses) heroCourses.textContent = display(approvedCourseCount,'곳');","if(heroCourses) heroCourses.textContent = display(approvedCourseCount,'개');");
 homeBeforeAudit=homeBeforeAudit.replace('home-premium.css?v=20261111-footer-framing','home-premium.css?v=20261103-actions').replace(/<picture class="app-page active home-footer-scene"[\s\S]*?<\/picture>\n/,'');
 const release=readJSON('data/public-counts.json');
 const countFmt=new Intl.NumberFormat('en-US');
 homeBeforeAudit=homeBeforeAudit.replace(/<!--home-count-method:start-->[\s\S]*?<!--home-count-method:end-->/,part=>part.replaceAll(countFmt.format(release.places),'21,918').replaceAll(countFmt.format(release.facilities),'4,221'));
 homeBeforeAudit=homeBeforeAudit.replace(/window\.PawCoursePages=Object\.freeze\((\[[^\n]*?\])\);/,(_,data)=>{
  const courses=JSON.parse(data);
  const position=courses.indexOf('c433');
  assert(position>=0&&!courses.includes('c434'));
  courses.splice(position+1,0,'c434');
  return 'window.PawCoursePages=Object.freeze('+JSON.stringify(courses)+');';
 });
 const baseline=applyPublicCounts(homeBeforeAudit,{courses:412,facilities:3281,places:20978,checked:'2026-11-07'});
 const versions={'course-photos.js':'20261029-dates2','course-expansion-20261017.js':'20261020-nationwide-b','course-pet-access.js':'20261020-nationwide-b','course-addresses.js':'20261020-nationwide-b','place-photos.js':'20261026-context9'};
 const previousIds=new Set(['docs/expansion-20261111/batch.json','docs/verified-walks-20261111/batch.json'].flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8')).courses.map(c=>c.id)));
 const priorContent=baseline.replace(/window\.PawCoursePages=Object\.freeze\((\[[^\n]*?\])\);/,(_,data)=>'window.PawCoursePages=Object.freeze('+JSON.stringify(JSON.parse(data).filter(id=>!previousIds.has(id)))+');').replace(/<!--home-count-method:start-->[\s\S]*?<!--home-count-method:end-->/,part=>part.replaceAll('21,918','20,978').replaceAll('4,221','3,281').replace(release.checked,'2026-11-07'));
 const baseAssets=priorContent.replaceAll('course-info.js?v=20261111-walk-access','course-info.js?v=20261020-nationwide-b').replace(/(course-photos\.js|course-expansion-20261017\.js|course-pet-access\.js|course-addresses\.js|place-photos\.js)\?v=20261111-(?:expansion|walk-access)/g,(_,file)=>file+'?v='+versions[file]);
 assert.equal(createHash('sha256').update(baseAssets).digest('hex'),'1c89a351beff20dfca2d105ccec800d80d86086a8f8273b797d02cf5fd47ed3c','home content must stay unchanged');
 // Publication may move the existing favicon after the new stylesheet. Its adjacent
 // whitespace is not a visual home change; every other byte remains protected.
 assert.equal(normalize(searchHead(fs.readFileSync('index.html','utf8'))),h);
 const counts=JSON.parse(fs.readFileSync('data/public-counts.json','utf8'));
 const expected=counts.courses+counts.facilities+38;
 const data=require('./search-records.cjs')();assert.equal(data.length,expected);assert.equal(Search.filter(data,{}).length,expected);assert(Search.filter(data,{pet:'known'}).every(Search.companionKnown));
});
