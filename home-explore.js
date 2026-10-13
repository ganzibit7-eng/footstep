/* Homepage region selection: public address data, no geolocation or extra requests. */
(function(root){
  'use strict';
  const regions=Object.freeze([
    ['seoul','서울',['서울특별시','서울']],['gyeonggi','경기',['경기도','경기']],
    ['incheon','인천',['인천광역시','인천']],['busan','부산',['부산광역시','부산']],
    ['jeju','제주',['제주특별자치도','제주도','제주']],['gangwon','강원',['강원특별자치도','강원도','강원']],
    ['daegu','대구',['대구광역시','대구']],['gwangju','광주',['광주광역시','광주']],
    ['daejeon','대전',['대전광역시','대전']],['ulsan','울산',['울산광역시','울산']],
    ['sejong','세종',['세종특별자치시','세종시','세종']],['chungbuk','충북',['충청북도','충북']],
    ['chungnam','충남',['충청남도','충남']],['jeonbuk','전북',['전북특별자치도','전라북도','전북']],
    ['jeonnam','전남',['전라남도','전남']],['gyeongbuk','경북',['경상북도','경북']],
    ['gyeongnam','경남',['경상남도','경남']]
  ].map(([key,label,aliases])=>Object.freeze({key,label,aliases:Object.freeze(aliases)})));
  const storageKey='balzaguk_home_area_v1';
  function valid(key){return key==='all'||regions.some(r=>r.key===key);}
  function label(key){return key==='all'?'전국':regions.find(r=>r.key===key)?.label||'';}
  function regionKey(course,address){
    const value=String(address?.address||address?.roadAddress||address?.parcelAddress||'').trim();
    const tokens=value.split(/[\s,]+/),first=tokens[0];
    if(first==='전남광주통합특별시'){
      // The source uses a combined administration name; classify only explicit source labels.
      if(/^광주(?:\s|$)/.test(course?.name||'')||/^(?:광주(?:시)?|동구|서구|남구|북구|광산구)$/.test(tokens[1]||''))return 'gwangju';
      if(/^(?:목포시|여수시|순천시|나주시|광양시|담양군|곡성군|구례군|고흥군|보성군|화순군|장흥군|강진군|해남군|영암군|무안군|함평군|영광군|장성군|완도군|진도군|신안군)$/.test(tokens[1]||''))return 'jeonnam';
      if(/^전남(?:\s|$)/.test(course?.name||''))return 'jeonnam';
      return '';
    }
    const direct=regions.find(r=>r.aliases.includes(first));if(direct)return direct.key;
    // Reverse-order geocoder addresses contain a full province name after comma separators.
    const canonical=regions.filter(r=>r.aliases.filter(a=>a.length>2).some(a=>tokens.includes(a)));
    return canonical.length===1?canonical[0].key:'';
  }
  function filter(courses,state,tools){
    if(!valid(state.region))return [];
    const query=String(state.query||'').trim();
    const max=Number(state.maxMinutes)||0;
    return courses.filter(c=>{
      if(state.region!=='all'&&regionKey(c,tools.address(c))!==state.region)return false;
      if(query&&!tools.query(c,query))return false;
      if(state.diff&&state.diff!=='all'&&c.diff!==state.diff)return false;
      if(max){const minutes=tools.minutes(c);if(minutes===null||!Number.isFinite(minutes)||minutes>max)return false;}
      return tools.comfort(c,state.comfort||{});
    });
  }
  function readSelection(storage){try{const value=(storage||root.localStorage).getItem(storageKey);return valid(value)?value:'';}catch{return '';}}
  function writeSelection(key,storage){if(!valid(key))return false;try{(storage||root.localStorage).setItem(storageKey,key);return true;}catch{return false;}}
  const api=Object.freeze({regions,valid,label,regionKey,filter,readSelection,writeSelection});
  if(typeof module==='object'&&module.exports)module.exports=api;else root.HomeExplore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
