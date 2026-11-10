import {execFileSync} from 'node:child_process';
import {appendFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

export function publicationState(expected,main,runs){
 if(main!==expected)return 'superseded';
 const pages=runs.filter(r=>r.name==='pages build and deployment');
 if(pages.some(r=>r.status!=='completed'))return 'wait';
 if(pages.some(r=>r.head_sha===expected&&r.conclusion==='success'))return 'published';
 return 'missing';
}

export async function ensurePublication({expected,read,request,allowRequest=false,sleep,now=Date.now,timeout=2400000}){
 const started=now();let requested=false,previous=new Map();
 while(now()-started<timeout){
  const {main,runs}=await read();
  const state=publicationState(expected,main,runs);
  if(state==='superseded'||state==='published')return state;
  if(requested){
   const failures=runs.filter(r=>r.name==='pages build and deployment'&&r.head_sha===expected&&r.status==='completed'&&r.conclusion!=='success'&&previous.get(r.id)!==r.run_attempt);
   if(failures.length)throw Error('Pages deployment failed; no search notification sent');
  }
  if(state==='missing'&&allowRequest&&!requested){
   previous=new Map(runs.map(r=>[r.id,r.run_attempt]));
   await request();requested=true;
  }
  await sleep(10000);
 }
 throw Error('Pages deployment not confirmed within the bounded wait; no search notification sent');
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const repo=process.env.GITHUB_REPOSITORY;
 if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo||''))throw Error('Repository required');
 const api=(route,post=false)=>{
  try{return execFileSync('gh',['api',...(post?['--method','POST']:[]),`repos/${repo}/${route}`],{encoding:'utf8',maxBuffer:4e6,stdio:['ignore','pipe','pipe']});}
  catch{throw Error('GitHub publication request failed; no credentials or response body logged');}
 };
 const expected=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
 const result=await ensurePublication({expected,allowRequest:process.argv.includes('--request'),
  read:async()=>({main:JSON.parse(api('commits/main')).sha,runs:JSON.parse(api('actions/runs?per_page=100')).workflow_runs}),
  request:async()=>{api('pages/builds',true);console.log('Requested one Pages build after previous deployments finished.');},
  sleep:ms=>new Promise(resolve=>setTimeout(resolve,ms))});
 console.log(result==='published'?'Pages deployment success confirmed.':'A newer main commit superseded this run; skipping stale notifications.');
 if(process.env.GITHUB_OUTPUT)appendFileSync(process.env.GITHUB_OUTPUT,`current=${result==='published'}\n`);
}
