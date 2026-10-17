const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('home-scenes.js','utf8'),css=fs.readFileSync('home-scenes.css','utf8');
function boot({reduced=false,observer=true,saveData=false,legacyMedia=false}={}){
 let callback,mutation,change,disconnected=0,focus=0,scroll=0;const observed=[],unobserved=[];
 function item(){const classes=new Set(),handlers={};return {classes,handlers,contains:()=>false,classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)},addEventListener:(n,f)=>handlers[n]=f};}
 const heading=item(),card=item(),items=[heading,card],target={setAttribute(){},focus(){focus++;}},section={dataset:{view:'picking'},querySelector:()=>target,scrollIntoView(){scroll++;}},handlers={};
 const area={querySelectorAll:selector=>selector==='.home-motion-enter'?items.filter(x=>x.classes.has('home-motion-enter')):items};
 const media={matches:reduced,...(legacyMedia?{addListener:fn=>change=fn}:{addEventListener:(n,fn)=>change=fn})};
 const ctx={navigator:{connection:{saveData}},document:{readyState:'complete',activeElement:{},querySelectorAll:()=>[{dataset:{homeJump:'home-explore'},addEventListener:(n,f)=>handlers[n]=f}],getElementById:id=>id==='nearby-section'?area:id==='home-explore'?section:target},matchMedia:()=>media};
 if(observer)ctx.IntersectionObserver=function(cb){callback=cb;this.observe=x=>observed.push(x);this.unobserve=x=>unobserved.push(x);this.disconnect=()=>disconnected++;};
 ctx.MutationObserver=function(cb){mutation=cb;this.observe=()=>{};this.disconnect=()=>disconnected++;};vm.createContext(ctx);vm.runInContext(source,ctx);
 return {heading,card,observed,unobserved,items,enter:x=>callback([{target:x,isIntersecting:true}]),late(){const x=item();items.push(x);mutation();return x;},change:()=>change({matches:true}),disconnected:()=>disconnected,jump(){handlers.click({preventDefault(){}});return {focus,scroll};}};
}
for(const opts of [{},{saveData:true},{legacyMedia:true}]){const b=boot(opts);assert.equal(b.observed.length,2);assert(!b.card.classes.size,'readable without initial hiding');b.enter(b.heading);assert(b.heading.classes.has('home-motion-enter'));assert(!b.card.classes.size,'heading entry must not pre-run offscreen card');b.enter(b.card);assert(b.card.classes.has('home-motion-enter'));assert(b.unobserved.includes(b.card));b.card.handlers.focusin();assert(!b.card.classes.size);assert(b.heading.classes.size,'focus only cancels the focused item');const late=b.late();assert(b.observed.includes(late),'asynchronously rendered cards observed');assert.equal(b.observed.length,3,'existing items not observed twice');b.change();assert.equal(b.heading.classes.size,0);assert.equal(b.disconnected(),2);assert.deepEqual(b.jump(),{focus:1,scroll:1});}
for(const opts of [{reduced:true},{observer:false}]){const b=boot(opts);assert.equal(b.observed.length,0);assert.deepEqual(b.jump(),{focus:1,scroll:1});}
assert(css.includes('animation:home-scene-arrive 640ms'));assert(!css.includes('animation-duration:440ms'));assert(css.includes('prefers-reduced-motion:reduce'));assert(!source.includes('fetch('));assert(!source.includes('localStorage'));assert(!css.includes('scroll-snap-type:y'));
console.log('PASS independent heading/card entrance, late course/shopping cards, one-time observation, focus, save-data, legacy media listener and reduced/no-observer fallback.');
