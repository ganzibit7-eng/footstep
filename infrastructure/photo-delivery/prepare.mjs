import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {validateManifest} from './policy.mjs';
import {readPhoto} from './files.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..');
const manifest=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const {bytes}=validateManifest(manifest);
const photos={};
for(const p of manifest.objects){
 if(!p.remoteOnly){const buffer=readPhoto(root,p);
 if(buffer.length!==p.bytes||crypto.createHash('sha256').update(buffer).digest('hex')!==p.sha256)throw Error('Local image changed: '+p.key);}
 photos[p.key]={bytes:p.bytes,sha256:p.sha256,type:p.contentType};
}
fs.writeFileSync(path.join(here,'allowlist.mjs'),'export const photos='+JSON.stringify(photos)+';\n');
console.log(JSON.stringify({verifiedObjects:manifest.objects.length,bytes,state:'prepared-not-deployed'}));
