import test from 'node:test';
import assert from 'node:assert/strict';
import {contentSignature,modificationDate,snapshotSitemap,finalizeModificationDates} from '../scripts/sitemap-modified.mjs';
import {professionalPage} from '../scripts/generate-professional-pages.mjs';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
const page=(body,style='a',script='one')=>`<html><head><title>실제 장소</title><meta name="description" content="공개 자료"><link rel="stylesheet" href="/${style}.css"><style>.${style}{}</style></head><body><main>${body}</main><script src="/${script}.js"></script></body></html>`;
test('substantive content, address, rights and links update lastmod while presentation-only builds do not',()=>{
 const before=page('<h1>실제 장소</h1><p>서울 중구</p><a href="/a/">상세</a><img src="/a.jpg" alt="실제 장소"><p>출처 A</p>');
 const prev={signature:contentSignature(before),lastmod:'2026-10-17'};
 assert.equal(modificationDate(prev,before.replace('/a.css','/b.css').replace('/one.js','/two.js'),'2026-10-10','2026-10-28'),'2026-10-17');
 for(const next of [before.replace('서울 중구','서울 강남구'),before.replace('href="/a/"','href="/b/"'),before.replace('출처 A','출처 B'),before.replace('src="/a.jpg"','src="/b.jpg"'),before.replace('실제 장소</title>','실제 장소 · 중구</title>')])assert.equal(modificationDate(prev,next,'2026-10-10','2026-10-28'),'2026-10-28');
 const next=before.replace('서울 중구','서울 강남구');
 assert.equal(modificationDate({signature:contentSignature(next),lastmod:'2026-10-28'},next,'2026-10-10','2026-10-29'),'2026-10-28');
 assert.equal(modificationDate(undefined,before,'2026-10-17','2026-10-28'),'2026-10-17');
});
test('structured data and image rights remain part of the modification signal',()=>{
 const a=page('<p>설명</p>'),b=a.replace('</head>','<script type="application/ld+json">{"address":"서울"}</script></head>');
 assert.notEqual(contentSignature(a),contentSignature(b));
 assert.notEqual(contentSignature(b),contentSignature(b.replace('서울','경기')));
});
test('same-name business title uses an existing public address without changing identity or canonical',()=>{
 const row=['pc-seoul-0000000000000001','스마일약국','서울특별시 중구 세종대로 1','02-123-4567',null,[0]];
 const manifest={kinds:[{label:'동물약국',source:'https://www.data.go.kr/'}],checked:'2026-10-22'};
 const region={label:'서울',id:'seoul'},map=[row[0],'',37.5,127.0];
 const html=professionalPage(row,region,manifest,map,null,'서울특별시 중구 세종대로 1');
 assert(html.includes('<title>스마일약국 · 서울특별시 중구 세종대로 1 동물약국 | 발자국</title>'));
 assert(html.includes('href="https://balzaguk.com/pet-care/places/'+row[0]+'/"'));
 assert(html.includes('서울특별시 중구 세종대로 1'));
 assert(!html.includes('중구점'));
});
test('final sitemap preserves image entries and a second identical build does not manufacture new dates',async()=>{
 const root=await mkdtemp(path.join(tmpdir(),'balzaguk-lastmod-'));
 try{
  const url='https://balzaguk.com/a.html',file=path.join(root,'sitemap.xml');
  await writeFile(path.join(root,'a.html'),page('<h1>서울 장소</h1>'));
  await writeFile(file,`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"><url><loc>${url}</loc><lastmod>2026-10-17</lastmod><image:image><image:loc>https://balzaguk.com/a.jpg</image:loc></image:image></url></urlset>`);
  const before=await snapshotSitemap(root);
  await writeFile(path.join(root,'a.html'),page('<h1>서울 장소</h1><p>새로 확인된 원문 조건</p>'));
  await finalizeModificationDates(root,[{url,lastmod:'2026-10-17'}],before,'2026-10-28');
  const changed=await readFile(file,'utf8');assert(changed.includes('<lastmod>2026-10-28</lastmod>'));assert(changed.includes('<image:image>'));
  const next=await snapshotSitemap(root);
  await finalizeModificationDates(root,[{url,lastmod:'2026-10-17'}],next,'2026-10-29');
  assert.equal(await readFile(file,'utf8'),changed);
 }finally{await rm(root,{recursive:true,force:true});}
});
