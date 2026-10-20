const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');const courses=JSON.parse(fs.readFileSync(path.join(root,'course-photos.js'),'utf8').match(/const records = (\[[\s\S]*?\]);/)[1]);
const clean=v=>String(v||'').replace(/<[^>]*>/g,' ').replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&quot;','"').replace(/\s+/g,' ').trim();
module.exports=function verifySource(p){
 assert(!['Type2','Type4'].includes(p.rightsType));
 if(p.photoKind==='commons-photo'){
  const proof=p.commonsProof,info=proof?.imageinfo?.[0],metadata=info?.extmetadata;assert(info&&metadata);assert.equal(p.commonsPageId,proof.pageid);assert.equal(p.commonsRevision,proof.lastrevid);assert.equal(p.source,info.descriptionurl);assert.equal(p.original,info.url);assert.equal(p.downloadSource,(info.thumburl||info.url).replace(/^http:/,'https:'));assert.equal(p.author,clean(metadata.Artist.value));assert.equal(p.title,proof.title.replace(/^File:/,''));assert.equal(p.license,metadata.LicenseShortName.value);assert.equal(p.licenseUrl,metadata.LicenseUrl.value.replace(/^http:/,'https:'));
  assert.match(p.license,/^(CC BY(?:-SA)? [234]\.0|CC0)$/);assert.match(p.licenseUrl,/^https:\/\/creativecommons\.org\/(?:licenses\/(?:by|by-sa)\/[234]\.0\/?|publicdomain\/zero\/1\.0\/(?:deed\.en)?)$/);assert.equal(new URL(p.source).hostname,'commons.wikimedia.org');assert.equal(new URL(p.original).hostname,'upload.wikimedia.org');assert(['upload.wikimedia.org','thumb.wikimedia.org'].includes(new URL(p.downloadSource).hostname));assert(!metadata.Restrictions?.value);assert.match(p.src,/^\/assets\/place-supplement\/commons-\d+-[a-f0-9]{12}\.(jpg|png)$/);assert(p.noCrop&&p.changes.includes('추가 편집 없음'));return;
 }
 if(p.photoKind==='shared-course-photo'){
  const original=courses.find(x=>Object.hasOwn(x.courses,p.sharedCourseId));assert(original,'existing course photo provenance');
  for(const key of ['src','source','original','author','license','licenseUrl'])assert.equal(p[key],original[key],key+' must preserve the prior source');if(original.title)assert.equal(p.title,original.title);
  assert(['CC BY-SA 3.0','CC BY-SA 4.0','공공누리 제1유형'].includes(p.license));assert(p.changes.includes(original.changes));assert(p.dateNote.includes(original.date||'미상'));assert.match(p.src,/^\/assets\/course-photos\/[A-Za-z0-9_-]+\.(webp|jpg)$/);
 }else{
  assert.match(p.src,/^\/assets\/(?:place-photos|place-supplement)\/kto-\d+(?:-[a-f0-9]{12})?\.(jpg|png|bmp)$/);
  assert.match(p.original,/^https:\/\/tong\.visitkorea\.or\.kr\/cms\/resource(?:_photo)?\//);assert.equal(p.licenseUrl,'https://www.data.go.kr/data/15101578/openapi.do');assert.match(p.dateNote,/미상/);
  if(/\.bmp$/i.test(p.src)||p.original.includes('/resource_photo/')){const z=require('node:zlib'),proof=['docs/place-enrichment-20261020e/selected-photos.json.gz','docs/nationwide-expansion-20261020/selected-photos.json.gz','docs/nationwide-expansion-20261020b/selected-photos.json.gz','docs/nationwide-expansion-20261020c/selected-photos.json.gz'].flatMap(f=>JSON.parse(z.gunzipSync(fs.readFileSync(path.join(root,f))))).find(x=>x.photo.src===p.src);assert(proof,'per-image source required for additional official formats');assert.equal(proof.officialImage.cpyrhtDivCd,p.rightsType);assert(['Type1','Type3'].includes(p.rightsType));assert.equal(proof.officialImage.originimgurl.replace(/^http:/,'https:'),p.original);assert.equal(proof.photo.sha256,p.sha256);}
 }
};
