export function administrativeArea(address){
 const p=String(address||'').trim().split(/\s+/),aliases={'전라북':'전북','전라남':'전남','충청북':'충북','충청남':'충남','경상북':'경북','경상남':'경남'};
 const region=p[0]?.replace(/(?:특별자치도|특별자치시|특별시|광역시|도|시)$/,'');return p.length>=2&&/(?:시|군|구)$/.test(p[1])?{region:aliases[region]||region,area:p[1]}:null;
}
export function sameArea(a,b){const x=administrativeArea(a.address),y=administrativeArea(b.address);return Boolean(x&&y&&x.region===y.region&&x.area===y.area);}
export function straightLineKm(a,b){
 const p=[a.lat,a.lng,b.lat,b.lng];if(p.some(v=>v===null||v===undefined||v===''||!Number.isFinite(Number(v))))return Infinity;
 const [x,y,u,v]=p.map(Number);if([x,u].some(n=>n<32||n>40)||[y,v].some(n=>n<123||n>133))return Infinity;
 const rad=n=>n*Math.PI/180,h=Math.sin(rad(u-x)/2)**2+Math.cos(rad(x))*Math.cos(rad(u))*Math.sin(rad(v-y)/2)**2;return 6371*2*Math.asin(Math.sqrt(Math.min(1,h)));
}
export function nearbyEntries(item,pool){return pool.map(other=>({other,km:straightLineKm(item,other),sameArea:sameArea(item,other)})).filter(x=>x.other.id!==item.id&&x.km<=3).sort((a,b)=>Number(b.sameArea)-Number(a.sameArea)||a.km-b.km||String(a.other.id).localeCompare(String(b.other.id))).slice(0,6);}
export function sameAreaEntries(item,pool){return pool.filter(other=>other.id!==item.id&&sameArea(item,other)).sort((a,b)=>String(a.name).localeCompare(String(b.name),'ko')).slice(0,4);}
