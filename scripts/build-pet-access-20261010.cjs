const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'docs/pet-access-audit-20261010');
const courses=JSON.parse(fs.existsSync('/tmp/audit-courses.json')?fs.readFileSync('/tmp/audit-courses.json'):zlib.gunzipSync(fs.readFileSync(path.join(dir,'before-courses.json.gz'))));
const review=JSON.parse(fs.readFileSync(path.join(dir,'review.json')));
const photos=JSON.parse(fs.readFileSync(path.join(root,'assets/course-photos/credits.json')));
const outdoorScopes={
 c407:'Current permission explicitly allows walking and excludes facilities; retained OSM outdoor path excludes restricted facility polygons (20261003 completion-review).',
 c408:'Current permission excludes indoor facilities; retained OSM outdoor path excludes facility polygons (20261003 completion-review).',
 c409:'Current permission excludes indoor facilities; retained OSM outdoor path excludes facility polygons (20261003 completion-review).',
 c414:'Current permission explicitly allows beach walking and prohibits entering the sea; original selected GPX follows beach walking section (20261003 batch route-evidence).',
 c433:'Named pet walking route expressly covered by KTO article 9f723f27-d2ff-4e1e-8fc6-3b19d480aaa7; retained original GPX matches lake path (20261004 route-evidence).',
 c434:'Named pet walking route covered by KTO article 6129af9e-2559-4870-a1cc-4f4bb28fc995; original course 1 GPX avoids restricted suspension bridges (20261004 route-evidence).'
};
function signature(p){let h=2166136261;for(const ch of JSON.stringify(p))h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;return String(h);}
const records={},pending=[];
for(const r of review){
 const c=courses.find(c=>c.id===r.id);
 const photo=photos.find(p=>p.courses[c.id]===c.name);
 const scope=outdoorScopes[c.id];
 const allowed=r.positive||!!scope;
 r.scopeReview=scope||null;r.hasPhoto=!!photo;r.publish=allowed&&!!photo;
 if(r.publish)records[c.id]={name:c.name,source:r.source,lat:c.lat,lng:c.lng,pathSignature:signature(c.path),checkedDate:'2026-10-10',conditions:r.conditions,scopeReview:scope||null};
 else pending.push({id:c.id,name:c.name,reason:allowed?'Reusable matching photo not secured':'Pet permission scope not currently confirmed'});
}
const code=`(function(root){'use strict';\nconst records=${JSON.stringify(records)};\nfunction signature(p){let h=2166136261;for(const ch of JSON.stringify(p))h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;return String(h);}\nfunction get(c){if(!c||(c.path!==null&&!Array.isArray(c.path))||(c.tags||[]).includes('동반 확인 필요'))return null;const r=records[c.id];if(!r||r.name!==c.name||Number(r.lat)!==Number(c.lat)||Number(r.lng)!==Number(c.lng)||r.pathSignature!==signature(c.path))return null;const source=String(c.description||c.desc||'').match(/공식안내:\\s*(https:\\/\\/\\S+)/)?.[1];return source===r.source?r:null;}\nconst api=Object.freeze({get});if(typeof module==='object'&&module.exports)module.exports=api;else root.CoursePetAccess=api;\n})(typeof globalThis!=='undefined'?globalThis:this);\n`;
fs.writeFileSync(path.join(root,'course-pet-access.js'),code);
fs.writeFileSync(path.join(dir,'review.json'),JSON.stringify(review,null,2)+'\n');
fs.writeFileSync(path.join(dir,'pending.json'),JSON.stringify(pending,null,2)+'\n');
const publicCourses=courses.filter(c=>records[c.id]);
fs.writeFileSync(path.join(dir,'public-courses.json.gz'),zlib.gzipSync(JSON.stringify(publicCourses),{level:9}));
const sql=`-- Only managed source records; preserve user-owned rows. Permission and photo audit 2026-10-10.\nWITH moved AS (UPDATE public.courses SET status='pending' WHERE status='approved' AND (owner_id IS NULL OR owner_id='') AND ('동반 확인 필요'=ANY(tags) OR id IN (${pending.map(p=>"'"+p.id+"'").join(',')})) RETURNING id) SELECT count(*) AS moved FROM moved;\n`;
fs.writeFileSync(path.join(root,'database_sql/seed_expansion_pet_access_20261010.sql'),sql);
fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({checkedDate:'2026-10-10',publicCourses:publicCourses.length,publicPhotoCoverage:publicCourses.length,petUnconfirmedHidden:468,additionalHeld:pending.length,photoPending:pending.filter(x=>x.reason.startsWith('Reusable')).length,addedPlaces:29},null,2));
console.log('Public courses with permission and photo:',publicCourses.length,'additional held:',pending.length);
