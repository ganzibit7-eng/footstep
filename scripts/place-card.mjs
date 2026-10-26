import Photos from '../place-photos.js';import Courses from '../course-photos.js';
import Conditions from '../place-conditions.js';import Evidence from '../place-evidence.js';
import CourseInfo from '../course-info.js';import Presentation from '../place-presentation.js';
import Media from '../card-media.js';
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function cardFacts(item,type){
 if(type.table==='facilities')return Presentation.summary([...Conditions.get(item),...Presentation.visitRows(Evidence.visit(item)?.rows||[])],{kind:item.category,caution:Boolean(Evidence.caution(item)),limit:3});
 if(type.table==='courses'){const time=CourseInfo.walkTime(item.description,item.distance);return [...((item.tags||[]).includes('동반 확인 필요')?[{label:'동반 확인 필요',value:'경로 자료만 확인했습니다. 동반 허용 범위는 운영기관에 확인해 주세요.'}]:[]),{label:'등록 거리',value:item.distance||'미확인'},{label:'등록 난이도',value:item.diff||'미확인'},...(time.minutes?[{label:time.official?'공식 안내 시간':'평지 예상 시간',value:time.minutes+'분'}]:[])];}
 return [{label:'현장 확인',value:'시설 위치·작동·수거 여부는 상세 안내를 확인해 주세요.'}];
}
export function cardRecord(item,type){
 const url='/'+type.folder+'/'+encodeURIComponent(item.id)+'/',category=item.category?.replace('식당카페','식당·카페').replace('공원관광','공원·관광')||(type.table==='courses'?'산책코스':'편의시설');
 const photo=type.table==='facilities'?Photos.get(item):type.table==='courses'?Courses.get(item):null;
 const area=String(item.address||'').split(/\s+/).slice(0,2).join(' '),credit=photo?(type.table==='courses'?Courses.credit(photo):Photos.credit(photo))+esc(Photos.deliveryNote(photo)):'';
 return {url,id:String(item.id),name:item.name,category,area,address:item.address||'',photo,src:photo?Photos.url(photo):null,credit,facts:cardFacts(item,type),intro:area?area+'의 '+category+'입니다. 방문 전 확인할 정보를 살펴보세요.':category+'의 위치와 이용 조건을 살펴보세요.'};
}
export function renderPlaceCard(record,{attrs='',related=false,context=''}={}){
 const r=record,facts=r.facts||[],body='<p class="premium-card-meta">'+esc([r.area,r.category].filter(Boolean).join(' · '))+'</p><h'+(related?'3':'2')+' class="premium-card-title"><a href="'+esc(r.url)+'">'+esc(r.name)+'</a></h'+(related?'3':'2')+'><div class="premium-card-context"><p>'+esc(related?r.intro:r.address||r.intro)+'</p>'+(context?'<small>'+esc(context)+'</small>':'')+'</div><dl class="premium-card-facts">'+facts.map(f=>'<div><dt>'+esc(f.label)+'</dt><dd>'+esc(f.value)+'</dd></div>').join('')+'</dl>'+Media.credits(r.photo,r.credit)+'<a class="premium-card-cta listing-detail-link" href="'+esc(r.url)+'"><span>자세히 보기</span><span aria-hidden="true">↗</span></a>';
 return '<li'+attrs.replace(/\sclass="[^"]*"/g,'')+' class="place-result-card premium-place-card" data-card-template="premium5" data-card-source="'+esc(r.url)+'" data-listing-card="quality3">'+Media.image(r.photo,{src:r.src,name:r.name,href:r.url,category:r.category})+body+'</li>';
}
