(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.MapServices=api;})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 function create(host,timeout=10000){let pending;return {ready(){if(pending)return pending;pending=new Promise((resolve,reject)=>{let finished=false;const finish=(error,value)=>{if(finished)return;finished=true;clearTimeout(timer);error?reject(error):resolve(value);},timer=setTimeout(()=>finish(Error('지도 검색 연결이 지연되고 있어요. 다시 시도해 주세요.')),timeout);try{const maps=host.kakao?.maps;if(!maps?.load)throw Error('지도 검색 파일에 연결하지 못했어요. 새로고침 후 다시 시도해 주세요.');maps.load(()=>{try{if(!maps.services?.Places||!maps.services?.Geocoder)throw Error('지도 검색을 준비하지 못했어요. 다시 시도해 주세요.');finish(null,{places:new maps.services.Places(),geocoder:new maps.services.Geocoder()});}catch(e){finish(e);}});}catch(e){finish(e);}}).catch(e=>{pending=null;throw e;});return pending;}};}
 return {create};
});
