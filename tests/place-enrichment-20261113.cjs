const test = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync, existsSync} = require('node:fs');
const {createHash} = require('node:crypto');
const reviewed = require('../docs/place-enrichment-20261113/verification.json');
const cohort = require('../docs/expansion-20261112/proof.json');
const conditions = require('../place-conditions.js');
const photos = require('../place-photos.js');
const evidence = require('../place-evidence.js');
const published = new Map(require('./search-records.cjs')().map(row => [row.path, row]));
const registry = new Map(JSON.parse(readFileSync('place-evidence.js','utf8').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]).map(row => [row.id, row]));
const cohortIds = new Set(cohort.places.map(row => row.id));
const detail = id => 'places/' + id + '/index.html';
const escape = value => value.replaceAll('&','&amp;');

test('operator conditions are bound to the original public place and printed with the source', () => {
 for (const {id, pet, source} of reviewed.conditions) {
  const venue = registry.get(id);
  assert(cohortIds.has(id) && published.has('/places/' + id + '/'), id);
  assert.deepEqual(evidence.conditions(venue), pet, id);
  assert.equal(evidence.conditions({...venue, description:venue.description+' 변경'}), null);
  assert.equal(evidence.conditions({...venue, address:venue.address+' 다른 지점'}), null);
  assert.equal(conditions.source(venue), source);
  const html = readFileSync(detail(id), 'utf8');
  assert(html.includes(escape(source)), id);
  for (const field of ['acmpyPsblCpam', 'etcAcmpyInfo', 'acmpyNeedMtr']) {
   if (pet[field]) assert(html.includes(escape(pet[field])), id + ' ' + field);
  }
 }
});

test('new photo originals preserve the official image-level license in detail and search', () => {
 for (const row of reviewed.photos) {
  assert(cohortIds.has(row.id), row.id);
  const place = registry.get(row.id);
  const displayed = [photos.get(place), ...photos.gallery(place)];
  const html = readFileSync(detail(row.id), 'utf8');
  assert.equal(published.get('/places/'+row.id+'/')?.photo?.src, displayed[0].src);
  for (const [i, {asset, rights}] of row.photos.entries()) {
   assert.equal(displayed[i].src, asset.src);
   assert.equal(rights.cpyrhtDivCd, 'Type3');
   assert.equal(rights.originimgurl.replace(/^http:/,'https:'), asset.original);
   assert.equal(createHash('sha256').update(readFileSync('.'+asset.src)).digest('hex'), asset.sha256);
   assert(html.includes(asset.src) && html.includes('공공누리 제3유형'), row.id);
  }
 }
});

test('temporarily closed and unconfirmed venues are absent from public details and search', () => {
 const sitemap = readFileSync('sitemap.xml', 'utf8');
 for (const {id, source} of reviewed.holds) {
  assert(cohortIds.has(id));
  assert.match(source, /^https:\/\/gocamping\.or\.kr\//);
  assert(!published.has('/places/'+id+'/'), id);
  assert(!existsSync(detail(id)), id);
  assert(!sitemap.includes('/places/'+id+'/'), id);
 }
});
