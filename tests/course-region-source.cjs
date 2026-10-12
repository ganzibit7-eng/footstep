const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../scripts/generate-seo.mjs'),'utf8');const ctx={compact:s=>String(s||'').replace(/\s+/g,' ').trim(),CourseInfo:require('../course-info'),BinInfo:{get:()=>null}};vm.createContext(ctx);
vm.runInContext(source.slice(source.indexOf('const REGIONS ='),source.indexOf('const coordinateMetroRegion'))+'\nthis.regionFor=regionFor;',ctx);
const expected={경남:'gyeongnam',충남:'chungnam',전남:'jeonnam',경기:'gyeonggi',강원:'gangwon',경북:'gyeongbuk',제주:'jeju',울산:'ulsan'};
for(const c of require('../docs/course-expansion-20261012b/manifest.json').courses)assert.equal(ctx.regionFor(c)?.[0],expected[c.tags[0]],c.name);
assert.equal(ctx.regionFor({address:'부산광역시 해운대구',tags:['서울']})?.[0],'busan','Known official address wins');
assert.equal(ctx.regionFor({address:'분류되지 않은 주소',tags:['애견동반']}),undefined,'Do not guess a region');
console.log('PASS: official-address priority, explicit regional-tag fallback, 13 new region assignments and unknown address exclusion');
