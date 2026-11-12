const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync, existsSync} = require('node:fs');
const {createHash} = require('node:crypto');
const review = require('../docs/place-enrichment-followup-20261113/verification.json');
const original = require('../docs/expansion-20261112/proof.json');
const previous = require('../docs/place-enrichment-20261113/verification.json');
const photos = require('../place-photos.js');
const conditions = require('../place-conditions.js');
const evidence = require('../place-evidence.js');
const index = new Map(require('./search-records.cjs')().map(row => [row.path,row]));
const registry = new Map(JSON.parse(readFileSync('place-evidence.js','utf8').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]).map(row => [row.id,row]));
const excluded = new Set([...original.photos,...previous.photos,...previous.holds].map(row => row.id));
const scoped = new Set(original.places.filter(row => !excluded.has(row.id)).map(row => row.id));
const detail = id => 'places/'+id+'/index.html';
const escape = str => str.replaceAll('&','&amp;');

test('the second photo review preserves the original files and distinguishes general interiors from the allowed pet zone', () => {
 assert.equal(scoped.size,review.photoCohort);
 assert.equal(scoped.size,review.openLicenseSearches);
 for (const record of review.photos) {
  const venue = registry.get(record.id);
  assert(scoped.has(record.id));
  assert.equal(index.get('/places/'+record.id+'/')?.photo?.src,record.photos[0].asset.src);
  const actual = [photos.get(venue),...photos.gallery(venue)];
  const html = readFileSync(detail(record.id),'utf8');
  for (const [i,{asset,rights}] of record.photos.entries()) {
   assert.equal(actual[i].src,asset.src);
   assert.equal(String(rights.contentId),record.contentId);
   assert.equal(rights.cpyrhtDivCd,'Type3');
   assert.equal(asset.licenseUrl,'https://www.data.go.kr/data/15101753/openapi.do');
   assert.equal(asset.original,rights.originimgurl.replace(/^http:/,'https:'));
   assert.equal(createHash('sha256').update(readFileSync('.'+asset.src)).digest('hex'),asset.sha256);
   assert(asset.noCrop && html.includes(asset.src));
  }
  assert(html.includes('공공누리 제3유형') && html.includes('1층 실내 펫존'));
 }
});

test('venue operator rules and confirmed no-pet locations are reflected across public views', () => {
 const xml = readFileSync('sitemap.xml','utf8');
 for (const {id,pet,source} of review.conditions) {
  assert(scoped.has(id));
  const venue = registry.get(id);
  assert.deepEqual(evidence.conditions(venue),pet,id);
  assert.equal(evidence.conditions({...venue,address:venue.address+' 별관'}),null,id);
  assert.equal(conditions.source(venue),source,id);
  const html = readFileSync(detail(id),'utf8');
  assert(html.includes(escape(source)),id);
  for (const text of Object.values(pet)) assert(html.includes(escape(text)),id+' '+text);
 }
 for (const {id,source} of review.holds) {
  assert(scoped.has(id));
  assert.match(source,/^https:\/\/camfit\.co\.kr\/camp\//);
  assert(!index.has('/places/'+id+'/'));
  assert(!existsSync(detail(id)));
  assert(!xml.includes('/places/'+id+'/'));
 }
});
