import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const script=readFileSync(new URL('../place-saves.js',import.meta.url),'utf8');
const values=new Map();
function load(storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)}){const box={localStorage:storage,module:{exports:{}}};vm.runInNewContext(script,box);return box.module.exports;}
let api=load();
assert.equal(api.toggle('place-one','첫 장소').saved,true);
api=load();assert.equal(api.list()[0].id,'place-one','saved places survive reload');
assert.equal(api.toggle('place-two','둘째 장소').saved,true);
assert.equal(api.toggle('place-one','첫 장소').saved,false);
assert.equal(api.list().length,1);
assert.equal(api.toggle('../unsafe','잘못된 주소').ok,false);
values.set('paw_saved_places_v1','not-json');assert.equal(api.list().length,0);
values.set('paw_saved_places_v1',JSON.stringify([{id:'../../bad',name:'bad'},{id:'valid',name:'good'},{id:'valid',name:'duplicate'}]));assert.equal(api.list().length,1);
const denied=load({getItem:()=>null,setItem:()=>{throw new Error('blocked');}});assert.equal(denied.toggle('valid','장소').ok,false,'blocked storage must not report success');
values.clear();for(let i=0;i<100;i++)assert.equal(api.toggle('p'+i,'장소'+i).ok,true);assert.equal(api.toggle('overflow','101번째').ok,false);assert.equal(api.list().length,100);
console.log('PASS: reload, removal, invalid cache, unsafe paths, blocked storage, save limit');
