const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{checked:false,value:'',disabled:false,textContent:'',dataset:{},attributes:{},focus(){this.focused=true;},checkValidity(){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);},setAttribute(k,v){this.attributes[k]=v;},removeAttribute(k){delete this.attributes[k];}});return elements.get(id);}
let pending=false,requests=[],reply={error:null},feedback='';
const context={document:{getElementById:element},console:{error(){}},window:{location:{origin:'https://balzaguk.com',pathname:'/'}},AuthPresentation:{isBusy:()=>pending,feedback:text=>{feedback=text;},busy:(button,state)=>{pending=state;for(const id of ['kakao-login-btn','google-login-btn','email-login-btn'])element(id).disabled=state;}},sb:{auth:{signInWithOAuth:async opts=>{requests.push(opts);return await reply;},signInWithOtp:async opts=>{requests.push(opts);return await reply;}}}};
vm.createContext(context);vm.runInContext(html.slice(html.indexOf('  function isTermsAgreed(){'),html.indexOf('  async function signOutUser(){')),context);
(async()=>{
 await context.signInWithKakao();assert.equal(requests.length,0);assert.match(feedback,/동의/);assert.equal(element('terms-agree-checkbox').focused,true);
 element('terms-agree-checkbox').checked=true;reply={error:new Error('failure')};await context.signInWithGoogle();assert.equal(requests[0].provider,'google');assert.equal(requests[0].options.redirectTo,'https://balzaguk.com/');assert.equal(pending,false);assert.match(feedback,/Google/);
 let finish;reply=new Promise(resolve=>finish=resolve);const first=context.signInWithKakao();await context.signInWithGoogle();assert.equal(requests.length,2,'provider clicks must not overlap');assert.equal(requests[1].options.scopes,'profile_nickname profile_image');finish({error:new Error('failure')});await first;assert.equal(pending,false);
 element('email-login-input').value='';await context.sendMagicLink();assert.equal(requests.length,2);assert.equal(element('email-login-input').attributes['aria-invalid'],'true');
 reply={error:null};element('email-login-input').value='test@example.invalid';await context.sendMagicLink();assert.equal(requests.at(-1).email,'test@example.invalid');assert.equal(requests.at(-1).options.emailRedirectTo,'https://balzaguk.com/');assert.equal(element('email-login-note').dataset.state,'success');assert.equal(element('email-login-input').value,'test@example.invalid','keep address visible after sending');assert.equal(pending,false);
 reply={error:new Error('mail failure')};await context.sendMagicLink();assert.equal(element('email-login-note').dataset.state,'error');assert.equal(pending,false);
 console.log('Auth UI: consent, provider options, overlapping clicks, failure recovery, email validation and result feedback passed (mock requests only).');
})().catch(error=>{console.error(error);process.exitCode=1;});
