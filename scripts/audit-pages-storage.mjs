import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function excludesFrom(config){
  return config.split(/\r?\n/).filter(line=>/^\s+- /.test(line))
    .map(line=>line.replace(/^\s+- /,'').trim().replace(/^"|"$/g,''));
}
export function excluded(file,entries){
  return entries.some(entry=>file===entry||file.startsWith(entry+'/'));
}
export function audit(rootPath=root){
  const entries=excludesFrom(fs.readFileSync(path.join(rootPath,'_config.yml'),'utf8'));
  const files=execFileSync('git',['ls-files','-z'],{cwd:rootPath,encoding:'utf8',maxBuffer:8e6}).split('\0').filter(Boolean);
  const published=files.filter(p=>!p.split('/').some(x=>/^[._#]/.test(x))&&!excluded(p,entries));
  const omitted=files.filter(p=>excluded(p,entries));
  const broken=[];
  for(const p of published){
    if(!/\.(?:html|js|css|xml|json|webmanifest|txt)$/.test(p))continue;
    const text=fs.readFileSync(path.join(rootPath,p),'utf8');
    for(const m of text.matchAll(/(?:href|src|action)=["']([^"']+)["']|(?:fetch\(|import\s*\()["']([^"']+)["']/g)){
      const raw=m[1]||m[2];
      if(/^(?:[a-z]+:|\/\/|#)/i.test(raw)||raw.includes('${'))continue;
      let ref;try{ref=decodeURIComponent(raw.split(/[?#]/)[0]);}catch{continue;}
      const target=path.posix.normalize(ref.startsWith('/')?ref.slice(1):path.posix.join(path.posix.dirname(p),ref));
      if(excluded(target,entries))broken.push({file:p,target});
    }
  }
  for(const required of ['index.html','sw.js','admin-panel.html','admin-panel.js','walk-tracker.js','place-evidence.js','data/weather.json','sitemap.xml','rss.xml','BingSiteAuth.xml','36cdc2e3fc151330e552ca84f2c8eacb.txt']){
    if(!published.includes(required))throw Error('Required public file excluded: '+required);
  }
  if(broken.length)throw Error('Public references to excluded paths: '+JSON.stringify(broken.slice(0,10)));
  const size=list=>list.reduce((n,p)=>n+fs.statSync(path.join(rootPath,p)).size,0);
  return {trackedBytes:size(files),excludedBytes:size(omitted),publicSourceBytes:size(published),publicFiles:published.length,excludedFiles:omitted.length,notes:'Public source bytes estimate; Jekyll output and compressed artifact sizes differ.'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const result=audit();console.log(JSON.stringify(result,null,2));
  // Leave a margin below the published-site ceiling instead of waiting for a failed deployment.
  if(result.publicSourceBytes>975_000_000)throw Error('Public source exceeds 975 MB safety budget; move verified images to external storage first.');
}
