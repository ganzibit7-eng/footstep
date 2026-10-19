const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),z=require('node:zlib'),path=require('node:path');
const root=path.resolve(__dirname,'..'),E=require('../place-evidence.js'),P=require('../place-photos.js');
const records=JSON.parse(fs.readFileSync(path.join(root,'place-evidence.js'),'utf8').match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]);
const removed=JSON.parse(z.gunzipSync(fs.readFileSync(path.join(root,'docs/place-enrichment-20261019c/removed.json.gz')))),blocked=new Set(removed.map(x=>x.photo.sha256));
const catalogue=JSON.parse(z.gunzipSync(fs.readFileSync(path.join(root,'docs/place-enrichment-20261019c/rights-catalogue.json.gz')))),restrictedResources=new Set(catalogue.filter(x=>['Type2','Type4'].includes(x.type)).map(x=>x.resource));
test('individually restricted pictures are absent from registry and home cards',()=>{
 const home=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const r of records)for(const p of [r.photo,...r.gallery||[]].filter(Boolean)){assert(!blocked.has(p.sha256),r.name);const resource=p.original.match(/\/(\d+)_image[23]_1\./i)?.[1];if(resource)assert(!restrictedResources.has(resource),r.name+' restricted resource');assert(!['Type2','Type4'].includes(p.rightsType));}for(const row of removed)assert(!home.includes(row.photo.src),row.name);assert.equal(removed.length,94);
});
test('renderer refuses a restricted photo even if later imported accidentally',()=>{
 const r=records.find(x=>x.photo&&x.gallery?.length),stored=E.get(r),primary=stored.photo.rightsType,extra=stored.gallery[0].rightsType,before=P.gallery(r).length;try{stored.photo.rightsType='Type4';stored.gallery[0].rightsType='Type2';assert.equal(P.get(r),null);assert.equal(P.gallery(r).length,before-1);assert(!P.figure(r).includes(stored.photo.src));}finally{if(primary===undefined)delete stored.photo.rightsType;else stored.photo.rightsType=primary;if(extra===undefined)delete stored.gallery[0].rightsType;else stored.gallery[0].rightsType=extra;}
});
test('same-place course photographs preserve their existing open licence and credited source',()=>{
 const verify=require('./helpers/place-photo-source.cjs');let n=0;for(const r of records)for(const p of [r.photo,...r.gallery||[]].filter(Boolean))if(p.photoKind==='shared-course-photo'){verify(p);assert(P.credit(p).includes(p.author));assert(P.credit(p).includes(p.licenseUrl));n++;}assert.equal(n,13);
});
