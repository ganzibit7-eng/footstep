(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.PlaceConditions=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Preserve labelled source text, including restrictions. Never infer unrestricted access.
  function get(place){
    const description=String(place?.description||'');
    const parts=description.split(/\s*·\s*/);
    const field=labels=>{for(const part of parts){for(const label of labels){const match=part.match(new RegExp('^'+label+'\\s*[:：]\\s*(.+)$'));if(match)return match[1].trim();}}return '미확인 · 방문 전 문의';};
    let scope=description.split(/\s*·\s*(?:동반가능동물|동반 가능 동물|동반시 필요사항|동반 시 필요사항|구비시설|문의|공식안내|사고 대비사항)\s*[:：]/)[0].trim();
    if(!/동반|반려|출입|입장/.test(scope))scope='미확인 · 허용 구역은 방문 전 문의';
    return [{label:'허용 구역·제한',value:scope},{label:'견종·크기 조건',value:field(['동반가능동물','동반 가능 동물'])},{label:'필수 준비물',value:field(['동반시 필요사항','동반 시 필요사항'])},{label:'문의',value:field(['문의'])}];
  }
  function panel(place){return '<section aria-label="반려견 동반 조건" style="margin:14px 0;padding:14px;border:1px solid #ddd3c4;border-radius:12px;background:#fffaf3"><h3 style="margin:0 0 10px;font-size:15px">반려견 동반 조건</h3><dl style="margin:0">'+get(place).map(row=>'<div style="margin:8px 0"><dt style="font-weight:700;font-size:12px">'+escape(row.label)+'</dt><dd style="margin:3px 0 0;font-size:13px;line-height:1.65;overflow-wrap:anywhere">'+escape(row.value)+'</dd></div>').join('')+'</dl><p style="font-size:12px;margin:10px 0 0">'+escape(freshness(place))+'<br>자료의 동반 조건이며, 현장 운영·요금·예약 여부는 방문 전 확인해 주세요.</p>'+reportLink(place)+'</section>';}
  function summary(place){const rows=get(place);return rows[1].value+' · 준비물: '+rows[2].value;}
  function reportLink(place){
    const subject=encodeURIComponent('발자국 장소 정보 수정 제보: '+String(place?.name||'장소'));
    const body=encodeURIComponent('장소: '+String(place?.name||'')+'\n장소 ID: '+String(place?.id||'')+'\n변경된 내용:\n확인 가능한 공식 안내 주소 또는 확인 경위:\n');
    return '<a href="mailto:footstepbiz@gmail.com?subject='+subject+'&amp;body='+body+'" style="font-size:13px">정보 수정 제보 ↗</a>';
  }
  function freshness(place,now=Date.now()){
    const description=String(place?.description||'');
    const source=description.match(/공식안내:\s*(https?:\/\/[^\s·]+)/)?.[1];
    const value=description.match(/확인일:\s*(\d{4}-\d{2}-\d{2})/)?.[1];
    let trusted=false;try{const url=new URL(source);trusted=url.protocol==='https:'&&!url.username&&!url.password&&['gocamping.or.kr','www.gocamping.or.kr','gil.seoul.go.kr','www.foodsafetykorea.go.kr','korean.visitseoul.net','www.durunubi.kr','durunubi.kr','korean.visitkorea.or.kr','sjfmc.or.kr','www.suwon.go.kr','www.visitbusan.net','visitbusan.net'].includes(url.hostname);}catch{}
    if(!trusted||!value)return '자료 확인일 미확인 · 방문 전 문의';
    const time=Date.parse(value+'T00:00:00Z');
    if(!Number.isFinite(time)||new Date(time).toISOString().slice(0,10)!==value||time>now)return '자료 확인일 미확인 · 방문 전 문의';
    return value+' 자료 확인'+(now-time>180*86400000?' · 확인 후 180일 경과, 운영기관 재확인 필요':' · 당일 운영은 방문 전 확인');
  }
  return {get,panel,summary,freshness};
});
