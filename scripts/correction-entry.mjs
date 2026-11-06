export const CORRECTION_VERSION='20261106-corrections';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const correctionButton=(path='',name='')=>'<button type="button" class="detail-correction-open" data-correction-open'+(path?' data-correction-path="'+esc(path)+'"':'')+(name?' data-correction-name="'+esc(name)+'"':'')+'>정보 정정 요청</button>';
export function correctionAssets(html){
 if(!html.includes('data-detail-template='))return html;
 const canonical=html.match(/rel="canonical" href="https:\/\/balzaguk.com([^"?#]*)"/)?.[1];
 if(!/^\/(?:places|courses|bins)\/[A-Za-z0-9_-]+\/$|^\/pet-care\/places\/[A-Za-z0-9_-]+\/$/.test(canonical||''))return html;
 if(!html.includes('data-correction-open'))html=html.replace(/(<header class="detail-heading"[^>]*>[\s\S]*?)(<\/header>)/,'$1'+correctionButton()+'$2');
 // The label is the action; repeating a decorative inline SVG in 22k pages wastes deployment space.
 html=html.replace(/(<button type="button" class="detail-correction-open" data-correction-open>)<svg[^>]*>[\s\S]*?<\/svg><span>정보 정정 요청<\/span>/g,'$1정보 정정 요청');
 if(!html.includes('/correction-request.css?'))html=html.replace('</head>','<link rel="stylesheet" href="/correction-request.css?v='+CORRECTION_VERSION+'"></head>');
 if(!html.includes('/correction-request.js?'))html=html.replace('</body>','<script defer src="/correction-request.js?v='+CORRECTION_VERSION+'"></script></body>');
 return html;
}
