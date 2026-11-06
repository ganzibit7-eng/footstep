// Presentation corrections only. Original source disclosures, JSON-LD, data,
// photos, source dates and links are deliberately kept byte-for-byte.
export const factLabel=row=>/^(?:견종·크기 조건|견종·체중 기준)$/.test(row.label)&&/^(?:반려동물|반려견)$/.test(String(row.value).trim())?'동반 대상':row.label;
export function detailReliability(html){
 if(!html.includes('data-detail-template='))return html;
 const dining=html.includes('data-detail-kind="dining"');
 const visible=part=>part.replace(/<span>(견종·크기 조건|견종·체중 기준)<\/span>(\s*<strong[^>]*>)(반려동물|반려견)<\/strong>/g,'<span>동반 대상</span>$2$3</strong>');
 html=html.replace(/<div class="detail-essentials"[\s\S]*?<\/div>/g,part=>{
  part=visible(part).replace(/<p><span>동반 대상<\/span><strong>(?:반려동물|반려견)<\/strong><\/p>/g,'');
  return part.includes('<p>')?part:'';
 });
 html=html.replace(/<section class="detail-section" id="detail-conditions">[\s\S]*?<\/section>/g,part=>{
  part=visible(part);
  return dining?part.replace(/(<p class="detail-unconfirmed">[\s\S]*?<\/p>)/g,p=>p.replaceAll('실내·객실 출입','실내 출입 범위')):part;
 });
 if(dining)html=html.replace(/<p class="detail-lead-check">[\s\S]*?<\/p>/g,p=>p.replaceAll('실내·객실 출입','실내 출입 범위'));
 return html.replace(/<div class="detail-source-links">[\s\S]*?<\/div>/g,part=>part.replaceAll('이번에 대조한 공식 동반 자료','동반 안내 원문'));
}
export function cardReliability(html){
 return html.replace(/<dl class="premium-card-facts">[\s\S]*?<\/dl>/g,part=>part
  .replace(/<dt>(?:견종·크기 조건|견종·체중 기준)<\/dt><dd>(반려동물|반려견)<\/dd>/g,'<dt>동반 대상</dt><dd>$1</dd>')
  .replace('<dt>현장 확인</dt><dd>시설 위치·작동·수거 여부는 상세 안내를 확인해 주세요.</dd>','<dt>방문 전 확인</dt><dd>시설 위치·작동·수거 여부는 상세 안내를 확인해 주세요.</dd>'));
}
