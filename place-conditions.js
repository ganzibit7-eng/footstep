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
  function panel(place){return '<section aria-label="반려견 동반 조건" style="margin:14px 0;padding:14px;border:1px solid #ddd3c4;border-radius:12px;background:#fffaf3"><h3 style="margin:0 0 10px;font-size:15px">반려견 동반 조건</h3><dl style="margin:0">'+get(place).map(row=>'<div style="margin:8px 0"><dt style="font-weight:700;font-size:12px">'+escape(row.label)+'</dt><dd style="margin:3px 0 0;font-size:13px;line-height:1.65;overflow-wrap:anywhere">'+escape(row.value)+'</dd></div>').join('')+'</dl><p style="font-size:12px;margin:10px 0 0">자료의 동반 조건이며, 현장 운영·요금·예약 여부는 방문 전 확인해 주세요.</p></section>';}
  function summary(place){const rows=get(place);return rows[1].value+' · 준비물: '+rows[2].value;}
  return {get,panel,summary};
});
