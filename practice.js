/* Web Lab 4.0: luyện tập cho mọi bài học và dự án liên môn. */
(() => {
  'use strict';
  const lessons = new Map(window.HTML_LAB_DATA.LESSONS.map(item => [item.id, item]));
  const storageKey = 'webLab:practiceV4';
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { progress = {}; }
  const $ = id => document.getElementById(id);
  const escape = v => String(v == null ? '' : v).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  const tidy = s => String(s || '').trim();
  const removeComments = (s, tab) => tab === 'html' ? s.replace(/<!--[^]*?-->/g, '') : s.replace(/\/\*[^]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch {} };
  function currentItem() { return lessons.get(window.__WEB_LAB_TEST__?.selected); }
  function currentCode(item) {
    let drafts = {};
    try { drafts = JSON.parse(localStorage.getItem('webLab:drafts') || '{}') || {}; } catch {}
    const original = drafts[item.id] || {};
    const data = typeof original === 'string' ? {html:original} : original;
    const code = {html:data.html ?? item.html ?? item.demo ?? '', css:data.css ?? item.css ?? '', scss:data.scss ?? item.scss ?? '', js:data.js ?? item.js ?? ''};
    const selected = document.querySelector('.editor-tab.active')?.dataset.editor;
    if (selected && $('codeEditor')) code[selected] = $('codeEditor').value;
    return code;
  }
  function baseline(item) { return {html:item.html ?? item.demo ?? '', css:item.css ?? '', scss:item.scss ?? '', js:item.js ?? ''}; }
  function changes(item, code) { const base=baseline(item); return Object.fromEntries(Object.keys(base).map(key => [key, tidy(code[key]) !== tidy(base[key])])); }
  function focusEditor(tab) {
    document.querySelector(`[data-editor="${tab}"]`)?.click();
    $('codeEditor')?.focus({preventScroll:true});
    $('codeEditor')?.scrollIntoView({block:'center',behavior:'smooth'});
  }
  function label(item) { return item.kind === 'tag' ? `<${item.name}>` : item.name; }
  function isTargetPresent(item, code) {
    if (item.kind === 'tag') {
      const name = item.name.replace(/[^\w:-]/g, '');
      return new RegExp('<\\s*'+name+'(?=[\\s/>])', 'i').test(removeComments(code.html,'html'));
    }
    if (item.kind === 'attribute') {
      const name = item.name.replace(/\*/g, '');
      return removeComments(code.html,'html').toLowerCase().includes(name.toLowerCase());
    }
    return true;
  }
  function goalList(item) {
    if (item.practice) return item.practice.goals.map((g,idx)=>({id:'goal-'+idx,text:g[2]}));
    return [
      {id:'explore',text:'Sửa ví dụ bằng chính tay bạn và chạy thử kết quả.'},
      {id:'apply',text:item.challenge || `Tự thực hành ${label(item)} trong tab mã nguồn.`},
      {id:'combine',text:item.kind==='js'?'Kết hợp HTML với JavaScript, thêm một tương tác khác.':item.kind==='web'?'Kết hợp thay đổi HTML, CSS và JavaScript trong cùng ví dụ.':item.kind==='scss'?'Kết hợp HTML với SCSS để thiết kế một thành phần.':'Kết hợp thay đổi cả HTML và CSS để tạo giao diện riêng.'}
    ];
  }
  function validate(item, code) {
    const edited=changes(item,code);
    const hasCode=Object.values(code).some(s => tidy(s));
    if (item.practice) {
      return item.practice.goals.map((g,idx) => {
        const content=removeComments(String(code[g[0]] || ''),g[0]).replace(/\s+/g,'').toLowerCase();
        const needle=g[1].replace(/\s+/g,'').toLowerCase();
        return {id:'goal-'+idx,pass:content.includes(needle),info:`Cần có ${g[1]} trong tab ${g[0].toUpperCase()}.`};
      });
    }
    const target=isTargetPresent(item,code);
    const track=item.kind==='tag'||item.kind==='attribute'?'html':item.kind;
    const main=track==='web'?'html':track;
    const primaryEdited=Boolean(edited[main]);
    const apply=primaryEdited && target && tidy(removeComments(code[main]||'',main)).length>0;
    const combo=track==='html'||track==='css'||track==='scss'
      ? edited.html && (edited.css || edited.scss) && tidy(code.html) && (tidy(code.css)||tidy(code.scss))
      : track==='js' ? edited.html && edited.js && tidy(code.html) && tidy(code.js)
      : edited.html && edited.css && edited.js && tidy(code.html) && tidy(code.css) && tidy(code.js);
    return [
      {id:'explore',pass:hasCode && Object.values(edited).some(Boolean),info:'Hãy thay đổi ít nhất một đoạn code, rồi chạy thử.'},
      {id:'apply',pass:apply,info:!target?`Hãy dùng ${label(item)} trong tab HTML.`:`Hãy chỉnh tab ${main.toUpperCase()} theo yêu cầu của bài tập.`},
      {id:'combine',pass:Boolean(combo),info:track==='js'?'Hãy thay đổi cả HTML và JavaScript.':track==='web'?'Hãy thay đổi HTML, CSS và JavaScript.':'Hãy chỉnh cả HTML và CSS (hoặc SCSS), không chỉ xem code mẫu.'}
    ];
  }
  function render() {
    const item=currentItem(); if (!item || item.kind!=='roadmap' || $('practicePanel')) return;
    const project=Boolean(item.practice),goals=goalList(item),done=progress[item.id]||[];
    const panel=document.createElement('section');
    panel.id='practicePanel';panel.className='lesson-section practice-panel';
    panel.innerHTML=`<div class="practice-heading"><div><span class="practice-kicker">🎯 ${project?'DỰ ÁN TỔNG HỢP · '+escape(item.practice.level):'LUYỆN TẬP THEO BÀI HỌC'}</span><h3>${project?'Hoàn thành dự án':'3 bước luyện tập: '+escape(label(item))}</h3><p>Viết trực tiếp tại trình soạn thảo phía trên, nhấn <b>▶ Chạy thử</b>, sau đó kiểm tra yêu cầu.</p></div><strong id="practiceBadge">${done.length}/${goals.length}</strong></div>
      <ol class="practice-goals">${goals.map((g,i)=>`<li class="practice-goal ${done.includes(g.id)?'passed':''}" data-practice-goal="${escape(g.id)}"><span class="practice-marker">${done.includes(g.id)?'✓':i+1}</span><span>${escape(g.text)}</span></li>`).join('')}</ol>
      <div class="practice-actions"><button type="button" class="practice-check" id="practiceCheck">✓ Kiểm tra bài làm</button><button type="button" class="practice-help" id="practiceHint" aria-expanded="false">💡 Gợi ý</button><button type="button" class="practice-help" id="practiceNew">✍️ Tập từ code trống</button></div>
      <div id="practiceHintText" class="practice-hint" hidden><strong>Cách bắt đầu:</strong> ${escape(item.tip||'Xem cú pháp và thử điều chỉnh ví dụ.') }<p>Gợi ý: ${escape(item.syntax||'Đọc lại bài học rồi tự viết code.')}</p></div>
      <div id="practiceFeedback" class="practice-feedback" role="status" aria-live="polite">${done.length===goals.length?'🏅 Bạn đã vượt qua tất cả yêu cầu. Hãy chọn bài tiếp theo.':'Tiến độ được lưu ngay trên điện thoại hoặc máy tính này.'}</div>
      <div class="practice-next-wrap"><button type="button" id="practiceNext" class="practice-check" ${done.length===goals.length?"":"disabled"}>Bài tiếp theo →</button></div>
      <p class="practice-disclaimer">Bộ kiểm tra kiểm tra mã nguồn ở mức cơ bản, không thể xác nhận hoàn toàn tính đúng đắn của giao diện hay thuật toán. Hãy quan sát khung Chạy thử và tự kiểm tra hành vi thực tế.</p>`;
    const end=document.querySelector('#detailPanel .lesson-end');
    if(end)end.after(panel);else $('detailPanel').append(panel);
    $('practiceCheck').addEventListener('click',()=>check(item));
    $('practiceHint').addEventListener('click',()=>{const hidden=$('practiceHintText').hidden;$('practiceHintText').hidden=!hidden;$('practiceHint').setAttribute('aria-expanded',String(hidden));});
    $('practiceNew').addEventListener('click',()=>start(item));
    $('practiceNext').addEventListener('click',()=>{
      const all=window.WebLabCourse?.lessons||[];
      const idx=all.findIndex(lesson=>lesson.id===item.id);
      if(idx>=0&&idx+1<all.length&&window.WebLabCourse.unlockedId(all[idx+1].id)){
        window.WEB_LAB_NAVIGATE?.(all[idx+1].id);
      }else if(idx===all.length-1){$('practiceFeedback').textContent='🎉 Bạn đã hoàn thành lộ trình!';}
    });
  }
  function check(item) {
    const code=currentCode(item),results=validate(item,code);
    const old=new Set(progress[item.id]||[]);
    for (const result of results) if (result.pass) old.add(result.id);
    progress[item.id]=[...old];save();
    for (let i=0;i<results.length;i++) {
      const r=results[i],passed=old.has(r.id),li=document.querySelector(`[data-practice-goal="${r.id}"]`);
      if(!li)continue;li.classList.toggle('passed',passed);
      li.querySelector('.practice-marker').textContent=passed?'✓':String(i+1);
    }
    const total=results.length,done=results.filter(r=>old.has(r.id)).length;
    $('practiceBadge').textContent=`${done}/${total}`;
    if($('practiceNext'))$('practiceNext').disabled=done!==total;
    const missing=results.filter(r=>!r.pass && !old.has(r.id));
    $('practiceFeedback').textContent=done===total?'🏅 Hoàn thành! Bạn đã vượt qua các tiêu chí cơ bản. Thử tự kiểm tra kết quả chạy thực tế nhé.':`Đạt ${done}/${total} yêu cầu. ${missing[0]?.info || 'Tiếp tục hoàn thiện code theo nhiệm vụ.'}`;
    $('practiceFeedback').classList.toggle('is-success',done===total);
    $('runBtn')?.click();if(done===total)window.dispatchEvent(new CustomEvent('weblab:practice-passed',{detail:{id:item.id}}));
  }
  function start(item) {
    if (!confirm('Bắt đầu code trống sẽ thay phần mã ở tab đang luyện. Bạn có thể bấm “Đặt lại” để lấy lại ví dụ gốc. Tiếp tục?'))return;
    const track=item.kind==='tag'||item.kind==='attribute'?'html':item.kind;
    const tab=track==='web'?'html':track;
    const starters={
      html:'<!doctype html>\n<html lang="vi">\n<head><meta charset="UTF-8"><title>Bài thực hành</title></head>\n<body>\n  <!-- Hãy dùng thẻ hoặc thuộc tính vừa học ở đây -->\n</body>\n</html>',
      css:'/* Hãy tự viết các quy tắc CSS tại đây */\n',
      scss:'/* Hãy tự viết SCSS tại đây */\n',
      js:'// Hãy tự viết JavaScript tại đây\n'
    };
    focusEditor(tab);
    const editor=$('codeEditor');editor.value=starters[tab];editor.dispatchEvent(new Event('input',{bubbles:true}));
    $('practiceFeedback').textContent='Đã tạo code trống. Viết bài làm, chọn Chạy thử rồi Kiểm tra bài làm.';
  }
  function createLauncher() {
    const hero=document.querySelector('.hero-chips');if(!hero||$('practiceLauncher'))return;
    const btn=document.createElement('button');btn.type='button';btn.id='practiceLauncher';btn.className='practice-launcher';btn.textContent='🗺️ Học theo lộ trình';
    btn.addEventListener('click',()=>{
      document.getElementById('roadmapDialog')?.showModal();window.WebLabCourse?.render();
      document.querySelector('#detailPanel .practice-panel')?.scrollIntoView({behavior:'smooth',block:'center'});
    });
    hero.append(btn);
  }
  createLauncher();render();
  new MutationObserver(()=>{if(!$('practicePanel'))render();}).observe($('detailPanel'),{childList:true});
  window.WebLabPracticeTest={get count(){return lessons.size},validate,goalList};
})();
