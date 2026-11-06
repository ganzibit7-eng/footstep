// Offline guard for common credential formats in the current tracked tree.
// Reports locations and categories only; never print matching credentials.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

export function secretLocations(text){
 const found=[];
 const add=(kind,m)=>found.push({kind,line:text.slice(0,m.index).split('\n').length});
 const rules=[
  ['private-key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ['supabase-secret',/\bsb_secret_[A-Za-z0-9_-]{20,}/g],
  ['github-token',/\b(?:ghp_|github_pat_)[A-Za-z0-9_]{30,}/g],
  ['aws-access-key',/\bAKIA[0-9A-Z]{16}\b/g],
 ];
 for(const [kind,pattern]of rules)for(const match of text.matchAll(pattern))add(kind,match);
 for(const match of text.matchAll(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g)){
  try{
   const payload=JSON.parse(Buffer.from(match[0].split('.')[1],'base64url').toString('utf8'));
   if(['service_role','authenticated'].includes(payload.role))add('private-session-or-service-jwt',match);
  }catch{/* A non-JWT lookalike is not evidence of a credential. */}
 }
 return found;
}

export function scanTrackedTree(){
 const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8',maxBuffer:16*1024*1024}).split('\0').filter(Boolean);
 const findings=[];let scanned=0;
 for(const file of files){
  if(!/\.(html?|[cm]?js|ts|json|ya?ml|toml|sql|md|txt|env)$/i.test(file)&&!/(^|\/)\.env(?:\.|$)/.test(file))continue;
  const bytes=fs.readFileSync(file);if(bytes.includes(0))continue;scanned++;
  for(const finding of secretLocations(bytes.toString('utf8')))findings.push({file,...finding});
 }
 return {scanned,findings};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const {scanned,findings}=scanTrackedTree();
 if(findings.length){for(const f of findings)console.error(`${f.file}:${f.line}: ${f.kind}`);process.exitCode=1;}
 else console.log(`PASS: common private credential formats absent from ${scanned} tracked text files (current tree only).`);
}
