/* Web Lab 11.0 — AI assistant. API secrets stay on the Supabase server.
   Conversation is kept only in this tab; user explicitly chooses whether code is shared. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const cfg=window.WEB_LAB_CLOUD_CONFIG||{};
const base=String(cfg.url||'').replace(/\/+$/,'');
const key=String(cfg.publishableKey||'');
let history=[],busy=false;
const sampleQuestions=['Giải thích bài học hiện tại dễ hiểu hơn','Cho mình ví dụ HTML và CSS ngắn','let, const và var khác nhau thế nào?','Hướng dẫn mình tìm lỗi JavaScript'];
function status(msg,bad=false){const el=$('aiStatus');if(!el)return;el.textContent=msg;el.classList.toggle('is-error',bad)}
function bubble(kind,text){
 const stream=$('aiMessages');if(!stream)return;
 const bubble=document.createElement('article');
 bubble.className='wl-ai-message '+(kind==='user'?'wl-ai-user':'wl-ai-bot');
 const author=document.createElement('strong');author.textContent=kind==='user'?'Bạn':'✦ Web Lab AI';
 bubble.append(author);
 const chunks=String(text).split(String.fromCharCode(96).repeat(3));
 chunks.forEach((chunk,i)=>{
  if(!chunk)return;
  if(i%2){
   const pre=document.createElement('pre'),code=document.createElement('code');
   code.textContent=chunk.replace(/^[^\n]*\n/,'').trim();
   pre.append(code);bubble.append(pre);
  }else{
   const part=document.createElement('div');part.className='wl-ai-text';
   part.textContent=chunk;bubble.append(part);
  }
 });
 stream.append(bubble);stream.scrollTop=stream.scrollHeight;
}
function lesson(){
 const id=window.__WEB_LAB_TEST__?.selected;
 const item=window.HTML_LAB_DATA?.LESSONS?.find(x=>x.id===id);
 return item?[item.name,item.summary,item.syntax].filter(Boolean).join(' | ').slice(0,650):'';
}
function codeAttached(){
 if(!$('aiAttachCode')?.checked)return '';
 const code=$('codeEditor')?.value||'';
 if(!code)return '';
 const language=document.querySelector('.editor-tab.active')?.dataset.editor||'html';
 return 'Tab '+language.toUpperCase()+':\n'+String(code).slice(0,3500);
}
function refresh(){
 const input=$('aiInput'),send=$('aiSendBtn');
 if(input)input.disabled=busy;
 if(send)send.disabled=busy||!input?.value?.trim();
 document.querySelectorAll('.wl-ai-chip').forEach(button=>button.disabled=busy);
}
async function ask(){
 if(busy)return;
 const q=String($('aiInput')?.value||'').trim();
 if(!q){status('Hãy nhập câu hỏi trước khi gửi.',true);return}
 if(!window.WebLabCloud?.loggedIn){status('Hãy đăng nhập Web Lab Cloud trước khi hỏi AI.',true);return}
 const prior=history;const messages=history.slice(-8),code=codeAttached(),context=lesson();
 busy=true;refresh();bubble('user',q);$('aiInput').value='';
 status('Gia sư AI đang suy nghĩ...');
 history=[...history,{role:'user',content:q}].slice(-12);
 try{
  const token=await window.WebLabCloud.getAccessToken();
  const response=await fetch(base+'/functions/v1/web-lab-ai',{
   method:'POST',
   headers:{apikey:key,Authorization:'Bearer '+token,'Content-Type':'application/json'},
   body:JSON.stringify({question:q,lesson:context,code,history:messages}),
   cache:'no-store',signal:AbortSignal.timeout(38000)
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.answer)throw Error(data.error||'Dịch vụ AI trả về lỗi '+response.status);
  bubble('assistant',data.answer);
  history=[...history,{role:'assistant',content:data.answer}].slice(-12);
  status('✓ Hoàn tất · Còn '+Math.max(0,Number(data.remaining??0))+' câu AI trong ngày.');
 }catch(error){
  history=prior;
  const msg=String(error?.message||'Không thể kết nối');
  bubble('assistant','⚠ '+msg);status(msg,true);
 }finally{busy=false;refresh();$('aiInput')?.focus({preventScroll:true})}
}
function init(){
 const dialog=$('aiDialog'),launch=$('aiOpenBtn'),form=$('aiForm');
 if(!dialog||!launch||!form)return;
 launch.addEventListener('click',()=>{
  if(!dialog.open)dialog.showModal();
  $('aiLoginBtn').hidden=!!window.WebLabCloud?.loggedIn;
  status(window.WebLabCloud?.loggedIn?'Mỗi tài khoản có 12 câu hỏi/ngày (cách nhau ít nhất 20 giây).':'Bạn cần đăng nhập Cloud để dùng AI.');
  $('aiInput')?.focus({preventScroll:true});
 });
 $('aiCloseBtn')?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',ev=>{if(ev.target===dialog)dialog.close()});
 $('aiLoginBtn')?.addEventListener('click',()=>{dialog.close();$('accountBtn')?.click()});
 form.addEventListener('submit',ev=>{ev.preventDefault();ask()});
 $('aiInput')?.addEventListener('input',refresh);
 $('aiInput')?.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&!ev.shiftKey&&!ev.isComposing){ev.preventDefault();ask()}});
 const quick=$('aiQuickQuestions');
 for(const question of sampleQuestions){
  const b=document.createElement('button');b.type='button';b.className='wl-ai-chip';b.textContent=question;
  b.addEventListener('click',()=>{if(busy)return;$('aiInput').value=question;refresh();$('aiInput').focus()});
  quick?.append(b);
 }
 bubble('assistant','Xin chào! Mình là gia sư AI của Web Lab. Bạn có thể hỏi về HTML, CSS, SCSS, JavaScript và bài đang học.\n\nNếu muốn AI kiểm tra code, hãy chọn “Gửi kèm mã ở tab đang mở” trước khi gửi câu hỏi.');
 refresh();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();