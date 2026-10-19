/* Web Lab v3 — Vanilla JavaScript, chạy offline. */
(() => {
  'use strict';
  const { LESSONS, CATEGORIES } = window.HTML_LAB_DATA;
  const $ = id => document.getElementById(id);
  const itemMap = new Map(LESSONS.map(item => [item.id,item]));
  const FEATURED=['web:HTML + CSS + JS','tag:div','css:CSS là gì?','scss:SCSS là gì?','js:JavaScript là gì?','attr:aria-label','web:Website hoạt động thế nào?','css:Flexbox là gì?','js:addEventListener click','web:Mini project: Todo List','tag:button','css:Grid là gì?','js:DOM là gì?'];
  const LABELS={html:'HTML',css:'CSS',js:'JAVASCRIPT',scss:'SCSS',web:'WEB & CÔNG CỤ',roadmap:'LỘ TRÌNH'};
  const SEARCH_LABELS={html:'HTML',css:'CSS',scss:'SCSS',js:'JS',web:'WEB',roadmap:'KHÓA HỌC'};
  const DEFAULT_STUDIO={id:'studio',kind:'web',cat:'web-projects',name:'Sân chơi tự do',summary:'Tự viết một website từ đầu! Chỉnh sửa HTML, CSS, SCSS và JavaScript ngay trong trình duyệt.',syntax:'HTML + CSS + JavaScript = Website của bạn',html:'<main class="card">\n  <p class="eyebrow">✨ WEBSITE CỦA MÌNH</p>\n  <h1>Xin chào Web Lab!</h1>\n  <p>Bạn có thể sửa HTML, CSS và JavaScript.</p>\n  <button id="helloBtn">Bấm thử</button>\n  <p id="message"></p>\n</main>',css:'body { background: #f5f3ff; }\n.card { padding: 24px; border-radius: 16px; background: white; border: 1px solid #ddd6fe; box-shadow: 0 7px 22px #7c3aed18; }\n.eyebrow { letter-spacing: 2px; font-size: 11px; color: #7c3aed; }\nh1 { color: #6d28d9; }\nbutton { background: #7c3aed; color: white; border: 0; padding: 10px 16px; border-radius: 9px; cursor: pointer; }',js:'document.getElementById("helloBtn").addEventListener("click", () => {\n  document.getElementById("message").textContent = "Bạn đã viết JavaScript thành công! 🎉";\n  console.log("Hello from Web Lab!");\n});',tip:'Các tab mô phỏng ba tệp index.html, style.css và script.js; bạn có thể thử chỉnh cả ba rồi chạy lại.',challenge:'Tạo một card giới thiệu bản thân, đổi màu nền và thêm nút tương tác.',related:[]};
  itemMap.set('studio',DEFAULT_STUDIO);
  const trackOf=item=>item.kind==='tag'||item.kind==='attribute'?'html':item.kind;
  const originalSort=(a,b)=>{const x=FEATURED.indexOf(a.id),y=FEATURED.indexOf(b.id);if(x>=0||y>=0)return (x<0?999:x)-(y<0?999:y);return a.name.localeCompare(b.name,'vi')};
  const sorted=[...LESSONS].sort(originalSort);
  const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().replace(/[<>]/g,'').trim();
  const read=(key,fallback)=>{try{const data=localStorage.getItem('webLab:'+key);if(data!==null)return JSON.parse(data);if(['favorites','completed','drafts'].includes(key)){const old=localStorage.getItem('htmlLab:'+key);if(old!==null)return JSON.parse(old)}}catch{}return fallback;};
  const persist=(key,data)=>{try{localStorage.setItem('webLab:'+key,JSON.stringify(data))}catch{}};
  const state={selected:'web:HTML + CSS + JS',track:'all',category:'all',query:'',editorTab:'html',device:'desktop',favorites:new Set(read('favorites',[])),completed:new Set(read('completed',[])),drafts:read('drafts',{}),visibleLimit:70,runId:''};
  let toastTimeout;
  function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').classList.remove('show'),2350)}
  function friendly(item){return item.kind==='tag'?`<${item.name}>`:item.name}
  function typeLabel(item){return item.kind==='attribute'?'THUỘC TÍNH HTML':item.kind==='tag'?'THẺ HTML':LABELS[item.kind]||'BÀI HỌC'}
  function iconFor(item){return item.kind==='tag'?'&lt;/&gt;':item.kind==='attribute'?'@':item.kind==='css'?'CSS':item.kind==='scss'?'Sass':item.kind==='js'?'JS':'⌘'}
  function groupCount(cat){if(cat.id==='all')return LESSONS.length;if(cat.id==='favorites')return [...state.favorites].filter(id=>itemMap.has(id)&&id!=='studio').length;return LESSONS.filter(l=>l.cat===cat.id).length}
  function renderNav(){
    const sections=[
      {name:'TỔNG QUAN',cats:CATEGORIES.filter(c=>['all','favorites'].includes(c.id))},
      {name:'HTML',cats:CATEGORIES.filter(c=>!c.track&&!['all','favorites'].includes(c.id))},
      {name:'CSS',cats:CATEGORIES.filter(c=>c.track==='css')},
      {name:'SCSS / SASS',cats:CATEGORIES.filter(c=>c.track==='scss')},
      {name:'JAVASCRIPT',cats:CATEGORIES.filter(c=>c.track==='js')},
      {name:'WEB & CÔNG CỤ',cats:CATEGORIES.filter(c=>c.track==='web')}
    ];
    $('navList').innerHTML=sections.map(section=>`<div class="side-group">${section.name}</div>`+section.cats.map(cat=>`<button type="button" class="nav-item ${state.category===cat.id?'active':''}" data-cat="${esc(cat.id)}" aria-current="${state.category===cat.id?'true':'false'}"><span class="nav-ico">${esc(cat.icon)}</span><span class="nav-title">${esc(cat.label)}</span><span class="nav-total">${groupCount(cat)}</span></button>`).join('')).join('');
    $('navList').querySelectorAll('[data-cat]').forEach(button=>button.addEventListener('click',()=>{
      state.category=button.dataset.cat;
      const cat=CATEGORIES.find(c=>c.id===state.category);
      if(cat?.track)state.track=cat.track;
      else if(state.category==='attributes'||(!cat?.track&&!['all','favorites'].includes(state.category)))state.track='html';
      else state.track='all';
      state.visibleLimit=70;
      syncTracks();renderNav();renderCatalog();closeMenu();
    }));
  }
  function syncTracks(){document.querySelectorAll('[data-track]').forEach(b=>b.classList.toggle('active',b.dataset.track===state.track));}
  function filtered(){const words=normalize(state.query).split(/\s+/).filter(Boolean);
    const matches=sorted.filter(item=>{
      if(state.track!=='all'&&trackOf(item)!==state.track)return false;
      if(state.category==='favorites'&&!state.favorites.has(item.id))return false;
      if(state.category==='attributes'&&item.kind!=='attribute')return false;
      if(!['all','favorites','attributes'].includes(state.category)&&item.cat!==state.category)return false;
      if(!words.length)return true;
      const searchable=normalize([item.name,item.summary,item.syntax,item.cat,item.kind==='attribute'?'thuoc tinh aria html':trackOf(item),item.tip,item.challenge,item.demo,item.html,item.css,item.scss,item.js,...(item.related||[])].join(' '));
      return words.every(w=>searchable.includes(w));
    });
    if(words.length)matches.sort((a,b)=>{
      const rank=l=>{const name=normalize(l.name),query=normalize(state.query);return name===query?0:name.startsWith(query)?1:name.includes(query)?2:normalize(l.summary).includes(query)?3:normalize(l.syntax).includes(query)?4:5};return rank(a)-rank(b);
    });
    return matches;
  }
  function renderCatalog(){
    const items=filtered();$('resultCount').textContent=items.length;
    $('resultStatus').textContent=state.query.trim()?`Tìm toàn bộ thư viện: ${items.length} kết quả cho “${state.query.slice(0,45)}”`:`${items.length} bài học để khám phá`;
    const visible=items.slice(0,state.visibleLimit);
    $('catalogList').innerHTML=items.length?visible.map(item=>`<button type="button" class="catalog-entry ${item.id===state.selected?'selected':''}" data-lesson="${esc(item.id)}" aria-current="${item.id===state.selected?'true':'false'}"><span class="entry-icon ${trackOf(item)}">${iconFor(item)}</span><span class="entry-content"><strong>${esc(friendly(item))}${state.favorites.has(item.id)?' ♥':''}</strong><small>${esc(item.summary)}</small></span><span class="entry-search-kind ${trackOf(item)}">${SEARCH_LABELS[trackOf(item)]}</span><span class="entry-arrow">›</span></button>`).join('')+(visible.length<items.length?`<button class="more-btn" type="button" id="moreBtn">Hiển thị thêm (${items.length-visible.length} bài) ↓</button>`:''):`<div class="catalog-empty"><div class="big">🔍</div>Không tìm thấy bài học nào.<br>Hãy thử từ khóa khác hoặc chọn “Tất cả”.</div>`;
    $('catalogList').querySelectorAll('[data-lesson]').forEach(btn=>btn.addEventListener('click',()=>selectLesson(btn.dataset.lesson)));
    $('moreBtn')?.addEventListener('click',()=>{state.visibleLimit+=70;renderCatalog()});
  }
  function similar(item){
    const fromRelated=(item.related||[]).map(name=>itemMap.get('tag:'+name)||itemMap.get('attr:'+name)||[...itemMap.values()].find(l=>l.name===name&&l.id!==item.id)).filter(Boolean);
    const same=LESSONS.filter(l=>l.id!==item.id&&l.cat===item.cat);
    return [...new Map([...fromRelated,...same].map(l=>[l.id,l])).values()].slice(0,5);
  }
  function currentCode(item){const saved=state.drafts[item.id]||{};const oldFormat=typeof saved==='string'?{html:saved}:saved;return {html:oldFormat.html??item.html??item.demo??'',css:oldFormat.css??item.css??'',scss:oldFormat.scss??item.scss??'',js:oldFormat.js??item.js??''};}
  function lessonMarkup(item){const track=trackOf(item),done=state.completed.has(item.id),fav=state.favorites.has(item.id),related=similar(item),studio=item.id==='studio';
    return `<div class="detail-top"><div class="breadcrumbs"><span>THƯ VIỆN</span><span>›</span><span>${esc(track.toUpperCase())}</span><span>›</span><b>${esc(item.name)}</b></div><button id="favoriteBtn" class="icon-btn ${fav?'saved':''}" type="button" aria-label="${fav?'Bỏ yêu thích':'Thêm vào yêu thích'}" title="${fav?'Bỏ yêu thích':'Yêu thích'}">${fav?'♥':'♡'}</button></div>
      <div class="lesson-heading"><h2>${esc(friendly(item))}</h2><span class="kind-pill ${track}">${esc(studio?'PLAYGROUND':typeLabel(item))}</span></div>
      <p class="lesson-lead">${esc(item.summary)}</p>
      <div class="info-note"><span class="emoji">💡</span><div><strong>${studio?'Không gian sáng tạo':'Hiểu nhanh'}</strong><br>${esc(studio?'Đây là khu vực thử nghiệm tự do. Mã bạn sửa được lưu trên trình duyệt hiện tại; nút Đặt lại sẽ khôi phục code mẫu.':item.kind==='attribute'?'Thuộc tính được viết trong thẻ mở HTML để mô tả hoặc điều chỉnh hành vi của phần tử.':item.kind==='tag'?'Thẻ HTML mô tả nội dung và cấu trúc của trang. CSS định dạng và JavaScript thêm tương tác.':item.kind==='css'?'CSS dùng selector và các thuộc tính để quyết định cách phần tử HTML hiển thị.':item.kind==='scss'?'SCSS mở rộng CSS với biến, lồng selector và mixin. SCSS phải biên dịch thành CSS mới hiển thị được.':'Hãy kết hợp HTML, CSS và JavaScript để hiểu cách website hoạt động trong thực tế.')}</div></div>
      ${item.kind==='tag'||item.kind==='attribute'? `<section class="lesson-section"><div class="section-header"><h3>📘 Giải thích chi tiết</h3><span class="section-hint">Từ cơ bản đến thực tế</span></div><div class="info-note"><div><strong>${item.kind==='tag'?'Thẻ này dùng để làm gì?':'Thuộc tính này dùng để làm gì?'}</strong><p>${esc(item.summary)}</p><strong>Cách sử dụng:</strong><p>${esc(item.kind==='tag'?'Đặt thẻ vào vị trí phù hợp trong tài liệu HTML, viết nội dung hoặc các thẻ con bên trong (nếu thẻ cho phép).':'Viết thuộc tính trong thẻ mở của phần tử HTML. Giá trị của thuộc tính quyết định thông tin hoặc hành vi của phần tử.')}</p><strong>Ví dụ cú pháp:</strong><pre class="syntax-line">${esc(item.syntax)}</pre><strong>Lưu ý khi sử dụng:</strong><p>${esc(item.tip||'Sử dụng đúng mục đích và kiểm tra trên trình duyệt.')}</p></div></div></section>` :''}
      <section class="lesson-section"><div class="section-header"><h3>🎬 Video tham khảo</h3><span class="section-hint">Học bằng video</span></div><p class="lesson-lead">Mở YouTube để tìm các video hướng dẫn về chủ đề này. Video do người đăng tải bên ngoài cung cấp, không phải nội dung do Web Lab sản xuất hoặc kiểm duyệt.</p><a href="https://www.youtube.com/results?search_query=${encodeURIComponent((item.kind==='tag'?'thẻ HTML ':item.kind==='attribute'?'thuộc tính HTML ':'học lập trình web ')+item.name+' hướng dẫn tiếng Việt')}" target="_blank" rel="noopener noreferrer" class="complete-btn" style="display:inline-block;text-decoration:none;margin-top:8px">▶ Tìm video giải thích ${esc(friendly(item))} ↗</a></section>
      <section class="lesson-section"><div class="section-header"><h3>✧ Cú pháp / khái niệm</h3><span class="section-hint">Ghi nhớ nhanh</span></div><div class="syntax-line">${esc(item.syntax)}</div></section>
      <section class="lesson-section"><div class="section-header"><h3>⌘ Trình soạn thảo — hãy tự sửa code</h3><span class="section-hint">4 ngôn ngữ, cùng chạy thử</span></div><div class="editor-frame"><div class="editor-head"><div class="editor-tabs" role="tablist" aria-label="Chọn ngôn ngữ sửa code"><button type="button" class="editor-tab html" data-editor="html" role="tab" aria-selected="true"><span class="dot"></span> HTML</button><button type="button" class="editor-tab css" data-editor="css" role="tab" aria-selected="false"><span class="dot"></span> CSS</button><button type="button" class="editor-tab scss" data-editor="scss" role="tab" aria-selected="false"><span class="dot"></span> SCSS</button><button type="button" class="editor-tab js" data-editor="js" role="tab" aria-selected="false"><span class="dot"></span> JavaScript</button></div><div class="editor-actions"><button type="button" id="resetBtn" title="Khôi phục ví dụ">↺ Đặt lại</button><button type="button" id="copyBtn" title="Sao chép tab đang mở">⧉ Sao chép</button></div></div><div class="editor-pane"><textarea id="codeEditor" class="editor-textarea" spellcheck="false" aria-label="Trình sửa mã nguồn"></textarea></div><div class="editor-tip"><span>Tab: thụt lề · Ctrl + Enter: chạy thử</span><button type="button" class="run-btn" id="runBtn">▶ Chạy thử</button></div></div><details class="scss-readout" id="scssDetails"><summary>CSS được biên dịch từ SCSS <span>↗ Xem mã CSS</span></summary><div class="scss-status" id="scssStatus">Viết SCSS rồi nhấn Chạy thử để xem mã CSS tạo ra.</div><pre class="scss-output" id="scssOutput">Chưa có SCSS.</pre></details></section>
      <section class="lesson-section"><div class="section-header"><h3>◉ Kết quả chạy thử</h3><span class="section-hint">Live Preview</span></div><div class="preview-card"><div class="preview-toolbar"><span><i class="preview-status"></i> Trình duyệt mô phỏng</span><div class="device-actions"><button type="button" class="device-btn" data-device="desktop">▣ Màn hình rộng</button><button type="button" class="device-btn" data-device="mobile">▯ 375px</button></div></div><div class="preview-stage"><iframe class="preview-frame" id="previewFrame" sandbox="allow-scripts allow-forms" referrerpolicy="no-referrer" title="Khung chạy thử HTML, CSS, JavaScript"></iframe></div><div class="console-head"><span>⌁ Console <span id="consoleCount">(0)</span></span><button type="button" id="clearConsole">Xóa log</button></div><div class="console-output" id="consoleOutput" role="log" aria-label="Nhật ký JavaScript"><div class="console-empty">Nhật ký console.log() và lỗi JavaScript sẽ hiện ở đây.</div></div></div></section>
      <section class="lesson-section"><div class="tip-box">💡 <strong>Ghi nhớ:</strong> ${esc(item.tip||'Thử thay đổi ví dụ để học thêm.')}</div></section>
      
      ${related.length?`<section class="lesson-section"><div class="section-header"><h3>↗ Học tiếp</h3></div><div class="related-items">${related.map(l=>`<button type="button" class="related-btn" data-related="${esc(l.id)}">${esc(friendly(l))}</button>`).join('')}</div></section>`:''}
      <div class="lesson-end"><p>${done?'✓ Bạn đã hoàn thành bài này.':'Học xong rồi? Ghi lại tiến độ của bạn nhé.'}</p><button id="completeBtn" type="button" class="complete-btn ${done?'done':''}">${done?'✓ Đã hoàn thành':'✓ Đánh dấu đã học'}</button></div>`;
  }
  function renderLesson(){const item=itemMap.get(state.selected);if(!item)return;
    $('detailPanel').innerHTML=lessonMarkup(item);
    let code=currentCode(item);let active=state.editorTab;
    const textarea=$('codeEditor');
    const selectTab=tab=>{code[active]=textarea.value;active=tab;state.editorTab=tab;textarea.value=code[tab];textarea.setAttribute('aria-label','Trình sửa mã nguồn '+(tab==='js'?'JavaScript':tab.toUpperCase()));document.querySelectorAll('[data-editor]').forEach(btn=>{btn.classList.toggle('active',btn.dataset.editor===tab);btn.setAttribute('aria-selected',String(btn.dataset.editor===tab))});};
    textarea.value=code[active];selectTab(active);
    const persistDraft=()=>{code[active]=textarea.value;state.drafts[item.id]={...code};persist('drafts',state.drafts)};
    textarea.addEventListener('input',persistDraft);
    textarea.addEventListener('keydown',event=>{if(event.key==='Tab'){event.preventDefault();textarea.setRangeText('  ',textarea.selectionStart,textarea.selectionEnd,'end');persistDraft();}if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){event.preventDefault();runPreview();toast('Đã chạy code!')}});
    document.querySelectorAll('[data-editor]').forEach(btn=>btn.addEventListener('click',()=>selectTab(btn.dataset.editor)));
    async function runPreview(){
      code[active]=textarea.value;
      const compiled=$('scssOutput'),status=$('scssStatus'),details=$('scssDetails');
      let out=code.css||'';
      if(code.scss?.trim()){
        status.textContent='Đang biên dịch SCSS...';status.classList.remove('error');
        try{
          const result=await window.WebLabSCSS.compile(code.scss);
          out+='\n'+result.css;
          compiled.textContent=result.css||'/* Không có CSS được tạo ra */';
          status.textContent='✓ Đã biên dịch bằng '+result.engine+(result.engine.includes('offline')?' (chỉ hỗ trợ một phần cú pháp SCSS)':'');
        }catch(error){compiled.textContent='Lỗi SCSS: '+error.message;status.textContent='✕ Lỗi biên dịch SCSS — hãy sửa cú pháp và chạy lại.';status.classList.add('error');details.open=true;setTimeout(()=>appendConsole('error','SCSS: '+error.message),0);}
      }else{compiled.textContent='Chưa có SCSS. Hãy mở tab SCSS để thử.';status.textContent='Bạn có thể viết SCSS ở bất kỳ bài học nào.';status.classList.remove('error');}
      updatePreview({...code,css:out});
    }
    $('runBtn').addEventListener('click',()=>{runPreview();toast('Đã yêu cầu chạy thử!')});
    $('resetBtn').addEventListener('click',()=>{delete state.drafts[item.id];persist('drafts',state.drafts);code={html:item.html??item.demo??'',css:item.css??'',scss:item.scss??'',js:item.js??''};textarea.value=code[active];runPreview();toast('Đã khôi phục code mẫu.')});
    $('copyBtn').addEventListener('click',async()=>{const value=textarea.value;try{await navigator.clipboard.writeText(value);toast('Đã sao chép code!')}catch{textarea.focus();textarea.select();try{document.execCommand('copy');toast('Đã sao chép code!')}catch{toast('Hãy dùng Ctrl + C để sao chép.')};}});
    $('favoriteBtn').addEventListener('click',()=>{if(state.favorites.has(item.id))state.favorites.delete(item.id);else state.favorites.add(item.id);persist('favorites',[...state.favorites]);renderNav();renderCatalog();renderLesson();toast(state.favorites.has(item.id)?'Đã lưu yêu thích!':'Đã bỏ yêu thích.')});
    $('completeBtn').addEventListener('click',()=>{if(state.completed.has(item.id))state.completed.delete(item.id);else state.completed.add(item.id);persist('completed',[...state.completed]);updateProgress();renderLesson();toast(state.completed.has(item.id)?'Chúc mừng! Đã hoàn thành bài.':'Đã bỏ đánh dấu hoàn thành.')});
    document.querySelectorAll('[data-related]').forEach(btn=>btn.addEventListener('click',()=>selectLesson(btn.dataset.related)));
    document.querySelectorAll('[data-device]').forEach(btn=>btn.addEventListener('click',()=>{state.device=btn.dataset.device;syncDevice()}));
    $('clearConsole').addEventListener('click',()=>{clearConsole();toast('Đã xóa nhật ký Console.')});
    function syncDevice(){const frame=$('previewFrame');frame.classList.toggle('mobile',state.device==='mobile');document.querySelectorAll('[data-device]').forEach(b=>b.classList.toggle('active',b.dataset.device===state.device))}
    syncDevice();runPreview();
  }
  let logCount=0;
  function clearConsole(){logCount=0;const target=$('consoleOutput');if(!target)return;target.innerHTML='<div class="console-empty">Chưa có log. Thử dùng console.log() trong JavaScript.</div>';$('consoleCount').textContent='(0)'}
  function appendConsole(level,message){const output=$('consoleOutput');if(!output)return;if(!logCount)output.textContent='';logCount++;const el=document.createElement('div');el.className='console-line '+(level==='error'?'error':level==='warn'?'warn':'log');el.textContent=(level==='error'?'✕ ':level==='warn'?'⚠ ':'› ')+String(message).slice(0,4500);output.appendChild(el);$('consoleCount').textContent='('+logCount+')';output.scrollTop=output.scrollHeight}
  function updatePreview(code){const frame=$('previewFrame');if(!frame)return;clearConsole();
    state.runId='r'+Date.now().toString(36)+Math.random().toString(36).slice(2,9);
    const id=state.runId;
    const safeScript=s=>String(s).replace(/<\/script/gi,'<\\/script');
    const safeStyle=s=>String(s).replace(/<\/style/gi,'<\\/style');
    const bridge=`<script>(function(){var marker=${JSON.stringify(id)};function format(v){try{if(typeof v==='undefined')return 'undefined';if(v===null)return 'null';if(typeof v==='string')return v;if(v instanceof Error)return v.message;return JSON.stringify(v)}catch(e){return String(v)}}function send(level,args){try{parent.postMessage({webLabRunner:marker,level:level,message:Array.from(args).map(format).join(' ')},'*')}catch(e){}}['log','info','warn','error'].forEach(function(level){var prev=console[level];console[level]=function(){send(level,arguments);try{prev.apply(console,arguments)}catch(e){}}});window.addEventListener('error',function(e){send('error',[e.message||'Lỗi JavaScript'])});window.addEventListener('unhandledrejection',function(e){send('error',[e.reason||'Promise bị từ chối'])});})();<\/script>`;
    const style=`<style>html{color-scheme:light}body{margin:0;padding:20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#282c45;overflow-wrap:anywhere}button,input,textarea,select{font:inherit}button{cursor:pointer}img,video,canvas{max-width:100%}a{color:#7050cb}table{max-width:100%}</style><style>${safeStyle(code.css)}</style>`;
    const jsCode=code.js?`<script>${safeScript(code.js)}<\/script>`:'';
    const head=`<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: https:; connect-src https:; font-src data:; media-src data: https:; frame-src https:; form-action 'none'"><base target="_self">${bridge}${style}`;
    let html=String(code.html||'');let doc='';
    if(/<\s*(?:!doctype|html|head|body)\b/i.test(html)){
      if(/<head(?:\s|>)/i.test(html))doc=html.replace(/<head([^>]*)>/i,`<head$1>${head}`);
      else if(/<body(?:\s|>)/i.test(html))doc=html.replace(/<body([^>]*)>/i,`<head>${head}</head><body$1>`);
      else doc=`<head>${head}</head>`+html;
      if(/<\/body\s*>/i.test(doc))doc=doc.replace(/<\/body\s*>/i,jsCode+'</body>');else doc+=jsCode;
    }else doc=`<!doctype html><html lang="vi"><head>${head}</head><body>${html}${jsCode}</body></html>`;
    frame.srcdoc=doc;
  }
  window.addEventListener('message',event=>{const data=event.data;if(!data||typeof data!=='object'||data.webLabRunner!==state.runId)return;if(event.source!==$('previewFrame')?.contentWindow)return;appendConsole(data.level,data.message)});
  function selectLesson(id){if(!itemMap.has(id))return;if(window.WebLabCourse?.isCourse(id)&&!window.WebLabCourse.unlockedId(id)){toast('🔒 Hoàn thành bài trước để mở khóa!');return;}state.selected=id;state.editorTab=itemMap.get(id)?.kind==='css'?'css':itemMap.get(id)?.kind==='scss'?'scss':itemMap.get(id)?.kind==='js'?'js':'html';renderCatalog();renderLesson();if(window.matchMedia('(max-width:1050px)').matches)$('detailPanel').scrollIntoView({block:'start',behavior:'smooth'})}
  function updateProgress(){const count=[...state.completed].filter(id=>itemMap.has(id)&&id!=='studio').length;const percent=Math.round(count/LESSONS.length*100);$('progressPct').textContent=percent+'%';$('progressBar').style.width=percent+'%';$('progressText').textContent=`Đã học ${count}/${LESSONS.length} bài • tiếp tục nhé!`}
  function switchTrack(track){state.track=track;state.category='all';state.visibleLimit=70;syncTracks();renderNav();renderCatalog();closeMenu();}
  function closeMenu(){$('sidebar').classList.remove('open');$('scrim').hidden=true;$('menuBtn').setAttribute('aria-expanded','false')}
  $('menuBtn').addEventListener('click',()=>{const open=$('sidebar').classList.toggle('open');$('scrim').hidden=!open;$('menuBtn').setAttribute('aria-expanded',String(open))});
  $('scrim').addEventListener('click',closeMenu);
  $('brandLink').addEventListener('click',e=>{e.preventDefault();switchTrack('all');selectLesson('web:HTML + CSS + JS');window.scrollTo({top:0,behavior:'smooth'})});
  $('studioBtn').addEventListener('click',()=>{switchTrack('all');selectLesson('studio');toast('Sân chơi code của bạn đã sẵn sàng!')});
  $('appHelpBtn').addEventListener('click',()=>$('installDialog').showModal());
  $('closeInstall').addEventListener('click',()=>$('installDialog').close());
  $('roadmapBtn').addEventListener('click',()=>$('roadmapDialog').showModal());
  $('closeRoadmap').addEventListener('click',()=>$('roadmapDialog').close());
  $('roadmapDialog').querySelectorAll('[data-goto]').forEach(button=>button.addEventListener('click',()=>{const track=button.dataset.goto;switchTrack(track);$('roadmapDialog').close();const first=track==='html'?'tag:html':track==='css'?'css:CSS là gì?':track==='js'?'js:JavaScript là gì?':track==='scss'?'scss:SCSS là gì?':'web:Website hoạt động thế nào?';selectLesson(first);$('searchInput').scrollIntoView({behavior:'smooth',block:'center'})}));
  document.querySelectorAll('[data-track]').forEach(button=>button.addEventListener('click',()=>switchTrack(button.dataset.track)));
  $('searchInput').addEventListener('input',event=>{
    state.query=event.target.value;
    state.visibleLimit=70;
    // Mỗi lần nhập từ khóa đều tìm toàn bộ bài học, bất kể danh mục được chọn trước đó.
    if(normalize(state.query)){state.track='all';state.category='all';syncTracks();renderNav();}
    renderCatalog();
  });
  $('searchInput').addEventListener('keydown',event=>{
    if(event.key==='Enter'&&normalize(state.query)){
      const first=filtered()[0];
      if(first){event.preventDefault();selectLesson(first.id);$('searchInput').blur();}
    }
  });
  document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();$('searchInput').focus();$('searchInput').select()}if(event.key==='Escape')closeMenu()});
  $('htmlCount').textContent=LESSONS.filter(l=>trackOf(l)==='html').length;
  $('cssCount').textContent=LESSONS.filter(l=>l.kind==='css').length;
  $('jsCount').textContent=LESSONS.filter(l=>l.kind==='js').length;
  $('webCount').textContent=LESSONS.filter(l=>l.kind==='web').length;
  syncTracks();renderNav();renderCatalog();updateProgress();renderLesson();
  window.WEB_LAB_NAVIGATE=selectLesson;
  window.__WEB_LAB_TEST__={get count(){return LESSONS.length},get track(){return state.track},get selected(){return state.selected}};
})();
