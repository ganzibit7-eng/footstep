const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),z=require('node:zlib');
const id='pub1788410826323_292_qamulv';
const currentReview=require('../data/pet-access-review-holds-20261111.json');
const followupHolds=[...require('../docs/place-enrichment-20261113/verification.json').holds,...require('../docs/place-enrichment-followup-20261113/verification.json').holds];
test('withdrawn lodging has no public detail, discovery, sitemap, RSS or companion evidence',()=>{
 assert(!fs.existsSync('places/'+id+'/index.html'));
 for(const file of ['discover.html','sitemap.xml','rss.xml','place-evidence.js','trip-stays.json','docs/trip-stays/audit-20261022.json','with-dog/ulsan/index.html','courses/c354/index.html','courses/c357/index.html','courses/c358/index.html'])assert(!fs.readFileSync(file,'utf8').includes(id),file);
 for(const file of ['docs/expansion-20261003-batch/before-imported-places.json.gz','docs/place-enrichment-20261019c/coverage.json.gz','docs/place-enrichment-20261019c/remaining-places.csv.gz','docs/place-enrichment-20261019e/coverage.json.gz','docs/place-enrichment-20261019e/remaining-places.csv.gz','docs/place-enrichment-20261019f/matched.json.gz'])assert(!z.gunzipSync(fs.readFileSync(file)).toString('utf8').includes(id),file);
});
test('public count release matches the remaining directory and combined place total',()=>{
 const counts=JSON.parse(fs.readFileSync('data/public-counts.json')),combined=JSON.parse(fs.readFileSync('data/place-count-summary.json'));
 const data=require('./search-records.cjs')();
 const firstHolds=require('../data/place-review-holds-20261107.json').count;
 const additions=require('../docs/expansion-20261111/batch.json').places.length+require('../docs/expansion-20261112/proof.json').places.length;
 assert.equal(data.filter(p=>p.kind==='facilities').length,counts.facilities);
 assert.equal(counts.facilities,4168-firstHolds-currentReview.facilities.length+additions-followupHolds.length);
 assert.equal(counts.places,combined.facilities+combined.professionalPlaces-combined.overlap);
 assert(fs.readFileSync('pet-life/index.html','utf8').includes(counts.places.toLocaleString('ko-KR')));assert(fs.readFileSync('index.html','utf8').includes('>'+counts.places.toLocaleString('ko-KR')+'곳</span>'));
});

test('operator-withdrawn glamping has no public detail or current search entry',()=>{
 assert(!fs.existsSync('places/gocamping_8099/index.html'));
 assert(!fs.readFileSync('place-evidence.js','utf8').includes('gocamping_8099'));
 assert(!fs.readFileSync('sitemap.xml','utf8').includes('/places/gocamping_8099/'));
 assert(!require('./search-records.cjs')().some(r=>r.path==='/places/gocamping_8099/'||r.name==='글램핑로망'));
});

test('pending verification venues cannot appear in public detail, search, or sitemap',()=>{
 const hold=JSON.parse(fs.readFileSync('data/place-review-holds-20261107.json','utf8'));
 assert.equal(hold.ids.length,887);
 const protectedIds=new Set([...hold.ids,...currentReview.facilities,...followupHolds.map(row=>row.id)]),records=require('./search-records.cjs')();
 const published=new Set([...fs.readFileSync('sitemap.xml','utf8').matchAll(/<loc>https:\/\/balzaguk\.com\/places\/([A-Za-z0-9_-]+)\/<\/loc>/g)].map(m=>m[1]));
 for(const row of records){const m=row.path.match(/^\/places\/([A-Za-z0-9_-]+)\/$/);if(m)assert(!protectedIds.has(m[1]),row.path);}
 for(const id of protectedIds){assert(!fs.existsSync('places/'+id+'/index.html'),id);assert(!published.has(id),id);}
 for(const id of hold.retained_official_evidence_ids)if(!protectedIds.has(id))assert(fs.existsSync('places/'+id+'/index.html'),id+' must remain published');
});


test('only the active immutable search snapshots remain publicly readable',()=>{
 const html=fs.readFileSync('discover.html','utf8'),manifest=JSON.parse(html.match(/id="place-data">([\s\S]*?)<\/script>/)[1]);
 const active=new Set(['discover.json',manifest.src.split('/').at(-1),...manifest.parts.map(p=>p.src.split('/').at(-1))]);
 const snapshots=fs.readdirSync('assets/search-data').filter(name=>/^(?:discover|part)-[a-f0-9]{16}\.json$/.test(name));
 assert.equal(snapshots.length,active.size-1);
 for(const name of snapshots)assert(active.has(name),'unreferenced search snapshot '+name);
});
