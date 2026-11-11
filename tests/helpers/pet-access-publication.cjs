const {existsSync,readFileSync}=require('node:fs');
const assert=require('node:assert/strict');
const review=require('../../data/pet-access-review-holds-20261111.json');
const held={
 courses:new Set(review.courses),
 places:new Set(review.facilities)
};

module.exports=function readPublicDetail(folder,id){
 const file=folder+'/'+id+'/index.html';
 if(held[folder].has(id)){
  assert(!existsSync(file),file+' is on hold');
  return '';
 }
 return readFileSync(file,'utf8');
};
