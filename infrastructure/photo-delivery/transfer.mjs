import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {validateManifest,planUpload,reserve} from './policy.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const [mode,manifestPath]=process.argv.slice(2);
if(!['--upload','--verify'].includes(mode)||!manifestPath)throw Error('Use --upload or --verify followed by a verified manifest');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));validateManifest(manifest);
// Verify every local file before the first remote request or mutation.
for(const p of manifest.objects){const b=fs.readFileSync(path.join(root,p.key));if(b.length!==p.bytes||crypto.createHash('sha256').update(b).digest('hex')!==p.sha256)throw Error('Local file changed: '+p.key);}
const account=process.env.CLOUDFLARE_ACCOUNT_ID,bucket='balzaguk-place-photos';
if(!/^[a-f0-9]{32}$/.test(account||'')||!process.env.AWS_ACCESS_KEY_ID||!process.env.AWS_SECRET_ACCESS_KEY)throw Error('Scoped R2 credentials required; never put keys in the site or manifest');
const dir=path.join(root,'.photo-storage-work');fs.mkdirSync(dir,{recursive:true});
const lock=path.join(dir,'transfer.lock'),handle=fs.openSync(lock,'wx');fs.writeFileSync(handle,String(process.pid));
try{
 const {S3Client,ListObjectsV2Command,HeadObjectCommand,PutObjectCommand,GetObjectCommand}=await import('@aws-sdk/client-s3');
 const client=new S3Client({region:'auto',endpoint:`https://${account}.r2.cloudflarestorage.com`,maxAttempts:1,credentials:{accessKeyId:process.env.AWS_ACCESS_KEY_ID,secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY}});
 const month=new Date().toISOString().slice(0,7),ledgerFile=path.join(dir,`${account}-${bucket}-${month}.json`);
 let ledger={classA:0,classB:0};if(fs.existsSync(ledgerFile))ledger=JSON.parse(fs.readFileSync(ledgerFile,'utf8'));
 const send=async(command,kind)=>{if(new Date().toISOString().slice(0,7)!==month)throw Error('UTC month changed; restart transfer');reserve(ledger,kind);fs.writeFileSync(ledgerFile,JSON.stringify(ledger));return client.send(command);};
 const inventory=[];let token;
 do{const page=await send(new ListObjectsV2Command({Bucket:bucket,MaxKeys:1000,ContinuationToken:token}),'A');inventory.push(...page.Contents||[]);if(inventory.length>10_000)throw Error('Object budget exceeded');if(page.IsTruncated&&!page.NextContinuationToken)throw Error('Incomplete inventory');token=page.IsTruncated?page.NextContinuationToken:undefined;}while(token);
 const plan=planUpload(manifest,inventory);let completed=0,cursor=0,failed;
 const receiptFile=path.join(dir,'verified-'+crypto.createHash('sha256').update(account+bucket+JSON.stringify(manifest.objects)).digest('hex')+'.json');
 const receipt=fs.existsSync(receiptFile)?JSON.parse(fs.readFileSync(receiptFile,'utf8')):{verified:{}};
 const results=await Promise.allSettled(Array.from({length:4},async()=>{while(cursor<manifest.objects.length&&!failed){
  const p=manifest.objects[cursor++];try{
  const existing=inventory.find(x=>x.Key===p.key);
  if(mode==='--upload'){
   if(existing){const head=await send(new HeadObjectCommand({Bucket:bucket,Key:p.key}),'B');if(head.ContentLength!==p.bytes||head.Metadata?.sha256!==p.sha256)throw Error('Existing key differs; refusing to overwrite: '+p.key);}
   else{const body=fs.readFileSync(path.join(root,p.key));await send(new PutObjectCommand({Bucket:bucket,Key:p.key,Body:body,ContentLength:p.bytes,ContentType:p.contentType,CacheControl:'public, max-age=86400',Metadata:{sha256:p.sha256},StorageClass:'STANDARD',IfNoneMatch:'*'}),'A');}
  }else{
   const prior=receipt.verified[p.key];
   if(!prior||prior.sha256!==p.sha256||!existing?.ETag||prior.etag!==existing.ETag||existing.Size!==p.bytes){
    const result=await send(new GetObjectCommand({Bucket:bucket,Key:p.key}),'B');const buffer=await result.Body.transformToByteArray();
    if(buffer.length!==p.bytes||crypto.createHash('sha256').update(buffer).digest('hex')!==p.sha256||result.ContentType!==p.contentType||result.Metadata?.sha256!==p.sha256)throw Error('Remote image verification failed: '+p.key);
    receipt.verified[p.key]={sha256:p.sha256,bytes:p.bytes,etag:result.ETag,checked:new Date().toISOString()};
    fs.writeFileSync(receiptFile,JSON.stringify(receipt));
   }
  }
  completed++;if(completed%100===0)console.log(JSON.stringify({mode,completed,total:manifest.objects.length}));
  }catch(error){failed=error;throw error;}
 }}));
 if(failed)throw failed;
 if(results.some(r=>r.status==='rejected'))throw Error('Incomplete transfer');
 receipt.completedAt=new Date().toISOString();receipt.objects=completed;receipt.bytes=plan.projectedBytes;if(mode==='--verify')fs.writeFileSync(receiptFile,JSON.stringify(receipt));
 console.log(JSON.stringify({mode,completed,projectedBytes:plan.projectedBytes,operations:ledger}));
}finally{fs.closeSync(handle);fs.unlinkSync(lock);}
