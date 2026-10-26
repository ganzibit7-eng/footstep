import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';import {execFileSync} from 'node:child_process';
import Media from '../card-media.js';
import {renderPlaceCard} from '../scripts/place-card.mjs';
import {buildRelatedIndex,relatedCards,text} from '../scripts/detail-editorial.mjs';

test('card image policy preserves restricted, small and unknown images without stretching',()=>{
 const source={width:1200,height:800,license:'CC BY-SA 3.0'};
 assert.equal(Media.fit(source),'cover');
 for(const override of [{noCrop:true},{license:'CC BY-ND 4.0'},{license:'공공누리 제4유형'},{license:'한국관광공사 국문 관광정보 개방자료'},{width:200},{width:4000},{license:''}])assert.equal(Media.fit({...source,...override}),'contain');
 const html=Media.image(source,{name:'한 장소',src:'/owned.jpg',href:'/places/a/'});
 assert(html.includes('data-card-fit="cover"'));assert(!html.includes('aria-hidden="true"'));
 assert(Media.image(null,{category:'동물병원'}).includes('사진 미등록'));
 assert(Media.image({...source,place:'공원 대표 풍경 · 코스 사진 아님'},{name:'산책 경로'}).includes('공원 대표 풍경 · 코스 사진 아님'));
});

test('an article without its own image never borrows another recommended place photograph',()=>{
 const html='<link rel="canonical" href="https://balzaguk.com/places/a/"><main><article><h1>사진 없는 카페</h1></article><section><figure class="detail-slide"><img src="/other-place.jpg"></figure></section></main>';
 const index=buildRelatedIndex([['/places/a/',html],['/places/wrong/',html]]);
 assert.equal(index.size,1);assert.equal(index.get('/places/a/').photo,null);assert.equal(index.get('/places/a/').name,'사진 없는 카페');
});

test('related cards bind title, photo, rules and CTA to the destination, not a credit or stale anchor text',()=>{
 const record={url:'/places/b/',name:'올바른 카페',category:'식당·카페',area:'강원 인제군',intro:'자료로 확인한 장소 안내',photo:{src:'/correct.jpg',width:1000,height:700,license:'CC BY 4.0'},credit:'<a href="https://source.example/">사진작가</a> · <a href="https://license.example/">CC BY 4.0</a>',facts:[{label:'준비물',value:'목줄 착용'}]};
 const before='<main><article><h1>기준 장소</h1></article><section class="card" id="place-related"><h2>같은 시·군·구에서 함께 보기</h2><ul><li><figure><a href="https://source.example/">사진작가</a></figure><a href="/places/b/">오래된 이름</a> · 직선 1.2km</li><li><a href="/places/missing/">누락</a></li></ul></section></main>';
 const result=relatedCards(before,new Map([[record.url,record]]));
 assert(result.includes('id="place-related"'));assert(result.includes('data-related-template="premium5"'));
 assert(result.includes('<h3 class="premium-card-title" title="올바른 카페"><a href="/places/b/">올바른 카페</a></h3>'));
 assert(result.includes('src="/correct.jpg"'));assert(result.includes('목줄 착용'));assert(result.includes('직선 1.2km'));
 assert(!result.includes('오래된 이름'));assert(!result.includes('/places/missing/'));assert.equal((result.match(/data-card-source=/g)||[]).length,1);
 const escaped=renderPlaceCard({...record,name:'<script>악성</script>'});assert(!escaped.includes('<script>악성'));
 assert(escaped.includes('사진작가'));assert(escaped.includes('사진 정보'));
});

test('every generated related/list card has one matching destination, own name and own image',()=>{
 const files=execFileSync('git',['ls-files','-z','--','*.html'],{encoding:'utf8',maxBuffer:10000000}).split('\0').filter(f=>f&&!/^(?:tests|docs|admin)/.test(f));
 const registry=new Map();
 for(const f of files){const html=readFileSync(f,'utf8');const article=html.match(/<article\b[^>]*data-detail-template="editorial-v3"[^>]*>([\s\S]*?)<\/article>/)?.[1],url=html.match(/rel="canonical" href="https:\/\/balzaguk.com([^"?#]+)"/)?.[1];if(article&&url)registry.set(url,{name:text((article.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]||'').replace(/<small>[\s\S]*?<\/small>/g,'')),images:new Set([...article.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m=>m[1]))});}
 let cards=0,related=0,lists=0;const counts={};
 for(const file of files){const html=readFileSync(file,'utf8');
  if(html.includes('data-listing-template="quality3"'))lists++;
  if(html.includes('data-related-template="premium5"'))related++;
  assert(!html.includes('class="detail-related-copy"'),file+' obsolete related markup');
  const old=html.match(/<li\b[^>]*data-listing-card="quality3"[^>]*>/g)||[];
  assert(old.every(tag=>tag.includes('data-card-template="premium5"')),file+' old list card');
  for(const match of html.matchAll(/<(li|a)\b[^>]*data-card-template="premium5"[^>]*data-card-source="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)){
   const [,tag,url,body]=match,target=registry.get(url);assert(match[0].includes('data-card-revision="quality6"'),file+' older card revision');assert(target,file+' unknown destination '+url);cards++;
   const title=text(body.match(/<h[23] class="premium-card-title"[^>]*>([\s\S]*?)<\/h[23]>/)?.[1]);
   assert.equal(title,target.name,file+' mismatched card title '+url);
   const photo=body.match(/<img\b[^>]*src="([^"]+)"/)?.[1];if(photo)assert(target.images.has(photo),file+' photograph not owned by '+url);else assert(body.includes('사진 미등록'),file+' missing honest placeholder');
   assert(body.includes('premium-card-cta'),file+' missing CTA');
   if(url.startsWith('/places/'))for(const dd of body.matchAll(/<dd>([\s\S]*?)<\/dd>/g))assert(text(dd[1]).length<=54,file+' unprocessed long condition');
   const context=body.match(/class="premium-card-context">([\s\S]*?)<\/div>/)?.[1]||'';assert(!context.includes('방문 전 확인할 정보를 살펴보세요'),file+' repetitive placeholder prose');
   const type=url.split('/')[1];counts[type]=(counts[type]||0)+1;
  }
 }
 assert.equal(registry.size,22317);assert(lists>=1114);assert(cards>39000);assert(related>3000);
 console.log('Premium card coverage:',JSON.stringify({details:registry.size,listPages:lists,relatedPages:related,cards,counts,unapplied:0}));
});


test('interactive search scripts cannot run before their shared photo renderer',()=>{
 for(const file of ['discover.html','pet-care/index.html','pet-care/seoul/index.html']){
  const html=readFileSync(file,'utf8'),scripts=[...html.matchAll(/<script\b([^>]*)src="([^"]+)"([^>]*)>/g)];
  const media=scripts.findIndex(s=>s[2].startsWith('/card-media.js?')),client=scripts.findIndex(s=>/\/(?:place-search|pet-care)\.js\?/.test(s[2]));
  assert(media>=0&&client>=0,file+' shared renderer present');
  const mediaDeferred=/\bdefer\b/.test(scripts[media][1]+scripts[media][3]),clientDeferred=/\bdefer\b/.test(scripts[client][1]+scripts[client][3]);
  assert((clientDeferred&&!mediaDeferred)||(media<client&&(!mediaDeferred||clientDeferred)),file+' renderer must execute first');
 }
});
