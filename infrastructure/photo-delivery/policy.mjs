export const LIMITS=Object.freeze({bytes:8_000_000_000,objects:10_000,classA:10_000,classB:100_000});
export function validateManifest(manifest){
 if(!Array.isArray(manifest.objects)||!manifest.objects.length||manifest.objects.length>LIMITS.objects)throw Error('Invalid photo count');
 const keys=new Set();let bytes=0;
 for(const p of manifest.objects){
  if(!/^assets\/(?:place-photos|place-supplement)\/kto-\d+(?:-[a-f0-9]{12})?\.(jpg|png)$/.test(p.key)||keys.has(p.key))throw Error('Invalid or duplicate key');
  if(!/^[a-f0-9]{64}$/.test(p.sha256)||!Number.isSafeInteger(p.bytes)||p.bytes<1000||p.bytes>10_000_000)throw Error('Invalid photo metadata');
  if(p.contentType!==(p.key.endsWith('.png')?'image/png':'image/jpeg'))throw Error('Invalid photo MIME type');
  if(!p.evidence?.length||p.evidence.some(e=>!e.source||!e.original||!e.licenseUrl||!e.noCrop))throw Error('Missing source rights');
  keys.add(p.key);bytes+=p.bytes;
 }
 if(bytes>LIMITS.bytes)throw Error('Photo storage exceeds 8 GB');
 return {keys,bytes};
}
export function planUpload(manifest,inventory){
 validateManifest(manifest);
 const current=new Map();let bytes=0;
 for(const item of inventory){if(current.has(item.Key)||!Number.isSafeInteger(item.Size)||item.Size<0)throw Error('Invalid inventory');current.set(item.Key,item);bytes+=item.Size;}
 if(current.size>LIMITS.objects||bytes>LIMITS.bytes)throw Error('Current storage exceeds budget');
 const missing=manifest.objects.filter(p=>!current.has(p.key));
 const projectedBytes=bytes+missing.reduce((n,p)=>n+p.bytes,0);
 if(projectedBytes>LIMITS.bytes||current.size+missing.length>LIMITS.objects)throw Error('Upload would exceed storage budget');
 return {missing,projectedBytes};
}
export function reserve(ledger,kind){
 const key=kind==='A'?'classA':kind==='B'?'classB':null;
 if(!key||!Number.isSafeInteger(ledger[key])||ledger[key]<0)throw Error('Invalid operation ledger');
 if(ledger[key]>=LIMITS[key])throw Error('Monthly transfer operation budget reached');
 ledger[key]++;
}
