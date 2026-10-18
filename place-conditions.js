(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(root,require('./place-evidence.js'));else root.PlaceConditions=factory(root);})(typeof globalThis!=='undefined'?globalThis:this,function(root,evidence){
  const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Preserve labelled source text, including restrictions. Never infer unrestricted access.
  function get(place){
    const description=String(place?.description||'');
    const parts=description.split(/\s*·\s*/);
    const field=labels=>{for(const part of parts){for(const label of labels){const match=part.match(new RegExp('^'+label+'\\s*[:：]\\s*(.+)$'));if(match)return match[1].trim();}}return '미확인 · 방문 전 문의';};
    let scope=description.split(/\s*·\s*(?:동반가능동물|동반 가능 동물|동반시 필요사항|동반 시 필요사항|구비시설|문의|공식안내|사고 대비사항)\s*[:：]/)[0].trim();
    if(!/동반|반려|출입|입장/.test(scope))scope='미확인 · 허용 구역은 방문 전 문의';
    const data=evidence||root.PlaceEvidence;
    const verified=data?.conditions(place),current=data?.camping?.(place),caution=data?.caution?.(place),visit=data?.visit?.(place);
    const clean=v=>String(v||'').replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]*>/g,' ').replaceAll('&nbsp;',' ').replaceAll('&amp;','&').trim();
    const detail=clean(verified?.etcAcmpyInfo)||field(['동반 관련 상세정보','동반 관련 상세 정보']);
    let size=clean(verified?.acmpyPsblCpam)||field(['동반가능동물','동반 가능 동물']);
    const camping=description.match(/고캠핑 반려동물 출입 안내:\s*([^·]+)/)?.[1].trim();
    if(size.startsWith('미확인')&&camping&&/소형견/.test(camping))size=camping+' · 세부 체중 기준 미확인';
    const rows=[{label:'허용 구역·제한',value:clean(verified?.acmpyTypeCd)?clean(verified.acmpyTypeCd)+(detail.startsWith('미확인')?'':' · '+detail):scope},{label:'견종·크기 조건',value:size},{label:'필수 준비물',value:clean(verified?.acmpyNeedMtr)||field(['동반시 필요사항','동반 시 필요사항'])},{label:'문의',value:field(['문의','문의처'])}];
    if(rows[3].value.startsWith('미확인')&&visit?.phone)rows[3].value=visit.phone+' · 공식 관광자료 연락처 ('+visit.checked+')';
    if(current){
      const facts=current.facts,access=clean(facts['반려동물 출입']);
      rows[0].value='고캠핑 공식 안내: '+access+' · 세부 허용 구역은 방문 전 문의';
      if(verified&&!caution)rows.push({label:'관광자료의 동반 구역',value:clean(verified.acmpyTypeCd)+' · '+detail});
      if(/소형견/.test(access)&&!verified?.acmpyPsblCpam)rows[1].value=access+' · 세부 체중 기준 미확인';
      if(facts['문의처'])rows[3].value=clean(facts['문의처']);
      for(const key of ['운영기간','운영일','예약방법','캠핑장 유형','주요시설','기타 부대시설','캠핑장비대여','안전시설현황'])if(facts[key])rows.push({label:key,value:clean(facts[key])});
    }
    if(caution){rows[0].value=caution.summary;rows[1].value='허용 여부 미확정 · 견종·크기 조건은 운영기관 재확인 필요';rows.push({label:'공식 자료의 상충·제한 안내',value:caution.excerpt});if(verified)rows.push({label:'관광자료에 기재된 조건 · 현재 허용 확정 아님',value:[clean(verified.acmpyTypeCd),clean(verified.acmpyPsblCpam),detail].filter(Boolean).join(' · ')});}
    const extra=[['세부 출입 조건',detail],['반려동물 이용 안내',clean(verified?.petTursmInfo)],['구비시설',clean(verified?.relaPosesFclty)||field(['구비시설'])],['사고 대비사항',clean(verified?.relaAcdntRiskMtr)||field(['사고 대비사항'])],['비치 품목',clean(verified?.relaFrnshPrdlst)||field(['비치 품목'])],['구매 품목',clean(verified?.relaPurcPrdlst)||field(['구매 품목'])],['대여 품목',clean(verified?.relaRntlPrdlst)||field(['렌탈 품목','대여 품목'])]];
    for(const [label,value] of extra)if(value&&!value.startsWith('미확인')&&!rows.some(row=>value!=='없음'&&(row.value===value||label==='세부 출입 조건'&&row.value.includes(value))))rows.push({label,value});
    if(!rows.some(row=>/체중|몸무게|kg|㎏|킬로그램/i.test(row.value)))rows.push({label:'체중 기준',value:'미확인 · 방문 전 문의'});
    if(!rows.some(row=>/실내|실외|테라스|객실|숙소|내부/.test(row.value)))rows.push({label:'실내·객실 출입',value:'미확인 · 방문 전 문의'});
    return rows;
  }
  function panel(place){const data=evidence||root.PlaceEvidence,caution=data?.caution?.(place),notes=data?.notes?.(place);return '<section aria-label="반려견 동반 조건" style="margin:14px 0;padding:14px;border:1px solid #ddd3c4;border-radius:12px;background:#fffaf3"><h3 style="margin:0 0 10px;font-size:15px">반려견 동반 조건</h3>'+(caution?'<p role="note" style="padding:12px;background:#fff0db;border-left:3px solid #a64622;font-weight:700">'+escape(caution.summary)+'</p>':'')+'<dl style="margin:0">'+get(place).map(row=>'<div style="margin:8px 0"><dt style="font-weight:700;font-size:12px">'+escape(row.label)+'</dt><dd style="margin:3px 0 0;font-size:13px;line-height:1.65;overflow-wrap:anywhere">'+escape(row.value)+'</dd></div>').join('')+'</dl><p style="font-size:12px;margin:10px 0 0">'+escape(freshness(place))+'<br>자료 확인일은 운영정책 갱신일과 다릅니다. 현장 운영·요금·예약 여부는 방문 전 확인해 주세요.</p>'+(source(place)?'<p style="font-size:12px"><a href="'+escape(source(place))+'" target="_blank" rel="noopener noreferrer">이번에 대조한 공식 동반 자료 ↗</a></p>':'')+(caution&&caution.source!==source(place)?'<p style="font-size:12px"><a href="'+escape(caution.source)+'" target="_blank" rel="noopener noreferrer">서로 다른 안내가 있는 공식 자료 ↗</a></p>':'')+(notes?'<details class="place-official-notes"><summary>공식 소개의 동반 안내 더 보기</summary><p style="white-space:pre-line">'+escape(notes.excerpt)+'</p><p><a href="'+escape(notes.source)+'" target="_blank" rel="noopener noreferrer">공식 관광 소개 ↗</a> · 자료 대조 '+escape(notes.checked)+'</p><p>소개 자료의 안내이며 당일 운영·허용 범위를 보장하지 않습니다. 다른 안내와 다르면 운영기관에 확인해 주세요.</p></details>':'')+reportLink(place)+'</section>'+visitPanel(place);}
  function visitPanel(place){const info=(evidence||root.PlaceEvidence)?.visit?.(place);if(!info)return '';return '<details class="place-visit-info" style="margin:16px 0;padding:16px;border:1px solid #ddd3c4;border-radius:12px;background:#fffef9"><summary style="font-weight:700;cursor:pointer">운영시간·주차·공식 이용 안내</summary><dl style="margin:14px 0">'+info.rows.map(row=>'<div style="margin:10px 0"><dt style="font-weight:700;font-size:13px">'+escape(row.label)+'</dt><dd style="margin:4px 0 0;white-space:pre-line;font-size:14px;line-height:1.7">'+escape(row.value)+'</dd></div>').join('')+'</dl>'+(info.petNotes.length?'<h3 style="font-size:15px">반려견 관련 추가 안내</h3>'+info.petNotes.map(note=>'<p style="white-space:pre-line;font-size:14px;line-height:1.7">'+escape(note)+'</p>').join(''):'')+'<p style="font-size:12px;line-height:1.7"><a href="'+escape(info.source)+'" target="_blank" rel="noopener noreferrer">공식 관광 상세 자료 ↗</a> · 자료 조회 '+escape(info.checked)+'<br>방문 전 운영시간·요금·동반 조건을 운영기관에 확인해 주세요.</p></details>';}
  function summary(place){const rows=get(place),caution=(evidence||root.PlaceEvidence)?.caution?.(place);return (caution?caution.summary+' · ':'')+rows[1].value+' · 준비물: '+rows[2].value;}
  function source(place){const data=evidence||root.PlaceEvidence;return data?.camping?.(place)?.source||(data?.conditions(place)?data.get(place).source:'');}
  function reportLink(place){
    const subject=encodeURIComponent('발자국 장소 정보 수정 제보: '+String(place?.name||'장소'));
    const body=encodeURIComponent('장소: '+String(place?.name||'')+'\n장소 ID: '+String(place?.id||'')+'\n변경된 내용:\n확인 가능한 공식 안내 주소 또는 확인 경위:\n');
    return '<a href="mailto:footstepbiz@gmail.com?subject='+subject+'&amp;body='+body+'" style="font-size:13px">정보 수정 제보 ↗</a>';
  }
  function freshness(place,now=Date.now()){
    const data=evidence||root.PlaceEvidence,pet=data?.conditions(place),camp=data?.camping?.(place),record=data?.get?.(place),checked=pet?(record?.petChecked||record?.checked):camp?.checked;
    if((pet||camp)&&/^\d{4}-\d{2}-\d{2}$/.test(checked||'')){const time=Date.parse(checked+'T00:00:00+09:00');if(Number.isFinite(time)&&new Date(time+9*3600000).toISOString().slice(0,10)===checked&&time<=now)return checked+' 공식 동반 자료 확인 · 당일 운영은 방문 전 확인';}
    const description=String(place?.description||'');
    const source=description.match(/공식안내:\s*(https?:\/\/[^\s·]+)/)?.[1];
    const value=description.match(/확인일:\s*(\d{4}-\d{2}-\d{2})/)?.[1];
    let trusted=false;try{const url=new URL(source);trusted=url.protocol==='https:'&&!url.username&&!url.password&&['gocamping.or.kr','www.gocamping.or.kr','gil.seoul.go.kr','www.foodsafetykorea.go.kr','korean.visitseoul.net','www.durunubi.kr','durunubi.kr','korean.visitkorea.or.kr','sjfmc.or.kr','www.suwon.go.kr','www.visitbusan.net','visitbusan.net'].includes(url.hostname);}catch{}
    if(!trusted||!value)return '자료 확인일 미확인 · 방문 전 문의';
    const time=Date.parse(value+'T00:00:00Z');
    if(!Number.isFinite(time)||new Date(time).toISOString().slice(0,10)!==value||time>now)return '자료 확인일 미확인 · 방문 전 문의';
    return value+' 자료 확인'+(now-time>180*86400000?' · 확인 후 180일 경과, 운영기관 재확인 필요':' · 당일 운영은 방문 전 확인');
  }
  return {get,panel,summary,freshness,source,visitPanel};
});
