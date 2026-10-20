/* Web Lab 13.0 — local code history, personal projects and offline ZIP exports.
   History/projects are local to this device. Studio draft sync retains existing Supabase behavior. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const HISTORY_KEY='webLab:codeHistoryV13',PROJECT_KEY='webLab:personalProjectsV13';
const FIELDS=['html','css','scss','js'],MAX_PROJECTS=16,MAX_HISTORY=64,MAX_PER_LESSON=9,MAX_CODE_CHARS=100000;
const workspace=()=>window.WebLabWorkspace;
function read(key,fb){try{const o=JSON.parse(localStorage.getItem(key)||'null');return o??fb}catch{return fb}}
function write(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true}catch{return false}}
function normalized(input){const result={};for(const key of FIELDS)result[key]=String(input?.[key]??'');return result}
function bytes(code){return FIELDS.reduce((total,k)=>total+code[k].length,0)}
function projectList(){const v=read(PROJECT_KEY,[]);return Array.isArray(v)?v.filter(p=>p&&p.id&&p.code):[]}
function historyList(){const v=read(HISTORY_KEY,[]);return Array.isArray(v)?v.filter(p=>p&&p.id&&p.code):[]}
function notice(msg,fail=false){const e=$('wl13Message');if(e){e.textContent=msg;e.classList.toggle('bad',fail)}}
function activeCode(){const c=workspace()?.getCode();return c?normalized(c):null}
function filename(x){return String(x||'du-an').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50)||'du-an'}
function snapshot({id,code,title,force=false}={}){
 id=id||workspace()?.currentId;title=title||workspace()?.currentTitle;
 code=normalized(code||activeCode());
 if(!id)return false;
 if(bytes(code)>MAX_CODE_CHARS){notice('Code quá dài để lưu lịch sử. Bạn vẫn có thể xuất file ZIP.',true);return false}
 const collection=historyList();
 // Ignore snapshots identical to the latest save for the same lesson.
 const last=collection.find(v=>v.id===id);
 if(last&&FIELDS.every(k=>last.code[k]===code[k]))return true;
 const elapsed=Date.now()-(last?.at||0);
 if(!force&&elapsed<22000)return false;
 const now=Date.now();
 const record={id,title:String(title||id).slice(0,80),at:now,code};
 const next=[record,...collection].sort((a,b)=>b.at-a.at);
 const counts={},reduced=[];
 for(const entry of next){
  counts[entry.id]=(counts[entry.id]||0)+1;
  if(counts[entry.id]>MAX_PER_LESSON)continue;
  reduced.push(entry);
  if(reduced.length===MAX_HISTORY)break;
 }
 // Do not replace old snapshots until the new set can be stored.
 if(!write(HISTORY_KEY,reduced)){notice('Bộ nhớ thiết bị gần đầy. Không lưu được bản code mới.',true);return false}
 return true;
}
let pending=null;
function onChanged(e){
 if(!e.detail?.id||e.detail.restored)return;
 const id=e.detail.id,code=normalized(e.detail.code);
 clearTimeout(pending);
 pending=setTimeout(()=>{
  if(document.visibilityState!=='hidden')snapshot({id,code,title:workspace()?.currentId===id?workspace().currentTitle:id});
 },3200);
}
function show(part='history'){
 const dialog=$('wl13Dialog');
 if(!dialog)return;
 dialog.dataset.tab=part;
 if(!dialog.open)dialog.showModal();
 render();
}
function formatDate(n){try{return new Date(n).toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}catch{return ''}}
function renderHistory(root){
 const id=workspace()?.currentId||'studio';
 const rows=historyList().filter(x=>x.id===id);
 root.innerHTML='<div class="wl13-header"><h3>🕘 Lịch sử của '+esc(workspace()?.currentTitle||'bài học')+'</h3><p>Web Lab tự lưu các mốc code khi bạn sửa. Lịch sử chỉ ở thiết bị này; không tự đồng bộ lên Supabase.</p><button type="button" id="wl13Snapshot" class="wl13-primary">＋ Lưu phiên bản hiện tại</button></div>'+
 (rows.length?'<div class="wl13-list">'+rows.map((x,i)=>
 '<div class="wl13-item"><div><strong>Phiên bản '+(rows.length-i)+'</strong><span>'+esc(formatDate(x.at))+' · '+bytes(normalized(x.code))+' ký tự</span></div>'+
 '<button type="button" data-wl13-restore="'+i+'">↶ Khôi phục</button></div>').join('')+'</div>':
 '<div class="wl13-empty">Chưa có bản sao code. Hãy sửa bài tập hoặc nhấn “Lưu phiên bản hiện tại”.</div>')+
 '<p class="wl13-note">Mỗi bài giữ tối đa 9 phiên bản gần nhất. Khi khôi phục, Web Lab cố gắng lưu phiên bản hiện tại trước khi thay thế.</p>';
 root.querySelector('#wl13Snapshot')?.addEventListener('click',()=>{
  const ok=snapshot({force:true});notice(ok?'Đã lưu phiên bản code.':'Chưa lưu được phiên bản mới.',!ok);render();
 });
 root.querySelectorAll('[data-wl13-restore]').forEach(btn=>btn.addEventListener('click',()=>{
  const row=rows[Number(btn.dataset.wl13Restore)];
  if(!row)return;
  if(!window.confirm('Khôi phục code của phiên bản '+formatDate(row.at)+'? Code hiện tại sẽ được sao lưu nếu còn dung lượng.'))return;
  snapshot({force:true});
  const ok=workspace()?.replaceCode(row.code);
  notice(ok?'Đã khôi phục code. Nhấn “Chạy thử” để xem kết quả.':'Không khôi phục được code.',!ok);
  render();
 }));
}
function saveProject(){
 const code=activeCode();
 if(!code){notice('Hãy mở một bài học hoặc Sân chơi code trước.',true);return}
 if(bytes(code)>MAX_CODE_CHARS){notice('Dự án lớn quá 100.000 ký tự. Hãy xuất trực tiếp từ trình soạn thảo.',true);return}
 const list=projectList();
 if(list.length>=MAX_PROJECTS){notice('Đã có 16 dự án. Hãy xóa một dự án cũ để tạo mới.',true);return}
 const title=String($('wl13ProjectName')?.value||'').trim().slice(0,60)||workspace().currentTitle;
 const id='p'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
 const record={id,title,code,at:Date.now()};
 if(!write(PROJECT_KEY,[record,...list])){notice('Thiết bị không đủ dung lượng để lưu dự án.',true);return}
 $('wl13ProjectName').value='';
 notice('✅ Đã tạo dự án "'+title+'". Dự án được lưu trên thiết bị này.');
 render();
}
function updateProject(id){
 const list=projectList();const idx=list.findIndex(p=>p.id===id);
 if(idx<0)return;
 const code=activeCode();
 if(!code||bytes(code)>MAX_CODE_CHARS){notice('Không thể lưu code hiện tại vào dự án.',true);return}
 if(!window.confirm('Lưu code hiện tại đè lên nội dung dự án "'+list[idx].title+'"?'))return;
 list[idx]={...list[idx],code,at:Date.now()};
 if(!write(PROJECT_KEY,list)){notice('Không đủ dung lượng để cập nhật dự án.',true);return}
 notice('Đã cập nhật dự án.');render();
}
function renameProject(id){
 const list=projectList();const p=list.find(x=>x.id===id);if(!p)return;
 const name=window.prompt('Đổi tên dự án:',p.title);
 if(name===null)return;
 const trimmed=name.trim().slice(0,60);
 if(!trimmed){notice('Tên dự án không được để trống.',true);return}
 p.title=trimmed;
 if(!write(PROJECT_KEY,list)){notice('Không thể đổi tên dự án.',true);return}
 notice('Đã đổi tên dự án.');render();
}
function deleteProject(id){
 const list=projectList();const p=list.find(x=>x.id===id);if(!p)return;
 if(!window.confirm('Xóa dự án "'+p.title+'"? Hành động này không thể hoàn tác.'))return;
 if(!write(PROJECT_KEY,list.filter(x=>x.id!==id))){notice('Không thể xóa dự án.',true);return}
 notice('Đã xóa dự án.');render();
}
function openProject(id){
 const p=projectList().find(p=>p.id===id);if(!p)return;
 if(!window.confirm('Mở dự án "'+p.title+'" vào Sân chơi code? Code ở Sân chơi sẽ được sao lưu trước khi thay thế.'))return;
 const current=workspace()?.getCode();
 if(current)snapshot({force:true});
 window.WEB_LAB_NAVIGATE?.('studio');
 const studioCode=workspace()?.getCode();
 if(studioCode)snapshot({id:'studio',title:'Sân chơi tự do',code:studioCode,force:true});
 const ok=workspace()?.replaceCode(p.code);
 if(ok){
  $('wl13Dialog')?.close();
  window.requestAnimationFrame(()=>$('#detailPanel')?.scrollIntoView({block:'start',behavior:'smooth'}));
 }else notice('Không thể mở dự án vào Sân chơi code.',true);
}
function crcTable(){
 const out=new Uint32Array(256);
 for(let n=0;n<256;n++){let c=n;for(let i=0;i<8;i++)c=c&1?0xedb88320^(c>>>1):c>>>1;out[n]=c>>>0}
 return out;
}
const TABLE=crcTable();
function crc32(bytes){
 let c=0xffffffff;
 for(const b of bytes)c=TABLE[(c^b)&255]^(c>>>8);
 return (c^0xffffffff)>>>0;
}
function zipBlob(filePairs){
 const encoder=new TextEncoder(),localParts=[],centralParts=[];
 let offset=0;
 const now=new Date(),dt=((now.getHours()&31)<<11)|((now.getMinutes()&63)<<5)|((Math.floor(now.getSeconds()/2))&31);
 const date=(((now.getFullYear()-1980)&127)<<9)|(((now.getMonth()+1)&15)<<5)|(now.getDate()&31);
 for(const [name,value] of filePairs){
  const nameBytes=encoder.encode(name),data=encoder.encode(value);
  const checksum=crc32(data);
  const localHeader=new Uint8Array(30+nameBytes.length),localView=new DataView(localHeader.buffer);
  localView.setUint32(0,0x04034b50,true);localView.setUint16(4,20,true);
  localView.setUint16(6,0x0800,true);localView.setUint16(8,0,true);
  localView.setUint16(10,dt,true);localView.setUint16(12,date,true);
  localView.setUint32(14,checksum,true);localView.setUint32(18,data.length,true);localView.setUint32(22,data.length,true);
  localView.setUint16(26,nameBytes.length,true);localHeader.set(nameBytes,30);
  localParts.push(localHeader,data);
  const central=new Uint8Array(46+nameBytes.length),cv=new DataView(central.buffer);
  cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);
  cv.setUint16(8,0x0800,true);cv.setUint16(10,0,true);cv.setUint16(12,dt,true);cv.setUint16(14,date,true);
  cv.setUint32(16,checksum,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);
  cv.setUint16(28,nameBytes.length,true);cv.setUint32(42,offset,true);central.set(nameBytes,46);
  centralParts.push(central);
  offset+=localHeader.length+data.length;
 }
 const centralSize=centralParts.reduce((s,p)=>s+p.length,0);
 const end=new Uint8Array(22),ev=new DataView(end.buffer);
 ev.setUint32(0,0x06054b50,true);ev.setUint16(8,filePairs.length,true);ev.setUint16(10,filePairs.length,true);
 ev.setUint32(12,centralSize,true);ev.setUint32(16,offset,true);
 return new Blob([...localParts,...centralParts,end],{type:'application/zip'});
}
function fullIndex(code){
 const link='<link rel="stylesheet" href="./style.css">';
 const script='<script src="./script.js" defer><\/script>';
 const html=code.html;
 if(/<html[\s>]/i.test(html)){
  let output=html;
  output=/<\/head>/i.test(output)?output.replace(/<\/head>/i,link+'</head>'):output.replace(/<body/i,'<head>'+link+'</head><body');
  output=/<\/body>/i.test(output)?output.replace(/<\/body>/i,script+'</body>'):output+script;
  return output;
 }
 return '<!doctype html>\n<html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+link+'</head><body>\n'+html+'\n'+script+'\n</body></html>';
}
function exportProject(project){
 const code=normalized(project.code);
 const files=[['index.html',fullIndex(code)],['style.css',code.css],['style.scss',code.scss],['script.js',code.js],
 ['README.txt','Web Lab 13.0 - '+project.title+'\nMo index.html trong trinh duyet de xem HTML, CSS, JavaScript.\nFile style.scss can duoc bien dich thanh CSS rieng neu su dung SCSS.\nCode duoc xuat tu Web Lab, nen xem lai va kiem tra truoc khi dang len web.\n']];
 const blob=zipBlob(files),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=filename(project.title)+'.zip';a.style.display='none';
 document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),60000);
 notice('✅ Đã chuẩn bị file ZIP của "'+project.title+'".');
}
function renderProjects(root){
 const items=projectList();
 root.innerHTML='<div class="wl13-header"><h3>📁 Dự án cá nhân</h3><p>Lưu HTML, CSS, SCSS và JavaScript thành dự án, mở lại để sửa và xuất ZIP. Dữ liệu dự án được lưu trên thiết bị này.</p></div>'+
 '<form id="wl13CreateForm" class="wl13-form"><label for="wl13ProjectName">Tên dự án mới</label><div class="wl13-create"><input type="text" maxlength="60" id="wl13ProjectName" placeholder="Ví dụ: Trang cá nhân của tôi" autocomplete="off" required><button type="submit" class="wl13-primary">＋ Lưu code thành dự án</button></div></form>'+
 (items.length?'<div class="wl13-list">'+items.map(p=>
 '<article class="wl13-project"><div><strong>'+esc(p.title)+'</strong><span>'+esc(formatDate(p.at))+' · HTML / CSS / SCSS / JS</span></div>'+
 '<div class="wl13-actions"><button type="button" data-wl13-open="'+esc(p.id)+'" class="wl13-primary">Mở code</button>'+
 '<button type="button" data-wl13-update="'+esc(p.id)+'">Lưu đè</button>'+
 '<button type="button" data-wl13-export="'+esc(p.id)+'">⬇ ZIP</button>'+
 '<button type="button" data-wl13-rename="'+esc(p.id)+'">Đổi tên</button>'+
 '<button type="button" data-wl13-delete="'+esc(p.id)+'" class="wl13-danger">Xóa</button></div></article>').join('')+'</div>':
 '<div class="wl13-empty">Chưa có dự án cá nhân nào. Hãy viết code trong một bài hoặc Sân chơi và nhấn “Lưu code thành dự án”.</div>')+
 '<p class="wl13-note">Giới hạn 16 dự án trên thiết bị này. Xuất ZIP để có bản sao an toàn, vì xóa dữ liệu Safari có thể làm mất dự án và lịch sử.</p>';
 root.querySelector('#wl13CreateForm')?.addEventListener('submit',e=>{e.preventDefault();saveProject()});
 for(const [attr,handler] of [['open',openProject],['update',updateProject],['export',id=>{const p=projectList().find(p=>p.id===id);if(p)exportProject(p)}],['rename',renameProject],['delete',deleteProject]]){
  root.querySelectorAll('[data-wl13-'+attr+']').forEach(btn=>btn.addEventListener('click',()=>handler(btn.getAttribute('data-wl13-'+attr))));
 }
}
function render(){
 const d=$('wl13Dialog'),body=$('wl13Content');if(!d||!body||!d.open)return;
 const tab=d.dataset.tab||'history';
 $('wl13HistoryTab').classList.toggle('selected',tab==='history');
 $('wl13ProjectsTab').classList.toggle('selected',tab==='projects');
 $('wl13HistoryTab').setAttribute('aria-selected',String(tab==='history'));
 $('wl13ProjectsTab').setAttribute('aria-selected',String(tab==='projects'));
 if(tab==='history')renderHistory(body);else renderProjects(body);
}
function init(){
 const dialog=$('wl13Dialog');if(!dialog)return;
 $('wl13HistoryBtn')?.addEventListener('click',()=>show('history'));
 $('wl13ProjectBtn')?.addEventListener('click',()=>show('projects'));
 $('wl13GlobalProjects')?.addEventListener('click',()=>show('projects'));
 $('wl13Close')?.addEventListener('click',()=>dialog.close());
 $('wl13HistoryTab')?.addEventListener('click',()=>{dialog.dataset.tab='history';render()});
 $('wl13ProjectsTab')?.addEventListener('click',()=>{dialog.dataset.tab='projects';render()});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 window.addEventListener('webLab:codeSaved',onChanged);
 window.addEventListener('pagehide',()=>{clearTimeout(pending);pending=null;const code=activeCode();if(code)snapshot({code})});
}
window.WebLabV13={snapshot,zipBlob,crc32,projectList,historyList,show};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();