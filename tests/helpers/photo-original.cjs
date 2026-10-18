const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');let receipt;
module.exports=function verifyOriginal(photo){
 const file=path.join(root,photo.src);
 if(fs.existsSync(file)){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),photo.sha256);return;}
 receipt??=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'docs/photo-storage-20261018/verified-objects.json.gz'))));
 const proof=receipt.verified[photo.src.replace(/^\//,'')];
 assert(proof,'Missing remote verification for '+photo.src);assert.equal(proof.sha256,photo.sha256);assert.equal(proof.bytes,photo.bytes);assert(proof.checked&&proof.etag);assert(receipt.completedAt);
};
