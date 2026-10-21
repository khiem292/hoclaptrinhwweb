/* Web Lab 17.0 — paste/file/editor code explainer interface.
 * All analysis stays in this browser. No fetch, eval, or code execution.
 */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const langName={auto:'Tự nhận diện',js:'JavaScript',html:'HTML',css:'CSS',scss:'SCSS',json:'JSON'};
let report=null,filename='',sourceType='paste',expanded=false;
function announce(message,type=''){
 const label=$('ceFeedback');
 if(label){label.textContent=message;label.dataset.type=type;}
}
function fileLabel(text){const el=$('ceFileName');if(el)el.textContent=text||'Chưa chọn file';}
function open(prefill=false){
 const dialog=$('ceDialog');
 if(!dialog)return;
 if(prefill)fromEditor();
 if(!dialog.open)dialog.showModal();
 $('ceSource')?.focus({preventScroll:true});
}
function clearResults(){
 report=null;
 const section=$('ceResult');section.hidden=true;
 $('ceStats').textContent='';
 $('ceLines').replaceChildren();
 $('ceOverview').textContent='';
}
function sourceChanged(){
 clearResults();
 if(sourceType==='file'){
  sourceType='paste';filename='';fileLabel('');
 }
}
function newNode(tag,cls,text){
 const e=document.createElement(tag);
 if(cls)e.className=cls;
 if(text!==undefined)e.textContent=String(text);
 return e;
}
function fromEditor(){
 const editor=$('codeEditor');
 if(!editor){open(false);announce('Hãy mở một bài học có trình soạn thảo rồi thử lại.','warn');return;}
 const active=document.querySelector('[data-editor].active');
 const lang=active?.dataset?.editor||'js';
 $('ceSource').value=editor.value||'';
 $('ceLanguage').value=['html','css','scss','js'].includes(lang)?lang:'auto';
 sourceType='editor';filename='';
 fileLabel('Đã lấy code từ tab '+(langName[lang]||lang)+' của bài đang học.');
 clearResults();
 announce('Đã lấy code từ trình soạn thảo Web Lab. Bạn có thể sửa trước khi phân tích.','ok');
}
async function loadFile(file){
 if(!file)return;
 const allowed=/\.(html?|css|scss|sass|js|mjs|cjs|jsx|ts|tsx|json|txt)$/i;
 if(!allowed.test(file.name||'')){
  announce('Chỉ hỗ trợ file văn bản .html, .css, .scss, .js, .ts, .json hoặc .txt. ZIP và file nhị phân chưa được hỗ trợ.','error');return;
 }
 if(file.size>350000){announce('File quá lớn. Hãy chọn file dưới 350 KB hoặc tách thành nhiều phần.','error');return;}
 try{
  const value=await file.text();
  $('ceSource').value=value;
  $('ceLanguage').value='auto';
  filename=file.name;sourceType='file';
  fileLabel('📄 '+file.name+' ('+Math.round(file.size/1024*10)/10+' KB)');
  clearResults();
  announce('Đã đọc file trên thiết bị, không tải lên máy chủ. Nhấn “Giải thích toàn bộ”.','ok');
 }catch{
  announce('Không đọc được file. Hãy thử lại hoặc sao chép code rồi dán trực tiếp.','error');
 }
}
function populateLine(row,container){
 if(container.dataset.ready==='yes')return;
 container.dataset.ready='yes';
 const info=newNode('p','ce-line-info',row.summary);
 container.append(info);
 if(!row.items.length){
  container.append(newNode('p','ce-none','Không có ký hiệu cần phân tích trên dòng này.'));
  return;
 }
 const list=newNode('div','ce-token-grid');
 for(const item of row.items){
  const element=newNode('div','ce-token-item');
  const key=newNode('code','ce-token',item.token);
  const detail=newNode('p','ce-token-meaning',item.why);
  element.append(key,detail);list.append(element);
 }
 container.append(list);
}
function renderReport(next){
 report=next;expanded=false;
 $('ceResult').hidden=false;
 $('ceStats').textContent=next.lineCount+' dòng · '+next.nonblank+' dòng có nội dung · '+next.tokenCount+' thành phần · '+(langName[next.language]||next.language);
 $('ceOverview').textContent=next.overview;
 $('ceImportantNote').textContent=next.note;
 const root=$('ceLines');
 root.replaceChildren();
 for(const row of next.lines){
  const details=newNode('details','ce-line');
  details.dataset.line=String(row.number);
  const summary=newNode('summary','ce-line-title');
  const number=newNode('span','ce-number','Dòng '+row.number);
  const preview=newNode('code','ce-code-preview',row.code.trim()||'(dòng trống)');
  const hint=newNode('span','ce-short',row.summary);
  summary.append(number,preview,hint);
  const content=newNode('div','ce-line-content');
  details.append(summary,content);
  details.addEventListener('toggle',()=>{
   if(details.open)populateLine(row,content);
  });
  root.append(details);
  if(row.number<=3){details.open=true;populateLine(row,content);}
 }
 $('ceExpand').textContent='Mở rộng tất cả';
 announce('✅ Đã phân tích '+next.lineCount+' dòng, giải thích '+next.tokenCount+' thành phần. Nhấn từng dòng để xem chi tiết.','ok');
 $('ceResult').scrollIntoView({behavior:'smooth',block:'start'});
}
function analyze(){
 const engine=window.WebLabCodeExplainer;
 if(!engine){announce('Chưa tải được bộ giải thích code. Hãy mở lại Web Lab để cập nhật.','error');return;}
 const code=$('ceSource').value;
 try{
  const result=engine.explain(code,$('ceLanguage').value,filename);
  renderReport(result);
 }catch(e){clearResults();announce('⚠ '+(e.message||'Không thể phân tích đoạn code này.'),'error');}
}
function reportText(){
 if(!report)return'';
 const items=['WEB LAB — GIẢI THÍCH MÃ NGUỒN',report.filename||'Code đã dán','Ngôn ngữ: '+langName[report.language],
 report.lineCount+' dòng · '+report.tokenCount+' thành phần',report.overview,''];
 for(const row of report.lines){
  items.push('DÒNG '+row.number+': '+(row.code||'(trống)'));
  items.push('Giải thích: '+row.summary);
  for(const item of row.items)items.push('  • '+item.token+' → '+item.why);
  items.push('');
 }
 items.push('Lưu ý: '+report.note);
 return items.join('\n');
}
async function copy(){
 if(!report)return;
 if(!navigator.clipboard?.writeText){announce('Trình duyệt chưa hỗ trợ sao chép tự động. Bạn có thể dùng “Xuất TXT”.','warn');return;}
 try{await navigator.clipboard.writeText(reportText());announce('✓ Đã sao chép toàn bộ lời giải thích.','ok')}
 catch{announce('Không sao chép được. Bạn hãy thử nút “Xuất TXT”.','warn')}
}
function download(){
 if(!report)return;
 const blob=new Blob(['\uFEFF'+reportText()],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob);
 const link=document.createElement('a');
 link.href=url;link.download='weblab-giai-thich-code.txt';
 document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),60000);
 announce('Đã chuẩn bị file TXT tiếng Việt.','ok');
}
function example(){
 $('ceSource').value='const numbers = [2, 4, 6];\nconst total = numbers.reduce((sum, number) => sum + number, 0);\nconsole.log("Tổng là:", total);';
 $('ceLanguage').value='js';filename='';sourceType='example';
 fileLabel('Đang dùng code ví dụ JavaScript.');
 clearResults();announce('Đã nạp ví dụ. Nhấn “Giải thích toàn bộ” để xem từng dòng và ký hiệu.','ok');
}
function toggleAll(){
 if(!report)return;
 expanded=!expanded;
 const all=$('ceLines').querySelectorAll('details.ce-line');
 for(let i=0;i<all.length;i++){
  const line=all[i],row=report.lines[i];
  line.open=expanded;
  if(expanded)populateLine(row,line.querySelector('.ce-line-content'));
 }
 $('ceExpand').textContent=expanded?'Thu gọn tất cả':'Mở rộng tất cả';
}
function init(){
 if(!$('ceDialog')||!$('ceHeroBtn'))return;
 $('ceHeroBtn').addEventListener('click',()=>open());
 $('ceClose').addEventListener('click',()=>$('ceDialog').close());
 $('ceDialog').addEventListener('click',e=>{if(e.target===$('ceDialog'))$('ceDialog').close()});
 document.addEventListener('click',e=>{
  const target=e.target?.closest?.('#ceEditorBtn');
  if(target)open(true);
 });
 $('ceFromEditor').addEventListener('click',fromEditor);
 $('ceExample').addEventListener('click',example);
 $('ceAnalyze').addEventListener('click',analyze);
 $('ceSource').addEventListener('input',sourceChanged);
 $('ceLanguage').addEventListener('change',clearResults);
 $('ceFile').addEventListener('change',e=>{loadFile(e.target.files?.[0]);e.target.value=''});
 $('ceDrop').addEventListener('dragover',e=>{e.preventDefault();$('ceDrop').classList.add('dragging')});
 $('ceDrop').addEventListener('dragleave',()=>$('ceDrop').classList.remove('dragging'));
 $('ceDrop').addEventListener('drop',e=>{
  e.preventDefault();$('ceDrop').classList.remove('dragging');
  if(e.dataTransfer?.files?.length)loadFile(e.dataTransfer.files[0]);
 });
 $('ceExpand').addEventListener('click',toggleAll);
 $('ceCopy').addEventListener('click',copy);
 $('ceDownload').addEventListener('click',download);
}
window.WebLabExplainerUI={open,analyze,example};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();