/* Presentation only: provider requests and account data remain in index.html. */
(function(){
  'use strict';
  const login=document.getElementById('nick-overlay'),profile=document.getElementById('profile-overlay');
  const buttons=['kakao-login-btn','google-login-btn','email-login-btn'].map(id=>document.getElementById(id));
  const labels=new Map(buttons.map(button=>[button,button.querySelector('[data-auth-label]').textContent]));
  let pending=false;
  function busy(active,state,label){
    pending=state;buttons.forEach(button=>{button.disabled=state;button.removeAttribute('aria-busy');button.querySelector('[data-auth-label]').textContent=labels.get(button);});
    if(state){active.setAttribute('aria-busy','true');active.querySelector('[data-auth-label]').textContent=label;}
  }
  function feedback(text,consentError=false){const note=document.getElementById('auth-feedback');note.textContent=text;note.hidden=!text;document.getElementById('terms-agree-checkbox').setAttribute('aria-invalid',consentError?'true':'false');}
  window.AuthPresentation={busy,feedback,isBusy:()=>pending};
  document.getElementById('terms-agree-checkbox').addEventListener('change',()=>feedback(''));
  document.getElementById('email-login-input').addEventListener('input',event=>{event.target.removeAttribute('aria-invalid');});
  document.getElementById('auth-browse-btn').addEventListener('click',()=>document.getElementById('nick-close').click());
  document.getElementById('profile-close').addEventListener('click',()=>profile.classList.remove('show'));
  window.addEventListener('pageshow',()=>busy(null,false));
  const state=new Map();let locked=false,oldOverflow='',background=[];
  function active(){return [profile,login].find(overlay=>overlay.classList.contains('show'));}
  function update(){
    const current=active();
    for(const overlay of [login,profile]){
      const open=overlay.classList.contains('show'),previous=state.get(overlay);
      if(open&&!previous?.open){state.set(overlay,{open:true,returnTo:document.activeElement});requestAnimationFrame(()=>{if(overlay.classList.contains('show'))overlay.querySelector('.modal').focus({preventScroll:true});});}
      if(!open&&previous?.open){state.set(overlay,{open:false});if(!current&&previous.returnTo?.isConnected&&!previous.skipReturn)requestAnimationFrame(()=>previous.returnTo.focus({preventScroll:true}));}
    }
    if(current&&!locked){locked=true;oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';background=Array.from(document.body.children).filter(el=>![login,profile].includes(el)&&!['SCRIPT','STYLE','LINK'].includes(el.tagName)).map(el=>[el,el.inert]);background.forEach(([el])=>{el.inert=true;});}
    if(!current&&locked){locked=false;document.body.style.overflow=oldOverflow;background.forEach(([el,value])=>{el.inert=value;});background=[];}
  }
  for(const overlay of [login,profile]){
    new MutationObserver(update).observe(overlay,{attributes:true,attributeFilter:['class']});
    overlay.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();event.stopPropagation();overlay.querySelector('.modal-close').click();return;}
      if(event.key!=='Tab')return;
      const focusable=Array.from(overlay.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),summary,[tabindex="0"]')).filter(el=>el.getClientRects().length&&!el.closest('[hidden]'));
      const first=focusable[0],last=focusable.at(-1);if(!first){event.preventDefault();return;}
      if(event.shiftKey&&(document.activeElement===first||!focusable.includes(document.activeElement))){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&(document.activeElement===last||!focusable.includes(document.activeElement))){event.preventDefault();first.focus();}
    });
  }
  login.querySelectorAll('[data-page-nav]').forEach(link=>link.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const record=state.get(login);if(record)record.skipReturn=true;document.getElementById('nick-close').click();}));
  document.getElementById('auth-email-details').addEventListener('toggle',event=>{if(event.target.open&&login.classList.contains('show'))document.getElementById('email-login-input').focus();});
  update();
})();
