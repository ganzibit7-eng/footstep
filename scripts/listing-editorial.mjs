import {readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import PlacePhotos from '../place-photos.js';
import PlaceConditions from '../place-conditions.js';
import PlaceEvidence from '../place-evidence.js';
import CoursePhotos from '../course-photos.js';
import CourseInfo from '../course-info.js';
import Presentation from '../place-presentation.js';
export const LISTING_VERSION='20261026-quality3';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let records=new Map();
export function setListingRecords(groups){records=new Map(groups.flatMap(g=>g.items.map(item=>['/'+g.type.folder+'/'+item.id+'/',{item,type:g.type}])));}
export function listingFacts(item,type){
 if(type.table==='facilities')return Presentation.summary([...PlaceConditions.get(item),...Presentation.visitRows(PlaceEvidence.visit(item)?.rows||[])],{kind:item.category,caution:Boolean(PlaceEvidence.caution(item))});
 if(type.table==='courses'){
  const time=CourseInfo.walkTime(item.description,item.distance);
  return [...((item.tags||[]).includes('동반 확인 필요')?[{label:'동반 확인 필요',value:'경로 자료만 확인했습니다. 동반 허용 범위는 운영기관에 확인해 주세요.'}]:[]),{label:'등록 거리',value:item.distance||'미확인'},{label:'등록 난이도',value:item.diff||'미확인'},...(time.minutes?[{label:time.official?'공식 안내 시간':'평지 예상 시간',value:time.minutes+'분'}]:[])];
 }
 return [{label:'현장 확인',value:'시설 위치·작동·수거 여부는 상세 안내를 확인해 주세요.'}];
}
export function listCard(item,type,attrs=''){
 const href='/'+type.folder+'/'+item.id+'/',photo=type.table==='facilities'?PlacePhotos.get(item):type.table==='courses'?CoursePhotos.get(item):null;
 const facts=listingFacts(item,type),category=item.category?.replace('식당카페','식당·카페').replace('공원관광','공원·관광')||(type.table==='courses'?'산책코스':'편의시설');
 const image=photo?'<figure class="listing-photo"><a href="'+href+'" tabindex="-1"><img src="'+esc(PlacePhotos.url(photo))+'" alt="'+esc(photo.place||item.name)+' 실제 사진" width="'+photo.width+'" height="'+photo.height+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"'+(photo.noCrop?' style="object-fit:contain"':'')+'></a><figcaption><details><summary>사진 출처·이용 안내</summary><div>'+(type.table==='courses'?CoursePhotos.credit(photo):PlacePhotos.credit(photo))+esc(PlacePhotos.deliveryNote(photo))+'</div></details></figcaption></figure>':'<p class="listing-photo-absent">'+esc(category)+' · 사진 미등록</p>';
 return '<li'+attrs.replace(/\sclass="[^"]*"/g,'')+' class="place-result-card" data-listing-card="quality3">'+image+'<p class="listing-category">'+esc(category)+'</p><h2><a href="'+href+'">'+esc(item.name)+'</a></h2><p class="listing-address">'+esc(item.address||'주소는 상세 안내에서 확인해 주세요.')+'</p><dl class="listing-conditions">'+facts.map(r=>'<div><dt>'+esc(r.label)+'</dt><dd>'+esc(r.value)+'</dd></div>').join('')+'</dl><a class="listing-detail-link" href="'+href+'">자세히 보기 ↗</a></li>';
}
export function professionalCard(row,labels){
 const name=/^[-.\s]*$/.test(row[1])?'업소명 미확인':row[1],phone=String(row[3]||'').trim(),valid=/^\+?[0-9()\s-]{8,30}$/.test(phone)&&phone.replace(/\D/g,'').length>=8;
 return '<a class="care-card" data-listing-card="quality3" href="/pet-care/places/'+esc(row[0])+'/"><span class="care-kicker">'+esc(labels.join(' · '))+'</span><h2>'+esc(name)+'</h2><p class="care-address">'+esc(row[2])+'</p><p class="care-card-contact">'+(valid?'공개 연락처 '+esc(phone):'공개 연락처 미등록')+'</p><div class="care-card-bottom"><span>진료·이용 조건은 업소에 확인</span><span>자세히 보기 ↗</span></div></a>';
}
export function refineListing(html){
 if(html.includes('data-detail-template=')||html.includes('data-listing-template="quality3"'))return html;
 const canonical=html.match(/rel="canonical" href="https:\/\/balzaguk.com([^"?#]*)"/)?.[1];if(!canonical||canonical==='/')return html;
 let cards=0;
 html=html.replace(/<li\b([^>]*)>([\s\S]*?)<\/li>/g,(all,attrs,body)=>{
  const links=[...body.matchAll(/<a\b[^>]*href="(?:https:\/\/balzaguk.com)?(\/(?:places|courses|bins)\/[^/]+\/)"/g)];const record=links.map(m=>records.get(m[1])).find(Boolean);if(!record)return all;cards++;return listCard(record.item,record.type,attrs);
 });
 const listing=cards||/"@type"\s*:\s*"CollectionPage"/.test(html)||html.includes('id="find-place"');if(!listing)return html;
 html=html.replace(/<body([^>]*)>/,(_,attrs)=>'<body'+(attrs.includes('class="')?attrs.replace('class="','class="editorial-listing '):attrs+' class="editorial-listing"')+' data-listing-template="quality3">');
 html=html.replace('</head>','<link rel="stylesheet" href="/listing-editorial.css?v='+LISTING_VERSION+'"></head>');
 if(html.includes('id="find-place"'))html=html.replace('</head>','<script src="/place-presentation.js?v='+LISTING_VERSION+'"></script></head>').replace(/place-search\.js\?v=[\w-]+/g,'place-search.js?v='+LISTING_VERSION);
 if(html.includes('id="care-form"'))html=html.replace(/pet-care\.js\?v=[\w-]+/g,'pet-care.js?v='+LISTING_VERSION);
 return html;
}
export async function publishListingEditorial(root){
 let pages=0,cards=0;const urls=[];
 async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){if(entry.name.startsWith('.')||['docs','tests','scripts','infrastructure','supabase','database_sql','assets'].includes(entry.name))continue;const file=path.join(dir,entry.name);if(entry.isDirectory()){await walk(file);continue;}if(!entry.name.endsWith('.html'))continue;const before=await readFile(file,'utf8'),after=refineListing(before);if(after!==before)await writeFile(file,after);if(after.includes('data-listing-template="quality3"')){pages++;cards+=(after.match(/data-listing-card="quality3"/g)||[]).length;urls.push(after.match(/rel="canonical" href="([^"]+)"/)?.[1]);}}}
 await walk(root);return {pages,cards,urls};
}
