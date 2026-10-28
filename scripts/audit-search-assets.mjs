import path from 'node:path';
import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// Read-only owner audit. A missing local file is a candidate, not proof of a
// live 404 or permission to restore/redirect a rejected record.
export function publicFile(root,input,site='https://balzaguk.com'){
 const url=new URL(input),origin=new URL(site);
 if(url.origin!==origin.origin||url.username||url.password)throw new Error('Unexpected origin');
 const pathname=decodeURIComponent(url.pathname);
 if(pathname.includes('\\')||pathname.includes('\0'))throw new Error('Invalid path');
 const base=path.resolve(root);
 const relative=pathname.replace(/^\/+/, '')+(pathname.endsWith('/')?'index.html':'');
 const file=path.resolve(base,relative);
 if(file!==base&&!file.startsWith(base+path.sep))throw new Error('Path outside public root');
 return file;
}

export function comparisonRows(text){
 const integer=value=>{
  if(!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value))throw new Error('Invalid comparison count');
  return Number(value.replaceAll(',',''));
 };
 return text.split(/\r?\n/).filter(line=>line.startsWith('https://')).map(line=>{
  const cells=line.split('\t');
  if(cells.length===1)return {url:cells[0],beforeClicks:null,beforeImpressions:null,afterClicks:null,afterImpressions:null};
  if(cells.length<9)throw new Error('Incomplete comparison row');
  return {url:cells[0],beforeClicks:integer(cells[2]),beforeImpressions:integer(cells[5]),afterClicks:integer(cells[1]),afterImpressions:integer(cells[4])};
 });
}

export function missingAssets(rows,root,{site='https://balzaguk.com',exists=existsSync}={}){
 const unique=new Map();
 for(const row of rows){
  const file=publicFile(root,row.url,site);
  const previous=unique.get(row.url);
  if(previous&&JSON.stringify(previous.row)!==JSON.stringify(row))throw new Error('Conflicting comparison rows');
  unique.set(row.url,{row,file});
 }
 return [...unique.values()].filter(({file})=>!exists(file)).map(({row})=>row)
  .sort((a,b)=>(b.beforeClicks??-1)-(a.beforeClicks??-1)||(b.beforeImpressions??-1)-(a.beforeImpressions??-1)||a.url.localeCompare(b.url,'en'));
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const args=process.argv.slice(2),inputs=[];let root=process.cwd(),output,limit=20;
 while(args.length){
  const key=args.shift(),value=args.shift();
  if(!value)throw new Error('Missing option value');
  if(key==='--input')inputs.push(value);
  else if(key==='--root')root=value;
  else if(key==='--output')output=value;
  else if(key==='--limit')limit=Number(value);
  else throw new Error('Unknown option: '+key);
 }
 if(!inputs.length||!output||!Number.isSafeInteger(limit)||limit<1||limit>20)throw new Error('Provide --input, --output and --limit 1..20');
 const rows=inputs.flatMap(file=>comparisonRows(readFileSync(file,'utf8'))),missing=missingAssets(rows,root);
 const result={scope:'Local file candidates only; confirm live HTTP and historical decisions separately',ranking:'Earlier-period clicks descending, impressions descending, URL ascending; unknown metrics last',sourceRows:rows.length,rowsWithoutMetrics:rows.filter(row=>row.beforeClicks===null).length,uniqueURLs:new Set(rows.map(row=>row.url)).size,missingCount:missing.length,selected:missing.slice(0,limit)};
 // Output location is explicit: private Search Console counts need not enter a
 // public repository or the deployed site.
 writeFileSync(output,JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({sourceRows:rows.length,uniqueURLs:result.uniqueURLs,missingCount:missing.length,selected:result.selected.length}));
}
