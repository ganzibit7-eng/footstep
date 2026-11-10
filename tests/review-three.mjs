import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {ensurePublication,publicationState} from '../scripts/pages-publication.mjs';

const running={id:1,run_attempt:1,name:'pages build and deployment',head_sha:'old',status:'in_progress'};
const success={...running,head_sha:'new',status:'completed',conclusion:'success'};
test('publication never restarts any active deployment and skips obsolete commits',()=>{
 assert.equal(publicationState('new','new',[running]),'wait');
 assert.equal(publicationState('new','new',[success]),'published');
 assert.equal(publicationState('old','new',[]),'superseded');
});
test('generated and weather publication requests once only after all active runs finish',async()=>{
 let tick=0,requests=0;const snapshots=[[running],[],[],[{...success,id:2,status:'in_progress'}],[{...success,id:2}]];
 const result=await ensurePublication({expected:'new',allowRequest:true,now:()=>tick,timeout:100,
  read:async()=>({main:'new',runs:snapshots.shift()}),request:async()=>requests++,sleep:async()=>tick++});
 assert.equal(result,'published');assert.equal(requests,1);
});
test('failed, unconfirmed and superseded deployments never qualify for notifications',async()=>{
 let tick=0,reads=0;
 await assert.rejects(ensurePublication({expected:'new',allowRequest:true,now:()=>tick,timeout:100,
  read:async()=>({main:'new',runs:reads++?[{...success,id:2,conclusion:'failure'}]:[]}),request:async()=>{},sleep:async()=>tick++}),/failed/);
 assert.equal(await ensurePublication({expected:'old',read:async()=>({main:'new',runs:[]}),request:async()=>assert.fail(),sleep:async()=>assert.fail()}),'superseded');
 tick=0;await assert.rejects(ensurePublication({expected:'new',now:()=>tick,timeout:2,read:async()=>({main:'new',runs:[]}),request:async()=>assert.fail(),sleep:async()=>tick++}),/not confirmed/);
});

function inbox(reloadFails){
 let submit,loads=0;const messages=[],revisions=[],note={set textContent(v){messages.push(v)}},filter={value:'pending'},list={addEventListener:(n,f)=>submit=f};
 const nodes={'[data-correction-list]':list,'[data-correction-admin-status]':note,'[data-correction-filter]':filter,'[data-correction-prev]':{},'[data-correction-next]':{},'[data-correction-page]':{},'[data-correction-refresh]':{}};
 const el={classList:{add(){}},querySelector:s=>nodes[s],querySelectorAll:()=>[],setAttribute(){},replaceChildren(){}};
 const row={id:'fixture',revision:1,status:'pending',target_name:'가상 장소',created_at:'2026-11-10',target_path:'/places/fixture/'};
 const sb={rpc:async(name,args)=>{if(name==='admin_review_content_correction'){revisions.push(args.p_revision);return {data:{id:row.id,revision:args.p_revision+1},error:null};}loads++;return loads>1&&reloadFails?{error:{message:'fixture reload failure'}}:{data:{items:[row],total:1},error:null};}};
 const ctx={module:{exports:{}},URL,MutationObserver:class{observe(){}disconnect(){}}};vm.runInNewContext(fs.readFileSync('admin-corrections.js','utf8'),ctx);
 const instance=ctx.module.exports.mount(el,sb,()=>true);
 return {messages,list,revisions,instance,save:()=>submit({preventDefault(){},target:{closest:()=>({dataset:{correctionReview:row.id},elements:{status:{value:'resolved'},note:{value:'검증용 처리 메모'}}})}})};
}
test('saved review with failed reload retains correct revision and explicitly reports the partial outcome',async()=>{
 const f=inbox(true);await f.instance.load();await f.save();assert.match(f.messages.at(-1),/저장했지만.*불러오지 못/);assert(f.list.innerHTML.includes('처리 완료'));
 await f.save();assert.deepEqual(f.revisions,[1,2]);f.instance.dispose();
});
test('successful review and reload retain normal confirmation',async()=>{
 const f=inbox(false);await f.instance.load();await f.save();assert.match(f.messages.at(-1),/저장했어요/);f.instance.dispose();
});

for(const file of ['detail-editorial.js','route-experience.js'])test(file+' preserves query/hash for normal, copied and modified-click return links',()=>{
 const source=fs.readFileSync(file,'utf8'),a=source.indexOf(" const back=page.querySelector('[data-detail-back]');"),b=source.indexOf(" back?.addEventListener('click'",a),end=source.indexOf('\n',b);
 const snippet=source.slice(a,end);for(const ref of ['https://balzaguk.com/discover.html?q=광교&sort=relevance#find-place','https://evil.example/discover.html?q=bad','']){
  let handler,backs=0;const link={href:'/discover.html?kind=facilities#find-place',addEventListener:(n,f)=>handler=f};const c={page:{querySelector:()=>link,querySelectorAll:()=>[]},document:{referrer:ref},location:{origin:'https://balzaguk.com'},history:{length:3,back(){backs++}},URL};
  vm.runInNewContext(snippet,c);let prevented=0;handler({button:0,ctrlKey:true,preventDefault(){prevented++}});assert.equal(prevented,0);assert.equal(backs,0);
  handler({button:0,preventDefault(){prevented++}});
  if(ref.includes('https://balzaguk.com/')){assert.match(link.href,/q=%EA%B4%91%EA%B5%90&sort=relevance#find-place/);assert.equal(backs,1);}else{assert.equal(link.href,'/discover.html?kind=facilities#find-place');assert.equal(backs,0);}
 }
});
test('weather no longer requests independent Pages builds; one serialized workflow owns requests',()=>{
 const weather=fs.readFileSync('.github/workflows/refresh-weather.yml','utf8'),notify=fs.readFileSync('.github/workflows/search-discovery.yml','utf8');
 assert(!weather.includes('pages/builds'));assert(!weather.includes('pages: write'));assert(notify.includes("'Refresh regional weather'"));assert(notify.includes('cancel-in-progress: false'));assert(notify.includes('node scripts/pages-publication.mjs --request'));assert(notify.includes("if: steps.publish.outputs.current == 'true'"));
});
