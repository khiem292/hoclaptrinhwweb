/* Web Lab 8.0: optional Supabase email account + private sync (RLS).
   No credentials/secret keys are bundled in this source. */
(()=>{
'use strict';
const cfg=window.WEB_LAB_CLOUD_CONFIG||{};
const url=String(cfg.url||'').replace(/\/+$/,'');
const key=String(cfg.publishableKey||'');
const configured=/^https:\/\/[a-z0-9.-]+(?::443)?$/i.test(url)&&key.length>12;
const $=id=>document.getElementById(id);
const SESSION_KEY='webLab:cloudSession';
const FIELD_KEYS=['favorites','completed','drafts','practiceV4','draftUpdatedAt','cloudStamps'];
let session=null,inFlight=null,timer=null,busy=false,refreshPromise=null,restoring=false,recoveryToken=null;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const read=(key,fb)=>{try{const s=localStorage.getItem('webLab:'+key);return s===null?fb:JSON.parse(s)}catch{return fb}};
const write=(key,value)=>{try{localStorage.setItem('webLab:'+key,JSON.stringify(value))}catch{}};
const notify=message=>{const e=$('accountFeedback');if(e){e.textContent=message;e.hidden=false;}};
function snapshot(){return{
 favorites:read('favorites',[]),
 completed:read('completed',[]),
 drafts:read('drafts',{}),
 practiceV4:read('practiceV4',{}),
 draftUpdatedAt:read('draftUpdatedAt',{}),
 stamps:read('cloudStamps',{})
}}
// JSON.stringify depends on object key insertion order, which differs between
// snapshot() and merge(). A normal comparison caused a reload on EVERY login
// sync, creating an infinite refresh loop on Safari/iPhone.
function stableValue(value){
 if(Array.isArray(value))return value.map(stableValue);
 if(value!==null&&typeof value==='object'){
  return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stableValue(value[key])]));
 }
 return value;
}
function jsonEqual(a,b){return JSON.stringify(stableValue(a))===JSON.stringify(stableValue(b))}
function progressEqual(a,b){
 return ['favorites','completed','drafts','practiceV4','draftUpdatedAt'].every(field=>jsonEqual(a[field],b[field]));
}
const RELOAD_GUARD='webLab:cloudLastAutoReload';
function safeRefresh(){
 // Even unexpected conflicts must never trap a learner in a reload loop.
 try{
  const last=Number(sessionStorage.getItem(RELOAD_GUARD)||0);
  if(Date.now()-last<20000){
   updateSyncStatus('✅ Đã đồng bộ. Dữ liệu mới sẽ hiện khi bạn mở lại bài học.');
   return;
  }
  sessionStorage.setItem(RELOAD_GUARD,String(Date.now()));
 }catch{}
 location.reload();
}
function stamp(field){const s=read('cloudStamps',{});s[field]=Date.now();write('cloudStamps',s)}
function merge(remote,local){
 const r=remote&&typeof remote==='object'?remote:{}, l=local&&typeof local==='object'?local:{};
 const rs=r.stamps||{},ls=l.stamps||{};
 const combineSet=(field)=>{
  const a=Array.isArray(r[field])?r[field]:[],b=Array.isArray(l[field])?l[field]:[];
  const rt=Number(rs[field]||0),lt=Number(ls[field]||0);
  if(rt>lt)return [...a];
  if(lt>rt)return [...b];
  return [...new Set([...a,...b])];
 };
 const practice={...r.practiceV4};
 for(const [id,list] of Object.entries(l.practiceV4||{})){
  practice[id]=[...new Set([...(Array.isArray(practice[id])?practice[id]:[]),...(Array.isArray(list)?list:[])])];
 }
 const drafts={},clock={};
 const rd=r.drafts||{},ld=l.drafts||{},rt=r.draftUpdatedAt||{},lt=l.draftUpdatedAt||{};
 for(const id of new Set([...Object.keys(rd),...Object.keys(ld)])){
  const newerLocal=Number(lt[id]||0)>Number(rt[id]||0);
  drafts[id]=newerLocal?ld[id]:(id in rd?rd[id]:ld[id]);
  clock[id]=Math.max(Number(rt[id]||0),Number(lt[id]||0));
 }
 return{
  favorites:combineSet('favorites'),completed:combineSet('completed'),
  practiceV4:practice,drafts,draftUpdatedAt:clock,
  stamps:{favorites:Math.max(Number(rs.favorites||0),Number(ls.favorites||0)),
   completed:Math.max(Number(rs.completed||0),Number(ls.completed||0)),
   practiceV4:Math.max(Number(rs.practiceV4||0),Number(ls.practiceV4||0))}
 };
}
function adopt(data){
 restoring=true;
 for(const field of FIELD_KEYS){
  const name=field==='cloudStamps'?'stamps':field;
  if(name in data)write(field,data[name]);
 }
 restoring=false;
}
async function request(path,{method='GET',body,token}={}){
 if(!configured)throw Error('Chưa cấu hình Supabase cho website.');
 const headers={'apikey':key,'Content-Type':'application/json'};
 if(path.startsWith('/rest/v1/')&&method==='POST')headers.Prefer='resolution=merge-duplicates,return=minimal';
 if(token)headers.Authorization='Bearer '+token;
 const response=await fetch(url+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});
 const str=await response.text();
 let data={};try{data=str?JSON.parse(str):{}}catch{data={message:str.slice(0,250)}}
 if(!response.ok){const error=new Error(String(data.msg||data.error_description||data.message||data.error||('HTTP '+response.status)));error.status=response.status;throw error}
 return data;
}
function setSession(data){
 if(!data?.access_token||!data?.refresh_token||!data?.user?.id)throw Error('Đăng nhập chưa có phiên hợp lệ.');
 session={
 access_token:data.access_token,refresh_token:data.refresh_token,
 expiresAt:Date.now()+Number(data.expires_in||3600)*1000,
 user:{id:data.user.id,email:data.user.email||''}
 };
 try{localStorage.setItem(SESSION_KEY,JSON.stringify(session))}catch{}
 updateUI();
}
function clearSession(){session=null;try{localStorage.removeItem(SESSION_KEY)}catch{}updateUI()}
async function freshToken(){
 if(!session)throw Error('Bạn cần đăng nhập.');
 if(session.expiresAt>Date.now()+65000)return session.access_token;
 if(refreshPromise)return refreshPromise;
 refreshPromise=(async()=>{
  try{
   const updated=await request('/auth/v1/token?grant_type=refresh_token',{
     method:'POST',body:{refresh_token:session.refresh_token}});
   setSession(updated);return session.access_token;
  }catch(error){clearSession();throw Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.')}
 })().finally(()=>{refreshPromise=null});
 return refreshPromise;
}
async function cloudRow(){
 const token=await freshToken();
 const rows=await request('/rest/v1/web_lab_progress?select=payload&user_id=eq.'+encodeURIComponent(session.user.id),{token});
 return Array.isArray(rows)&&rows.length?rows[0].payload||{}:{};
}
async function saveCloud(data){
 const token=await freshToken();
 await request('/rest/v1/web_lab_progress?on_conflict=user_id',{
  method:'POST',token,body:{user_id:session.user.id,payload:data,updated_at:new Date().toISOString()}
 });
}
async function sync({refreshView=false}={}){
 if(!session||!navigator.onLine)return;
 if(inFlight)return inFlight;
 inFlight=(async()=>{
  const before=snapshot();
  try{
    updateSyncStatus('☁ Đang đồng bộ dữ liệu...');
    const remote=await cloudRow();
    const merged=merge(remote,before);
    const changedLocal=!jsonEqual(before,merged);
    const changedProgress=!progressEqual(before,merged);
    // Avoid redundant writes on login and page load.
    if(!jsonEqual(remote,merged))await saveCloud(merged);
    if(changedLocal){
     adopt(merged);
     if(refreshView&&changedProgress){
      updateSyncStatus('✅ Đã lấy tiến độ mới, đang cập nhật bài học...');
      safeRefresh();
      return;
     }
    }
    updateSyncStatus('✅ Đồng bộ thành công lúc '+new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}));
  }catch(error){updateSyncStatus('⚠ Không đồng bộ được: '+error.message);throw error}
 })().finally(()=>{inFlight=null});
 return inFlight;
}
function updateSyncStatus(t){const el=$('accountSyncStatus');if(el)el.textContent=t}
function updateUI(){
 const btn=$('accountBtn'),off=$('accountSignedOut'),on=$('accountSignedIn'),notReady=$('accountMissing'),ready=$('accountReady');
 if(btn)btn.innerHTML=session?'☁ <span>Tài khoản ✓</span>':'☁ <span>Đăng nhập</span>';
 if(off)off.hidden=!!session||!configured;
 if(on)on.hidden=!session;
 if(notReady)notReady.hidden=configured;
 if(ready)ready.hidden=!configured;
 if($('accountEmail'))$('accountEmail').textContent=session?.user?.email||'';
}
async function signIn(email,password){
 const d=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
 setSession(d);
 notify('✅ Đăng nhập thành công. Đang kết hợp dữ liệu trên thiết bị và đám mây...');
 await sync({refreshView:true});
}
async function signUp(email,password){
 // Confirm email should return to this GitHub Pages project, not the account root.
 const redirectUrl=new URL('./',window.location.href).href;
 const d=await request('/auth/v1/signup?redirect_to='+encodeURIComponent(redirectUrl),{method:'POST',body:{email,password}});
 if(d?.access_token&&d?.refresh_token&&d?.user?.id){
  setSession(d);notify('✅ Đã tạo tài khoản. Đang đồng bộ...');await sync({refreshView:true});
 }else{notify('📩 Nếu bạn nhận được thư xác nhận, hãy nhấn liên kết trong email. Sau khi xác nhận, quay lại Web Lab để đăng nhập. Nếu gặp lỗi 404, kiểm tra Site URL và Redirect URLs trong Supabase.');}
}
async function sendPasswordRecovery(){
 const email=$('accountLoginEmail')?.value?.trim();
 if(!email||!$('accountLoginEmail').checkValidity()){notify('Vui lòng nhập địa chỉ email tài khoản trước khi chọn Quên mật khẩu.');return}
 const redirectTo=new URL('./',window.location.href).href;
 await request('/auth/v1/recover?redirect_to='+encodeURIComponent(redirectTo),{
   method:'POST',body:{email}
 });
 notify('📩 Nếu email này có tài khoản Web Lab, bạn sẽ nhận được thư đặt lại mật khẩu. Hãy dùng liên kết mới nhất và kiểm tra cả thư rác.');
}
function checkRecoveryCallback(dialog){
 const fragment=new URLSearchParams(location.hash.startsWith('#')?location.hash.slice(1):'');
 if(fragment.get('type')!=='recovery')return;
 recoveryToken=fragment.get('access_token');
 // Strip sensitive callback tokens from the address bar and browser history.
 history.replaceState(null,'',location.pathname+location.search);
 if(!recoveryToken){
   notify('Liên kết đặt lại mật khẩu chưa hợp lệ. Hãy yêu cầu gửi lại email.');
   return;
 }
 const login=$('accountSignedOut'),recover=$('accountRecovery');
 if(login)login.hidden=true;
 if(recover)recover.hidden=false;
 notify('🔐 Đã mở liên kết xác nhận. Hãy nhập mật khẩu mới để hoàn tất.');
 if(!dialog.open)dialog.showModal();
}
async function changeRecoveredPassword(password){
 if(!recoveryToken)throw Error('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
 await request('/auth/v1/user',{method:'PUT',token:recoveryToken,body:{password}});
 recoveryToken=null;
 $('accountRecovery').hidden=true;
 $('accountSignedOut').hidden=false;
 $('accountNewPassword').value='';
 $('accountNewPasswordConfirm').value='';
 notify('✅ Đã đổi mật khẩu. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.');
}
async function logout(){
 try{if(session){const token=await freshToken();await request('/auth/v1/logout',{method:'POST',token})}}catch{}
 clearSession();notify('Đã đăng xuất. Tiến độ offline vẫn còn trên thiết bị này. Trên máy dùng chung, hãy xóa dữ liệu website nếu cần.');
 updateSyncStatus('Đã ngắt đồng bộ đám mây.');
}
function schedule(){
 if(restoring||!session||!configured)return;
 clearTimeout(timer);
 timer=setTimeout(()=>{sync().catch(()=>{})},3600);
}
function init(){
 const dialog=$('accountDialog'),button=$('accountBtn');
 if(!dialog||!button)return;
 try{
  const stored=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');
  if(stored?.access_token&&stored?.refresh_token&&stored?.user?.id)session=stored;
 }catch{}
 if(!configured)session=null;
 button.addEventListener('click',()=>{updateUI();dialog.showModal()});
 $('closeAccount')?.addEventListener('click',()=>dialog.close());
 $('accountForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(busy)return;
  const email=$('accountLoginEmail').value.trim(),password=$('accountLoginPassword').value;
  if(!email||!password)return;
  busy=true;notify('Đang đăng nhập...');
  try{await signIn(email,password);$('accountLoginPassword').value='';}
  catch(err){notify('⚠ '+err.message)}finally{busy=false}
 });
 $('accountForgotPassword')?.addEventListener('click',async()=>{
  if(busy)return;busy=true;notify('Đang gửi hướng dẫn lấy lại mật khẩu...');
  try{await sendPasswordRecovery()}catch(error){notify('⚠ Không gửi được email: '+error.message)}
  finally{busy=false}
 });
 $('accountRecoveryForm')?.addEventListener('submit',async event=>{
   event.preventDefault();
   if(busy)return;
   const password=$('accountNewPassword').value,confirm=$('accountNewPasswordConfirm').value;
   if(password.length<8){notify('Mật khẩu cần từ 8 ký tự trở lên.');return}
   if(password!==confirm){notify('Hai lần nhập mật khẩu chưa trùng nhau.');return}
   busy=true;notify('Đang cập nhật mật khẩu...');
   try{await changeRecoveredPassword(password)}catch(error){notify('⚠ Không đổi được mật khẩu: '+error.message)}
   finally{busy=false}
 });
 $('accountRegister')?.addEventListener('click',async()=>{
  if(busy)return;
  const email=$('accountLoginEmail').value.trim(),password=$('accountLoginPassword').value;
  if(!email||password.length<8){notify('Hãy nhập email hợp lệ và mật khẩu tối thiểu 8 ký tự.');return}
  busy=true;notify('Đang tạo tài khoản...');
  try{await signUp(email,password);$('accountLoginPassword').value='';}
  catch(err){notify('⚠ '+err.message)}finally{busy=false}
 });
 $('accountLogout')?.addEventListener('click',()=>logout().catch(error=>notify(error.message)));
 $('accountSyncNow')?.addEventListener('click',()=>sync({refreshView:true}).catch(error=>notify(error.message)));
 window.addEventListener('webLab:dataChanged',schedule);
 window.addEventListener('online',schedule);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&session)schedule()});
 updateUI();
 checkRecoveryCallback(dialog);
 if(session){
  updateSyncStatus('Đã nhận phiên đăng nhập. Đang kiểm tra dữ liệu...');
  sync({refreshView:true}).catch(error=>notify('⚠ Đồng bộ chưa hoàn tất: '+error.message));
 }else if(!configured){
  updateSyncStatus('Chưa cấu hình dịch vụ đăng nhập. Tiến độ vẫn lưu trên thiết bị này.');
 }
}
window.WebLabCloud={sync:()=>sync({refreshView:true}),get configured(){return configured},get loggedIn(){return Boolean(session)},markChanged:field=>{if(field)stamp(field);schedule()}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
