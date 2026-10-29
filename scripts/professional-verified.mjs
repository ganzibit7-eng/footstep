// Official-site evidence, separate from licensing and collection dates.
export function verifiedProfessional(html,id){
 if(id!=='pc-seoul-0c1ba090e9dc2469'||!html.includes('도산대로90길 17'))return html;
 const section='<section class="detail-section" id="official-business"><h2>업체 공식 안내</h2><p><a href="https://020amc.com/" target="_blank" rel="noopener noreferrer">020동물의료센터 공식 홈페이지 ↗</a> · 2026-10-29 웹자료 조회</p><p>공식 주소: 서울특별시 강남구 도산대로90길 17, 소양빌딩 2층. 인허가 자료의 201호 표기는 기존 주소에 보존합니다.</p><p><a href="tel:0262040207">02-6204-0207 전화 문의</a></p><p>공식 진료 안내: 월·수·금 09:30–19:30 / 화·목 10:00–21:00(19:30 이후 예약 필수) / 토 09:30–18:30 / 일 휴무. 점심 13:00–14:00. 예약 우선 운영.</p><p>홈페이지에 게시된 안내이며 실제 당일 영업·현장 방문 확인이 아닙니다. 방문 전 예약과 진료시간을 확인해 주세요. 이 조회일은 원본 인허가 변경일·발자국 수집일을 대체하지 않습니다.</p></section>';
 return html.includes('id="official-business"')?html:html.replace('</main>',section+'</main>');
}
