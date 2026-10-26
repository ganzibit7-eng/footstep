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
function directory(mobile=false){
 const nodes={};for(const id of ['place-data','place-search','place-query','place-kind','place-region','place-category','place-results','place-count','place-more','place-sort','discovery-title','place-clear'])nodes[id]=new Node();
 nodes['place-filter-options']=new Node('details');nodes['place-filter-options'].open=true;nodes['place-filter-selection']=new Node();
 const data=Array.from({length:45},(_,i)=>({name:'카페 '+i,path:'/places/'+i+'/',kind:'facilities',region:'서울',info:'서울 주소 · 식당카페',conditions:'미확인'}));
 data[0].photo={src:'/photo.jpg',width:940,height:625,source:'https://example.com/source',author:'제공기관',licenseScope:'사진만 해당 라이선스 적용',caption:'원본 표시 안내',checked:'2026-10-26',licenseUrl:'https://example.com/license'};
 nodes['place-data'].textContent=JSON.stringify(data);nodes['place-count'].parentElement=new Node();
 for(const [id,values]of Object.entries({'place-kind':['','facilities','courses','bins'],'place-region':[''],'place-category':['','식당카페','숙소'],'place-sort':['photos','name','registered']}))for(const value of values){const option=new Node('option');option.value=value;option.textContent=value;nodes[id].append(option);}
 nodes['place-sort'].value='photos';
 const history={state:{preserve:'yes'},replaceState(state,_,url){this.state=state;this.url=url;}};
 const window={location:{href:'https://balzaguk.com/discover.html?kind=facilities&category='+encodeURIComponent('식당카페'),search:'?kind=facilities&category='+encodeURIComponent('식당카페')},history};
 window.matchMedia=()=>({matches:mobile});window.CardMedia=require('../card-media.js');
 vm.runInNewContext(fs.readFileSync('place-search.js','utf8'),{window,document:{getElementById:id=>nodes[id],createElement:tag=>new Node(tag),createTextNode:text=>({textContent:text})},URL,URLSearchParams});
 return {nodes,history,data};
}
test('directory more preserves existing cards and photos, focuses next result, and retains URL filters',()=>{
 const {nodes,history}=directory(),list=nodes['place-results'],first=list.children[0],photo=first.children[0];
 assert.equal(list.children.length,20);nodes['place-more'].click();assert.equal(list.children.length,40);assert.equal(list.children[0],first);assert.equal(first.children[0],photo);
 const next=list.children[20].querySelector('.directory-name');assert.equal(next.focused.preventScroll,true);assert.equal(next.scrolled.block,'nearest');assert.match(history.url,/shown=40/);assert.equal(history.state.preserve,'yes');
 nodes['place-more'].click();assert.equal(list.children.length,45);assert.equal(nodes['place-more'].hidden,true);assert.match(nodes['place-count'].textContent,/45곳 중 45곳/);
});
test('mobile filters collapse once, expose restored selections and remain open during refinement',()=>{
 const {nodes}=directory(true),options=nodes['place-filter-options'];
 assert.equal(options.open,false);assert.equal(nodes['place-filter-selection'].textContent,'식당카페');
 options.open=true;nodes['place-region'].value='서울';nodes['place-region'].listeners.change();
 assert.equal(options.open,true);assert.equal(nodes['place-filter-selection'].textContent,'서울 · 식당카페');
 nodes['place-clear'].click();assert.equal(nodes['place-filter-selection'].textContent,'전체');assert.equal(options.open,true);
 assert.equal(directory(false).nodes['place-filter-options'].open,true);
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

const {conditionRows}=require('../place-search.js');
test('condition labels split only the explicit source delimiter and preserve unknown facts',()=>{
 assert.deepEqual(conditionRows('미확인 · 방문 전 문의 · 준비물: 목줄 착용'),[['동반 조건','미확인 · 방문 전 문의'],['준비물','목줄 착용']]);
 for(const raw of ['대형견 불가, 이동장 필요','실내 여부 미확인','운영기관 문의'])assert.deepEqual(conditionRows(raw),[['동반 조건',raw]]);
 assert.match(conditionRows(null)[0][1],/미확인/);
});


test('live directory cards keep one record across photo, heading, credits and bottom CTA',()=>{
 const {nodes,data}=directory(),first=nodes['place-results'].children[0];
 assert.equal(first.children.length,7);assert.equal(first.attrs['data-card-source'],data[0].path);
 assert.equal(first.querySelector('.premium-card-title').children[0].textContent,data[0].name);
 assert.equal(first.querySelector('.premium-card-cta').href,data[0].path);
 const media=first.children[0],img=media.children[0].children[0];assert.equal(img.src,data[0].photo.src);assert.equal(img.attrs['data-card-fit'],'contain');
 assert(first.children[5].children[1].children[1].textContent.includes(data[0].photo.licenseScope));assert(first.children[5].children[1].children[1].textContent.includes(data[0].photo.caption));
 assert.equal(nodes['place-results'].children[1].children[0].innerHTML.includes('사진 미등록'),true);
});
