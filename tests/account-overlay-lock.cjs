const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){
 const nodes=new Map(),observers=new Map(),frames=[];
 function node(id){if(!nodes.has(id)){const classes=new Set(),label={textContent:id};nodes.set(id,{id,tagName:'DIV',inert:false,classList:{contains:x=>classes.has(x),add:x=>classes.add(x),remove:x=>classes.delete(x)},addEventListener(){},setAttribute(){},removeAttribute(){},querySelector:()=>({...label,focus(){}}),querySelectorAll:()=>[]});}return nodes.get(id);}
 const login=node('nick-overlay'),profile=node('profile-overlay'),shop=node('points-shop-overlay'),main=node('main'),protectedNode=node('protected'),script=node('script');script.tagName='SCRIPT';protectedNode.inert=true;
 const document={activeElement:main,getElementById:node,body:{style:{overflow:'clip'},children:[main,protectedNode,login,profile,shop,script]}};
 const window={addEventListener(){}};
 const MutationObserver=class{constructor(cb){this.cb=cb;}observe(el){observers.set(el.id,this.cb);}};
 vm.runInNewContext(fs.readFileSync('auth-presentation.js','utf8'),{document,window,MutationObserver,requestAnimationFrame:fn=>frames.push(fn)});
 function toggle(id,open){node(id).classList[open?'add':'remove']('show');observers.get(id)();}
 return {node,document,main,protectedNode,shop,script,toggle,update:id=>observers.get(id)()};
}
test('points overlay locks background and restores original overflow and inert states',()=>{
 const h=setup();h.toggle('points-shop-overlay',true);assert.equal(h.document.body.style.overflow,'hidden');assert(h.main.inert);assert(h.protectedNode.inert);assert.equal(h.shop.inert,false);assert.equal(h.script.inert,false);
 h.toggle('points-shop-overlay',false);assert.equal(h.document.body.style.overflow,'clip');assert.equal(h.main.inert,false);assert.equal(h.protectedNode.inert,true);
});
test('switching profile to points in one update preserves the shared background lock',()=>{
 const h=setup();h.toggle('profile-overlay',true);h.node('profile-overlay').classList.remove('show');h.shop.classList.add('show');h.update('points-shop-overlay');assert.equal(h.document.body.style.overflow,'hidden');assert(h.main.inert);assert.equal(h.shop.inert,false);
 h.toggle('points-shop-overlay',false);assert.equal(h.document.body.style.overflow,'clip');assert.equal(h.main.inert,false);
});
test('points close restores focus after inert is released and cannot steal focus from a reopened shop',()=>{
 const source=fs.readFileSync('index.html','utf8'),fn=source.match(/  function closePointsShop\(\)\{[\s\S]*?\n  \}/)[0];
 for(const reopen of [false,true]){let open=true,focused=0,frame;const target={isConnected:true,getClientRects:()=>[{}],focus:()=>focused++},overlay={classList:{remove:()=>open=false,contains:()=>open}};
 const context={pointsShopReturnFocus:target,document:{getElementById:id=>id==='points-shop-overlay'?overlay:target},requestAnimationFrame:cb=>frame=cb};vm.runInNewContext(fn,context);context.closePointsShop();assert.equal(focused,0);assert.equal(context.pointsShopReturnFocus,null);open=reopen;frame();assert.equal(focused,reopen?0:1);}
});
