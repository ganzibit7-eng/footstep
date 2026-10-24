const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('unknown or invalid KPI data never becomes a fabricated zero',()=>{
 const {formatCount}=require('../admin-console.js');
 assert.equal(formatCount(0),'0');assert.equal(formatCount(12345),'12,345');assert.equal(formatCount('154'),'154');
 for(const value of [null,undefined,'',NaN,Infinity,-1,'unknown',9007199254740992])assert.equal(formatCount(value),'—');
});
class Element{
 constructor(doc){this.ownerDocument=doc;this.children=[];this.listeners={};this.attrs={};this.classes=new Set();this.classList={add:n=>this.classes.add(n),toggle:(n,on)=>on?this.classes.add(n):this.classes.delete(n)};}
 append(...nodes){for(const node of nodes){node.parent=this;this.children.push(node);}}
 before(node){this.insertedBefore=node;}
 setAttribute(k,v){this.attrs[k]=v;}
 querySelectorAll(){return this.children;}
 querySelector(){return {textContent:this.name};}
 addEventListener(k,fn){this.listeners[k]=fn;}
 removeEventListener(k,fn){if(this.listeners[k]===fn)delete this.listeners[k];}
 contains(node){return this===node||this.children.some(child=>child.contains(node));}
 focus(){this.ownerDocument.activeElement=this;}
}
function setup(mobile=false){
 const doc={createElement(){return new Element(doc);}},overlay=new Element(doc),workspace=new Element(doc),nav=new Element(doc);
 for(const name of ['운영 개요','회원 관리','콘텐츠 검수','제휴 성과','보안 기록','데이터 관리']){const button=new Element(doc);button.name=name;nav.append(button);}
 const media={matches:mobile,addEventListener(k,fn){this.listener=fn;},removeEventListener(k,fn){if(this.listener===fn)this.listener=null;}};
 const context={module:{exports:{}},matchMedia:()=>media};vm.runInNewContext(fs.readFileSync('admin-console.js','utf8'),context);
 const shell=context.module.exports.create({overlay,workspace,nav}),wrapper=nav.insertedBefore,toggle=wrapper.children[0];
 return {shell,wrapper,toggle,overlay,workspace,nav,media,doc};
}
test('desktop navigation folds without removing any menu or its accessible name',()=>{
 const h=setup();assert.equal(h.nav.hidden,false);assert.equal(h.toggle.attrs['aria-expanded'],'true');
 h.toggle.listeners.click();assert.equal(h.nav.hidden,false);assert(h.workspace.classes.has('admin-nav-collapsed'));assert.equal(h.toggle.attrs['aria-expanded'],'false');
 assert.equal(h.nav.children.length,6);assert.equal(h.nav.children[1].attrs['aria-label'],'회원 관리');
 h.toggle.listeners.click();assert(!h.workspace.classes.has('admin-nav-collapsed'));
});
test('mobile navigation starts closed, opens explicitly, and closes on menu selection',()=>{
 const h=setup(true);assert.equal(h.nav.hidden,true);h.toggle.listeners.click();assert.equal(h.nav.hidden,false);
 h.shell.select('회원 관리',true);assert.equal(h.nav.hidden,true);assert.match(h.toggle.attrs['aria-label'],/회원 관리/);assert.equal(h.toggle.attrs['aria-expanded'],'false');
});
test('Escape closes only the mobile menu and restores focus without bubbling to the overlay',()=>{
 const h=setup(true);h.toggle.listeners.click();let prevented=false,stopped=false;
 h.wrapper.listeners.keydown({key:'Escape',preventDefault(){prevented=true;},stopPropagation(){stopped=true;}});
 assert(h.nav.hidden);assert(prevented&&stopped);assert.equal(h.doc.activeElement,h.toggle);
});
test('breakpoint changes retain desktop folding and recover focus from a newly hidden menu',()=>{
 const h=setup();h.toggle.listeners.click();h.doc.activeElement=h.nav.children[1];h.media.matches=true;h.media.listener();
 assert(h.nav.hidden);assert.equal(h.doc.activeElement,h.toggle);h.media.matches=false;h.media.listener();
 assert(!h.nav.hidden);assert(h.workspace.classes.has('admin-nav-collapsed'));h.shell.dispose();assert.equal(h.media.listener,null);assert(!h.wrapper.listeners.keydown);
});
test('new shell styles are scoped and private resources remain outside the offline shell',()=>{
 const css=fs.readFileSync('admin-console.css','utf8'),sw=fs.readFileSync('sw.js','utf8');
 assert(css.includes('#admin-overlay.admin-console'));assert(!/^:root|^body|\.home-/m.test(css));assert(css.includes('prefers-reduced-motion'));
 const cached=sw.slice(0,sw.indexOf("self.addEventListener('install'"));assert(!cached.includes('admin-console.js'));assert(!cached.includes('admin-console.css'));
});
