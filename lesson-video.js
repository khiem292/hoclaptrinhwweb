/* Web Lab 10.0 — trình chiếu bài học kiểu VS Code có thuyết minh tiếng Việt.
 * Bài học tạo động theo mục tiêu học; âm thanh dùng Web Speech trên thiết bị.
 * Không phải tập tin MP4 hoặc giọng đọc thu âm sẵn.
 */
(()=>{
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const filenames={html:'index.html',css:'style.css',scss:'style.scss',js:'script.js'};
 const labels={html:'HTML',css:'CSS',scss:'SCSS',js:'JavaScript'};
 const REDUCED=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
 const supportsSpeech=()=>('speechSynthesis' in window)&&('SpeechSynthesisUtterance' in window);
 let active=null;
 function phrase(str){return String(str||'').replace(/<h([1-6])>/gi,(_,n)=>'thẻ h '+n).replace(/<\/?[a-z][^>]*>/gi,' thẻ HTML ').replace(/@media/gi,'media query').replace(/SCSS/g,'S C S S').replace(/CSS/g,'C S S').replace(/HTML/g,'H T M L').replace(/JavaScript/g,'Java Script');}
 function scenesFor(item){
   const topics=item.guide?.topics||[];
   const scenes=[{
     label:'GIỚI THIỆU',heading:item.name,step:'Hôm nay chúng ta sẽ học gì?',
     text:item.summary||'Học và thực hành lập trình website.',
     spoken:'Xin chào, chào mừng đến với Web Lab. Hôm nay chúng ta học bài '+phrase(item.name)+'. '+phrase(item.guide?.intro||item.summary)+'. Trước tiên hãy xem cách viết mã, rồi bạn sẽ tự làm bài tập.',
     language:topics[0]?.tab||'html',code:'',kind:'intro'
   }];
   topics.forEach((topic,i)=>{
     const deep=topic.deep||{};
     const base=topic.title||topic.key||'Kiến thức mới';
     scenes.push({
       label:'PHẦN '+(i+1)+' / '+topics.length,heading:base,step:'1 • Hiểu công dụng',
       text:deep.meaning||topic.why||'Đây là kiến thức cần học cho bài thực hành.',
       spoken:'Phần '+(i+1)+'. '+phrase(base)+'. '+phrase(deep.meaning||topic.why||'Chúng ta cùng tìm hiểu cách sử dụng.'),
       language:topic.tab||'html',code:'',kind:'concept'
     });
     scenes.push({
       label:'GÕ CODE · '+(i+1)+' / '+topics.length,heading:base,step:'2 • Theo dõi cách viết từng dòng',
       text:deep.steps||'Bây giờ chúng ta viết ví dụ vào đúng tab.',
       spoken:'Bây giờ hãy quan sát đoạn mã được gõ trên màn hình, từng dòng một. '+phrase(deep.steps||'Hãy chú ý cú pháp, các thẻ đóng và vị trí đặt thuộc tính.')+'. Khi học xong, bạn sẽ tự viết lại đoạn này.',
       language:topic.tab||'html',code:topic.example||'',kind:'typing'
     });
     scenes.push({
       label:'GHI NHỚ · '+(i+1)+' / '+topics.length,heading:base,step:'3 • Tránh lỗi thường gặp',
       text:deep.pitfalls||topic.why||'Kiểm tra cú pháp và nhìn kết quả trong khung chạy thử.',
       spoken:'Trước khi chuyển sang phần tiếp theo, hãy ghi nhớ. '+phrase(deep.pitfalls||'Bạn nên tự kiểm tra cú pháp và thử thay đổi ví dụ.')+'. Kết quả mong đợi là '+phrase(deep.expected||'bài tập hoạt động đúng theo yêu cầu')+'.',
       language:topic.tab||'html',code:topic.example||'',kind:'tip'
     });
   });
   const goals=(item.practice?.goals||[]).map(x=>x[2]).filter(Boolean);
   scenes.push({
     label:'THỰC HÀNH',heading:'Đến lượt bạn viết code!',step:'4 • Làm bài để mở khóa bài tiếp theo',
     text:goals.length?'Yêu cầu: '+goals.join(' • '):'Mở trình soạn thảo và tự viết ví dụ.',
     spoken:'Bạn đã học xong phần hướng dẫn. Bây giờ hãy kéo xuống trình soạn thảo, tự viết code và nhấn Chạy thử. Sau đó kiểm tra bài làm để mở khóa bài tiếp theo.',
     language:topics.at(-1)?.tab||'html',code:'',kind:'finish'
   });
   return scenes;
 }
 function markup(item){
   if(item?.kind!=='roadmap'||!item.guide?.topics?.length)return '';
   const steps=scenesFor(item).length;
   return '<section class="lesson-section wl-video-lesson wl-v10" id="wlVideoLesson" aria-label="Bài giảng có giọng nói tiếng Việt">'+
     '<div class="section-header"><h3>🎥 Bài giảng có thuyết minh tiếng Việt</h3><span class="section-hint">Viết code kiểu VS Code</span></div>'+
     '<p class="wl-video-intro">Nhấn <strong>Phát bài học</strong> để xem giáo viên ảo giải thích và gõ code từng dòng. Giọng đọc do trình duyệt cung cấp; bạn có thể bật hoặc tắt bất cứ lúc nào.</p>'+
     '<div class="wl-video-player" role="group" aria-label="Trình phát bài giảng Web Lab">'+
       '<div class="wl-video-stage wl-v10-stage">'+
         '<div class="wl-video-top"><span class="wl-video-brand">WEB LAB · FRONTEND ACADEMY</span><span class="wl-video-badge" id="wlVideoBadge">GIỚI THIỆU</span></div>'+
         '<div class="wl-v10-title"><span class="wl-v10-step" id="wlV10Step"></span><h4 id="wlVideoTitle"></h4><p id="wlVideoMeaning"></p></div>'+
         '<div class="wl-v10-ide"><div class="wl-v10-toolbar"><span class="wl-v10-dots">● ● ●</span><span id="wlVideoFilename">index.html</span><span>WEB LAB • STUDIO</span></div>'+
           '<div class="wl-v10-editorrow"><pre class="wl-v10-gutter" id="wlV10Gutter" aria-hidden="true">1</pre><pre class="wl-v10-code"><code id="wlVideoCode"></code><span class="wl-video-caret" aria-hidden="true">▍</span></pre></div>'+
           '<div class="wl-v10-editorfooter"><span id="wlV10Language">HTML</span><span>UTF-8 • Spaces: 2</span></div>'+
         '</div>'+
         '<div class="wl-v10-subtitles" id="wlV10Subtitles" role="status" aria-live="off"></div>'+
         '<div class="wl-video-stagefooter"><span id="wlVideoCounter">1 / '+steps+'</span><span id="wlV10AudioState">🔇 Sẵn sàng</span></div>'+
       '</div>'+
       '<div class="wl-video-progress"><input type="range" id="wlVideoSeek" min="0" max="'+(steps-1)+'" value="0" step="1" aria-label="Chọn phần của video"><span class="wl-video-ticks" id="wlVideoProgressText">1/'+steps+'</span></div>'+
       '<div class="wl-video-controls wl-v10-controls">'+
         '<button type="button" id="wlVideoPrevious" aria-label="Phần trước">⏮ Trước</button>'+
         '<button type="button" id="wlVideoPlay" class="wl-video-play" aria-pressed="false">▶ Phát bài học</button>'+
         '<button type="button" id="wlVideoNext" aria-label="Phần tiếp">Tiếp ⏭</button>'+
         '<button type="button" id="wlVideoSpeak" aria-pressed="true">🔊 Giọng Việt: Bật</button>'+
         '<label class="wl-v10-speed">Tốc độ <select id="wlV10Speed" aria-label="Tốc độ bài giảng"><option value="0.85">0.85x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option></select></label>'+
       '</div>'+
       '<p class="wl-video-caption" id="wlVideoCaption" role="status" aria-live="polite">Nhấn Phát để nghe thuyết minh và xem code được gõ tự động.</p>'+
     '</div>'+
     '<details class="wl-v10-transcript"><summary>📄 Xem lời giảng bằng chữ (khi không nghe được âm thanh)</summary><div id="wlV10Transcript"></div></details>'+
     '<p class="wl-video-note">Đây là <strong>video mô phỏng tương tác có giọng đọc tổng hợp</strong>, không phải video MP4 thu sẵn. Giọng Việt và chất lượng phụ thuộc vào trình duyệt/thiết bị; nội dung và phụ đề vẫn dùng được khi tắt âm.</p>'+
   '</section>';
 }
 function cancelAudio(){if(supportsSpeech())try{window.speechSynthesis.cancel()}catch{}}
 function stop(){
   if(!active)return;
   const state=active;active=null;
   state.playing=false;
   state.generation++;
   clearTimeout(state.timer);
   clearInterval(state.tick);
   state.timer=null;state.tick=null;
   state.abort.abort();
   cancelAudio();
 }
 function mount(item){
   stop();
   const root=document.getElementById('wlVideoLesson');
   if(!root||item?.kind!=='roadmap')return;
   const scenes=scenesFor(item);
   const el=id=>root.querySelector('#'+id);
   const abort=new AbortController(),options={signal:abort.signal};
   const state={root,scenes,abort,pos:0,playing:false,voice:true,speed:1,timer:null,tick:null,
     started:0,shown:0,doneVoice:false,doneCode:false,generation:0,utterance:null};
   active=state;
   const btn=el('wlVideoPlay'),prev=el('wlVideoPrevious'),next=el('wlVideoNext'),voiceBtn=el('wlVideoSpeak');
   // Preserve the narration choice only on the current device. No automatic audio on mount.
   try{state.voice=localStorage.getItem('webLab:videoVoice')!=='off'}catch{}
   if(!supportsSpeech()){state.voice=false;voiceBtn.disabled=true;voiceBtn.title='Trình duyệt không hỗ trợ Web Speech';}
   function setCaption(message){el('wlVideoCaption').textContent=message;}
   function sayStatus(message){el('wlV10AudioState').textContent=message;}
   function renderLabels(){
     btn.textContent=state.playing?'❚❚ Tạm dừng':'▶ '+(state.pos===scenes.length-1?'Phát lại':'Phát bài học');
     btn.setAttribute('aria-pressed',String(state.playing));
     prev.disabled=state.pos===0;next.disabled=state.pos===scenes.length-1;
     voiceBtn.textContent=state.voice?'🔊 Giọng Việt: Bật':'🔇 Giọng Việt: Tắt';
     voiceBtn.setAttribute('aria-pressed',String(state.voice));
     el('wlVideoProgressText').textContent=(state.pos+1)+'/'+scenes.length;
   }
   function renderCode(snip){
     const code=String(snip||''),lines=code.split('\n');
     el('wlVideoCode').textContent=code;
     el('wlV10Gutter').textContent=Array.from({length:lines.length},(_,i)=>i+1).join('\n');
     const codebox=root.querySelector('.wl-v10-code');
     codebox.scrollTop=codebox.scrollHeight;
   }
   function render(){
     if(active!==state||!root.isConnected)return;
     const scene=scenes[state.pos];
     el('wlVideoBadge').textContent=scene.label;
     el('wlV10Step').textContent=scene.step;
     el('wlVideoTitle').textContent=scene.heading;
     el('wlVideoMeaning').textContent=scene.text;
     el('wlVideoFilename').textContent=filenames[scene.language]||filenames.html;
     el('wlV10Language').textContent=labels[scene.language]||labels.html;
     el('wlVideoCounter').textContent=(state.pos+1)+' / '+scenes.length;
     el('wlVideoSeek').value=String(state.pos);
     el('wlVideoSeek').style.setProperty('--wl-seek-fill',state.pos/(scenes.length-1)*100+'%');
     const subtitle=scene.kind==='typing'?'⌨️ '+scene.spoken:scene.spoken;
     el('wlV10Subtitles').textContent=subtitle;
     const placeholder=scene.kind==='finish'?'Hãy tự viết code trong trình soạn thảo bên dưới':scene.step;
     const comment=(scene.language==='html'?'<!-- '+placeholder+' -->':scene.language==='js'?'// '+placeholder:'/* '+placeholder+' */');
     renderCode(scene.code?scene.code.slice(0,state.shown):comment);
     renderLabels();
   }
   function clearPlayback(){
     clearTimeout(state.timer);clearInterval(state.tick);
     state.timer=null;state.tick=null;
     cancelAudio();state.utterance=null;
   }
   function pause(){
     state.playing=false;state.generation++;
     clearPlayback();renderLabels();
     if(active===state)setCaption('Đã tạm dừng tại phần '+(state.pos+1)+'. Nhấn Phát để nghe lại phần này.');
     sayStatus('❚❚ Tạm dừng');
   }
   function jump(n){
     pause();
     state.pos=Math.max(0,Math.min(scenes.length-1,n));
     state.shown=scenes[state.pos].code?.length||0;
     render();sayStatus('Chọn phần '+(state.pos+1));
   }
   function nextScene(){
     if(active!==state||!state.playing)return;
     clearPlayback();state.generation++;
     if(state.pos===scenes.length-1){
       state.playing=false;renderLabels();sayStatus('✓ Đã xem xong');
       setCaption('✅ Hoàn thành bài giảng. Kéo xuống trình soạn thảo để làm bài tập.');
       return;
     }
     state.pos++;beginScene();
   }
   function startSpeech(scene,gen){
     if(!state.voice||!supportsSpeech()){
       state.doneVoice=true;
       sayStatus('🔇 Xem phụ đề');
       return;
     }
     try{
       const synth=window.speechSynthesis;
       // Prefer an installed Vietnamese voice; Safari may lazy-load voices.
       const voices=synth.getVoices?.()||[];
       const chosen=voices.find(v=>/^vi[-_]/i.test(v.lang))||voices.find(v=>/^vi$/i.test(v.lang));
       const utterance=new window.SpeechSynthesisUtterance(phrase(scene.spoken));
       utterance.lang='vi-VN';utterance.rate=Math.max(.72,Math.min(1.35,state.speed*.93));
       utterance.pitch=1;utterance.volume=1;if(chosen)utterance.voice=chosen;
       utterance.onstart=()=>{if(active===state&&state.generation===gen)sayStatus('🔊 Đang thuyết minh tiếng Việt')};
       utterance.onend=()=>{
         if(active!==state||state.generation!==gen)return;
         state.doneVoice=true;state.utterance=null;
         sayStatus('✓ Đã đọc xong');
         if(state.doneCode)nextScene();
       };
       utterance.onerror=()=>{
         if(active!==state||state.generation!==gen)return;
         state.doneVoice=true;state.utterance=null;
         sayStatus('🔇 Giọng đọc chưa sẵn sàng');
         setCaption('Giọng đọc chưa phát được trên thiết bị này. Bạn vẫn có thể theo dõi phụ đề và phần code tự viết.');
         if(state.doneCode)nextScene();
       };
       state.utterance=utterance;
       synth.cancel(); // cancel any prior utterance before starting this scene
       synth.speak(utterance);
     }catch{
       state.doneVoice=true;
       sayStatus('🔇 Xem phụ đề');
     }
   }
   function beginScene(){
     if(active!==state)return;
     clearPlayback();
     const scene=scenes[state.pos],gen=++state.generation;
     state.started=performance.now();
     state.shown=REDUCED()?(scene.code||'').length:0;
     state.doneCode=false;state.doneVoice=false;
     state.playing=true;
     render();
     setCaption('▶ Đang phát phần '+(state.pos+1)+'/'+scenes.length+' · Theo dõi phụ đề và code trên màn hình.');
     startSpeech(scene,gen); // Called synchronously from Play click for Safari user-gesture rules.
     const code=scene.code||'';
     const typeMs=code&& !REDUCED()?Math.max(1600,Math.min(10500,code.length*75/state.speed)):1000;
     const silentMs=Math.max(5200,Math.min(19000,phrase(scene.spoken).length*67/state.speed));
     function tick(){
       if(active!==state||state.generation!==gen||!state.playing)return;
       if(!root.isConnected){stop();return}
       const elapsed=performance.now()-state.started;
       if(code){
         const chars=REDUCED()?code.length:Math.min(code.length,Math.floor(code.length*elapsed/typeMs));
         if(chars!==state.shown){state.shown=chars;renderCode(code.slice(0,chars))}
       }
       state.doneCode=elapsed>=Math.max(typeMs,state.voice&&supportsSpeech()?2200:silentMs);
       // iOS may never fire speechSynthesis.onend. Recover gracefully at a bounded timeout.
       const safetyMs=Math.max(typeMs+2000,Math.min(38000,silentMs+14000));
       if(state.doneCode&&(state.doneVoice||!state.voice||elapsed>=safetyMs))nextScene();
     }
     state.tick=setInterval(tick,90);
     state.timer=setTimeout(()=>{if(state.generation===gen&&state.playing){state.doneVoice=true;state.doneCode=true;nextScene()}},Math.max(typeMs+3500,44000));
   }
   btn.addEventListener('click',()=>{
     if(state.playing){pause();return}
     if(state.pos===scenes.length-1){state.pos=0}
     beginScene();
   },options);
   prev.addEventListener('click',()=>jump(state.pos-1),options);
   next.addEventListener('click',()=>jump(state.pos+1),options);
   el('wlVideoSeek').addEventListener('input',event=>jump(Number(event.target.value)),options);
   voiceBtn.addEventListener('click',()=>{
     state.voice=!state.voice;
     try{localStorage.setItem('webLab:videoVoice',state.voice?'on':'off')}catch{}
     if(state.playing){
       // Ensure turning sound on/off really changes the voice on the current scene.
       state.generation++;clearPlayback();beginScene();
     }else{renderLabels();sayStatus(state.voice?'🔊 Đã bật giọng Việt':'🔇 Đã tắt giọng đọc')}
   },options);
   el('wlV10Speed').addEventListener('change',event=>{
     state.speed=Number(event.target.value)||1;
     if(state.playing){state.generation++;clearPlayback();beginScene();}
   },options);
   document.addEventListener('visibilitychange',()=>{
     if(active===state&&document.visibilityState==='hidden'&&state.playing)pause();
   },options);
   el('wlV10Transcript').innerHTML=scenes.map((s,i)=>
     '<p><strong>'+(i+1)+'. '+esc(s.heading)+(s.kind==='typing'?' — gõ code':'')+'</strong><br>'+
       esc(s.spoken)+(s.code?'<pre><code>'+esc(s.code)+'</code></pre>':'')+'</p>').join('');
   state.shown=0;render();sayStatus(state.voice?'🔊 Sẵn sàng phát':'🔇 Sẵn sàng phát');
   if(!supportsSpeech())setCaption('Thiết bị không hỗ trợ giọng đọc tự động. Phụ đề và phần gõ code vẫn hoạt động.');
 }
 window.WebLabVideo={markup,mount,destroy:stop,scenesFor,
   get lessonCount(){return(window.HTML_LAB_DATA?.LESSONS||[]).filter(x=>x.kind==='roadmap').length}};
})();