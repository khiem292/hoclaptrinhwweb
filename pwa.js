/* Web Lab PWA: chỉ đăng ký service worker trên HTTPS / localhost. */
(() => {
 'use strict';
 let deferredPrompt;
 const $=id=>document.getElementById(id);
 const installBtn=$('nativeInstallBtn');
 window.addEventListener('beforeinstallprompt',event=>{
   event.preventDefault();deferredPrompt=event;
   if(installBtn)installBtn.hidden=false;
 });
 installBtn?.addEventListener('click',async()=>{
   if(!deferredPrompt)return;
   deferredPrompt.prompt();
   try{await deferredPrompt.userChoice;}catch{}
   deferredPrompt=null;installBtn.hidden=true;
 });
 window.addEventListener('appinstalled',()=>{if(installBtn)installBtn.hidden=true;});
 const secure=window.isSecureContext && /^https?:$/.test(location.protocol);
 if(secure&&'serviceWorker' in navigator){
   window.addEventListener('load',()=>{
     navigator.serviceWorker.register('./service-worker.js',{scope:'./'}).catch(error=>{
       console.info('Web Lab: không đăng ký được chế độ offline',error.message);
     });
   });
 }
})();
