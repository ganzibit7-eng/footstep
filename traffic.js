(function(root){
  'use strict';
  const script=document.currentScript,manual=script?.hasAttribute('data-manual');
  const storage=(name,key,value)=>{try{const s=root[name];if(value!==undefined)s.setItem(key,value);return s.getItem(key);}catch(e){return null;}};
  const params=new URLSearchParams(location.search);
  if(params.get('analytics_test')==='1')storage('localStorage','paw_analytics_exclude','1');
  if(params.get('analytics_test')==='0')try{localStorage.removeItem('paw_analytics_exclude');}catch(e){}
  let excluded=storage('localStorage','paw_analytics_exclude')==='1',started=false,client=null,visitor=null,view=null;
  let active=0,clicks=0,depth=0,lastTick=Date.now(),page=location.pathname,lastSent=0,queued=null;
  const actions={link:0,button:0,search:0,navigation:0};
  const tidy=s=>String(s||'').replace(/[^a-zA-Z0-9_.-]/g,'').slice(0,80);
  function source(){
    const medium=tidy(params.get('utm_medium')),campaign=tidy(params.get('utm_campaign')),utm=tidy(params.get('utm_source'));
    if(utm)return {source:'utm:'+utm,medium,campaign};
    const ref=tidy(params.get('ref'));
    if(ref)return {source:/^[0-9a-f-]{36}$/i.test(ref)?'추천 링크':'ref:'+ref,medium:'',campaign:''};
    let host='';try{const u=new URL(document.referrer);if(u.origin!==location.origin)host=u.hostname.replace(/^www\./,'');}catch(e){}
    if(host)return {source:host.slice(0,120),medium:'',campaign:''};
    return null;
  }
  function attribution(){
    const found=source(),now=Date.now();let saved;
    try{saved=JSON.parse(storage('sessionStorage','paw_traffic_source')||'null');}catch(e){}
    if(found){saved={...found,time:now};storage('sessionStorage','paw_traffic_source',JSON.stringify(saved));}
    else if(!saved||now-saved.time>1800000){saved={source:'직접 방문 / 출처 미상',medium:'',campaign:'',time:now};}
    else {saved.time=now;storage('sessionStorage','paw_traffic_source',JSON.stringify(saved));}
    return saved;
  }
  let entry;
  const affiliateRecent=new Map();
  function affiliateClick(event){
    if(!event.isTrusted||!started||excluded||!visitor||!entry||!client||navigator.webdriver)return;
    if(event.type==='auxclick'?event.button!==1:event.button!==undefined&&event.button!==0)return;
    const el=event.target?.closest?.('a[data-shopping-item]');if(!el)return;
    let url;try{url=new URL(el.href);if(url.origin!=='https://link.coupang.com'||!/^\/a\/[A-Za-z0-9]+$/.test(url.pathname)||url.search||url.hash||url.username||url.password)return;}catch{return;}
    const key=el.dataset.shoppingItem+'|'+url.href,now=Date.now();
    if(now-(affiliateRecent.get(key)||0)<700)return;affiliateRecent.set(key,now);
    const body={event_id:root.crypto.randomUUID(),visitor_id:visitor,product_id:el.dataset.shoppingItem,
      url:url.href,path:location.pathname,section:/^[a-z_-]{1,32}$/.test(page)?page:'home',
      placement:el.dataset.shoppingPlacement||'home-walk-shopping',source:entry.source,automated:!!navigator.webdriver};
    // Never delay or replace the user's direct affiliate navigation.
    try{Promise.resolve(client.rpc('record_affiliate_click',{p_payload:body})).catch(()=>{});}catch{}
  }
  function tick(){const now=Date.now();if(document.visibilityState==='visible')active+=Math.min(2,Math.max(0,(now-lastTick)/1000));lastTick=now;}
  function payload(){return {visitor_id:visitor,view_token:view,path:location.pathname,page,source:entry.source,medium:entry.medium,campaign:entry.campaign,active_seconds:Math.floor(active),clicks,depth,actions,automated:!!navigator.webdriver};}
  async function send(){
    if(!started||excluded||!client)return;
    if(queued){queued.dirty=true;return queued.promise;}
    lastSent=Date.now();const state={dirty:false,promise:null};queued=state;
    state.promise=(async()=>{try{const {data,error}=await client.rpc('record_traffic_visit',{p_payload:payload()});if(error)return;if(data?.excluded){excluded=true;}else if(!manual){await client.rpc('record_presence',{p_visitor_id:visitor,p_page:'reading'});}}catch(e){}finally{queued=null;if(state.dirty&&!excluded)setTimeout(send,250);}})();
    return state.promise;
  }
  function interaction(event){
    affiliateClick(event);
    if(!event.isTrusted||!started||excluded)return;
    const el=event.target?.closest?.('a,button,[role="button"],input[type="submit"]');if(!el)return;
    clicks=Math.min(1000,clicks+1);const kind=el.closest('nav')?'navigation':el.matches('a')?'link':'button';actions[kind]=Math.min(1000,actions[kind]+1);if(Date.now()-lastSent>2000)send();
  }
  async function start(sb){
    if(started)return;started=true;client=sb;
    if(excluded||!['balzaguk.com','www.balzaguk.com'].includes(location.hostname)){excluded=true;return;}
    visitor=storage('localStorage','paw_visitor_id');
    if(!/^v[0-9]{10,16}[a-z0-9]{4,20}$/.test(visitor||'')){visitor='v'+Date.now()+Math.random().toString(36).slice(2,10);storage('localStorage','paw_visitor_id',visitor);}
    view=root.crypto.randomUUID();entry=attribution();lastTick=Date.now();
    document.addEventListener('click',interaction,true);
    document.addEventListener('auxclick',affiliateClick,true);
    document.addEventListener('submit',e=>{if(e.isTrusted&&e.target?.matches?.('[role="search"],form[data-search]')){actions.search=Math.min(1000,actions.search+1);send();}},true);
    document.addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight;if(h>0)depth=Math.max(depth,Math.min(100,Math.round(scrollY/h*100)));},{passive:true});
    document.addEventListener('visibilitychange',()=>{tick();send();lastTick=Date.now();});
    root.addEventListener('pagehide',()=>{tick();send();});
    setInterval(tick,1000);
    setInterval(()=>{if(document.visibilityState==='visible')send();},15000);
    sb.auth.onAuthStateChange(()=>{setTimeout(send,0);});
    await send();
  }
  function setPage(value){page=/^[a-z_-]{1,32}$/.test(value)?value:location.pathname;}
  root.PawTraffic=Object.freeze({start,setPage,get excluded(){return excluded;}});
  if(!manual){
    const boot=()=>{if(root.supabase)start(root.supabase.createClient('https://euwujrpjtwsrxhiytego.supabase.co','sb_publishable_RcJxSk1kYXkqeyptw7sCXw_zJhQ0DJJ'));};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  }
})(globalThis);
