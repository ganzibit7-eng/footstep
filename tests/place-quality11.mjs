import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {curationEvidence,selectCurated,curationSection} from '../scripts/place-curation.mjs';
import {verifiedRoute} from '../scripts/detail-editorial.mjs';
const evidence=JSON.parse(readFileSync('place-evidence.js','utf8').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]);

test('curation only uses identity-bound pet facts, reusable real photos and recent source dates',()=>{
 const now=Date.parse('2026-10-27T00:00:00Z'),selected=selectCurated(evidence,{limit:10000,now});
 assert(selected.length>50);
 for(const row of selected){
  assert(row.eligible);assert(row.facts.length>=2);assert(['Type1','Type3'].includes(row.photo.rightsType));
  assert(row.photo.width>=600&&row.photo.height>=400);assert(row.photo.source&&row.photo.licenseUrl);
  assert(!curationEvidence({...row.item,name:row.item.name+' 다른 장소'},{now}).eligible,'wrong name');
  assert(!curationEvidence({...row.item,description:'다른 원문'},{now}).eligible,'unbound policy');
 }
 const r=selected[0].item,before=JSON.stringify(r);assert(!curationEvidence(r,{now:Date.parse('2028-01-01')}).eligible);assert(!curationEvidence(r,{now:Date.parse('2025-01-01')}).eligible);assert.equal(JSON.stringify(r),before);
 const conflict=evidence.find(r=>r.caution&&r.pet);assert(conflict);assert(!curationEvidence(conflict,{now}).eligible);
 console.log('Eligible evidence records (not published venues):',selected.length);
});

test('curation adds a bounded separate shelf, preserves photo rights and never fills an ineligible region',()=>{
 const type={table:'facilities',folder:'places'},selected=selectCurated(evidence,{limit:4});assert.equal(curationSection([],type),'');assert.equal(curationSection(evidence,{table:'courses'}),'');
 const html=curationSection(selected.map(r=>r.item),type);assert.equal((html.match(/data-curation-item=/g)||[]).length,3);assert(html.includes('현장 검증이 아닙니다'));assert(html.includes('전체 목록'));
 for(const r of selected.slice(0,3)){assert(html.includes(r.item.id));assert(html.includes(r.photo.source.replaceAll('&','&amp;')));assert(html.includes(r.photo.licenseUrl.replaceAll('&','&amp;')));}
 assert.equal(selectCurated([selected[0].item,selected[0].item],{limit:3}).length,1);
});

test('all generated detail types use the shared overview while course evidence and preparation stay explicit',()=>{
 let total=0,photos=0,information=0,professional=0,gpx=0,proposal=0,location=0;
 for(const folder of ['places','courses','bins','pet-care/places'])for(const dir of readdirSync(folder,{withFileTypes:true})){
  const file=folder+'/'+dir.name+'/index.html';if(!dir.isDirectory()||!existsSync(file))continue;
  const h=readFileSync(file,'utf8');if(!h.includes('data-detail-template="editorial-v3"'))continue;total++;
  assert.equal((h.match(/data-detail-experience="quality11"/g)||[]).length,1,file);
  if(h.includes('data-detail-kind="professional"')){professional++;assert(h.includes('detail-contact-actions'));continue;}
  const lead=h.slice(h.indexOf('data-detail-experience="quality11"'),h.indexOf('<nav class="detail-sections"'));
  assert(lead.includes('detail-overview'),file);
  if(lead.includes('<img '))photos++;else information++;
  if(folder==='courses'){
   assert(lead.includes('?ref=walk&amp;course='+encodeURIComponent(dir.name)+'&amp;prepare=walk#walk'),file);
   if(verifiedRoute(dir.name,h))gpx++;else{assert(!h.includes('id="detail-route-data"'));assert(h.includes('정확한 경로 미확인'));h.includes('제안 경로 안내')?proposal++:location++;}
  }
 }
 assert.equal(total,22317);assert(photos>100);assert(information>0);assert(professional>17000);assert.deepEqual({gpx,proposal,location},{gpx:55,proposal:30,location:327});console.log('Experience coverage',{total,photos,information,professional,gpx,proposal,location});
});

test('ordinary catalogue and discover records stay complete; new preparation entry cannot start GPS',()=>{
 const cafes=readFileSync('places/cafes/index.html','utf8');assert(cafes.includes('data-place-curation="quality11"'));assert(cafes.includes('id="hub-results"'));assert(cafes.includes('전체 1,713곳'));
 const directory=readFileSync('discover.html','utf8');assert(directory.includes('data-directory-curation'));assert(directory.includes('id="place-results"'));
 const home=readFileSync('index.html','utf8'),handler=home.slice(home.indexOf("if(sharedCourseId && allCourses().some"),home.indexOf('} else if(sharedFacilityId)'));
 assert(handler.includes("params.get('prepare')==='walk'"));assert(handler.includes('prepareCourseWalk(sharedCourseId)'));assert(!/startWalk|watchPosition|getCurrentPosition/.test(handler));
});
