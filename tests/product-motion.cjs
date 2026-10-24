const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('product-motion.js','utf8');
function setup({reduce=false,saveData=false,intersection=true,animate=true,directMap=false}={}){
 const events={},observers=[],animations=[],mutations=[];let mediaChange,raf,scroll;
 const node={nodeType:1,closest:()=>null,getClientRects:()=>[{}],matches:s=>s.includes('.course-card'),classList:{contains:()=>false}};
 if(animate)node.animate=(frames,options)=>{const a={frames,options,cancelled:false,cancel(){this.cancelled=true;},finished:new Promise(()=>{})};animations.push(a);return a;};
 const button={matches:()=>true,classList:{contains:c=>c==='on'},setAttribute(k,v){this[k]=v;}};
 const proposal={querySelectorAll:()=>[button]},list={};
 const scope={dataset:{pageSection:'map'},querySelectorAll:()=>[node]};
 const document={readyState:'complete',hidden:false,addEventListener:(k,f)=>{const previous=events[k];events[k]=previous?()=>{previous();f();}:f;},removeEventListener(){},querySelector:()=>scope,getElementById:id=>id==='register-section'?proposal:id==='course-grid'?list:null};
 const reduced={matches:reduce,addEventListener:(k,f)=>mediaChange=f};
 const window={document,navigator:{connection:{saveData}},matchMedia:()=>reduced,MutationObserver:class{constructor(cb){this.cb=cb;mutations.push(this);}observe(target,options){this.target=target;this.options=options;}}};
 if(directMap){window.location={hash:'#map'};window.requestAnimationFrame=cb=>raf=cb;window.scrollTo=options=>scroll=options;}
 if(intersection)window.IntersectionObserver=class{constructor(cb){this.cb=cb;this.disconnected=false;observers.push(this);}observe(){}unobserve(){}disconnect(){this.disconnected=true;}};
 vm.runInNewContext(source,{window});
 return {window,node,scope,events,animations,observers,mutations,button,reduced,settle:()=>raf(),get scroll(){return scroll;},change:()=>mediaChange(),deliver:()=>observers.at(-1)?.cb([{isIntersecting:true,target:node}])};
}
test('entry is optional: reduced motion and data saver keep content static',()=>{
 for(const config of [{reduce:true},{saveData:true}]){const h=setup(config);h.window.PawUI.page('walk');assert.equal(h.observers.length,0);assert.equal(h.animations.length,0);}
});
test('visible headings enter briefly; route changes cancel unfinished motion',()=>{
 const h=setup();h.deliver();assert.equal(h.animations.length,1);assert(h.animations[0].options.duration<=600);h.window.PawUI.page('register');assert(h.animations[0].cancelled);assert(h.observers[0].disconnected);
});
test('interaction, backgrounding and preference changes stop motion',()=>{
 for(const event of ['pointerdown','focusin','visibilitychange','media']){const h=setup();h.deliver();if(event==='visibilitychange')h.window.document.hidden=true;if(event==='media'){h.reduced.matches=true;h.change();}else h.events[event]();assert(h.animations[0].cancelled);assert.equal(h.observers[0].disconnected,event==='visibilitychange'||event==='media');}
});
test('home reuses existing motion and missing browser animation APIs do not hide content',()=>{
 const h=setup();h.window.PawUI.page('home');assert.equal(h.observers.length,1);assert(h.observers[0].disconnected);assert.equal(h.animations.length,0);
 for(const config of [{intersection:false,animate:false},{animate:false}]){const fallback=setup(config);fallback.deliver();assert.equal(fallback.animations.length,0);}
});
test('selection semantics follow active state, including restored drafts',()=>{
 const h=setup();assert.equal(h.button['aria-pressed'],'true');h.button.classList.contains=()=>false;h.mutations[0].cb([{target:h.button}]);assert.equal(h.button['aria-pressed'],'false');assert.deepEqual(Array.from(h.mutations[0].options.attributeFilter),['class']);
});
test('card observation stays on result lists and is capped per update',()=>{
 const h=setup();const cards=h.mutations.find(o=>o.options.childList);cards.cb([{addedNodes:Array(50).fill(h.node)}]);assert.equal(h.animations.length,0);h.observers.at(-1).cb(Array(4).fill({isIntersecting:true,target:h.node}));assert.equal(h.animations.length,1);assert.equal(cards.options.subtree,undefined);assert.equal(cards.target,h.window.document.getElementById('course-grid'));
});

test('direct map entry restores the search header without overriding visitor interaction',()=>{
 const h=setup({directMap:true});h.settle();assert.equal(h.scroll.top,0);assert.equal(h.scroll.behavior,'auto');
 for(const event of ['pointerdown','keydown','wheel','touchstart']){const active=setup({directMap:true});active.events[event]();active.settle();assert.equal(active.scroll,undefined);}
 const changed=setup({directMap:true});changed.window.location.hash='#walk';changed.settle();assert.equal(changed.scroll,undefined);
});

test('returning to an already revealed heading never replays its entrance',()=>{const h=setup();h.deliver();h.window.PawUI.page('walk');h.deliver();assert.equal(h.animations.length,1);});
