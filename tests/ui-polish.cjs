const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
class Node{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.listeners={};this.value='';this.hidden=false;this.className='';this.attrs={};this.classList={add:n=>this.className+=' '+n};}
 append(...nodes){for(const n of nodes){n.parentElement=this;this.children.push(n);}}
 prepend(...nodes){this.children.unshift(...nodes);}
 after(node){this.sibling=node;}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(k,fn){this.listeners[k]=fn;}
 click(){this.listeners.click?.({preventDefault(){}});this.onclick?.();}
 focus(options){this.focused=options||true;}
 scrollIntoView(options){this.scrolled=options;}
 get options(){return this.children;}
 get selectedIndex(){return Math.max(0,this.children.findIndex(n=>n.value===this.value));}
 querySelector(selector){const name=selector.slice(1);for(const n of this.children){if(n.className?.split(' ').includes(name))return n;const nested=n.querySelector?.(selector);if(nested)return nested;}return null;}
}
function directory(){
 const nodes={};for(const id of ['place-data','place-search','place-query','place-kind','place-region','place-category','place-results','place-count','place-more','place-sort','discovery-title','place-clear'])nodes[id]=new Node();
 const data=Array.from({length:45},(_,i)=>({name:'카페 '+i,path:'/places/'+i+'/',kind:'facilities',region:'서울',info:'서울 주소 · 식당카페',conditions:'미확인'}));
 data[0].photo={src:'/photo.jpg',width:940,height:625,source:'https://example.com/source',author:'제공기관',licenseUrl:'https://example.com/license'};
 nodes['place-data'].textContent=JSON.stringify(data);nodes['place-count'].parentElement=new Node();
 for(const [id,values]of Object.entries({'place-kind':['','facilities','courses','bins'],'place-region':[''],'place-category':['','식당카페','숙소'],'place-sort':['photos','name','registered']}))for(const value of values){const option=new Node('option');option.value=value;option.textContent=value;nodes[id].append(option);}
 nodes['place-sort'].value='photos';
 const history={state:{preserve:'yes'},replaceState(state,_,url){this.state=state;this.url=url;}};
 const window={location:{href:'https://balzaguk.com/discover.html?kind=facilities&category='+encodeURIComponent('식당카페'),search:'?kind=facilities&category='+encodeURIComponent('식당카페')},history};
 vm.runInNewContext(fs.readFileSync('place-search.js','utf8'),{window,document:{getElementById:id=>nodes[id],createElement:tag=>new Node(tag),createTextNode:text=>({textContent:text})},URL,URLSearchParams});
 return {nodes,history,data};
}
test('directory more preserves existing cards and photos, focuses next result, and retains URL filters',()=>{
 const {nodes,history}=directory(),list=nodes['place-results'],first=list.children[0],photo=first.children[0];
 assert.equal(list.children.length,20);nodes['place-more'].click();assert.equal(list.children.length,40);assert.equal(list.children[0],first);assert.equal(first.children[0],photo);
 const next=list.children[20].querySelector('.directory-name');assert.equal(next.focused.preventScroll,true);assert.equal(next.scrolled.block,'nearest');assert.match(history.url,/shown=40/);assert.equal(history.state.preserve,'yes');
 nodes['place-more'].click();assert.equal(list.children.length,45);assert.equal(nodes['place-more'].hidden,true);assert.match(nodes['place-count'].textContent,/45곳 중 45곳/);
});
test('directory empty state resets existing controls without changing source conditions',()=>{
 const {nodes,data}=directory();nodes['place-query'].value='없는장소';nodes['place-search'].listeners.submit({preventDefault(){}});
 assert.equal(nodes['place-results'].children[0].className,'directory-empty');assert.equal(nodes['place-more'].hidden,true);
 nodes['place-results'].children[0].children.at(-1).click();assert.equal(nodes['place-query'].value,'');assert.equal(nodes['place-kind'].value,'');assert.equal(nodes['place-results'].children.length,0);assert.equal(nodes['place-count'].parentElement.sibling.hidden,true);assert(data.every(row=>row.conditions==='미확인'));
});
const {directoryReturn}=require('../place-saves.js');
test('detail return keeps only same-origin directory filters and rejects external destinations',()=>{
 assert.equal(directoryReturn('https://balzaguk.com/discover.html?category=숙소&shown=40#find-place','https://balzaguk.com'),'/discover.html?category=%EC%88%99%EC%86%8C&shown=40#find-place');
 for(const ref of ['https://evil.example/discover.html?q=test','javascript:alert(1)','https://balzaguk.com/places/example/',''])assert.equal(directoryReturn(ref,'https://balzaguk.com'),null);
});
test('detail return uses native back for ordinary clicks and preserves modified-link navigation',()=>{
 const link=new Node('a');let backs=0,prevented=0;
 const ctx={URL,document:{referrer:'https://balzaguk.com/discover.html?kind=facilities&shown=40',readyState:'complete',querySelectorAll:s=>s==='.place-back'?[link]:[]},location:{origin:'https://balzaguk.com'},history:{length:3,back(){backs++;}},localStorage:{getItem:()=>null},addEventListener(){}};
 vm.runInNewContext(fs.readFileSync('place-saves.js','utf8'),ctx);
 assert.equal(link.href,'/discover.html?kind=facilities&shown=40');assert.equal(link.textContent,'목록으로 돌아가기');
 link.listeners.click({button:0,preventDefault(){prevented++;}});assert.equal(backs,1);assert.equal(prevented,1);
 link.listeners.click({button:0,ctrlKey:true,preventDefault(){prevented++;}});assert.equal(backs,1);assert.equal(prevented,1);
});
