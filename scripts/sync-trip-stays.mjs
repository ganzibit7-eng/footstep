import {readFileSync,writeFileSync} from 'node:fs';
import {tripStays,tripBooking} from './trip-stays.mjs';
const root=new URL('../',import.meta.url);
let home=readFileSync(new URL('index.html',root),'utf8');
let homeCount=0;
for(const stay of tripStays){
 const start=home.indexOf(`<article class="home-place-card" data-place-id="${stay.id}">`);
 if(start>=0){const end=home.indexOf('</article>',start);const card=home.slice(start,end).replace(/<aside class="trip-booking"[\s\S]*?<\/aside>/g,'');home=home.slice(0,start)+card.replace('<details class="home-place-source">',tripBooking(stay.id,{compact:true})+'<details class="home-place-source">')+home.slice(end);homeCount++;}
 const file=new URL(`places/${stay.id}/index.html`,root);
 let page=readFileSync(file,'utf8').replace(/<aside class="trip-booking"[\s\S]*?<\/aside>/g,'');
 if(!page.includes('/trip-stays.css?v=20261022'))page=page.replace('</head>','<link rel="stylesheet" href="/trip-stays.css?v=20261022"></head>');
 if(!page.includes('<p class="place-save-note">'))throw Error(`Missing booking insertion point: ${stay.id}`);
 page=page.replace('<p class="place-save-note">',tripBooking(stay.id)+'<p class="place-save-note">');
 writeFileSync(file,page);
}
writeFileSync(new URL('index.html',root),home);
console.log(`Trip.com: ${tripStays.length} detail pages; ${homeCount} home cards.`);
