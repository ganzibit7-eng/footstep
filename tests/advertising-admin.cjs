const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const test=require('node:test');
const assert=require('node:assert/strict');

test('older admin loaders can load the retired module without restoring advertising',()=>{
 const config=readFileSync('_config.yml','utf8');
 const source=readFileSync('admin-advertising.js','utf8');
 assert.doesNotMatch(config,/^\s*- admin-advertising\.js\s*$/m);
 const denied=()=>{throw new Error('The retired module cannot contact advertising services');};
 const context=vm.createContext({fetch:denied});
 vm.runInContext(source,context);
 const host={textContent:'',replaceChildren(){this.textContent='';}};
 const oldClient=new Proxy({}, {get:denied});
 const mounted=context.PawAdvertisingAdmin.mount(host,oldClient,()=>true);
 assert.match(host.textContent,/광고·제휴 운영을 중단/);
 mounted.dispose();
 assert.equal(host.textContent,'');
});
