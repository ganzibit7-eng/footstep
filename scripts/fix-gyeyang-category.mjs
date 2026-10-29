// One verified identity correction. Never infer a category from a place-name suffix.
import fs from 'node:fs/promises';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';import {searchParts} from './search-partitions.mjs';
const id='kto_cbc679cc-4dae-4f9a-887c-b650912a100e',root=process.cwd();
const records=JSON.parse(await fs.readFile('assets/search-data/discover.json','utf8'));const row=records.find(r=>r.path==='/places/'+id+'/');
if(!row||row.name!=='계양산 둘레길'||!row.info.includes('계양산로 101'))throw Error('Identity mismatch');
row.info=row.info.replace(' · 쇼핑',' · 공원·관광지');
const json=JSON.stringify(records),name='discover-'+createHash('sha256').update(json).digest('hex').slice(0,16)+'.json';await fs.writeFile('assets/search-data/discover.json',json);await fs.writeFile('assets/search-data/'+name,json);
const parts=await searchParts(root,records);let hub=await fs.readFile('discover.html','utf8');hub=hub.replace(/(<script type="application\/json" id="place-data">)([\s\S]*?)(<\/script>)/,(_,a,b,c)=>{const data=JSON.parse(b);data.src='/assets/search-data/'+name;data.parts=parts;return a+JSON.stringify(data)+c;});await fs.writeFile('discover.html',hub);
const files=execFileSync('rg',['-l','-F',id,'courses','places','with-dog','guides','--glob','*.html'],{encoding:'utf8'}).trim().split(/\r?\n/);let changed=0;
for(const file of files){let h=await fs.readFile(file,'utf8'),old=h;
 // Recommendation/list items have their own closed li boundary and exact identity link.
 h=h.replace(/<li\b[^>]*>(?:(?!<\/li>)[\s\S])*<\/li>/g,block=>block.includes('/places/'+id+'/')?(file.replaceAll('\\','/').includes('/shopping/')?'':block.replace(/쇼핑(?:·체험)?/g,'공원·관광지')):block);
 if(file.replaceAll('\\','/')==='places/'+id+'/index.html'){
 const split=h.indexOf('id="detail-companions"');const end=split<0?h.indexOf('</main>'):split;
 h=h.slice(0,end).replace(/쇼핑(?:·체험)?/g,'공원·관광지').replaceAll('data-detail-kind="retail"','data-detail-kind="park"').replaceAll('운영시간과 매장 정보','이용시간과 시설 안내')+h.slice(end);
 h=h.replaceAll('/places/shopping/','/places/parks/').replaceAll('/incheon/shopping/','/incheon/parks/');
 }
 if(h!==old){await fs.writeFile(file,h);changed++;}}
console.log(JSON.stringify({id,files:files.length,changed,searchRows:records.length,parts:parts.length}));
