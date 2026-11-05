(function(root){'use strict';
 function inspect(data){
  if(!data||!Array.isArray(data.parts)||!data.parts.length||data.parts.length>100)return null;
  let count=0;
  for(const p of data.parts){if(!Array.isArray(p)||p.length<2)return null;for(const c of p){if(++count>50000||!Array.isArray(c)||c.length!==2||!c.every(Number.isFinite)||c[0]<32||c[0]>40||c[1]<123||c[1]>133)return null;}}
  const start=data.parts[0][0],end=data.parts.at(-1).at(-1);
  const close=Math.hypot((start[0]-end[0])*111000,(start[1]-end[1])*88000)<30;
  return {start,end,count,parts:data.parts,close,disconnected:data.parts.length>1};
 }
 function directions(name,point){return 'https://map.kakao.com/link/to/'+encodeURIComponent(name+' GPX 첫 지점')+','+point[0]+','+point[1];}
 const api=Object.freeze({inspect,directions});root.RouteGeometry=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis==='undefined'?this:globalThis);
