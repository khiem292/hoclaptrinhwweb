/* Web Lab 9.0 — Bài giảng chuyển động tự tạo cho 66 bài roadmap.
   Đây là trình phát bài giảng hoạt họa theo từng bước, không phải MP4 thu sẵn.
   Không tự phát khi mở bài; tôn trọng thiết bị và băng thông người học. */
(()=>{
'use strict';
const ESC=text=>String(text??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const waitMs=7600;
const codeLabel={html:'index.html',css:'style.css',scss:'style.scss',js:'script.js'};
let active=null;

function slidesFor(item){
 const guide=item.guide||{};
 const topics=Array.isArray(guide.topics)?guide.topics:[];
 const deck=[{
   badge:'BẮT ĐẦU',title:item.name,
   details:'Bạn sẽ học cách viết và hiểu những kiến thức cần thiết trước khi làm bài thực hành.',
   extra:'Mục tiêu của bài: '+(item.summary||'Hiểu và tự viết ví dụ thực tế.'),
   code:'',mode:'overview'
 }];
 for(let n=0;n<topics.length;n++){
   const p=topics[n],detail=p.deep||{};
   deck.push({
     badge:'KIẾN THỨC '+(n+1)+'/'+topics.length,
     title:p.title||p.key,
     details:detail.meaning||p.why||'Hãy hiểu cú pháp và mục đích trước khi áp dụng.',
     extra:detail.steps||'Đọc ví dụ, sau đó tự viết code trong trình soạn thảo.',
     code:p.example||'',mode:p.tab||'html'
   });
 }
 deck.push({
   badge:'ĐẾN LƯỢT BẠN',title:'Tự làm bài thực hành',
   details:'Mở các tab HTML, CSS, SCSS hoặc JavaScript bên dưới và viết lại ví dụ theo cách hiểu của bạn.',
   extra:'Nhấn ▶ Chạy thử rồi ✓ Kiểm tra bài làm. Khi hoàn thành mọi yêu cầu, nút “Bài tiếp theo” sẽ mở khóa.',
   code:'',mode:'finish'
 });
 return deck;
}
function markup(item){
 if(item?.kind!=='roadmap'||!item.guide?.topics?.length)return '';
 const count=slidesFor(item).length;
 return '<section class="lesson-section wl-video-lesson" id="wlVideoLesson" aria-label="Bài giảng minh họa trước bài tập">'+
 '<div class="section-header"><h3>🎞️ Video hướng dẫn theo bài</h3><span class="section-hint">Tự tạo từ nội dung bài học</span></div>'+
 '<p class="wl-video-intro">Xem bài giảng hoạt họa có ví dụ code, giải thích từng bước và thao tác điều khiển. Bài giảng chạy trực tiếp trên website, không cần YouTube.</p>'+
 '<div class="wl-video-player" role="group" aria-label="Trình phát bài giảng tương tác">'+
  '<div class="wl-video-stage" aria-live="off">'+
   '<div class="wl-video-top"><span class="wl-video-brand">WEB LAB • CODE CLASS</span><span class="wl-video-badge" id="wlVideoBadge">BẮT ĐẦU</span></div>'+
   '<div class="wl-video-copy"><h4 id="wlVideoTitle"></h4><p id="wlVideoMeaning"></p><div class="wl-video-extra" id="wlVideoInstruction"></div></div>'+
   '<div class="wl-video-terminal" id="wlVideoTerminal" hidden><div class="wl-video-terminalbar"><i></i><i></i><i></i><span id="wlVideoFilename">index.html</span></div><pre><code id="wlVideoCode"></code><span class="wl-video-caret" aria-hidden="true">▏</span></pre></div>'+
   '<div class="wl-video-stagefooter"><span id="wlVideoCounter">1 / '+count+'</span><span>HỌC → HIỂU → LÀM</span></div>'+
  '</div>'+
  '<div class="wl-video-progress"><input type="range" id="wlVideoSeek" min="0" max="'+(count-1)+'" value="0" step="1" aria-label="Chọn bước trong bài giảng"><div class="wl-video-ticks" id="wlVideoProgressText">Bước 1 / '+count+'</div></div>'+
  '<div class="wl-video-controls">'+
   '<button type="button" id="wlVideoPrevious" aria-label="Bước trước">⏮ Trước</button>'+
   '<button type="button" id="wlVideoPlay" class="wl-video-play" aria-pressed="false">▶ Phát bài giảng</button>'+
   '<button type="button" id="wlVideoNext" aria-label="Bước tiếp theo">Tiếp ⏭</button>'+
   '<button type="button" id="wlVideoSpeak" aria-label="Đọc lời giải thích bằng giọng nói">🔊 Nghe</button>'+
  '</div>'+
  '<p class="wl-video-caption" id="wlVideoCaption" role="status" aria-live="polite">Nhấn ▶ Phát bài giảng để xem từng bước. Có thể tua bằng thanh tiến độ.</p>'+
 '</div>'+
 '<p class="wl-video-note">Đây là <strong>bài giảng chuyển động do Web Lab tạo tự động từ từng bài</strong>, có chữ và ví dụ code; không phải video MP4 có người thuyết trình. Tính năng đọc giọng nói phụ thuộc trình duyệt.</p>'+
 '</section>';
}
function stop({silence=true}={}){
 if(!active)return;
 if(active.timer)clearInterval(active.timer);
 active.timer=null;
 if(silence&&'speechSynthesis' in window)try{speechSynthesis.cancel()}catch{}
 active=null;
}
function mount(item){
 stop();
 const root=document.getElementById('wlVideoLesson');
 if(!root||item?.kind!=='roadmap')return;
 const slides=slidesFor(item);
 const get=id=>root.querySelector('#'+id);
 const st={root,slides,pos:0,playing:false,timer:null,started:0,shown:0,stepDuration:waitMs};
 active=st;
 const playButton=get('wlVideoPlay'),previous=get('wlVideoPrevious'),next=get('wlVideoNext');
 function label(){
   playButton.textContent=st.playing?'❚❚ Tạm dừng':'▶ Phát bài giảng';
   playButton.setAttribute('aria-pressed',String(st.playing));
   previous.disabled=st.pos===0;
   next.disabled=st.pos===slides.length-1;
   get('wlVideoCaption').textContent=st.playing
     ?'Đang phát • '+(st.pos+1)+'/'+slides.length+' • Có thể tạm dừng và tua đến mục khác.'
     :st.pos===slides.length-1?'Bạn đã xem xong. Hãy kéo xuống trình soạn thảo để làm bài.'
     :'Đã dừng tại bước '+(st.pos+1)+'/'+slides.length+'. Nhấn Phát để tiếp tục.';
 }
 function render(){
   if(!root.isConnected){stop();return}
   const slide=slides[st.pos];
   get('wlVideoBadge').textContent=slide.badge;
   get('wlVideoTitle').textContent=slide.title;
   get('wlVideoMeaning').textContent=slide.details;
   get('wlVideoInstruction').textContent=slide.extra;
   get('wlVideoCounter').textContent=(st.pos+1)+' / '+slides.length;
   get('wlVideoSeek').value=String(st.pos);
   get('wlVideoProgressText').textContent='Bước '+(st.pos+1)+' / '+slides.length;
   get('wlVideoSeek').style.setProperty('--wl-seek-fill', (st.pos/(slides.length-1))*100+'%');
   const term=get('wlVideoTerminal');
   term.hidden=!slide.code;
   get('wlVideoFilename').textContent=codeLabel[slide.mode]||codeLabel.html;
   get('wlVideoCode').textContent=slide.code?slide.code.slice(0,st.shown):'';
   label();
 }
 function pause(){
   st.playing=false;
   if(st.timer)clearInterval(st.timer);
   st.timer=null;label();
 }
 function stepTo(n,{resume=false}={}){
   if('speechSynthesis' in window)try{speechSynthesis.cancel()}catch{}
   st.pos=Math.max(0,Math.min(slides.length-1,n));
   st.shown=0;st.started=performance.now();
   if(!resume)pause();
   render();
 }
 function tick(){
   if(active!==st||!root.isConnected||document.visibilityState==='hidden'){pause();return}
   const elapsed=performance.now()-st.started;
   const progress=Math.min(1,elapsed/st.stepDuration);
   const code=slides[st.pos].code||'';
   if(code){
     const visible=Math.min(code.length,Math.ceil(code.length*Math.min(1,elapsed/(st.stepDuration*.60))));
     if(visible!==st.shown){st.shown=visible;get('wlVideoCode').textContent=code.slice(0,visible)}
   }
   if(progress>=1){
     if(st.pos<slides.length-1){stepTo(st.pos+1,{resume:true});}
     else {pause();}
   }
 }
 function start(){
   if(st.pos===slides.length-1)stepTo(0);
   st.playing=true;st.started=performance.now();label();
   if(st.timer)clearInterval(st.timer);
   st.timer=setInterval(tick,120);
 }
 playButton.addEventListener('click',()=>st.playing?pause():start());
 previous.addEventListener('click',()=>stepTo(st.pos-1));
 next.addEventListener('click',()=>stepTo(st.pos+1));
 get('wlVideoSeek').addEventListener('input',e=>stepTo(Number(e.target.value)));
 get('wlVideoSpeak').addEventListener('click',()=>{
   if(!('speechSynthesis' in window)||!window.SpeechSynthesisUtterance){
     get('wlVideoCaption').textContent='Thiết bị này không hỗ trợ đọc lời giải thích tự động.';
     return;
   }
   try{
     speechSynthesis.cancel();
     const slide=slides[st.pos];
     const utterance=new SpeechSynthesisUtterance([slide.title,slide.details,slide.extra].join('. '));
     utterance.lang='vi-VN';utterance.rate=.95;utterance.pitch=1;
     speechSynthesis.speak(utterance);
     get('wlVideoCaption').textContent='🔊 Đang đọc lời giải thích của bước '+(st.pos+1)+'.';
   }catch{
     get('wlVideoCaption').textContent='Không thể phát giọng đọc trên thiết bị này.';
   }
 });
 // Prevent timer leakage on backgrounded Safari and free resources when leaving lessons.
 document.addEventListener('visibilitychange',()=>{
   if(active===st&&document.visibilityState==='hidden')pause();
 },{signal:(()=>{const c=new AbortController();st.abort=c;return c.signal;})()});
 const priorStop=stop;
 st.close=()=>{pause();st.abort?.abort()};
 const clean=()=>{if(active?.close)active.close();priorStop()};
 if(!window.WebLabVideo || window.WebLabVideo.destroy!==clean)window.WebLabVideo.destroy=clean;
 render();
}
window.WebLabVideo={markup,mount,destroy:()=>stop(),get lessonCount(){return (window.HTML_LAB_DATA?.LESSONS||[]).filter(x=>x.kind==='roadmap').length}};
})();