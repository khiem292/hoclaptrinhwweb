/* Web Lab v3, cache scoped to the GitHub Pages folder. */
const CACHE='weblab-pwa-v10.1';
const CORE=[
 './', './index.html', './style.css?v=10.1', './practice.css?v=5.5', './html-data.js',
 './extra-data.js', './scss-data.js', './scss-compiler.js',
 './learning-paths.js?v=6.0', './learning-guide-deep.js?v=8.0', './script.js?v=10.1', './practice-projects.js', './course-data.js?v=5.0', './practice.js?v=8.0', './editor-vscode.js?v=7.0', './cloud-config.js?v=8.2', './cloud-sync.js?v=8.5', './pwa.js', './manifest.webmanifest',
 './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
   caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('weblab-pwa-')&&key!==CACHE).map(key=>caches.delete(key)))),
   self.clients.claim()
 ]));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
   event.respondWith(fetch(req).then(response=>{
     if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));}
     return response;
   }).catch(async()=>await caches.match('./index.html')||Response.error()));
   return;
 }
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));}
   return response;
 })));
});
