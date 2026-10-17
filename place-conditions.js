(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(root,require('./place-evidence.js'));else root.PlaceConditions=factory(root);})(typeof globalThis!=='undefined'?globalThis:this,function(root,evidence){
  const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Preserve labelled source text, including restrictions. Never infer unrestricted access.
  function get(place){
    const description=String(place?.description||'');
    const parts=description.split(/\s*·\s*/);
    const field=labels=>{for(const part of parts){for(const label of labels){const match=part.match(new RegExp('^'+label+'\\s*[:：]\\s*(.+)$'));if(match)return match[1].trim();}}return '미확인 · 방문 전 문의';};
    let scope=description.split(/\s*·\s*(?:동반가능동물|동반 가능 동물|동반시 필요사항|동반 시 필요사항|구비시설|문의|공식안내|사고 대비사항)\s*[:：]/)[0].trim();
    if(!/동반|반려|출입|입장/.test(scope))scope='미확인 · 허용 구역은 방문 전 문의';
    const verified=(evidence||root.PlaceEvidence)?.conditions(place);
    const clean=v=>String(v||'').replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]*>/g,' ').replaceAll('&nbsp;',' ').replaceAll('&amp;','&').trim();
    const detail=clean(verified?.etcAcmpyInfo)||field(['동반 관련 상세정보','동반 관련 상세 정보']);
    let size=clean(verified?.acmpyPsblCpam)||field(['동반가능동물','동반 가능 동물']);
    const camping=description.match(/고캠핑 반려동물 출입 안내:\s*([^·]+)/)?.[1].trim();
    if(size.startsWith('미확인')&&camping&&/소형견/.test(camping))size=camping+' · 세부 체중 기준 미확인';
    const rows=[{label:'허용 구역·제한',value:clean(verified?.acmpyTypeCd)?clean(verified.acmpyTypeCd)+(detail.startsWith('미확인')?'':' · '+detail):scope},{label:'견종·크기 조건',value:size},{label:'필수 준비물',value:clean(verified?.acmpyNeedMtr)||field(['동반시 필요사항','동반 시 필요사항'])},{label:'문의',value:field(['문의','문의처'])}];
    const extra=[['세부 출입 조건',detail],['반려동물 이용 안내',clean(verified?.petTursmInfo)],['구비시설',clean(verified?.relaPosesFclty)||field(['구비시설'])],['사고 대비사항',clean(verified?.relaAcdntRiskMtr)||field(['사고 대비사항'])],['비치 품목',clean(verified?.relaFrnshPrdlst)||field(['비치 품목'])],['구매 품목',clean(verified?.relaPurcPrdlst)||field(['구매 품목'])],['대여 품목',clean(verified?.relaRntlPrdlst)||field(['렌탈 품목','대여 품목'])]];
    for(const [label,value] of extra)if(value&&!value.startsWith('미확인')&&!rows.some(row=>value!=='없음'&&(row.value===value||label==='세부 출입 조건'&&row.value.includes(value))))rows.push({label,value});
    if(!rows.some(row=>/체중|몸무게|kg|㎏|킬로그램/i.test(row.value)))rows.push({label:'체중 기준',value:'미확인 · 방문 전 문의'});
    if(!rows.some(row=>/실내|실외|테라스|객실|숙소|내부/.test(row.value)))rows.push({label:'실내·객실 출입',value:'미확인 · 방문 전 문의'});
    return rows;
  }
  function panel(place){return '<section aria-label="반려견 동반 조건" style="margin:14px 0;padding:14px;border:1px solid #ddd3c4;border-radius:12px;background:#fffaf3"><h3 style="margin:0 0 10px;font-size:15px">반려견 동반 조건</h3><dl style="margin:0">'+get(place).map(row=>'<div style="margin:8px 0"><dt style="font-weight:700;font-size:12px">'+escape(row.label)+'</dt><dd style="margin:3px 0 0;font-size:13px;line-height:1.65;overflow-wrap:anywhere">'+escape(row.value)+'</dd></div>').join('')+'</dl><p style="font-size:12px;margin:10px 0 0">'+escape(freshness(place))+'<br>자료의 동반 조건이며, 현장 운영·요금·예약 여부는 방문 전 확인해 주세요.</p>'+(source(place)?'<p style="font-size:12px"><a href="'+escape(source(place))+'" target="_blank" rel="noopener noreferrer">이번에 대조한 공식 동반 자료 ↗</a></p>':'')+reportLink(place)+'</section>';}
  function summary(place){const rows=get(place);return rows[1].value+' · 준비물: '+rows[2].value;}
  function source(place){const data=evidence||root.PlaceEvidence;return data?.conditions(place)?data.get(place).source:'';}
  function reportLink(place){
    const subject=encodeURIComponent('발자국 장소 정보 수정 제보: '+String(place?.name||'장소'));
    const body=encodeURIComponent('장소: '+String(place?.name||'')+'\n장소 ID: '+String(place?.id||'')+'\n변경된 내용:\n확인 가능한 공식 안내 주소 또는 확인 경위:\n');
    return '<a href="mailto:footstepbiz@gmail.com?subject='+subject+'&amp;body='+body+'" style="font-size:13px">정보 수정 제보 ↗</a>';
  }
  function freshness(place,now=Date.now()){
    const current=(evidence||root.PlaceEvidence)?.conditions(place);if(current&&Date.parse('2026-10-17T00:00:00+09:00')<=now)return '2026-10-17 공식 동반 자료 확인 · 당일 운영은 방문 전 확인';
    const description=String(place?.description||'');
    const source=description.match(/공식안내:\s*(https?:\/\/[^\s·]+)/)?.[1];
    const value=description.match(/확인일:\s*(\d{4}-\d{2}-\d{2})/)?.[1];
    let trusted=false;try{const url=new URL(source);trusted=url.protocol==='https:'&&!url.username&&!url.password&&['gocamping.or.kr','www.gocamping.or.kr','gil.seoul.go.kr','www.foodsafetykorea.go.kr','korean.visitseoul.net','www.durunubi.kr','durunubi.kr','korean.visitkorea.or.kr','sjfmc.or.kr','www.suwon.go.kr','www.visitbusan.net','visitbusan.net'].includes(url.hostname);}catch{}
    if(!trusted||!value)return '자료 확인일 미확인 · 방문 전 문의';
    const time=Date.parse(value+'T00:00:00Z');
    if(!Number.isFinite(time)||new Date(time).toISOString().slice(0,10)!==value||time>now)return '자료 확인일 미확인 · 방문 전 문의';
    return value+' 자료 확인'+(now-time>180*86400000?' · 확인 후 180일 경과, 운영기관 재확인 필요':' · 당일 운영은 방문 전 확인');
  }
  return {get,panel,summary,freshness,source};
});
