const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),folder=path.join(root,'docs/course-expansion-20261012c');
const m=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'))),before=JSON.parse(fs.readFileSync(path.join(folder,'baseline-fingerprints.json')));
const pet=require('../course-pet-access'),photos=require('../course-photos'),addresses=require('../course-addresses'),info=require('../course-info');
const sha=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
function registry(file,key){const text=fs.readFileSync(path.join(root,file),'utf8');const found=text.match(new RegExp('const '+key+'=(\\{[^\\n]*\\});'));assert(found,file+' registry missing');return JSON.parse(found[1]);}
const petRecords=registry('course-pet-access.js','records'),addressRecords=registry('course-addresses.js','addresses'),credits=JSON.parse(fs.readFileSync(path.join(root,'assets/course-photos/credits.json')));
const oldCredits=credits.filter(p=>before.photoSources.includes(p.src));
assert.equal(oldCredits.length,before.photoCount,'earlier photo record missing or duplicated');
assert.equal(sha(oldCredits.sort((a,b)=>a.src.localeCompare(b.src))),before.photoCreditsSemanticHash,'earlier image/credit contents changed');
assert.equal(sha(Object.fromEntries(before.petIds.map(id=>[id,petRecords[id]]))),before.petRegistryHash,'earlier pet evidence changed');
assert.equal(sha(Object.fromEntries(before.addressIds.map(id=>[id,addressRecords[id]]))),before.addressRegistryHash,'earlier addresses changed');
assert.equal(before.baselineCount,226);assert.equal(new Set(m.courses.map(c=>c.id)).size,m.courses.length);assert.equal(m.courses.length,m.photos.length);assert(m.courses.length>=40);
const sources=new Set();
for(const c of m.courses){
 assert(!before.courses[c.id],'existing public id reused');assert(!sources.has(c.source),'same source place duplicated');sources.add(c.source);
 assert.equal(c.path,null);assert.equal(c.distance,'미확인');assert.equal(c.diff,'미확인');assert(c.tags.includes('산책위치안내'));assert(c.description.includes('현장 답사 결과가 아닙니다'));assert(c.description.includes('전체 경로·계단·경사·쉼터는 미확인'));
 assert.equal(c.lat,Number(c.lat.toPrecision(15)));assert.equal(c.lng,Number(c.lng.toPrecision(15)));assert.equal(info.sourceURL(c.description),c.source);assert(pet.get(c));assert.equal(petRecords[c.id].checkedDate,c.checked||m.checked);assert.equal(addressRecords[c.id].checkedDate,c.checked||m.checked);assert(photos.get(c));assert(addresses.get(c).point.includes('출발점 미확인'));
 assert.equal(pet.get({...c,name:'다른 장소'}),null);assert.equal(pet.get({...c,lat:c.lat+.001}),null);assert.equal(pet.get({...c,path:[[c.lat,c.lng]]}),null);assert.equal(pet.get({...c,description:'출처 미확인'}),null);assert.equal(pet.get({...c,tags:[...c.tags,'동반 확인 필요']}),null);
 const p=m.photos.find(x=>x.key===c.photoKey);assert(p);assert.equal(p.courses[c.id],c.name);assert.equal(photos.get(c).assetSha256,p.assetSha256);assert(p.author&&p.licenseUrl&&p.source);
 const bytes=fs.readFileSync(path.join(root,p.src));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),p.assetSha256);
 if(p.noCrop){assert.equal(bytes.readUInt16BE(0),0xffd8);assert.equal(p.assetSha256,p.sourceSha256);assert(photos.figure(c).includes('object-fit:contain'));}
 else{assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');}
 assert(p.width>=400&&p.height>=200);
 if(p.license==='공개 관광사진(출처표시·원본 유지)'){
  assert.equal(p.licenseUrl,'https://www.data.go.kr/data/15101578/openapi.do');assert(p.licenseScope.includes('사진별 세부 유형이 미표기'));assert(p.noCrop);assert.equal(p.assetSha256,p.sourceSha256);
  const data=p.publicDataRecord;assert(data.visible);assert.equal(data.useInfo.showFlag,'1');assert.equal(String(data.tourDb.contentId),p.datasetContentId);assert.equal(data.tourDb.title,p.title);assert.equal(data.tourDb.firstImage.replace(/^http:/,'https:'),p.original);
  assert.equal(new URL(p.original).hostname,'tong.visitkorea.or.kr');assert(new URL(p.original).pathname.startsWith('/cms/resource/'));assert(photos.credit(p).includes(p.licenseScope));assert(photos.cardCredit(p).includes(p.licenseScope));
 }else assert(/^(CC BY(?:-SA)? [234]\.0|CC0|Public domain|공공누리 제[13]유형)$/.test(p.license));
 if(c.operatorSource){assert.equal(pet.operatorURL(c),c.operatorSource);assert.equal(pet.operatorURL({...c,name:'다른 장소'}),'');}
 if(c.status==='approved'){const html=fs.readFileSync(path.join(root,'courses',c.id,'index.html'),'utf8');const licensedPhoto=photos.get(c);assert(html.includes(licensedPhoto.src));assert(html.replace(/\r\n/g,'\n').includes(photos.credit(licensedPhoto).replace(/\r\n/g,'\n')));assert(html.includes(`width="${licensedPhoto.width}" height="${licensedPhoto.height}"`));assert(html.includes(c.source));assert(html.includes('대표 위치 주소'));if(c.operatorSource)assert(html.includes('운영기관 이용수칙'));
  if(p.datasetContentId){const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);const place=Array.isArray(schema)?schema.find(x=>x['@type']==='Place'):schema;assert(!place.image.creator,'unknown photographer invented');}
 }
}
for(const fragment of ['8kg 이하','동물등록·맹견 제외','소형견','댐 정상','야외','낮 야외'])assert(m.courses.some(c=>c.name.includes(fragment)),fragment+' restriction missing from titles');
for(const c of m.courses)assert(!c.name.includes('장암정'),'wrong-region Jangamjeong photo slipped into batch');
assert(m.held.some(c=>c.reason.includes('봉화 장암정')));assert(m.held.some(c=>c.reason.includes('맹견 제외')));
assert.equal(m.courses.length,174);assert.equal(before.baselineCount+m.courses.length,400);
for(const text of ['인천대공원','태산패밀리파크','대전 반려동물공원']){const c=m.courses.find(c=>c.name.includes(text));assert(c.name.includes('맹견 제외'));assert(c.conditions['동반가능동물'].includes('등록'));assert(c.operatorSource);assert(!c.conditions['동반가능동물'].includes('전 견종 동반 가능'));}
console.log('PASS:',m.courses.length,'source-bound location/photo/address records; earlier metadata unchanged; unknown routes and visible restrictions; incorrect regional photo held');
