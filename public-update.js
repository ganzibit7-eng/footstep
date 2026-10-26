// Check the worker on ordinary public-page visits. Never reload a live GPS page.
(function(){'use strict';
 if(!('serviceWorker' in navigator))return;
 function check(){navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).catch(function(){});}
 if(document.readyState==='complete')check();else window.addEventListener('load',check,{once:true});
})();
