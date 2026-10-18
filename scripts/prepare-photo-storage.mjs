// Prepare a byte-verified transfer list. This does not upload, delete or rewrite URLs.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import zlib from 'node:zlib';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=process.argv[2];
if(!output)throw Error('Provide an output manifest path outside the repository.');
const target=path.resolve(output),relative=path.relative(root,target);
if(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative))throw Error('Keep the transfer manifest outside the public repository.');
const source=fs.readFileSync(path.join(root,'place-evidence.js'),'utf8');
const records=JSON.parse(source.match(/const records=(\[[\s\S]*?\]);\r?\n/)[1]);
const objects=new Map();
let receipt;
for(const record of records)for(const photo of [record.photo,...record.gallery||[]].filter(Boolean)){
 if(!/^\/assets\/place-photos\/kto-\d+(?:-[a-f0-9]{12})?\.(?:jpg|png)$/.test(photo.src))throw Error('Unexpected photo path');
 let object=objects.get(photo.src);
 if(!object){
  const local=path.join(root,photo.src);let bytes,sha256,remoteOnly=false;
  if(fs.existsSync(local)){const buffer=fs.readFileSync(local);bytes=buffer.length;sha256=crypto.createHash('sha256').update(buffer).digest('hex');}
  else{receipt??=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'docs/photo-storage-20261018/verified-objects.json.gz'))));const proof=receipt.verified[photo.src.slice(1)];if(!receipt.completedAt||!proof||proof.sha256!==photo.sha256||proof.bytes!==photo.bytes)throw Error('Remote verification missing: '+photo.src);bytes=proof.bytes;sha256=proof.sha256;remoteOnly=true;}
  if(sha256!==photo.sha256)throw Error('Photo has changed: '+photo.src);
  object={key:photo.src.slice(1),bytes,sha256,contentType:photo.src.endsWith('.png')?'image/png':'image/jpeg',evidence:[],places:[],...(remoteOnly?{remoteOnly:true}:{})};
  objects.set(photo.src,object);
 }
 object.places.push({id:record.id,name:record.name});
 if(!object.evidence.some(e=>e.original===photo.original))object.evidence.push({original:photo.original,source:photo.source,author:photo.author,license:photo.license,licenseUrl:photo.licenseUrl,noCrop:photo.noCrop,width:photo.width,height:photo.height,dateNote:photo.dateNote,changes:photo.changes});
}
const list=[...objects.values()].sort((a,b)=>a.key.localeCompare(b.key));
const manifest={version:1,generatedAt:new Date().toISOString(),state:'prepared-not-uploaded',summary:{objects:list.length,bytes:list.reduce((n,p)=>n+p.bytes,0),photoBindings:records.reduce((n,r)=>n+(r.photo?1:0)+(r.gallery?.length||0),0)},objects:list};
fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest.summary));
