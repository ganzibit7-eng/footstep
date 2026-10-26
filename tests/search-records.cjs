const fs=require('node:fs');
module.exports=function(){const embedded=JSON.parse(fs.readFileSync('discover.html','utf8').match(/id="place-data">([\s\S]*?)<\/script>/)[1]);return Array.isArray(embedded)?embedded:JSON.parse(fs.readFileSync('.'+embedded.src.split('?')[0],'utf8'));};
