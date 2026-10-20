/* Web Lab v5.2: autocomplete gọn nhẹ, đóng thẻ HTML và format theo nút hoặc khi rời trình soạn thảo. */
(()=>{'use strict';
const tags=['a','abbr','article','aside','b','blockquote','body','button','code','dd','details','div','dl','dt','em','fieldset','figcaption','figure','footer','form','h1','h2','h3','h4','h5','h6','head','header','html','i','iframe','label','li','main','nav','ol','option','p','section','select','small','span','strong','summary','table','tbody','td','textarea','th','thead','title','tr','ul'];
const voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const cssProps=['align-items','animation','background','background-color','border','border-radius','box-shadow','color','display','flex','flex-direction','font-family','font-size','font-weight','gap','grid-template-columns','height','justify-content','line-height','margin','max-width','min-height','opacity','overflow','padding','position','text-align','transform','transition','width','z-index'];
const jsWords=['addEventListener','appendChild','classList','console.log','const','document','fetch','filter','forEach','function','getElementById','if','innerHTML','let','localStorage','map','querySelector','querySelectorAll','return','setItem','textContent','window'];
const $=id=>document.getElementById(id);let active=null,menu=null;
function tab(){return document.querySelector('.editor-tab.active')?.dataset.editor||'html';}
function fmt(src,type){
 if(type==='html'){
   const tokens=src.replace(/>\s*</g,'>\n<').split('\n'),out=[];let depth=0;
   for(const part of tokens){const t=part.trim();if(!t)continue;
     const closes=/^<\//.test(t), open=t.match(/^<([a-z][\w-]*)\b/i);
     if(closes)depth=Math.max(0,depth-1);
     out.push('  '.repeat(depth)+t);
     if(open&&!voids.has(open[1].toLowerCase())&&!/\/>/.test(t)&&!new RegExp('<\\/'+open[1]+'\\s*>','i').test(t)&&!/^<!/.test(t))depth++;
   }
   return out.join('\n');
 }
 const lines=src.split('\n');let depth=0;
 return lines.map(line=>{const s=line.trim();if(!s)return '';const closing=/^[}\])]/.test(s);
 if(closing)depth=Math.max(0,depth-1);
 const out='  '.repeat(Math.min(depth,20))+s;
 const opens=(s.match(/{/g)||[]).length,closes=(s.match(/}/g)||[]).length;
 depth=Math.max(0,Math.min(20,depth+opens-closes+(closing?1:0)));
 return out;}).join('\n');
}
function popup(editor){const caret=editor.selectionStart,head=editor.value.slice(0,caret),type=tab();let prefix='',choices=[];
 if(type==='html'){const hit=head.match(/<([a-z][a-z0-9-]*)$/i);if(!hit){hide();return;}prefix=hit[1];choices=tags;}
 else {const hit=head.match(/([a-zA-Z_$][\w$-]*)$/);if(!hit){hide();return;}prefix=hit[1];choices=type==='js'?jsWords:cssProps;}
 const items=choices.filter(x=>x.toLowerCase().startsWith(prefix.toLowerCase())&&x!==prefix).slice(0,7);
 if(!items.length){hide();return;}
 menu=menu||document.createElement('div');menu.id='weblabSuggestions';menu.className='weblab-suggestions';menu.setAttribute('role','listbox');
 menu.innerHTML=items.map((name,i)=>'<button type="button" data-suggest="'+i+'">'+name+'</button>').join('');
 if(!menu.isConnected)editor.parentElement.append(menu);
 [...menu.querySelectorAll('button')].forEach((btn,i)=>btn.addEventListener('pointerdown',ev=>{ev.preventDefault();apply(editor,prefix,items[i]);}));
 editor.setAttribute('aria-expanded','true');
}
function hide(){menu?.remove();menu=null;$('codeEditor')?.setAttribute('aria-expanded','false')}
function apply(editor,prefix,suggestion){const pos=editor.selectionStart,start=pos-prefix.length;editor.setRangeText(suggestion,start,pos,'end');editor.dispatchEvent(new Event('input',{bubbles:true}));hide();editor.focus();}
function mount(){const editor=$('codeEditor');if(!editor||editor===active)return;active=editor;editor.setAttribute('aria-autocomplete','list');editor.setAttribute('aria-expanded','false');
 editor.addEventListener('input',()=>popup(editor));
 editor.addEventListener('keydown',ev=>{
  if(ev.key==='Escape'){hide();return}
  if(menu&&ev.key==='Tab'){const first=menu.querySelector('button');if(first){ev.preventDefault();const h=editor.value.slice(0,editor.selectionStart),match=h.match(tab()==='html'?/<([a-z][a-z0-9-]*)$/i:/([a-zA-Z_$][\w$-]*)$/);if(match)apply(editor,match[1],first.textContent);return;}}
  if(tab()==='html'&&ev.key==='>'&&!ev.isComposing){const start=editor.selectionStart;const left=editor.value.slice(0,start);const m=left.match(/<([a-z][\w-]*)(?:\s[^<>]*)?$/i);if(m&&!voids.has(m[1].toLowerCase())&&!/\/\s*$/.test(left)){ev.preventDefault();const end='</'+m[1]+'>';editor.setRangeText('>'+end,start,editor.selectionEnd,'end');editor.setSelectionRange(start+1,start+1);editor.dispatchEvent(new Event('input',{bubbles:true}));hide();return;}}
  if((ev.ctrlKey||ev.metaKey)&&ev.shiftKey&&ev.key.toLowerCase()==='f'){ev.preventDefault();format(editor);}
 });
 editor.addEventListener('blur',()=>{hide()});
 const actions=document.querySelector('.editor-actions');if(actions&&!$('editorFormat')){const b=document.createElement('button');b.type='button';b.id='editorFormat';b.textContent='⫶ Format';b.title='Định dạng mã (Ctrl+Shift+F)';actions.append(b);b.addEventListener('click',()=>format($('codeEditor')));}
}
function format(editor){if(!editor)return;const type=tab();const formatted=fmt(editor.value,type);if(formatted!==editor.value){editor.value=formatted;editor.dispatchEvent(new Event('input',{bubbles:true}));}hide();}
new MutationObserver(mount).observe(document.getElementById('detailPanel'),{childList:true,subtree:false});
mount();
window.WebLabEditorAssist={format:()=>format($('codeEditor'))};
})();