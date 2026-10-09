const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path'),base=path.resolve(__dirname,'..');
class Element {
  constructor(tag){this.tag=tag;this.children=[];this.attributes={};this.dataset={};this.hidden=false;}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  insertBefore(node,before){this.children.splice(this.children.indexOf(before),0,node);}
  setAttribute(k,v){this.attributes[k]=v;}
  addEventListener(type,handler){(this.handlers??={})[type]=handler;}
}
const container=new Element('div'),disclosure=new Element('p');
const context={URL,document:{readyState:'complete',createElement:tag=>new Element(tag),getElementById:id=>id==='walk-shopping-items'?container:id==='walk-shopping-disclosure'?disclosure:null}};
vm.createContext(context);
for(const file of ['shopping-config.js','shopping.js'])vm.runInContext(fs.readFileSync(path.join(base,file),'utf8'),context);
const config=context.PawShoppingConfig;
assert.equal(container.children.length,3);
assert.equal(disclosure.hidden,false);
assert.match(disclosure.textContent,/쿠팡 파트너스.*수수료를 제공받습니다/);
const expected=['https://link.coupang.com/a/hHjJ8nlsJg','https://link.coupang.com/a/hHjPJ6DMUS','https://link.coupang.com/a/hHjVHyyABU'];
const descendants=node=>node.children.flatMap(child=>[child,...descendants(child)]);
container.children.forEach((card,i)=>{
 const nodes=descendants(card),links=nodes.filter(n=>n.tag==='a');assert.equal(links.length,1);
 assert.equal(links[0].href,expected[i],'preserve the issued affiliate URL');
 assert.equal(links[0].target,'_blank');assert.match(links[0].rel,/sponsored/);assert.match(links[0].rel,/noopener/);
 assert.match(links[0].textContent,/쿠팡.*상품 정보/);assert.ok(config.items[i].product);
 const image=nodes.find(n=>n.tag==='img');assert.ok(image);assert.equal(image.src,config.items[i].image);assert.equal(image.loading,'lazy');assert.ok(image.alt.includes(config.items[i].product));
 assert.equal(nodes.find(n=>n.tag==='h3').textContent,config.items[i].product);
 assert.equal(Object.hasOwn(config.items[i],'price'),false);
});
for(const invalid of ['javascript:alert(1)','http://link.coupang.com/a/x','https://link.coupang.com.evil.test/a/x','https://evil.test/a/x','https://secret@link.coupang.com/a/x','https://www.coupang.com/vp/products/1','https://link.coupang.com/other'])assert.equal(context.PawShopping.affiliateURL(invalid),null);
for(const invalid of ['https://coupangcdn.com.evil.test/thumbnails/remote/a.jpg','https://evil.test/a.jpg','javascript:alert(1)','https://secret@t4c.coupangcdn.com/thumbnails/remote/a.jpg'])assert.equal(context.PawShopping.productImageURL(invalid),null);
const firstImage=descendants(container.children[0]).find(n=>n.tag==='img');firstImage.handlers.error();assert.equal(firstImage.hidden,true);assert.equal(descendants(container.children[0]).some(n=>n.tag==='img'),false,'a failed photo must leave a readable category fallback');
config.items=[{id:'bad',name:'<img src=x onerror=alert(1)>',url:'javascript:alert(1)',image:'https://evil.test/a.jpg'}];context.PawShopping.render();assert.equal(disclosure.hidden,true);assert.equal(descendants(container.children[0]).some(n=>n.tag==='a'||n.tag==='img'),false);assert.equal(descendants(container.children[0]).find(n=>n.tag==='h3').textContent,config.items[0].name);
const html=fs.readFileSync(path.join(base,'index.html'),'utf8'),section=html.slice(html.indexOf('<section id="walk-shopping"'),html.indexOf('<section class="home-service-intro"'));
assert.ok(section.indexOf('id="walk-shopping-disclosure"')<section.indexOf('<h2 id="walk-shopping-title">'),'disclosure precedes commercial recommendations');
assert.match(section,/현재 가격과 배송 조건은 쿠팡/);
assert.doesNotMatch(fs.readFileSync(path.join(base,'shopping.js'),'utf8'),/fetch\(|\.click\(|window\.open|location\.(href|assign)|setInterval/,'rendering must not generate clicks, navigation or background affiliate requests');
console.log('PASS: 3 official photos and exact links, no prices, disclosure order, safe link attributes, image fallback, malicious URL rejection and no automatic affiliate navigation');
