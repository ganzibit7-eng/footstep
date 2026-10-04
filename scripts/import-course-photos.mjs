// Import reviewed public photographs. Verify exact bytes before updating any registry.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import os from 'node:os';
const manifest=JSON.parse(await fs.readFile('docs/walks-300-20261004/photo-downloads.json','utf8'));
const courses=new Map(JSON.parse(await fs.readFile('docs/walks-300-20261004/manifest.json','utf8')).courses.map(c=>[c.id,c.name]));
const hosts=new Set(['upload.wikimedia.org','thumb.wikimedia.org','www.kogl.or.kr','www.gyeongju.go.kr']);
const hash=b=>createHash('sha256').update(b).digest('hex');
const pending=[];
const previous=JSON.parse(await fs.readFile('assets/course-photos/credits.json','utf8'));
for(const entry of manifest.photos){
 const p=entry.record,u=new URL(entry.url);
 if(u.protocol!=='https:'||!hosts.has(u.hostname)||u.username||u.password)throw Error('Unapproved photo URL');
 if(!/^\/assets\/course-photos\/(osm_\d+|duru_T_CRS_MNG\d+)\.(jpg|png|webp)$/.test(p.src))throw Error('Invalid asset path');
 if(!Object.entries(p.courses).every(([id,name])=>courses.get(id)===name))throw Error('Photo course name mismatch');
 if(!/^[a-f0-9]{64}$/.test(entry.sha256)||entry.bytes<100||entry.bytes>35000000)throw Error('Invalid photo checksum/size');
 if(!['CC BY-SA 4.0','CC BY-SA 3.0','CC BY-SA 2.0','CC BY 3.0','CC BY 4.0','CC0','Public domain','공공누리 제1유형','공공누리 제3유형'].includes(p.license))throw Error('Unreviewed image license');
 if(p.license==='공공누리 제3유형'&&!p.noCrop)throw Error('No-change photo must retain its ratio');
 const dest=p.src.slice(1);let bytes;
 try{bytes=await fs.readFile(dest);}catch{}
 const prior=previous.find(old=>old.src===p.src);
 if(entry.convert&&bytes&&prior?.sourceSha256===entry.sha256&&prior?.assetSha256===hash(bytes)){pending.push({dest,bytes,record:{...p,sourceSha256:entry.sha256,assetSha256:prior.assetSha256},convert:false});console.log('Verified existing:',Object.keys(p.courses).join(', '));continue;}
 if(entry.convert){bytes=undefined;}
 if(!bytes||hash(bytes)!==entry.sha256){
  for(let attempt=0;attempt<3;attempt++){
   try{const response=await fetch(entry.url,{headers:{'User-Agent':'FootstepPhotoAudit/1.0 (footstepbiz@gmail.com)'},signal:AbortSignal.timeout(60000)});if(!response.ok)throw Error('Photo HTTP '+response.status);bytes=Buffer.from(await response.arrayBuffer());if(bytes.length!==entry.bytes||hash(bytes)!==entry.sha256)throw Error('Photo content changed: '+Object.keys(p.courses).join(', '));break;}
   catch(err){if(attempt===2)throw err;await new Promise(resolve=>setTimeout(resolve,1500));}
  }
 }
 if(bytes.length!==entry.bytes||hash(bytes)!==entry.sha256)throw Error('Photo verification failed');
 if(!(bytes[0]===255&&bytes[1]===216)&&!(bytes[0]===137&&bytes.toString('ascii',1,4)==='PNG')&&bytes.toString('ascii',0,4)!=='RIFF')throw Error('Invalid image signature');
 pending.push({dest,bytes,record:{...p,sourceSha256:entry.sha256},convert:entry.convert});
 console.log('Verified:',Object.keys(p.courses).join(', '));
}
// Publish assets and records together only after every source passes verification.
const temp=await fs.mkdtemp(path.join(os.tmpdir(),'course-photos-'));
try{for(const p of pending){await fs.mkdir(path.dirname(p.dest),{recursive:true});if(p.convert){const source=path.join(temp,path.basename(p.dest));await fs.writeFile(source,p.bytes);execFileSync('python3',['scripts/convert-course-photo.py',source,p.dest,String(p.record.width),String(p.record.height)]);}else await fs.writeFile(p.dest,p.bytes);p.record.assetSha256=hash(await fs.readFile(p.dest));}}finally{await fs.rm(temp,{recursive:true,force:true});}
const records=JSON.parse(await fs.readFile('assets/course-photos/credits.json','utf8'));
for(const {record} of pending){for(const old of records){for(const id of Object.keys(record.courses))delete old.courses[id];}records.push(record);}
const result=records.filter(p=>Object.keys(p.courses).length);
await fs.writeFile('assets/course-photos/credits.json',JSON.stringify(result,null,2)+'\n');
const script=await fs.readFile('course-photos.js','utf8');
const replaced=script.replace(/const records = \[[\s\S]*?\n\];/,()=> 'const records = '+JSON.stringify(result,null,2)+';');
if(replaced===script&&!script.includes(JSON.stringify(result,null,2)))throw Error('Photo module registry marker missing');
await fs.writeFile('course-photos.js',replaced);
console.log('Imported',pending.length,'reviewed photograph records.');
