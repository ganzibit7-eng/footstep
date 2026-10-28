import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {publicFile,comparisonRows,missingAssets} from '../scripts/audit-search-assets.mjs';

test('home, query URLs and directory indexes resolve inside the same public root',()=>{
 const root=path.resolve('fixture');
 assert.equal(publicFile(root,'https://balzaguk.com/'),path.join(root,'index.html'));
 assert.equal(publicFile(root,'https://balzaguk.com/?course=c16'),path.join(root,'index.html'));
 assert.equal(publicFile(root,'https://balzaguk.com/with-dog/seoul/'),path.join(root,'with-dog','seoul','index.html'));
 assert.equal(publicFile(root,'https://balzaguk.com/discover.html?region=seoul'),path.join(root,'discover.html'));
});
test('rejects other hosts and encoded path escapes',()=>{
 assert.throws(()=>publicFile('.','https://example.com/'));
 assert.throws(()=>publicFile('.','https://balzaguk.com/%2e%2e%2foutside'));
 assert.throws(()=>publicFile('.','https://balzaguk.com/%5coutside'));
});
test('reads the actual earlier and later comparison columns without summing overlapping exports',()=>{
 const row=comparisonRows('인기 페이지\nhttps://balzaguk.com/courses/c16/\t0\t5\t-5\t0\t1,038\t-1,038\t0\t7.2')[0];
 assert.deepEqual(row,{url:'https://balzaguk.com/courses/c16/',beforeClicks:5,beforeImpressions:1038,afterClicks:0,afterImpressions:0});
 assert.equal(missingAssets([row,row],'.',{exists:()=>false}).length,1);
 assert.equal(comparisonRows('https://balzaguk.com/')[0].beforeClicks,null);
 assert.throws(()=>comparisonRows('https://balzaguk.com/\t0'));
 assert.throws(()=>missingAssets([row,{...row,beforeClicks:6}],'.',{exists:()=>false}));
});
test('ranks clicks before impressions and excludes existing pages without declaring a live 404',()=>{
 const row=(id,clicks,impressions)=>({url:'https://balzaguk.com/'+id+'/',beforeClicks:clicks,beforeImpressions:impressions,afterClicks:0,afterImpressions:0});
 const rows=[row('a',0,200),row('b',2,5),row('c',2,20),row('existing',8,100)];
 const result=missingAssets(rows,'.',{exists:file=>file.includes(path.sep+'existing'+path.sep)});
 assert.deepEqual(result.map(row=>row.url.split('/')[3]),['c','b','a']);
});
