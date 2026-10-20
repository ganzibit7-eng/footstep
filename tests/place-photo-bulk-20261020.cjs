const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),z=require('node:zlib');
const E=require('../place-evidence.js'),C=require('../place-conditions.js'),P=require('../place-photos.js');
const selected=JSON.parse(z.gunzipSync(fs.readFileSync('docs/place-enrichment-20261020e/selected-photos.json.gz'))),records=JSON.parse(fs.readFileSync('place-evidence.js','utf8').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]);
test('bulk photos have individual commercial-use evidence and remain distinct from permission',()=>{
 assert.equal(selected.length,71);assert.equal(new Set(selected.map(x=>x.id)).size,17);assert.equal(selected.filter(x=>x.primary).length,17);assert.equal(new Set(selected.map(x=>x.photo.sha256)).size,71);
 for(const x of selected){const r=records.find(r=>r.id===x.id);assert(r);assert.equal(r.name,x.name);assert.equal(x.officialImage.cpyrhtDivCd,x.photo.rightsType);assert(['Type1','Type3'].includes(x.photo.rightsType));assert.equal(x.officialImage.originimgurl.replace(/^http:/,'https:'),x.photo.original);assert(x.photo.placeCaption.includes('별도 확인'));assert(P.credit(x.photo).includes('현재 모습·동반 허용 구역을 보장하지 않습니다'));assert(E.get(r));require('./helpers/photo-original.cjs')(x.photo);}
 assert(!selected.some(x=>['gocamping_100274','gocamping_100276','gocamping_101077','gocamping_1057','gocamping_1163','gocamping_7543','gocamping_7664','mfds_44c9b9211ae3701b0467','pub1788410835188_557_fk0myt'].includes(x.id)));
});
test('new coastal guidance preserves every requirement and rejects changed identity',()=>{
 const r=records.find(r=>r.id==='kto_b8c86251-cc42-48e1-83e7-e7bf8a4b4bcd'),proof=JSON.parse(fs.readFileSync('docs/place-enrichment-20261020e/new-pet-source.json'));assert.deepEqual(r.pet,proof.pet);assert(proof.detail.visible);assert.equal(proof.detail.tourDb.title,r.name);const rendered=C.get(r).map(x=>x.value).join(' ');for(const word of ['목줄','입마개','배변봉투','배변처리'])assert(rendered.includes(word));assert.equal(E.conditions({...r,address:'다른 지점'}),null);assert.equal(E.conditions({...r,description:'다른 조건'}),null);
 const review=JSON.parse(fs.readFileSync('docs/place-enrichment-20261020e/deep-pet-results.json'));assert.equal(review.targets,852);assert.equal(review.found.length,0);assert.equal(review.errors.length,0);
});
