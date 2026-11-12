const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {readFileSync} = require('node:fs');
const test = require('node:test');
const proof = require('../docs/expansion-20261112/proof.json');
const counts = require('../data/public-counts.json');
const held = require('../data/pet-access-review-holds-20261111.json');
const registryHolds = require('../data/place-review-holds-20261107.json');
const photos = require('../place-photos.js');
const previousReview = require('../docs/place-enrichment-20261113/verification.json');
const nextReview = require('../docs/place-enrichment-followup-20261113/verification.json');
const followup = {conditions:[...previousReview.conditions,...nextReview.conditions],holds:[...previousReview.holds,...nextReview.holds],photos:[...previousReview.photos,...nextReview.photos]};

test('the verified additions have matching public details, search entries and sitemap URLs', () => {
  const indexed = new Map(require('./search-records.cjs')().map(row => [row.path, row]));
  const withheld = new Set([...held.facilities, ...registryHolds.ids]);
  const laterHolds = new Set(followup.holds.map(row => row.id));
  const laterConditions = new Set(followup.conditions.map(row => row.id));
  const sitemap = new Set([...readFileSync('sitemap.xml', 'utf8').matchAll(/<loc>https:\/\/balzaguk\.com([^<]+)<\/loc>/g)].map(match => match[1]));
  const ids = new Set();
  for (const row of proof.places) {
    assert(!ids.has(row.id) && !withheld.has(row.id), row.id);
    ids.add(row.id);
    assert(row.lat > 33 && row.lat < 39 && row.lng > 124 && row.lng < 132, row.id);
    const path = '/places/' + row.id + '/';
    if (laterHolds.has(row.id)) {
      assert(!indexed.has(path) && !sitemap.has(path), row.id);
      continue;
    }
    assert.equal(indexed.get(path)?.name, row.name, row.id);
    assert(sitemap.has(path), row.id);
    const html = readFileSync('.' + path + 'index.html', 'utf8');
    const source = row.proof.source || row.proof.registry;
    assert(html.includes(source), row.id);
    assert(html.includes('href="https://balzaguk.com' + path + '"'), row.id);
    if (row.category === '캠핑') {
      assert.equal(source, 'https://gocamping.or.kr/bsite/camp/info/read.do?c_no=' + row.id.slice('gocamping_'.length));
      assert(['가능', '소형견만 가능'].includes(row.proof.policy));
      if (row.proof.policy === '소형견만 가능' && !laterConditions.has(row.id)) assert(html.includes(row.proof.policy), row.id);
    } else {
      assert.equal(row.category, '식당카페');
      assert.equal(source, 'https://www.foodsafetykorea.go.kr/portal/petKorea.do');
      assert(row.proof.storeId && row.proof.coordinateAddress, row.id);
    }
  }
  assert.equal(counts.facilities, proof.baseline + ids.size - laterHolds.size);
});

test('new photographs remain attached to their verified place and unmodified', () => {
  const places = new Map(proof.places.map(row => [row.id, row]));
  for (const {id, photo} of proof.photos) {
    const place = places.get(id);
    assert(place && photos.get(place)?.src === photo.src, id);
    assert.equal(photos.get({...place, name: place.name + ' 다른 지점'}), null);
    assert(photo.noCrop && ['Type1', 'Type3'].includes(photo.rightsType), id);
    assert.equal(createHash('sha256').update(readFileSync('.' + photo.src)).digest('hex'), photo.sha256);
    assert(readFileSync('places/' + id + '/index.html', 'utf8').includes(photo.src), id);
  }
});
