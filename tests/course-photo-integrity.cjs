const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const photos=require('../course-photos.js');
const records=JSON.parse(fs.readFileSync(path.join(root,'assets/course-photos/credits.json')));
let count=0;
for(const record of records){
 assert(fs.existsSync(path.join(root,record.src)));
 const binary=fs.readFileSync(path.join(root,record.src));assert.equal(binary.toString('ascii',0,4),'RIFF');assert.equal(binary.toString('ascii',8,12),'WEBP');
 assert(record.width>0&&record.height>0);
 for(const [id,name] of Object.entries(record.courses)){
  const markup=photos.figure({id,name});assert(markup.includes(`width="${record.width}" height="${record.height}"`));
  assert(markup.includes(record.licenseUrl));assert(markup.includes('편집본도'));assert.equal(photos.get({id,name:'다른 코스'}),null);assert.equal(photos.figure({id:'unknown',name}), '');
  const published=fs.readFileSync(path.join(root,'courses',id,'index.html'),'utf8');assert(published.includes(markup));count++;
 }
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,code] of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){
 if(code.trim()&&!code.trim().startsWith('{')&&!code.trim().startsWith('['))new vm.Script(code);
}
function element(){return {isConnected:true,hidden:false,innerHTML:'',attrs:{},classList:{add(){},remove(){}},focus(){document.activeElement=this;},removeAttribute(k){delete this.attrs[k];},replaceChildren(){this.innerHTML='';},addEventListener(){}};}
const elements=Object.fromEntries(['photo-lightbox','photo-lightbox-img','photo-lightbox-credit','photo-lightbox-close'].map(id=>[id,element()]));
const origin=element();const document={activeElement:origin,getElementById:id=>elements[id]};
const context=vm.createContext({document,CoursePhotos:photos});
const start=html.indexOf('  let photoReturnTarget=null;'),end=html.indexOf('  const MAX_PHOTO_MB',start);vm.runInContext(html.slice(start,end),context);
context.openPhotoLightbox('/test',records[0],'남산공원 사진');assert(elements['photo-lightbox-credit'].innerHTML.includes('Toobigtokale'));assert.equal(elements['photo-lightbox-img'].alt,'남산공원 사진');assert.equal(document.activeElement,elements['photo-lightbox-close']);
context.closePhotoLightbox();assert.equal(document.activeElement,origin);assert.equal(elements['photo-lightbox-credit'].innerHTML,'');
context.openPhotoLightbox('/user');assert(elements['photo-lightbox-credit'].hidden);assert.equal(elements['photo-lightbox-credit'].innerHTML,'');
console.log(`PASS: ${count} course/image matches, dimensions, licenses, static page consistency, inline JS syntax, lightbox credit isolation and focus restoration`);
