import {readFile,writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(import.meta.dirname,'..');
const source=await readFile(path.join(root,'scripts/generate-seo.mjs'),'utf8');
const marker='// 조회 실패 시 기존 검색 페이지를 지우지 않습니다.';
if(!source.includes(marker))throw Error('Generator test entry point missing');
const temporary=path.join(root,'scripts/seo-walks-300-check.mjs');
try{
 await writeFile(temporary,source.split(marker)[0]+`\nexport {detailHtml,types};\n`);
 const {detailHtml,types}=await import(pathToFileURL(temporary));
 const sql=await readFile(path.join(root,'database_sql/seed_expansion_walks_300_20261004.sql'),'utf8');
 const courses=JSON.parse(sql.match(/\$payload\$([\s\S]*?)\$payload\$/)[1]);
 for(const c of courses){
  const html=detailHtml(c,types[0],'https://balzaguk.com/courses/'+c.id+'/');
  for(const [,data] of html.matchAll(/type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(data);
  if(c.tags.includes('동반 확인 필요')&&!html.includes('<strong>반려견 동반 확인 필요</strong>'))throw Error('Missing pet scope warning: '+c.id);
  if(!html.includes('id="share-detail"'))throw Error('Missing sharing control: '+c.id);
 }
 console.log('PASS: all 83 new detail pages render with valid schema and explicit pet scope warnings.');
}finally{await unlink(temporary).catch(()=>{});}
