(function(root){
  'use strict';
  function affiliateURL(value){
    try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='link.coupang.com'&&!u.username&&!u.password&&u.pathname.startsWith('/a/')?u.href:null;}catch{return null;}
  }
  function productImageURL(value){
    try{const u=new URL(value);return u.protocol==='https:'&&/(?:^|\.)coupangcdn\.com$/.test(u.hostname)&&!u.username&&!u.password&&u.pathname.startsWith('/thumbnails/remote/')?u.href:null;}catch{return null;}
  }
  function popularityText(item){
    const evidence=item.popularity;
    if(!evidence||evidence.source!=='coupang-sales-search'||!Number.isInteger(evidence.reviews)||evidence.reviews<1)return '';
    const date=String(evidence.checkedAt||'');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return '';
    const stamp=Date.parse(date+'T00:00:00+09:00'),age=Date.now()-stamp;
    if(!Number.isFinite(stamp)||new Date(stamp+9*60*60*1000).toISOString().slice(0,10)!==date||age<0||age>30*86400000)return '';
    const buyers=evidence.buyersSource==='coupang-product-page'&&Number.isInteger(evidence.monthlyBuyersMin)&&evidence.monthlyBuyersMin>0?
      '최근 한 달 '+(evidence.monthlyBuyersMin%10000===0?evidence.monthlyBuyersMin/10000+'만':evidence.monthlyBuyersMin.toLocaleString('ko-KR'))+' 명 이상 구매 표시 · ':'';
    return buyers+'상품평 '+evidence.reviews.toLocaleString('ko-KR')+'개 · '+date.replaceAll('-','.')+' 쿠팡 확인';
  }
  function render(){
    const container=root.document?.getElementById('walk-shopping-items');if(!container)return;
    const config=root.PawShoppingConfig||{},items=Array.isArray(config.items)?config.items:[];
    const heading=root.document.getElementById('walk-shopping-title');if(heading&&config.title)heading.textContent=config.title;
    const subtitle=root.document.getElementById('walk-shopping-subtitle');if(subtitle&&config.subtitle)subtitle.textContent=config.subtitle;
    container.replaceChildren();let linked=0;
    items.forEach(item=>{
      const card=root.document.createElement('article');card.className='walk-shopping-card';
      const body=root.document.createElement('div');body.className='walk-shopping-body';
      if(item.featured){card.className+=' walk-shopping-featured';const badge=root.document.createElement('span');badge.className='walk-shopping-badge';badge.textContent='먼저 살펴볼 상품';body.append(badge);}
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
      const evidence=popularityText(item);
      if(evidence){const proof=root.document.createElement('p');proof.className='walk-shopping-popularity';proof.textContent=evidence;body.append(proof);}
      const url=affiliateURL(item.url);
      if(url){
        linked++;
        const option=root.document.createElement('p');option.className='walk-shopping-option';option.textContent='제휴 상품 · '+(item.option||item.name);
        body.append(option,check);
        const a=root.document.createElement('a');a.href=url;a.target='_blank';a.rel='sponsored nofollow noopener noreferrer';a.className='walk-shopping-link';a.textContent='쿠팡에서 상품 정보 보기 ↗';a.setAttribute('aria-label',(item.product||item.name)+' 쿠팡 제휴 상품 정보, 새 창');a.dataset.shoppingItem=item.id;a.dataset.shoppingPlacement='home-walk-shopping';body.append(a);
      }else body.append(reason,check);
      container.append(card);
    });
    const disclosure=root.document.getElementById('walk-shopping-disclosure');
    if(disclosure){disclosure.hidden=!linked;disclosure.textContent=config.disclosure||'이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';}
  }
  root.PawShopping={affiliateURL,productImageURL,popularityText,render};
  if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',render,{once:true});else render();}
})(globalThis);
