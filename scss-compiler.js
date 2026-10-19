/*
 Web Lab SCSS compiler (offline subset): $variables, nesting, &, @mixin/@include, basic @media.
 This is an educational fallback, NOT Dart Sass. No @use, @forward, built-in Sass functions, maps, module loading.
 When internet is available, optional Sass.js (LibSass) offers expanded SCSS support.
*/
(() => {
 'use strict';
 const unsupported = /@(use|forward|extend|function|each|for|while|debug|warn|error)\b/;
 function miniCompile(source){
   if(source.length>25000)throw Error('SCSS quá dài (>25 KB). Hãy thử ví dụ ngắn hơn.');
   const initial=source.replace(/\/\*[\s\S]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'');
   if(unsupported.test(initial))throw Error('Trình biên dịch offline chưa hỗ trợ @use, @forward, @extend hoặc vòng lặp. Hãy dùng Dart Sass trong VS Code.');
   const values=new Map(),mixins=new Map();
   const withVars=s=>String(s).replace(/\$([\w-]+)/g,(all,key)=>values.has(key)?values.get(key):all);
   let s=initial.replace(/\$([\w-]+)\s*:\s*([^;{}]+);/g,(_,k,v)=>{values.set(k,withVars(v.trim()));return ''});
   // Load mixins before expanding includes. Allow simple parameter values and defaults.
   s=s.replace(/@mixin\s+([\w-]+)\s*(?:\(([^)]*)\))?\s*\{([^{}]*)\}/g,(_,name,args,body)=>{
     mixins.set(name,{params:(args||'').split(',').map(x=>x.trim()).filter(Boolean),body});return '';
   });
   s=s.replace(/@include\s+([\w-]+)\s*(?:\(([^)]*)\))?\s*;/g,(_,name,args)=>{
      const mix=mixins.get(name);if(!mix)throw Error('Chưa định nghĩa mixin: '+name);
      let body=mix.body;
      const inputs=(args||'').split(',').map(s=>s.trim());
      mix.params.forEach((param,i)=>{
        const match=param.match(/^\$([\w-]+)(?:\s*:\s*(.+))?$/);
        if(match){const value=withVars(inputs[i]||match[2]||'');body=body.replace(new RegExp('\\$'+match[1]+'(?![\\w-])','g'),value)}
      });
      return body;
   });
   s=withVars(s);
   if(/\$[\w-]+/.test(s))throw Error('Một biến SCSS chưa được định nghĩa.');
   // Parse nested rules and statements using a lightweight CSS token parser.
   const root={selector:'',declarations:[],children:[],parent:null}; let ptr=root,buf='';
   function decl(txt){const part=txt.trim();if(part)ptr.declarations.push(part)}
   for(let i=0;i<s.length;i++){
     const ch=s[i];
     if(ch==='{'){
       const name=buf.trim();buf='';const child={selector:name,declarations:[],children:[],parent:ptr};ptr.children.push(child);ptr=child;
     }else if(ch===';'){decl(buf);buf='';}
     else if(ch==='}'){
       decl(buf);buf='';if(!ptr.parent)throw Error('Dấu } thừa trong SCSS.');ptr=ptr.parent;
     }else buf+=ch;
   }
   if(ptr!==root)throw Error('Thiếu dấu } trong SCSS.');
   if(buf.trim())throw Error('Cú pháp SCSS chưa hoàn chỉnh gần: '+buf.trim().slice(0,60));
   let outputs=[];
   function emit(node,selectors=[],media=''){
     const sel=node.selector;
     if(sel.startsWith('@')){
       if(!/^@media\b/.test(sel))throw Error('Trình biên dịch offline chưa hỗ trợ quy tắc '+sel.split(' ')[0]);
       node.children.forEach(child=>emit(child,selectors,sel));
       if(node.declarations.length&&selectors.length)outputs.push(`${sel}{${selectors.join(', ')}{${node.declarations.join(';')};}}`);
       return;
     }
     let next=selectors;
     if(sel){const subs=sel.split(',').map(x=>x.trim()).filter(Boolean);
       next=(selectors.length?selectors:['']).flatMap(parent=>subs.map(sub=>sub.includes('&')?sub.replace(/&/g,parent).trim():(parent?parent+' ':'')+sub));
     }
     if(node.declarations.length){
       if(!next.length||next.some(v=>!v.trim()))throw Error('Khai báo CSS cần nằm trong selector.');
       const body=next.join(', ')+' { '+node.declarations.join('; ')+'; }';
       outputs.push(media?media+' { '+body+' }':body);
     }
     node.children.forEach(child=>emit(child,next,media));
   }
   root.children.forEach(n=>emit(n));
   return outputs.join('\n');
 }
 let loading;
 async function loadExternal(){
   if(window.Sass&&typeof window.Sass.compile==='function')return true;
   if(!navigator.onLine||location.protocol==='file:')return false;
   if(loading)return loading;
   loading=new Promise(resolve=>{
     const script=document.createElement('script');
     script.src='https://cdnjs.cloudflare.com/ajax/libs/sass.js/0.11.1/sass.sync.min.js';
     script.crossOrigin='anonymous';script.referrerPolicy='no-referrer';
     let done=false;
     const finish=ok=>{if(done)return;done=true;clearTimeout(timer);resolve(ok)};
     const timer=setTimeout(()=>{script.remove();finish(false)},5000);
     script.onload=()=>finish(Boolean(window.Sass?.compile));script.onerror=()=>finish(false);
     document.head.appendChild(script);
   });return loading;
 }
 async function compile(source){
   const text=String(source||'');
   if(!text.trim())return{css:'',engine:'offline'};
   // Fast offline for easy syntax (no network request), or full fallback after CDN loading.
   if(await loadExternal()){
     try{
       const result=await new Promise((resolve,reject)=>window.Sass.compile(text,res=>res?.status===0?resolve(res):reject(Error(res?.formatted||res?.message||'Lỗi cú pháp SCSS'))));
       return{css:result.text,engine:'Sass.js (LibSass)'};
     }catch(e){throw e;}
   }
   return {css:miniCompile(text),engine:'biên dịch cơ bản offline'};
 }
 window.WebLabSCSS={compile,miniCompile,loadExternal};
})();
