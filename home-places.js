(function(root){'use strict';
 function init(){const doc=root.document;if(!doc)return;const reduced=root.matchMedia?.('(prefers-reduced-motion: reduce)');
  doc.querySelectorAll('.home-place-scene,#walk-shopping').forEach(section=>{const rail=section.querySelector('.home-place-rail')||section.querySelector('.walk-shopping-items'),prev=section.querySelector('[data-place-prev]'),next=section.querySelector('[data-place-next]'),position=section.querySelector('[data-place-position]');if(!rail||!prev||!next)return;const cards=Array.from(rail.children);
   const total=cards.filter(card=>card.dataset?.placeEnd===undefined).length;
   const update=()=>{const max=rail.scrollWidth-rail.clientWidth,current=Math.max(0,Math.min(max,rail.scrollLeft));prev.disabled=current<4;next.disabled=current>=max-4;const step=(cards[1]?.offsetLeft??0)-(cards[0]?.offsetLeft??0);if(position)position.textContent=max>4&&current>=max-4&&total<cards.length?'더 보기':(max<=4?'전체':String(Math.min(total,Math.round(current/Math.max(1,step))+1)))+' / '+total;};
   const move=direction=>{const step=(cards[1]?.offsetLeft??0)-(cards[0]?.offsetLeft??0)||rail.clientWidth;rail.scrollBy({left:direction*step,behavior:reduced?.matches?'auto':'smooth'});};
   prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));rail.addEventListener('scroll',update,{passive:true});rail.addEventListener('keydown',event=>{if(event.target!==rail||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();if(event.key==='Home'||event.key==='End')rail.scrollTo({left:event.key==='Home'?0:rail.scrollWidth,behavior:'auto'});else move(event.key==='ArrowLeft'?-1:1);});root.addEventListener('resize',update,{passive:true});update();
  });
 }
 if(root.document&&root.document.readyState!=='complete')root.document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(typeof globalThis!=='undefined'?globalThis:this);
