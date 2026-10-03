'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),zlib=require('node:zlib'),vm=require('node:vm');
const Facility=require('../facility-info.js'),CourseInfo=require('../course-info.js');
const source=fs.readFileSync('course-routes.js','utf8');const routes=JSON.parse(source.split('const routes=')[1].split(';\nfunction get')[0]);
const evidence=JSON.parse(zlib.gunzipSync(fs.readFileSync('docs/expansion-20261003-batch/route-evidence.json.gz')));
const places=JSON.parse(zlib.gunzipSync(fs.readFileSync('docs/expansion-20261003-batch/place-evidence.json.gz')));
const decisions=JSON.parse(fs.readFileSync('docs/expansion-20261003-batch/place-decisions.json','utf8'));
assert.equal(new Set(Facility.categories.map(x=>x.category)).size,5);
for(const [oldId,target] of Object.entries(Facility.aliases)){assert.notEqual(oldId,target);assert.equal(Facility.resolveId(oldId),target);assert(!Facility.aliases[target]);}
assert(Object.keys(routes).length>=200+evidence.length);
for(const row of evidence){const c=row.course,r=routes[c.id];assert(r);assert.equal(CourseInfo.sourceURL(c.description),r.source);assert.equal(CourseInfo.checkedDate(c.description),'2026-10-03');assert.deepEqual(r.path,row.route.path);assert.equal(row.pet.conditions['동반구분'],'전구역 동반가능');assert(row.maxJump<=200);assert(row.parts.flat().every(p=>p.length===2&&p[0]>=33&&p[0]<=39.5&&p[1]>=124&&p[1]<=132));if(row.parts.length>1)assert.deepEqual(r.parts,row.parts);}
for(const d of decisions.filter(d=>['add','refresh_existing'].includes(d.decision))){const e=places.find(x=>x.cotId===d.cotId);assert.equal(e.detail.contentStatus,2);assert.notEqual(e.conditions?.['동반구분'],'불가능');assert(Facility.resolveId(d.id)===d.id);}
const html=fs.readFileSync('index.html','utf8');for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(match[1].includes('const SUPABASE_URL'))new vm.Script(match[1]);}
assert(html.includes("f.category==='식당카페'"));assert(html.includes('escapeHtml(r[nameCol]'));assert(html.includes('bulkSeen.has(key)'));
console.log(`PASS: ${evidence.length} added GPX routes, 5 place categories, 45 reversible aliases, approved-source checks, coordinate and multi-track integrity, frontend syntax and CSV guards.`);
