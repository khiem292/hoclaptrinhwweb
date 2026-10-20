/* Web Lab 7.0 — VS Code-inspired editor. Fully local, no CDN. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const TAGS='a abbr article aside audio b blockquote body button canvas caption code details div dl dt em fieldset figure figcaption footer form h1 h2 h3 h4 h5 h6 head header html i iframe img input label li link main meta nav ol option p picture pre script section select small source span strong style summary table tbody td textarea th thead title tr ul video'.split(' ');
  const ATTRS='alt aria-label class controls disabled for href id loading name placeholder required role src style target title type value width height data-id'.split(' ');
  const VOID=new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
  const CSS='align-items animation background background-color border border-color border-radius border-width bottom box-shadow color cursor display flex flex-direction flex-wrap font-family font-size font-weight gap grid-template-columns grid-template-rows height justify-content left letter-spacing line-height margin margin-bottom margin-left margin-right margin-top max-width min-height min-width opacity overflow padding padding-bottom padding-left padding-right padding-top position right text-align text-decoration top transform transition width z-index'.split(' ');
  const JS='addEventListener appendChild async await break case catch class classList clearTimeout console console.log const continue createElement document else fetch filter finally for forEach function getElementById if import innerHTML let localStorage map new parseInt preventDefault Promise querySelector querySelectorAll reduce return setItem setTimeout textContent throw try value while window'.split(' ');
  const jsKeywords=new Set('async await break case catch class const continue debugger default delete do else export extends false finally for from function if import in instanceof let new null of return static super switch this throw true try typeof undefined var void while yield'.split(' '));
  const modes={html:'HTML',css:'CSS',scss:'SCSS',js:'JavaScript'};
  let active=null;
  const getMode=()=>document.querySelector('.editor-tab.active')?.dataset.editor||'html';
  const pairStore={auto: true,theme:'dark'};
  try { pairStore.auto=JSON.parse(localStorage.getItem('webLab:editorAutoFormat')??'true');pairStore.theme=localStorage.getItem('webLab:editorTheme')||'dark'; } catch {}
  const kw=(str,words)=>words.has(str);
  function paintHTML(code){
    const re=/<!--[\s\S]*?-->|<![^>]*>|<\/?[A-Za-z][^>]*>|&(?:#\d+|[A-Za-z]+);/g;let result='',pos=0,match;
    while((match=re.exec(code))){
      result+=esc(code.slice(pos,match.index));const token=match[0];pos=re.lastIndex;
      if(token.startsWith('<!--')||token.startsWith('<!')){result+='<span class="vs-comment">'+esc(token)+'</span>';continue;}
      if(!token.startsWith('<')){result+='<span class="vs-entity">'+esc(token)+'</span>';continue;}
      const parts=token.match(/^(<\/?)([A-Za-z][\w:-]*)([\s\S]*?)(\/?>)$/);
      if(!parts){result+=esc(token);continue;}
      result+='<span class="vs-punc">'+esc(parts[1])+'</span><span class="vs-tag">'+esc(parts[2])+'</span>';
      let attrs=parts[3],cursor=0,p;
      const attRe=/([^\s=\/>]+)(\s*=\s*)("(?:[^"]*)"|'(?:[^']*)'|[^\s>]+)/g;
      while((p=attRe.exec(attrs))){result+=esc(attrs.slice(cursor,p.index))+'<span class="vs-attribute">'+esc(p[1])+'</span>'+esc(p[2])+'<span class="vs-string">'+esc(p[3])+'</span>';cursor=attRe.lastIndex;}
      result+=esc(attrs.slice(cursor))+'<span class="vs-punc">'+esc(parts[4])+'</span>';
    }
    return result+esc(code.slice(pos));
  }
  function paintCode(code,lang){
    const re=/\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\x60(?:\\.|[^\x60\\])*\x60|#[a-fA-F0-9]{3,8}\b|@[a-zA-Z-]+|\$[a-zA-Z_][\w-]*|\b\d+(?:\.\d+)?(?:px|em|rem|vh|vw|fr|s|ms|%)?\b|\b[A-Za-z_$][\w$-]*\b/g;
    let out='',pos=0,m;
    while((m=re.exec(code))){out+=esc(code.slice(pos,m.index));const token=m[0];pos=re.lastIndex;let cls='';
      if(token.startsWith('/*')||token.startsWith('//'))cls='vs-comment';
      else if(/^["'\x60]/.test(token))cls='vs-string';
      else if(token[0]==='#'||/^\d/.test(token))cls='vs-number';
      else if(token[0]==='$'||token[0]==='@')cls='vs-keyword';
      else if(lang==='js'){if(kw(token,jsKeywords))cls='vs-keyword';else if(/^\s*\(/.test(code.slice(re.lastIndex)))cls='vs-function';else if(['document','console','localStorage','window','Promise'].includes(token))cls='vs-object';}
      else if(CSS.includes(token)||code.slice(re.lastIndex).match(/^\s*:/))cls='vs-property';
      out+=cls?'<span class="'+cls+'">'+esc(token)+'</span>':esc(token);
    }
    return out+esc(code.slice(pos));
  }
  function renderHighlighted(editor){
    const area=editor.area,code=area.value;
    editor.highlight.innerHTML=(code.length>80000?esc(code):(getMode()==='html'?paintHTML(code):paintCode(code,getMode())))+'\n';
    const count=Math.min(2500,code.split('\n').length);
    editor.gutter.textContent=Array.from({length:count},(_,i)=>String(i+1)).join('\n')+'\n';
    const here=area.selectionStart,left=code.slice(0,here);
    const line=left.split('\n').length,col=left.length-left.lastIndexOf('\n');
    editor.position.textContent='Ln '+line+', Col '+col;
    editor.modeLabel.textContent=modes[getMode()]||'HTML';
    editor.size.textContent=code.length.toLocaleString('vi-VN')+' ký tự';
    let warning='';
    if(getMode()==='html'){
      const stack=[];const re=/<(\/?)([a-zA-Z][\w:-]*)\b[^>]*>/g;let m;
      while((m=re.exec(code))){const tag=m[2].toLowerCase();
        if(VOID.has(tag)||/\/>$/.test(m[0]))continue;
        if(!m[1])stack.push(tag);
        else if(stack.at(-1)===tag)stack.pop();
      }
      if(stack.length)warning='⚠ Kiểm tra thẻ </'+stack.at(-1)+'>';
    }else if(getMode()==='css'||getMode()==='scss'){
      const body=code.replace(/\/\*[\s\S]*?\*\//g,'').replace(/"[^"]*"|'[^']*'/g,'');
      const open=(body.match(/{/g)||[]).length,close=(body.match(/}/g)||[]).length;
      if(open!==close)warning='⚠ Kiểm tra dấu { }';
    }
    editor.diagnostics.textContent=warning||'✓ Sẵn sàng';
    editor.diagnostics.classList.toggle('vs-warn',Boolean(warning));
    editor.highlight.scrollTop=area.scrollTop;editor.highlight.scrollLeft=area.scrollLeft;
    editor.gutter.scrollTop=area.scrollTop;
  }
  function applyChange(editor,from,to,text,cursor){
    const area=editor.area;
    area.setRangeText(text,from,to,'end');
    const p=cursor??from+text.length;area.setSelectionRange(p,p);
    area.dispatchEvent(new Event('input',{bubbles:true}));
  }
  function getSuggest(editor){
    const caret=editor.area.selectionStart, before=editor.area.value.slice(0,caret),mode=getMode();
    let prefix='',all=[];
    if(mode==='html'){
      const tag=before.match(/<([a-z][\w-]*)$/i);
      if(tag){prefix=tag[1];all=TAGS;}
      else if(/<[^>]*$/.test(before)){const a=before.match(/\s([\w-]*)$/);if(a&&a[1].length){prefix=a[1];all=ATTRS;}}
    }else{
      const m=before.match(/([a-zA-Z_$][\w$-]*)$/);
      if(m){prefix=m[1];all=mode==='js'?JS:CSS.concat(mode==='scss'?['@mixin','@include','@use','@media']:['@media','@keyframes']);}
    }
    if(!prefix)return null;
    const items=all.filter(s=>s.toLowerCase().startsWith(prefix.toLowerCase())&&s!==prefix).slice(0,8);
    return items.length?{prefix,items}:null;
  }
  function hideSuggestions(editor){editor.suggest.hidden=true;editor.suggestion=null;editor.area.setAttribute('aria-expanded','false')}
  function acceptSuggestion(editor,index=0){const s=editor.suggestion;if(!s)return false;const value=s.items[index];if(!value)return false;const pos=editor.area.selectionStart;applyChange(editor,pos-s.prefix.length,pos,value);hideSuggestions(editor);editor.area.focus();return true}
  function showSuggestions(editor){
    const s=getSuggest(editor);
    if(!s){hideSuggestions(editor);return}
    editor.suggestion=s;
    editor.suggest.hidden=false;
    editor.area.setAttribute('aria-expanded','true');
    editor.suggest.replaceChildren();
    s.items.forEach((word,index)=>{const btn=document.createElement('button');btn.type='button';btn.textContent=word;btn.setAttribute('role','option');btn.className=index===0?'active':'';
      btn.addEventListener('pointerdown',ev=>{ev.preventDefault();acceptSuggestion(editor,index)});
      btn.addEventListener('click',()=>acceptSuggestion(editor,index));
      editor.suggest.append(btn);
    });
  }
  function formatHTML(src){
    const lines=src.replace(/>\s+</g,'>\n<').split('\n');
    let depth=0,formatted=[];
    for(const rawLine of lines){const line=rawLine.trim();if(!line){formatted.push('');continue}
      const close=/^<\//.test(line);if(close)depth=Math.max(0,depth-1);
      formatted.push('  '.repeat(Math.min(25,depth))+line);
      const open=line.match(/^<([A-Za-z][\w:-]*)\b/);
      if(open&&!VOID.has(open[1].toLowerCase())&&!/\/>$/.test(line)&&!new RegExp('</'+open[1]+'\\s*>','i').test(line))depth++;
    }
    return formatted.join('\n').replace(/\n{3,}/g,'\n\n');
  }
  function formatBraces(src){
    const lines=src.split(/\r?\n/),out=[];let depth=0;
    for(const raw of lines){const line=raw.trim();if(!line){out.push('');continue}
      const close=/^[}\])]/.test(line);if(close)depth=Math.max(0,depth-1);
      out.push('  '.repeat(Math.min(depth,25))+line);
      const noStrings=line.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\x60(?:\\.|[^\x60\\])*\x60/g,'""').replace(/\/\/.*$/,'');
      const op=(noStrings.match(/{/g)||[]).length,cl=(noStrings.match(/}/g)||[]).length;
      depth=Math.max(0,Math.min(25,depth+op-cl+(close?1:0)));
    }
    return out.join('\n');
  }
  function format(editor){
    const text=editor.area.value,mode=getMode(),newText=mode==='html'?formatHTML(text):formatBraces(text);
    if(newText!==text){const cursor=Math.min(newText.length,editor.area.selectionStart);editor.area.value=newText;editor.area.setSelectionRange(cursor,cursor);editor.area.dispatchEvent(new Event('input',{bubbles:true}))}
    hideSuggestions(editor);
  }
  function typeKey(editor,ev){
    if(ev.isComposing||ev.ctrlKey||ev.metaKey||ev.altKey)return;
    const area=editor.area,start=area.selectionStart,end=area.selectionEnd,mode=getMode();
    if(editor.suggestion&&(ev.key==='Tab'||ev.key==='Enter')){ev.preventDefault();ev.stopImmediatePropagation();acceptSuggestion(editor,0);return}
    if(ev.key==='Escape'){hideSuggestions(editor);return}
    if(ev.key==='>'&&mode==='html'&&start===end){
      const before=area.value.slice(0,start),after=area.value.slice(end);
      const tag=before.match(/<([A-Za-z][\w:-]*)(?:\s[^<>]*)?$/);
      if(tag&&!VOID.has(tag[1].toLowerCase())&&!/\/\s*$/.test(before)&&!after.startsWith('</'+tag[1]+'>')){
        ev.preventDefault();ev.stopImmediatePropagation();
        applyChange(editor,start,end,'></'+tag[1]+'>',start+1);hideSuggestions(editor);return;
      }
    }
    if(ev.key==='Enter'){
      const left=area.value.slice(0,start),previous=left.split('\n').at(-1)||'';
      const currentIndent=(previous.match(/^\s*/)||[''])[0];
      const opening=mode==='html'?(/<([A-Za-z][\w:-]*)[^>]*>\s*$/.test(previous)): (/[{[(]\s*$/.test(previous));
      const closing=area.value.slice(end).match(/^\s*(<\/|[}\])])/);
      let indent=currentIndent;
      if(opening)indent+='  ';
      const insert=closing&&opening?'\n'+indent+'\n'+currentIndent:'\n'+indent;
      ev.preventDefault();ev.stopImmediatePropagation();
      applyChange(editor,start,end,insert,start+1+indent.length);hideSuggestions(editor);return;
    }
    if(start!==end)return;
    const pairs={'(' : ')','[':']','{':'}','"':'"','\'':'\''};
    if(pairs[ev.key]&&mode!=='html' || (mode==='html'&&(ev.key==='"'||ev.key==="'"))){
      if((ev.key==='"'||ev.key==="'")&&area.value[start]===ev.key)return;
      ev.preventDefault();ev.stopImmediatePropagation();
      applyChange(editor,start,end,ev.key+pairs[ev.key],start+1);hideSuggestions(editor);return;
    }
  }
  function mount(){
    const area=$('codeEditor');if(!area||active?.area===area)return;
    const pane=area.closest('.editor-pane');if(!pane)return;
    const top=document.createElement('div');top.className='vscode-filebar';
    const file=document.createElement('span');file.className='vscode-file-label';file.textContent='▣ index.html';
    const tools=document.createElement('div');tools.className='vscode-tools';
    const formatBtn=document.createElement('button');formatBtn.type='button';formatBtn.textContent='⫶ Format';formatBtn.title='Định dạng code (Ctrl + Shift + F)';
    const themeBtn=document.createElement('button');themeBtn.type='button';themeBtn.textContent='☾ Giao diện';themeBtn.title='Đổi nền sáng/tối';
    const auto=document.createElement('label');auto.className='vscode-auto';const check=document.createElement('input');check.type='checkbox';check.checked=pairStore.auto;auto.append(check,document.createTextNode('Tự format khi chạy'));
    tools.append(formatBtn,themeBtn,auto);top.append(file,tools);
    const workspace=document.createElement('div');workspace.className='vscode-workspace';
    const gutter=document.createElement('pre');gutter.className='vscode-gutter';gutter.setAttribute('aria-hidden','true');
    const stage=document.createElement('div');stage.className='vscode-stage';
    const highlight=document.createElement('pre');highlight.className='vscode-highlight';highlight.setAttribute('aria-hidden','true');
    const suggest=document.createElement('div');suggest.className='vscode-suggestions';suggest.setAttribute('role','listbox');suggest.hidden=true;
    stage.append(highlight,area,suggest);workspace.append(gutter,stage);
    const status=document.createElement('div');status.className='vscode-status';
    const diagnostics=document.createElement('span');diagnostics.className='vscode-diagnostics';
    const size=document.createElement('span');const position=document.createElement('span');const modeLabel=document.createElement('span');
    status.append(diagnostics,size,position,modeLabel);
    pane.prepend(top,workspace,status);
    pane.classList.add('vscode-pane');
    pane.classList.toggle('vscode-light',pairStore.theme==='light');
    area.classList.add('vscode-input');area.setAttribute('aria-autocomplete','list');area.setAttribute('aria-expanded','false');area.setAttribute('autocapitalize','off');area.setAttribute('autocorrect','off');
    const editor={area,highlight,gutter,suggest,status,position,diagnostics,modeLabel,size,file,suggestion:null};active=editor;
    const refresh=()=>{if(active===editor){file.textContent=(getMode()==='html'?'▤ index.html':getMode()==='css'?'▤ style.css':getMode()==='scss'?'▤ style.scss':'▤ script.js');renderHighlighted(editor);hideSuggestions(editor)}};
    area.addEventListener('input',()=>{renderHighlighted(editor);showSuggestions(editor)});
    area.addEventListener('scroll',()=>{highlight.scrollTop=area.scrollTop;highlight.scrollLeft=area.scrollLeft;gutter.scrollTop=area.scrollTop},{passive:true});
    area.addEventListener('click',()=>renderHighlighted(editor));
    area.addEventListener('keyup',()=>{if(active===editor)renderHighlighted(editor)});
    area.addEventListener('keydown',ev=>{
      if((ev.ctrlKey||ev.metaKey)&&ev.shiftKey&&ev.key.toLowerCase()==='f'){ev.preventDefault();ev.stopImmediatePropagation();format(editor);return}
      typeKey(editor,ev);
    },{capture:true});
    area.addEventListener('blur',()=>setTimeout(()=>{if(!suggest.contains(document.activeElement))hideSuggestions(editor)},130));
    document.querySelectorAll('[data-editor]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(refresh,0)));
    $('resetBtn')?.addEventListener('click',()=>setTimeout(refresh,0));
    $('runBtn')?.addEventListener('click',()=>{if(pairStore.auto&&getMode()!=='js')format(editor);renderHighlighted(editor);},{capture:true});
    formatBtn.addEventListener('click',()=>format(editor));
    themeBtn.addEventListener('click',()=>{pairStore.theme=pairStore.theme==='dark'?'light':'dark';pane.classList.toggle('vscode-light',pairStore.theme==='light');try{localStorage.setItem('webLab:editorTheme',pairStore.theme)}catch{}});
    check.addEventListener('change',()=>{pairStore.auto=check.checked;try{localStorage.setItem('webLab:editorAutoFormat',JSON.stringify(pairStore.auto))}catch{}});
    refresh();
  }
  const detail=$('detailPanel');
  if(detail){new MutationObserver(mount).observe(detail,{childList:true});mount()}
  window.WebLabEditorAssist={format:()=>active&&format(active),refresh:()=>active&&renderHighlighted(active)};
})();
