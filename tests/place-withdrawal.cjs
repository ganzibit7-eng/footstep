const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),z=require('node:zlib');
const id='pub1788410826323_292_qamulv';
test('withdrawn lodging has no public detail, discovery, sitemap, RSS or companion evidence',()=>{
 assert(!fs.existsSync('places/'+id+'/index.html'));
 for(const file of ['discover.html','sitemap.xml','rss.xml','place-evidence.js','trip-stays.json','docs/trip-stays/audit-20261022.json','with-dog/ulsan/index.html','courses/c354/index.html','courses/c357/index.html','courses/c358/index.html'])assert(!fs.readFileSync(file,'utf8').includes(id),file);
 for(const file of ['docs/expansion-20261003-batch/before-imported-places.json.gz','docs/place-enrichment-20261019c/coverage.json.gz','docs/place-enrichment-20261019c/remaining-places.csv.gz','docs/place-enrichment-20261019e/coverage.json.gz','docs/place-enrichment-20261019e/remaining-places.csv.gz','docs/place-enrichment-20261019f/matched.json.gz'])assert(!z.gunzipSync(fs.readFileSync(file)).toString('utf8').includes(id),file);
});
test('public count release matches the remaining directory and combined place total',()=>{
 const counts=JSON.parse(fs.readFileSync('data/public-counts.json')),combined=JSON.parse(fs.readFileSync('data/place-count-summary.json'));
 const data=require('./search-records.cjs')();
 assert.equal(data.filter(p=>p.kind==='facilities').length,counts.facilities);assert.equal(counts.facilities,4169);assert.equal(counts.places,21864);assert.equal(counts.places,combined.facilities+combined.professionalPlaces-combined.overlap);
 assert(fs.readFileSync('pet-life/index.html','utf8').includes('21,864'));assert(fs.readFileSync('index.html','utf8').includes('>21,864곳</a>'));
});
