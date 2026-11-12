import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const read = path => readFileSync(path,'utf8');
const review = require('../data/pet-access-review-holds-20261111.json');
const counts = require('../data/public-counts.json');
const decisions = read('docs/pet-access-full-20261111/decisions.jsonl').trim().split('\n').map(row=>JSON.parse(row));
const laterPlaces = require('../docs/expansion-20261112/proof.json').places;
const publicResults = require('./search-records.cjs')();
const pathFor = row => '/'+(row.category==='course'?'courses':'places')+'/'+row.id+'/';

test('every reviewed course and place is accounted for across publication and search',()=>{
 assert.equal(new Set(decisions.map(row=>row.id)).size,review.reviewed.courses+review.reviewed.facilities);
 const paths = new Set(publicResults.map(row=>row.path));
 const sitemap = new Set([...read('sitemap.xml').matchAll(/<loc>https:\/\/balzaguk\.com(\/[^<]+)<\/loc>/g)].map(match=>match[1]));
 const home = read('index.html');
 const featured = new Set([...home.matchAll(/data-place-id="([^"]+)"/g)].map(match=>match[1]));
 const booking = new Set(require('../trip-stays.json').map(row=>row.id));
 for (const row of decisions) {
  const published = row.status==='keep';
  const path = pathFor(row);
  assert.equal(paths.has(path),published,row.id+' search');
  assert.equal(sitemap.has(path),published,row.id+' sitemap');
  assert.equal(existsSync('.'+path+'index.html'),published,row.id+' detail');
  if (published) {
   assert.match(row.source,/^https:\/\//,row.id+' evidence');
  } else {
   assert(!featured.has(row.id),row.id+' featured');
   assert(!booking.has(row.id),row.id+' booking');
  }
 }
 assert.deepEqual(review.courses,decisions.filter(r=>r.category==='course'&&r.status!=='keep').map(r=>r.id).sort());
 assert.deepEqual(review.facilities,decisions.filter(r=>r.category!=='course'&&r.status!=='keep').map(r=>r.id).sort());
 assert.equal(counts.courses,review.reviewed.courses-review.courses.length);
 assert.equal(counts.facilities,review.reviewed.facilities-review.facilities.length+laterPlaces.length);
});

test('reviewed hotel conditions bind to their operator evidence and current display',()=>{
 const evidence = require('../place-evidence.js');
 const amendments = require('../docs/pet-access-full-20261111/amendments.json');
 const photos = require('../place-photos.js');
 const home = read('index.html');
 for(const change of amendments) {
  const html = read('places/'+change.id+'/index.html');
  assert(html.includes(change.source.replaceAll('&','&amp;')),change.id);
  assert(!html.includes('9kg 이하')&&!html.includes('12Kg이하')&&!html.includes('10kg 이하'),change.id);
  if(change.oldCondition)assert(home.includes(change.cardCondition),change.id);
 }
 const replacement='kto_new_20261020_397938';
 assert(home.includes('data-place-id="'+replacement+'"'));
 const row=JSON.parse(read('place-evidence.js').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]).find(row=>row.id===replacement);
 assert(evidence.get(row)?.photo?.noCrop);
 assert(home.includes(photos.url(evidence.get(row).photo)));
});
