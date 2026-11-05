import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {verifiedRoute,routeDistance} from './detail-editorial.mjs';
const source=readFileSync('course-routes.js','utf8'),a=source.indexOf('const routes=')+13,records=JSON.parse(source.slice(a,source.indexOf(';',a)));
const counts={},courses=[];
for(const id of readdirSync('courses')){let h;try{h=readFileSync('courses/'+id+'/index.html','utf8')}catch{continue}if(!h.includes('data-detail-kind="course"'))continue;
 const route=verifiedRoute(id,h),record=records[id];const state=route?'official-gpx':record?.proposed?'proposal-not-verified':record?'stored-geometry-source-review':'location-only';counts[state]=(counts[state]||0)+1;
 courses.push({id,name:h.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1],state,source:record?.source||null,geometrySource:route?.source||null,parts:route?.parts.length||0,points:route?.parts.reduce((a,p)=>a+p.length,0)||0,measuredKm:route?Number(routeDistance(route).toFixed(3)):null,hasMap:h.includes('id="detail-route-data"')});
}
const report={basis:'Published static course details; DB approved count checked separately. Stored coordinates alone do not verify geometry or pet access. No new route or licence approval inferred.',total:courses.length,counts,courses};
writeFileSync('docs/route-details-20261105/audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({total:report.total,counts}));
