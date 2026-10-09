(function(root){
  'use strict';
  function affiliateURL(value){
    try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='link.coupang.com'&&!u.username&&!u.password&&u.pathname.startsWith('/a/')?u.href:null;}catch{return null;}
  }
  function productImageURL(value){
    try{const u=new URL(value);return u.protocol==='https:'&&/(?:^|\.)coupangcdn\.com$/.test(u.hostname)&&!u.username&&!u.password&&u.pathname.startsWith('/thumbnails/remote/')?u.href:null;}catch{return null;}
  }
  function render(){
    const container=root.document?.getElementById('walk-shopping-items');if(!container)return;
    const config=root.PawShoppingConfig||{},items=Array.isArray(config.items)?config.items:[];
    container.replaceChildren();let linked=0;
    items.forEach(item=>{
      const card=root.document.createElement('article');card.className='walk-shopping-card';
      const body=root.document.createElement('div');body.className='walk-shopping-body';
      const icon=root.document.createElement('span');icon.className='walk-shopping-icon';icon.setAttribute('aria-hidden','true');icon.textContent=item.icon;
      const context=root.document.createElement('small');context.textContent=item.context;
      const title=root.document.createElement('h3');title.textContent=item.product||item.name;
      const reason=root.document.createElement('p');reason.textContent=item.reason;
      const check=root.document.createElement('p');check.className='walk-shopping-check';check.textContent=item.check;
      const imageURL=productImageURL(item.image);
      if(imageURL){
        const media=root.document.createElement('div');media.className='walk-shopping-photo';
        const image=root.document.createElement('img');image.src=imageURL;image.alt=(item.product||item.name)+' · '+(item.option||'');image.width=212;image.height=212;image.loading='lazy';image.decoding='async';image.referrerPolicy='no-referrer';
        image.addEventListener('error',()=>{image.hidden=true;media.replaceChildren(icon);},{once:true});
        media.append(image);card.append(media);
      }else body.append(icon);
      body.append(context,title);card.append(body);
      const url=affiliateURL(item.url);
      if(url){
        linked++;
        const option=root.document.createElement('p');option.className='walk-shopping-option';option.textContent='제휴 상품 · '+(item.option||item.name);
        body.append(option,check);
        const a=root.document.createElement('a');a.href=url;a.target='_blank';a.rel='sponsored nofollow noopener noreferrer';a.className='walk-shopping-link';a.textContent='쿠팡에서 상품 정보 보기 ↗';a.setAttribute('aria-label',(item.product||item.name)+' 쿠팡 제휴 상품 정보, 새 창');a.dataset.shoppingItem=item.id;body.append(a);
      }else body.append(reason,check);
      container.append(card);
    });
    const disclosure=root.document.getElementById('walk-shopping-disclosure');
    if(disclosure){disclosure.hidden=!linked;disclosure.textContent=config.disclosure||'이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';}
  }
  root.PawShopping={affiliateURL,productImageURL,render};
  if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',render,{once:true});else render();}
})(globalThis);
