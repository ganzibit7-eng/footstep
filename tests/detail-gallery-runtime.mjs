import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

test('partially visible slides reach the final photo number and disable next at the scroll boundary',()=>{
 const events={},counter={},buttons=[-1,1].map(step=>({dataset:{galleryStep:String(step)},disabled:false,addEventListener(_,fn){this.click=()=>fn();}}));
 const gallery={scrollLeft:0,scrollWidth:2027,clientWidth:1008,
  getBoundingClientRect:()=>({left:0}),addEventListener(name,fn){events[name]=fn;},
  scrollTo({left}){this.scrollLeft=Math.max(0,Math.min(1019,left));events.scroll?.();}
 };
 gallery.children=[0,681,1362].map(offset=>({offsetLeft:offset,getBoundingClientRect:()=>({left:offset-gallery.scrollLeft})}));
 const controls={querySelectorAll:()=>buttons,querySelector(selector){return selector.includes('position')?counter:selector.includes('"-1"')?buttons[0]:buttons[1];}};
 const page={querySelectorAll:()=>[],querySelector(selector){return selector==='.detail-gallery-track'?gallery:selector==='.detail-gallery-controls'?controls:selector==='[data-detail-status]'?{}:null;}};
 const document={querySelector:()=>page},window={matchMedia:()=>({matches:true}),addEventListener(){}};
 vm.runInNewContext(readFileSync('detail-editorial.js','utf8'),{document,window,requestAnimationFrame(fn){fn();return 0;}});
 assert.equal(counter.textContent,'1 / 3');assert(buttons[0].disabled);
 buttons[1].click();assert.equal(counter.textContent,'2 / 3');
 buttons[1].click();assert.equal(gallery.scrollLeft,1019);assert.equal(counter.textContent,'3 / 3');assert(buttons[1].disabled);
 buttons[0].click();assert.equal(counter.textContent,'2 / 3');assert(!buttons[1].disabled);
 buttons[0].click();assert.equal(counter.textContent,'1 / 3');assert(buttons[0].disabled);
});
