import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {professionalRegionDescription,professionalRegionSummary} from '../scripts/generate-pet-care.mjs';

const manifest=JSON.parse(readFileSync(new URL('../data/pet-care/manifest.json',import.meta.url),'utf8'));
const escape=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

test('every pet-care region gets a unique, bounded, data-backed description',()=>{
 const all=[professionalRegionDescription(null,manifest),...manifest.regions.map(r=>professionalRegionDescription(r,manifest))];
 assert.equal(manifest.regions.length,17);
 assert.equal(new Set(all).size,18);
 for(const region of manifest.regions){
  const summary=professionalRegionSummary(region,manifest);
  const description=professionalRegionDescription(region,manifest);
  assert(summary.includes(region.label));
  assert(summary.includes(region.count.toLocaleString('ko-KR')+'곳'));
  assert(summary.includes('복수 업종은 중복'));
  assert(description.length<=155);
  assert(description.includes(region.label));
  assert(!/인기순|방문해 보니|실시간 영업|무조건 영업/.test(description));
  const top=region.kinds.map((count,i)=>({count,label:manifest.kinds[i].label})).sort((a,b)=>b.count-a.count).filter(x=>x.count>0).slice(0,3);
  for(const kind of top)assert(summary.includes(kind.label+' '+kind.count.toLocaleString('ko-KR')+'곳'));
 }
 assert.equal(professionalRegionDescription(null,manifest).includes('공공 인허가 자료'),true);
 assert.throws(()=>professionalRegionSummary({...manifest.regions[0],count:-1},manifest));
});

test('generated region hubs carry matching meta, OG, visible counts and canonical',()=>{
 if(process.env.REQUIRE_GENERATED_REGION_META!=='1')return;
 for(const region of manifest.regions){
  const page=readFileSync(new URL('../pet-care/'+region.id+'/index.html',import.meta.url),'utf8');
  const description=escape(professionalRegionDescription(region,manifest));
  const summary=escape(professionalRegionSummary(region,manifest));
  assert(page.includes('<meta name="description" content="'+description+'">'),region.id);
  assert(page.includes('<meta property="og:description" content="'+description+'">'),region.id);
  assert(page.includes('data-region-evidence="'+region.id+'">'+summary+'</p>'),region.id);
  assert(page.includes('<link rel="canonical" href="https://balzaguk.com/pet-care/'+region.id+'/">'),region.id);
  assert(page.includes('id="care-form"'),region.id);
 }
 const nationwide=readFileSync(new URL('../pet-care/index.html',import.meta.url),'utf8');
 assert(nationwide.includes('<link rel="canonical" href="https://balzaguk.com/pet-care/">'));
 assert(!nationwide.includes('data-region-evidence='));
});
