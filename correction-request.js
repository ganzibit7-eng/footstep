(function(root){'use strict';
 const endpoint='https://euwujrpjtwsrxhiytego.supabase.co/functions/v1/content-correction',key='sb_publishable_RcJxSk1kYXkqeyptw7sCXw_zJhQ0DJJ';
 const categories={pet:'반려견 동반 조건',route:'코스·경로 정보',location:'주소·위치',hours:'운영·이용 정보',photo:'사진·출처',other:'기타 정보'};
 const validPath=s=>/^\/(?:places|courses|bins)\/[A-Za-z0-9_-]+\/$|^\/pet-care\/places\/[A-Za-z0-9_-]+\/$/.test(s||'');
 function sourceURL(value){if(!value)return null;try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.href.length>1000)throw Error();return u.href;}catch{throw Error('공개된 HTTPS 자료 링크를 입력해 주세요.');}}
 function validate(fields){if(!Object.hasOwn(categories,fields.category))throw Error('정정할 정보 유형을 선택해 주세요.');const message=String(fields.message||'').trim();if(message.length<10||message.length>2000)throw Error('어떤 정보가 다른지 10~2,000자로 알려주세요.');if(!fields.acknowledged)throw Error('처리 안내를 확인해 주세요.');return {category:fields.category,message,source:sourceURL(String(fields.source||'').trim()),acknowledged:true};}
 async function submit(body,fetcher=root.fetch.bind(root)){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{const r=await fetcher(endpoint,{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json',apikey:key},body:JSON.stringify(body),signal:controller.signal});let data;try{data=await r.json();}catch{throw Error('접수 결과를 확인하지 못했어요. 다시 시도해 주세요.');}
   if(!r.ok){if(r.status===429)throw Error('접수 요청이 많아요. 잠시 뒤 다시 시도하거나 이메일로 문의해 주세요.');if(data.error==='too_fast')throw Error('내용을 확인하신 뒤 잠시 후 다시 눌러 주세요.');if(data.error==='target_unavailable')throw Error('이 페이지 정보를 확인하지 못했어요. 잠시 뒤 다시 시도해 주세요.');throw Error('접수하지 못했어요. 연결 상태를 확인하고 다시 시도해 주세요.');}
   if(data.accepted!==true||data.id!==body.id)throw Error('접수 결과를 확인하지 못했어요. 같은 내용으로 다시 시도해 주세요.');return data;
  }catch(e){if(e.name==='AbortError')throw Error('응답이 늦어지고 있어요. 다시 누르면 중복 접수를 확인합니다.');throw e;}finally{clearTimeout(timer);}
 }
 const api={validPath,sourceURL,validate,submit};if(typeof module==='object'&&module.exports){module.exports=api;return;}if(!root.document)return;
 let dialog,form,current,started,id,busy=false,opener,attemptSignature=null;
 function build(){
  dialog=document.createElement('dialog');dialog.className='correction-dialog';dialog.setAttribute('aria-labelledby','correction-title');
  dialog.innerHTML='<div class="correction-heading"><div><p>발자국 정보 정정</p><h2 id="correction-title">다른 정보를 발견하셨나요?</h2></div><button type="button" data-correction-close aria-label="정정 요청 창 닫기">×</button></div><div class="correction-body"><div class="correction-target"><strong data-correction-name></strong><a data-correction-url target="_blank" rel="noopener noreferrer"></a></div><p class="correction-intro">로그인 없이 알려주세요. 운영자가 원문과 확인한 뒤 검토합니다.</p><form novalidate><label>어떤 정보인가요?<select name="category" required><option value="">정보 유형 선택</option>'+Object.entries(categories).map(([v,l])=>'<option value="'+v+'">'+l+'</option>').join('')+'</select></label><label>정정 요청 내용<textarea name="message" rows="6" maxlength="2000" required placeholder="현재 안내와 다른 점, 확인하신 내용을 구체적으로 적어주세요."></textarea></label><div class="correction-count"><span>이름·전화번호 등 개인정보는 적지 마세요.</span><span data-correction-count>0 / 2,000</span></div><label>확인 가능한 공개 자료 링크 <small>선택</small><input name="source" type="url" inputmode="url" maxlength="1000" placeholder="https://"></label><div class="correction-trap" aria-hidden="true"><label>웹사이트<input name="website" tabindex="-1" autocomplete="off"></label></div><label class="correction-ack"><input name="acknowledged" type="checkbox" required><span>접수 내용은 접수 후 180일·처리 후 90일 중 빠른 기한, 오남용 방지 식별값은 48시간 뒤 정기 삭제합니다. <a href="/privacy/#privacy-corrections" target="_blank" rel="noopener noreferrer">처리 안내</a>를 확인했습니다.</span></label><p class="correction-status" role="status" aria-live="polite"></p><div class="correction-actions"><button type="button" data-correction-cancel>취소</button><button type="submit">정정 요청 접수</button></div></form><div class="correction-success" hidden><strong>정정 요청을 접수했습니다.</strong><p>확인 가능한 자료와 대조해 검토하겠습니다. 접수만으로 공개 정보가 변경되지는 않습니다.</p><p data-correction-receipt></p><button type="button" data-correction-done>확인</button></div><p class="correction-help">양식 이용이 어려우면 <a href="mailto:contact@balzaguk.com">이메일 문의</a>도 가능합니다.</p></div>';
  document.body.append(dialog);form=dialog.querySelector('form');
  dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();});dialog.addEventListener('close',()=>{document.documentElement.classList.remove('correction-dialog-active');opener?.focus({preventScroll:true});});
  dialog.addEventListener('keydown',event=>{if(event.key==='Escape')event.stopPropagation();});
  for(const b of dialog.querySelectorAll('[data-correction-close],[data-correction-cancel],[data-correction-done]'))b.addEventListener('click',()=>{if(!busy)dialog.close();});
  form.elements.message.addEventListener('input',()=>{dialog.querySelector('[data-correction-count]').textContent=form.elements.message.value.length.toLocaleString('ko-KR')+' / 2,000';});
  form.addEventListener('submit',async event=>{
   event.preventDefault();if(busy)return;const status=dialog.querySelector('.correction-status');
   let fields;try{fields=validate({category:form.elements.category.value,message:form.elements.message.value,source:form.elements.source.value,acknowledged:form.elements.acknowledged.checked});}catch(e){status.textContent=e.message;status.dataset.state='error';if(!form.elements.category.value)form.elements.category.focus();else if(form.elements.message.value.trim().length<10)form.elements.message.focus();else if(!form.elements.acknowledged.checked)form.elements.acknowledged.focus();else form.elements.source.focus();return;}
   const signature=JSON.stringify({...fields,path:current.path});if(attemptSignature&&attemptSignature!==signature)id=crypto.randomUUID();attemptSignature=signature;
   busy=true;form.setAttribute('aria-busy','true');dialog.querySelectorAll('input,select,textarea,button').forEach(e=>e.disabled=true);status.dataset.state='loading';status.textContent='정정 요청을 접수하고 있어요…';
   try{const data=await submit({...fields,id,path:current.path,started,website:form.elements.website.value});form.hidden=true;dialog.querySelector('.correction-success').hidden=false;dialog.querySelector('[data-correction-receipt]').textContent='접수 번호 '+data.id;dialog.querySelector('[data-correction-done]').disabled=false;dialog.querySelector('[data-correction-done]').focus();id=null;}
   catch(e){status.dataset.state='error';status.textContent=e.message;}
   finally{busy=false;form.removeAttribute('aria-busy');dialog.querySelectorAll('input,select,textarea,button').forEach(e=>e.disabled=false);}
  });
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-correction-open]');if(!button)return;event.preventDefault();if(busy)return;
  const canonical=document.querySelector('link[rel="canonical"]')?.href;let path=button.dataset.correctionPath;try{if(!path&&canonical){const u=new URL(canonical);if(u.origin==='https://balzaguk.com')path=u.pathname;}}catch{}
  if(!validPath(path))return;if(!dialog)build();if(typeof dialog.showModal!=='function'){button.insertAdjacentText('afterend',' 이 브라우저에서는 이메일 문의를 이용해 주세요.');return;}
  if(!current||current.path!==path||!id){form.reset();form.hidden=false;dialog.querySelector('.correction-success').hidden=true;dialog.querySelector('.correction-status').textContent='';dialog.querySelector('[data-correction-count]').textContent='0 / 2,000';id=crypto.randomUUID();started=Date.now();attemptSignature=null;}else if(Date.now()-started>86400000)started=Date.now();
  current={path,name:button.dataset.correctionName||document.querySelector('h1')?.textContent.trim()||'선택한 장소'};opener=button;
  dialog.querySelector('[data-correction-name]').textContent=current.name;const link=dialog.querySelector('[data-correction-url]');link.href='https://balzaguk.com'+path;link.textContent=link.href;
  if(!dialog.open){dialog.showModal();document.documentElement.classList.add('correction-dialog-active');}const heading=dialog.querySelector('#correction-title');heading.tabIndex=-1;heading.focus({preventScroll:true});dialog.scrollTop=0;
 });
})(typeof globalThis==='undefined'?this:globalThis);
