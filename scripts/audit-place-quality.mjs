import {readFile,readdir,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {text} from './detail-editorial.mjs';

export function reviewRecord(html,url){
 const article=html.match(/<article\b[^>]*data-detail-kind="([^"]+)"[^>]*>([\s\S]*?)<\/article>/);
 if(!article)return null;
 const kind=article[1],body=article[2],name=text(body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]);
 const trust=text(body.match(/class="detail-trust"[^>]*>([\s\S]*?)<\/div>/)?.[1]),issues=[];
 // Clinics and licensed services are contact-led registers; missing tourism
 // photos and pet-admission conditions are not defects in those records.
 if(kind!=='professional'){
  if(!body.includes('class="detail-gallery"'))issues.push('재사용 가능 사진 미등록');
  if(/상충/.test(trust))issues.push('동반 안내 상충 · 출처 대조 필요');
  if(/세부 동반 조건 미확인|일부 미확인/.test(trust))issues.push('세부 동반 자료 보완');
  if(/자료 확인일 미상/.test(trust))issues.push('자료 대조일 확인 필요');
  if(/180일 경과/.test(trust))issues.push('오래된 자료 재대조');
  if(kind==='course'&&!body.includes('id="detail-route-data"'))issues.push('공식 GPX 경로 미확인 · 추정 생성 금지');
 }
 return {url,name,kind,issues,publicRegister:kind==='professional'};
}
export async function auditPlaceQuality(root,output){
 const counts={},rows=[],all=[];
 for(const folder of ['places','courses','bins','pet-care/places'])for(const entry of await readdir(path.join(root,folder),{withFileTypes:true})){
  if(!entry.isDirectory())continue;let h;try{h=await readFile(path.join(root,folder,entry.name,'index.html'),'utf8');}catch(e){if(e.code==='ENOENT')continue;throw e;}
  const row=reviewRecord(h,'/'+folder+'/'+entry.name+'/');if(!row)continue;all.push(row);
  for(const issue of row.issues)counts[issue]=(counts[issue]||0)+1;
  if(row.issues.length)rows.push(row);
 }
 rows.sort((a,b)=>Number(b.issues.some(s=>s.includes('상충')))-Number(a.issues.some(s=>s.includes('상충')))||a.url.localeCompare(b.url));
 const quote=value=>'"'+String(value??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
 const csv='\uFEFF'+[['장소명','유형','URL','자료 보완 항목'],...rows.map(r=>[r.name,r.kind,'https://balzaguk.com'+r.url,r.issues.join(' / ')])].map(row=>row.map(quote).join(',')).join('\r\n');
 const summary={total:all.length,queued:rows.length,publicRegisters:all.filter(r=>r.publicRegister).length,counts,note:'공개 등록 자료의 표시 상태 점검입니다. 실제 현장·현재 정책의 개별 검증 또는 점수가 아닙니다. 전문업소는 연락처 중심 공공등록형으로 관광사진·동반조건 누락 대상으로 세지 않습니다.'};
 await mkdir(path.dirname(output),{recursive:true});await writeFile(output,csv);await writeFile(output+'.json',JSON.stringify(summary,null,2));return summary;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 if(!process.argv[2])throw Error('운영 검토 CSV를 저장할 명시적 경로가 필요합니다.');
 console.log(await auditPlaceQuality(path.resolve(import.meta.dirname,'..'),path.resolve(process.argv[2])));
}
