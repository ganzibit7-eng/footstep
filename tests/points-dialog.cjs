const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync('index.html','utf8');
const handler=source.match(/  function handlePointsShopKeydown\(event\)\{[\s\S]*?\n  \}/)?.[0];
assert(handler,'points dialog keyboard handler exists');
function harness(){
 let closed=0,focused=null,open=true;
 const first={getClientRects:()=>[{}],closest:()=>null,focus(){focused='first';}};
 const last={getClientRects:()=>[{}],closest:()=>null,focus(){focused='last';}};
 const hidden={getClientRects:()=>[],closest:()=>null};
 const overlay={classList:{contains:()=>open},querySelectorAll:()=>[first,hidden,last]};
 const document={getElementById:()=>overlay,activeElement:first};
 const context={document,closePointsShop:()=>closed++};vm.createContext(context);vm.runInContext(handler,context);
 function key(key,shiftKey=false){const e={key,shiftKey,prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;}};context.handlePointsShopKeydown(e);return e;}
 return {document,first,last,key,setOpen(value){open=value;},get closed(){return closed;},get focused(){return focused;}};
}
test('Escape closes only an open points dialog without propagating to other overlays',()=>{
 const h=harness();const e=h.key('Escape');assert.equal(h.closed,1);assert(e.prevented&&e.stopped);h.setOpen(false);h.key('Escape');assert.equal(h.closed,1);
});
test('Tab and Shift+Tab stay in visible controls; ordinary typing is untouched',()=>{
 const h=harness();h.document.activeElement=h.last;assert(h.key('Tab').prevented);assert.equal(h.focused,'first');h.document.activeElement=h.first;assert(h.key('Tab',true).prevented);assert.equal(h.focused,'last');assert.equal(h.key('a').prevented,false);
});
