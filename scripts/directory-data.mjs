// Only internal download/matching bookkeeping is omitted from the public search
// payload. Keep attribution, license, crop policy, captions and source links.
const bookkeeping=new Set(['sha256','sourceSha256','assetSha256','sourcePageSha256','bytes','courses','commonsPageId','commonsRevision','pageid','sourceOrder','datasetContentId','datasetShowFlag','id','key']);
export function directoryPhoto(photo,extra={}){
 return photo?Object.fromEntries(Object.entries({...photo,...extra}).filter(([key])=>!bookkeeping.has(key))):null;
}
