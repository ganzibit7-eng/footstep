import {cardRecord,cardFacts,renderPlaceCard} from './place-card.mjs';
import Media from '../card-media.js';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {CONTROL_VERSION} from './publish-control-polish.mjs';
export const LISTING_VERSION='20261026-quality3';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let records=new Map();
export function setListingRecords(groups){records=new Map(groups.flatMap(g=>g.items.map(item=>['/'+g.type.folder+'/'+item.id+'/',{item,type:g.type}])));}
export const listingFacts=cardFacts;
export function listCard(item,type,attrs=''){return renderPlaceCard(cardRecord(item,type),{attrs});}
export function professionalCard(row,labels){
 const name=/^[-.\s]*$/.test(row[1])?'업소명 미확인':row[1],phone=String(row[3]||'').trim(),valid=/^\+?[0-9()\s-]{8,30}$/.test(phone)&&phone.replace(/\D/g,'').length>=8;
 const url='/pet-care/places/'+esc(row[0])+'/';
 return '<a class="care-card premium-place-card premium-professional-card" data-card-template="premium5" data-card-revision="quality6" data-card-source="'+url+'" data-listing-card="quality3" href="'+url+'">'+Media.image(null,{category:labels[0]||'전문업소'})+'<p class="premium-card-meta">'+esc(labels.join(' · '))+'</p><h2 class="premium-card-title" title="'+esc(name)+'">'+esc(name)+'</h2><div class="premium-card-context"><p>'+esc(row[2])+'</p></div><div class="premium-card-facts"><p>'+(valid?'공개 연락처 '+esc(phone):'공개 연락처 미등록')+'</p><small>진료·이용 조건은 업소에 확인</small></div><div class="premium-card-credits" aria-hidden="true"></div><span class="premium-card-cta"><span>자세히 보기</span><span aria-hidden="true">↗</span></span></a>';
}
export function refineListing(html){
 if(!html.includes('data-detail-template=')&&html.includes('id="hub-results"')&&!html.includes('class="collection-other"'))html=html.replace(/<nav aria-label="빠른 탐색" class="quick-links">[\s\S]*?<\/nav>/,nav=>'<details class="collection-other"><summary>다른 목록 둘러보기</summary>'+nav+'</details>');
 if(html.includes('data-detail-template=')||html.includes('data-listing-template="quality3"'))return html;
 const canonical=html.match(/rel="canonical" href="https:\/\/balzaguk.com([^"?#]*)"/)?.[1];if(!canonical||canonical==='/')return html;
 let cards=0;
 html=html.replace(/<li\b([^>]*)>([\s\S]*?)<\/li>/g,(all,attrs,body)=>{
  const links=[...body.matchAll(/<a\b[^>]*href="(?:https:\/\/balzaguk.com)?(\/(?:places|courses|bins)\/[^/]+\/)"/g)];const record=links.map(m=>records.get(m[1])).find(Boolean);if(!record)return all;cards++;return listCard(record.item,record.type,attrs);
 });
 const listing=cards||/"@type"\s*:\s*"CollectionPage"/.test(html)||html.includes('id="find-place"');if(!listing)return html;
 html=html.replace(/<body([^>]*)>/,(_,attrs)=>'<body'+(attrs.includes('class="')?attrs.replace('class="','class="editorial-listing '):attrs+' class="editorial-listing"')+' data-listing-template="quality3">');
 html=html.replace('</head>','<link rel="stylesheet" href="/listing-editorial.css?v='+CONTROL_VERSION+'"></head>');
 if(html.includes('id="find-place"'))html=html.replace('</head>','<script src="/place-presentation.js?v='+LISTING_VERSION+'"></script></head>').replace(/place-search\.js\?v=[\w-]+/g,'place-search.js?v='+LISTING_VERSION);
 if(html.includes('id="care-form"'))html=html.replace(/pet-care\.js\?v=[\w-]+/g,'pet-care.js?v='+LISTING_VERSION);
 return html;
}
export async function publishListingEditorial(root){
 let pages=0,cards=0;const urls=[];
 async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){if(entry.name.startsWith('.')||['docs','tests','scripts','infrastructure','supabase','database_sql','assets'].includes(entry.name))continue;const file=path.join(dir,entry.name);if(entry.isDirectory()){await walk(file);continue;}if(!entry.name.endsWith('.html'))continue;const before=await readFile(file,'utf8'),after=refineListing(before);if(after!==before)await writeFile(file,after);if(after.includes('data-listing-template="quality3"')){pages++;cards+=(after.match(/data-listing-card="quality3"/g)||[]).length;urls.push(after.match(/rel="canonical" href="([^"]+)"/)?.[1]);}}}
 await walk(root);return {pages,cards,urls};
}
