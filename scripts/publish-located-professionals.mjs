import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
export function locatedPublication(map, manifest, regions) {
 const located=map.rows.filter(r=>Number.isFinite(r[2])&&Number.isFinite(r[3]));
 const ids=new Set(located.map(r=>r[0]));
 const published={};
 const next=structuredClone(manifest);next.sourceTotal=manifest.sourceTotal||manifest.total;next.total=ids.size;next.hiddenUnlocated=next.sourceTotal-ids.size;next.visibility='located-only';next.visibilityChecked='2026-10-22';
 next.regions=next.regions.map(entry=>{const rows=regions[entry.id].rows.filter(r=>ids.has(r[0])).map(r=>{const p=map.locationEvidence?.[r[0]];if(!p)return r;const next=[...r];next[9]={...r[9],location:{address:p.address,note:p.note,source:p.source,checked:p.checked}};return next;});published[entry.id]={...regions[entry.id],rows};return {...entry,count:rows.length,kinds:manifest.kinds.map((_,i)=>rows.filter(r=>r[5].includes(i)).length)};});
 const publicIds=new Set(Object.values(published).flatMap(p=>p.rows.map(r=>r[0])));
 if(publicIds.size!==ids.size||[...ids].some(id=>!publicIds.has(id)))throw Error('Directory/map mismatch');
 return {map:{...map,rows:located,total:located.length,mapped:located.length,unmapped:0,visibility:'located-only'},manifest:next,regions:published};
}
export function publishLocated(root){
 const read=f=>JSON.parse(fs.readFileSync(path.join(root,f))),write=(f,v)=>fs.writeFileSync(path.join(root,f),JSON.stringify(v,null,2));
 const m=read('data/pet-care/manifest.json'),map=read('data/pet-care/map-index.json'),regions=Object.fromEntries(m.regions.map(r=>[r.id,read(r.file.slice(1))]));
 const result=locatedPublication(map,m,regions);
 for(const entry of result.manifest.regions){const text=JSON.stringify(result.regions[entry.id]);fs.writeFileSync(path.join(root,entry.file),text);entry.bytes=Buffer.byteLength(text);entry.sha256=createHash('sha256').update(text).digest('hex');}
 write('data/pet-care/manifest.json',result.manifest);
 const bytes=JSON.stringify(result.map);fs.writeFileSync(path.join(root,'data/pet-care/map-index.json'),bytes);
 const summary=read('docs/professional-map-20261021/summary.json');Object.assign(summary,{total:result.map.total,mapped:result.map.mapped,unmapped:0,visibility:'located-only',bytes:Buffer.byteLength(bytes),sha256:createHash('sha256').update(bytes).digest('hex'),kindCounts:result.map.kinds.map((k,i)=>({kind:k.id,total:result.map.rows.filter(r=>r[4].includes(i)).length,mapped:result.map.rows.filter(r=>r[4].includes(i)).length}))});write('docs/professional-map-20261021/summary.json',summary);
 const overlap=read('docs/life-count-20261020/overlap.json'),ids=new Set(result.map.rows.map(r=>r[0]));for(const key of ['matches','possible'])overlap[key]=overlap[key].filter(r=>ids.has(r.professionalId));
 const counts=read('data/place-count-summary.json');counts.checked='2026-10-22';counts.professionalPlaces=ids.size;counts.overlap=new Set([...overlap.matches,...overlap.possible].map(r=>r.professionalId)).size;counts.places=counts.facilities+counts.professionalPlaces-counts.overlap;counts.method='지도 위치가 확인된 공개 전문업소만 집계. 기존 동반장소와 동일 상호·시군구 중복 가능 업소는 보수적으로 제외.';write('data/place-count-summary.json',counts);Object.assign(overlap,counts);write('docs/life-count-20261020/overlap.json',overlap);
 return counts;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))console.log(publishLocated(path.resolve(import.meta.dirname,'..')));
