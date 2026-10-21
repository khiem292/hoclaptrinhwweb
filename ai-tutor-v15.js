/* Web Lab 15.0 — Vietnamese AI tutor. API key is server-side only. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const cfg=window.WEB_LAB_CLOUD_CONFIG||{};
const supabase=String(cfg.url||'').replace(/\/+$/,'');
const publishable=String(cfg.publishableKey||'');
const service=supabase+'/functions/v1/web-lab-ai';
let messages=[],busy=false,ready=null,checking=false;
const suggested=[
 {label:'📘 Giải thích bài học',question:'Giải thích bài học hiện tại thật dễ hiểu, kèm ví dụ ngắn.'},
 {label:'🐞 Sửa lỗi code',question:'Hãy hướng dẫn mình tìm lỗi trong đoạn code đang viết và cách tự sửa.'},
 {label:'🧠 Giải thuật DSA',question:'Giải thích tư duy và độ phức tạp Big O của thuật toán đang học, gợi ý để mình tự làm.'},
 {label:'✍️ Bài luyện tập',question:'Hãy cho mình một bài thực hành nhỏ phù hợp bài học hiện tại, có gợi ý nhưng chưa giải.'},
];
function status(text,kind=''){const el=$('wlAiStatus');if(el){el.textContent=text;el.dataset.kind=kind;}}
function isLocal(){return $('wlAiMode')?.value!=='online'}
function onlineAccount(){return Boolean(window.WebLabCloud?.loggedIn&&window.WebLabCloud?.configured)}
function studyContext(){
 const id=window.WebLabWorkspace?.currentId;
 const item=window.HTML_LAB_DATA?.LESSONS?.find(x=>x.id===id);
 return item?[item.name,item.pathTitle,item.summary,item.guide?.intro,item.syntax].filter(Boolean).join('\n').slice(0,600):'';
}
function readCode(){
 if(!$('wlAiIncludeCode')?.checked)return '';
 const blocks=window.WebLabWorkspace?.getCode();
 if(!blocks)return '';
 return ['html','css','scss','js'].filter(k=>typeof blocks[k]==='string'&&blocks[k].trim()).map(k=>
  '--- '+k.toUpperCase()+' ---\n'+blocks[k].trim()).join('\n\n').slice(0,4500);
}
function addMessage(role,content){
 const feed=$('wlAiMessages');if(!feed)return;
 const article=document.createElement('article');
 article.className='wl-ai-msg '+(role==='user'?'wl-ai-msg-user':'wl-ai-msg-assistant');
 const label=document.createElement('strong');label.className='wl-ai-msg-author';
 label.textContent=role==='user'?'Bạn':isLocal()?'📗 Trợ lý miễn phí':'✦ Web Lab AI';
 article.append(label);
 const body=document.createElement('div');body.className='wl-ai-msg-body';
 // Actual text nodes keep Vietnamese Unicode and spaces intact.
 // Safe bold nodes are created only for complete double-asterisk pairs.
 function appendInline(parent,text){
  const pattern=/\*\*([^*\n]+)\*\*/g;
  let offset=0;
  for(const match of text.matchAll(pattern)){
   if(match.index>offset)parent.append(document.createTextNode(text.slice(offset,match.index)));
   const bold=document.createElement('strong');
   bold.textContent=match[1];
   parent.append(bold);
   offset=match.index+match[0].length;
  }
  if(offset<text.length)parent.append(document.createTextNode(text.slice(offset)));
 }
 const source=String(content??'').replace(/\r\n?/g,'\n').normalize('NFC');
 const ticks=String.fromCharCode(96).repeat(3);
 const fences=new RegExp(ticks+'([a-zA-Z0-9_+#.-]*)[ \\t]*\\n([\\s\\S]*?)'+ticks,'g');
 let offset=0;
 function addText(part){
  if(!part)return;
  const el=document.createElement('div');el.className='wl-ai-answer-text';
  appendInline(el,part);body.append(el);
 }
 for(const match of source.matchAll(fences)){
  addText(source.slice(offset,match.index));
  const pre=document.createElement('pre'),code=document.createElement('code');
  pre.setAttribute('aria-label','Ví dụ code '+(match[1]||''));
  code.textContent=match[2].replace(/^\n+|\n+$/g,'');
  pre.append(code);body.append(pre);
  offset=match.index+match[0].length;
 }
 addText(source.slice(offset));
 article.append(body);
 feed.append(article);feed.scrollTop=feed.scrollHeight;
}
function renderControls(){
 const field=$('wlAiQuestion'),send=$('wlAiSubmit');
 if(field)field.disabled=busy;
 if(send)send.disabled=busy||!field?.value?.trim()||(!isLocal()&&(!onlineAccount()||ready===false));
 $('wlAiLoginNotice').hidden=isLocal()||onlineAccount();
 $('wlAiLoginBtn').hidden=isLocal()||onlineAccount();
 $('wlAiReset').disabled=busy||!messages.length;
 $('wlAiAttachHint').textContent=isLocal()
  ?($('wlAiIncludeCode')?.checked?'Chỉ kiểm tra code trên thiết bị, không gửi lên máy chủ.':'Không tự đọc code; hãy tích chọn nếu muốn kiểm tra tĩnh.')
  :($('wlAiIncludeCode')?.checked?'Code chỉ được gửi tới máy chủ AI khi bạn bấm Gửi; đừng gửi mật khẩu, token.':'AI trực tuyến không tự đọc code của bạn.');
 $('wlAiSubmit').textContent=isLocal()?'➤ Hỏi miễn phí':'➤ Hỏi OpenAI';
 $('wlAiLessonName').textContent=window.WebLabWorkspace?.currentTitle||'Chưa chọn bài học';
}
function signin(){
 if($('wlAiDialog')?.open)$('wlAiDialog').close();
 $('accountBtn')?.click();
}
async function request(body){
 const token=await window.WebLabCloud.getAccessToken();
 const abort=new AbortController();
 const timer=setTimeout(()=>abort.abort(),39000);
 try{
  return await fetch(service,{
   method:'POST',headers:{"Authorization":"Bearer "+token,"apikey":publishable,"Content-Type":"application/json"},
   body:JSON.stringify(body),cache:'no-store',signal:abort.signal
  });
 }finally{clearTimeout(timer);}
}
async function checkStatus(){
 if(isLocal()||checking||!onlineAccount()||!navigator.onLine){renderControls();return}
 checking=true;status('Đang kiểm tra trạng thái gia sư AI…');
 try{
  const response=await request({action:'status'});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(data.error||'Không kiểm tra được máy chủ AI.');
  ready=Boolean(data.configured)&&data.verified!==false;
  if(!data.configured){
   status('Chưa tìm thấy OPENAI_API_KEY trong Supabase.','error');
  }else if(data.verified===false){
   const extra=data.provider_code?' · Mã lỗi: '+data.provider_code:'';
   status((data.diagnostic||'Khóa API chưa được OpenAI xác thực.')+extra,'error');
  }else if(data.verified===true){
   status('✓ Khóa OpenAI đã được xác thực · 12 lượt hỏi/ngày · 20 giây mỗi lượt.','ok');
  }else{
   status(data.diagnostic||'Tạm thời chưa kiểm tra được khóa. Bạn có thể thử lại sau.','warn');
  }
 }catch(e){
  ready=null;status('Không kiểm tra được AI: '+String(e.message||e),'warn');
 }finally{checking=false;renderControls()}
}
async function ask(){
 if(busy)return;
 const field=$('wlAiQuestion'),question=String(field?.value||'').trim();
 if(!question){status('Bạn hãy nhập câu hỏi.','warn');return}
 if(isLocal()){
  const engine=window.WebLabLocalTutor;
  if(!engine){status('Chưa tải được trợ lý miễn phí. Hãy tải lại Web Lab.', 'error');return}
  const lessonId=window.WebLabWorkspace?.currentId;
  const lesson=window.HTML_LAB_DATA?.LESSONS?.find(item=>item.id===lessonId)||null;
  const code=$('wlAiIncludeCode')?.checked?window.WebLabWorkspace?.getCode():null;
  busy=true;addMessage('user',question);field.value='';renderControls();
  try{
   const response=engine.answer(question,{lesson,code});
   addMessage('assistant',response);
   messages=[...messages,{role:'user',content:question},{role:'assistant',content:response}].slice(-12);
   status('✓ Trả lời từ thư viện Web Lab · Không dùng API, không gửi dữ liệu ra mạng.','ok');
  }catch{
   status('Không thể xử lý câu hỏi bằng trợ lý trên thiết bị.','error');
  }finally{busy=false;renderControls()}
  return;
 }
 if(!onlineAccount()){signin();return}
 if(!navigator.onLine){status('Cần Internet để hỏi AI.','warn');return}
 const context=studyContext(),code=readCode(),earlier=messages.slice(-8);
 busy=true;renderControls();addMessage('user',question);field.value='';
 status('⏳ Gia sư AI đang trả lời…');
 try{
  const response=await request({action:'ask',question,lesson:context,code,history:earlier});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.answer){
   const e=Error(data.error||'Chưa thể nhận câu trả lời.');
   e.kind=data.code||'unknown';throw e;
  }
  addMessage('assistant',data.answer);
  messages=[...messages,{role:'user',content:question},{role:'assistant',content:String(data.answer)}].slice(-12);
  ready=true;status('✓ Đã trả lời · Còn '+Math.max(0,Number(data.remaining??0))+' lượt trong ngày.','ok');
 }catch(e){
  if(!field.value.trim())field.value=question;
  if(['not_configured','invalid_key','access_denied','model_unavailable'].includes(e.kind))ready=false;
  status(String(e.message||'Kết nối AI bị gián đoạn.'),'error');
 }finally{busy=false;renderControls()}
}
function reset(){
 if(busy)return;
 messages=[];$('wlAiMessages').replaceChildren();
 addMessage('assistant',isLocal()?'Xin chào! 👋 Mình là trợ lý học tập miễn phí dựa trên bài học Web Lab và quy tắc có sẵn — không phải AI tạo sinh. Hỏi mình về HTML, CSS, JS, DSA, Big O hoặc kiểm tra code nhé.':'Xin chào! ✨ Mình là Web Lab AI trực tuyến. Bạn có thể hỏi về HTML, CSS, SCSS, JavaScript và DSA.');
 renderControls();
 status(isLocal()?'✓ Miễn phí · Hoạt động trên thiết bị, không cần khóa API hay tài khoản.':onlineAccount()?'Sẵn sàng hỏi OpenAI.':'Đăng nhập Web Lab Cloud để hỏi OpenAI.',isLocal()?'ok':'');
}
function open(){
 const dialog=$('wlAiDialog');if(!dialog)return;
 if(!dialog.open)dialog.showModal();
 renderControls();
 if(isLocal())status('✓ Chế độ trợ lý miễn phí — dùng được ngay và không gửi dữ liệu lên máy chủ.','ok');
 else if(!onlineAccount())status('Đăng nhập Web Lab Cloud để hỏi OpenAI.');
 else checkStatus();
 $('wlAiQuestion')?.focus({preventScroll:true});
}
function init(){
 if(!$('wlAiDialog')||!$('wlAiOpenBtn'))return;
 $('wlAiOpenBtn').addEventListener('click',open);
 $('wlAiClose').addEventListener('click',()=>$('wlAiDialog').close());
 $('wlAiLoginBtn').addEventListener('click',signin);
 $('wlAiForm').addEventListener('submit',e=>{e.preventDefault();ask()});
 $('wlAiQuestion').addEventListener('input',renderControls);
 $('wlAiQuestion').addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();ask();}
 });
 $('wlAiIncludeCode').addEventListener('change',renderControls);
 $('wlAiMode').addEventListener('change',()=>{
  $('wlAiIncludeCode').checked=false;
  reset();renderControls();
  if(!isLocal()&&onlineAccount())checkStatus();
 });
 $('wlAiReset').addEventListener('click',reset);
 $('wlAiDialog').addEventListener('click',e=>{if(e.target===$('wlAiDialog'))$('wlAiDialog').close()});
 const suggestions=$('wlAiSuggestions');
 for(const option of suggested){
  const btn=document.createElement('button');btn.type='button';btn.className='wl-ai-suggest';btn.textContent=option.label;
  btn.addEventListener('click',()=>{
   $('wlAiQuestion').value=option.question;
   renderControls();$('wlAiQuestion').focus({preventScroll:true});
  });
  suggestions.append(btn);
 }
 window.addEventListener('online',()=>{if($('wlAiDialog').open)checkStatus()});
 reset();renderControls();
}
window.WebLabTutor={open,checkStatus};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();