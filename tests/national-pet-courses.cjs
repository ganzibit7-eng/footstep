const assert=require('node:assert/strict');
const fs=require('node:fs');const crypto=require('node:crypto');
const batch=require('../docs/course-expansion-20261012/manifest.json');
const pet=require('../course-pet-access');const photos=require('../course-photos');
const addresses=require('../course-addresses');const info=require('../course-info');
assert.equal(batch.courses.length,8);assert.equal(batch.photos.length,7);
for(const c of batch.courses){
 assert.equal(c.path,null);assert.equal(c.diff,'미확인');assert(c.addressPoint.includes('출발점 미확인'));
 assert(pet.get(c));assert.equal(pet.get({...c,name:'다른 장소'}),null);
 assert.equal(pet.get({...c,lat:c.lat+1}),null);assert.equal(pet.get({...c,path:[[c.lat,c.lng]]}),null);
 assert.equal(pet.get({...c,description:'출처 미확인'}),null);
 assert(photos.get(c));assert(addresses.get(c).point.includes('대표 위치'));assert.equal(info.sourceURL(c.description),c.source);
 if(!c.id.startsWith('pet_20261012_haeundae')&&!['pet_20261012_dadaepo','pet_20261012_riverside','pet_20261012_citizens'].includes(c.id))assert.equal(c.distance,'미확인');
}
const hallim=batch.courses.find(c=>c.id.endsWith('hallim'));assert(hallim.name.includes('7kg 이하'));assert(hallim.description.includes('7kg'));
for(const p of batch.photos){const bytes=fs.readFileSync(require('node:path').join(__dirname,'..',p.src));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),p.assetSha256);assert.equal(bytes.toString('ascii',8,12),'WEBP');assert(p.source.startsWith('https://commons.wikimedia.org/wiki/'));assert(/^CC BY/.test(p.license));assert(p.width>0&&p.height>0);}
console.log('8 evidence-bound courses, 7 licensed photographs, unknown routes and weight restriction verified');
