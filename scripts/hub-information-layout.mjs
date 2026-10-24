// Improve generated listing hierarchy without changing facts, URLs or source data.
export function refineHubInformation(html){
 if(!html.includes('id="hub-results"'))return html;
 html=html.replace(/\/readability\.css\?v=[\w-]+/g,'/readability.css?v=20261024-polish');
 html=html.replace(/(<ul id="hub-results">)([\s\S]*?)(<\/ul>)/,(_,open,content,close)=>open+content.replace(/<li\b([^>]*)>([\s\S]*?)<\/li>/g,(row,attrs,body)=>{
  if(body.includes('class="hub-guide"'))return row;
  // Exactly three generated fields follow the heading: category, address, guide.
  body=body.replace(/(<\/h2>)<p>([^<]*)<\/p><p>([^<]*)<\/p><p>([^<]*)<\/p>/,(_,heading,category,address,guide)=>{
   if(guide.startsWith(address+' · '))guide=guide.slice(address.length+3);
   else if(guide===address)guide='';
   return heading+'<p>'+category+'</p><p>'+address+'</p>'+(guide?'<p class="hub-guide"><b>이용 안내</b>'+guide+'</p>':'');
  });
  return '<li'+attrs+'>'+body+'</li>';
 })+close);
 // Format display-only totals, leaving page numbers, JSON-LD and data untouched.
 return html.replace(/(전체 |식당·카페 |카페·식당 |총 )(\d{4,})(곳)/g,(_,lead,n,unit)=>lead+Number(n).toLocaleString('ko-KR')+unit);
}
