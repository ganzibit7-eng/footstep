import {readFile,writeFile,mkdir} from 'node:fs/promises';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),file=path.join(root,'data/weather.json');
// Public regional reference points only. No visitor location or account data.
const regions=[['seoul','서울',37.5665,126.978],['incheon','인천',37.4563,126.7052],['suwon','수원',37.2636,127.0286],['chuncheon','춘천',37.8813,127.7298],['gangneung','강릉',37.7519,128.8761],['daejeon','대전',36.3504,127.3845],['sejong','세종',36.4801,127.289],['cheongju','청주',36.6424,127.489],['hongseong','홍성',36.6012,126.6608],['gwangju','광주',35.1595,126.8526],['jeonju','전주',35.8242,127.148],['mokpo','목포',34.8118,126.3922],['yeosu','여수',34.7604,127.6622],['daegu','대구',35.8714,128.6014],['andong','안동',36.5684,128.7294],['pohang','포항',36.019,129.3435],['busan','부산',35.1796,129.0756],['ulsan','울산',35.5384,129.3114],['changwon','창원',35.228,128.6811],['jinju','진주',35.18,128.1076],['jeju','제주',33.4996,126.5312],['seogwipo','서귀포',33.2541,126.56]];
export function extractForecast(body,now=Date.now()){
 if(body?.properties?.meta?.units?.air_temperature!=='celsius')throw Error('Unexpected temperature unit');
 const updatedAt=body.properties.meta.updated_at;if(!Number.isFinite(Date.parse(updatedAt))||Date.parse(updatedAt)>now+300000||now-Date.parse(updatedAt)>36*3600000)throw Error('Invalid forecast update time');
 const hours=body.properties.timeseries.filter(x=>{const t=Date.parse(x.time);return t>=now-90*60000&&t<=now+48*3600000;}).map(x=>({time:x.time,temp:x.data?.instant?.details?.air_temperature,symbol:x.data?.next_1_hours?.summary?.symbol_code||x.data?.next_6_hours?.summary?.symbol_code||''})).filter(x=>Number.isFinite(x.temp)&&x.temp>=-60&&x.temp<=60&&/^[a-z_]+$/.test(x.symbol));
 if(hours.length<20)throw Error('Incomplete forecast');return {updatedAt,hours};
}
async function main(){let previous={regions:[]};try{previous=JSON.parse(await readFile(file,'utf8'));}catch{}const now=Date.now(),result=[];
 for(const [id,name,lat,lng]of regions){const old=previous.regions.find(r=>r.id===id),url=`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lng}`;
  try{if(old&&Date.parse(old.expires)>now){result.push(old);continue;}const headers={'User-Agent':'BalzagukWeather/1.0 (+https://balzaguk.com/)',Accept:'application/json'};if(old?.lastModified)headers['If-Modified-Since']=old.lastModified;
   const res=await fetch(url,{headers,signal:AbortSignal.timeout(20000)});if(res.status===304&&old){result.push({...old,expires:res.headers.get('expires')||new Date(now+3600000).toUTCString()});continue;}if(res.status!==200)throw Error('HTTP '+res.status);const weather=extractForecast(await res.json(),now);result.push({id,name,lat,lng,...weather,lastModified:res.headers.get('last-modified'),expires:res.headers.get('expires')});
  }catch(e){console.error(name,e.message);if(old&&now-Date.parse(old.updatedAt)<=36*3600000)result.push(old);}
 }
 if(result.length!==regions.length)throw Error('Incomplete regional coverage: keep previous snapshot');
 await mkdir(path.dirname(file),{recursive:true});await writeFile(file,JSON.stringify({version:1,generatedAt:new Date(now).toISOString(),provider:'MET Norway',source:'https://api.met.no/weatherapi/locationforecast/2.0/documentation',license:'https://creativecommons.org/licenses/by/4.0/',changes:'Regional forecast fields selected from original data',regions:result})+'\n');console.log('Weather snapshot:',result.length,'public reference points');
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(import.meta.filename))await main();
