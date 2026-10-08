(function(root){
  'use strict';
  function affiliateURL(value){
    try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='link.coupang.com'&&!u.username&&!u.password&&u.pathname.startsWith('/a/')?u.href:null;}catch{return null;}
  }
  function render(){
    const container=root.document?.getElementById('walk-shopping-items');if(!container)return;
    const config=root.PawShoppingConfig||{},items=Array.isArray(config.items)?config.items:[];
    container.replaceChildren();let linked=0;
    items.forEach(item=>{
      const card=root.document.createElement('article');card.className='walk-shopping-card';
      const icon=root.document.createElement('span');icon.className='walk-shopping-icon';icon.setAttribute('aria-hidden','true');icon.textContent=item.icon;
      const context=root.document.createElement('small');context.textContent=item.context;
      const title=root.document.createElement('h3');title.textContent=item.name;
      const reason=root.document.createElement('p');reason.textContent=item.reason;
      const check=root.document.createElement('p');check.className='walk-shopping-check';check.textContent=item.check;
      card.append(icon,context,title,reason,check);
      const url=affiliateURL(item.url);
      if(url){linked++;const a=root.document.createElement('a');a.href=url;a.target='_blank';a.rel='sponsored nofollow noopener noreferrer';a.className='walk-shopping-link';a.textContent='쿠팡에서 비교하기 ↗';a.setAttribute('aria-label',item.name+' 쿠팡 제휴 링크에서 비교하기, 새 창');a.dataset.shoppingItem=item.id;card.append(a);}
      container.append(card);
    });
    const disclosure=root.document.getElementById('walk-shopping-disclosure');
    if(disclosure){disclosure.hidden=!linked;disclosure.textContent=config.disclosure||'이 영역의 제휴 링크로 구매하면 일정액의 수수료를 제공받을 수 있습니다.';}
  }
  root.PawShopping={affiliateURL,render};
  if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',render,{once:true});else render();}
})(globalThis);
