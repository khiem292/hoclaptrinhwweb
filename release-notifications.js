/* Web Lab 13.0 — release notifications; checks new versions while app is open.
 * Release publisher updates release.json & version meta on each deployment.
 * Never forces an automatic reload while learners are writing code. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const built=document.querySelector('meta[name="web-lab-version"]')?.content||'13.0';
const RELEASE_KEY='webLab:lastSeenRelease';
const fallback={version:"13.0",date:"2026-10-21",title:"Dự án cá nhân & thông báo cập nhật",notes:[
 '📁 Lưu và quản lý dự án HTML, CSS, SCSS, JavaScript.',
 '🕘 Lịch sử tự động và khôi phục code.',
 '⬇️ Xuất dự án ZIP không cần thư viện bên ngoài.',
 '🔔 Chuông thông báo mỗi khi Web Lab có phiên bản mới.'
]};
let newest=fallback,lastCheck=0,checking=false;
const latestSeen=()=>{try{return localStorage.getItem(RELEASE_KEY)||''}catch{return ''}};
const saveSeen=v=>{try{localStorage.setItem(RELEASE_KEY,v)}catch{}};
function compare(a,b){
 const va=String(a||'0').split('.').map(x=>parseInt(x,10)||0),vb=String(b||'0').split('.').map(x=>parseInt(x,10)||0);
 for(let k=0;k<Math.max(va.length,vb.length);k++){const d=(va[k]||0)-(vb[k]||0);if(d)return d}
 return 0;
}
function showBadge(){
 const unread=compare(newest.version,latestSeen())>0;
 const btn=$('wl13UpdateBtn'),badge=$('wl13UpdateBadge');
 if(btn)btn.setAttribute('aria-label',unread?'Có thông báo cập nhật Web Lab mới':'Xem lịch sử cập nhật Web Lab');
 if(badge){badge.hidden=!unread;badge.textContent='●'}
 const strip=$('wl13UpdateStrip');
 if(strip){
  const newBuild=compare(newest.version,built)>0;
  strip.hidden=!unread&&!newBuild;
  const text=$('wl13UpdateStripText');
  if(text)text.textContent=newBuild
   ?'🚀 Web Lab '+newest.version+' đã có! Mở thông báo để xem và tải bản mới.'
   :'🔔 Web Lab '+newest.version+' có tính năng mới. Nhấn để xem thay đổi.';
 }
}
async function refresh(force=false){
 if(checking||(!force&&Date.now()-lastCheck<120000))return;
 checking=true;lastCheck=Date.now();
 try{
  const req=await fetch('./release.json?_='+Date.now(),{cache:'no-store'});
  if(!req.ok)throw Error('offline');
  const data=await req.json();
  if(data&&/^\d+(?:\.\d+){1,2}$/.test(data.version)&&Array.isArray(data.notes)&&data.notes.length<=20&&
     (compare(data.version,newest.version)>=0)){
   newest={version:data.version,date:String(data.date||''),title:String(data.title||'Bản cập nhật mới'),notes:data.notes.map(x=>String(x).slice(0,280))};
  }
 }catch{ /* offline: leave the locally cached version visible */ }
 finally{checking=false;showBadge();}
}
function open(){
 const dialog=$('wl13UpdateDialog');
 if(!dialog)return;
 const title=$('wl13ReleaseTitle'),date=$('wl13ReleaseDate'),list=$('wl13ReleaseList');
 title.textContent='Web Lab '+newest.version+' — '+newest.title;
 date.textContent='Ngày phát hành: '+(newest.date||'Không xác định');
 list.replaceChildren();
 newest.notes.forEach(note=>{const li=document.createElement('li');li.textContent=note;list.append(li)});
 const newer=compare(newest.version,built)>0;
 $('wl13UpdateApply').hidden=!newer;
 $('wl13InstalledVersion').textContent='Phiên bản đang chạy: '+built;
 if(!dialog.open)dialog.showModal();
 saveSeen(newest.version);showBadge();
}
async function apply(){
 const btn=$('wl13UpdateApply');if(btn)btn.disabled=true;
 try{window.WebLabV13?.snapshot({force:true})}catch{}
 if('serviceWorker' in navigator){
  try{
   const reg=await navigator.serviceWorker.getRegistration('./');
   await reg?.update();
   if(reg?.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});
  }catch{}
 }
 location.reload();
}
function init(){
 const button=$('wl13UpdateBtn'),strip=$('wl13UpdateStrip'),dialog=$('wl13UpdateDialog');
 if(!button||!dialog)return;
 button.addEventListener('click',()=>{refresh(true).finally(open)});
 $('wl13UpdateStripOpen')?.addEventListener('click',()=>{refresh(true).finally(open)});
 $('wl13UpdateClose')?.addEventListener('click',()=>dialog.close());
 $('wl13UpdateApply')?.addEventListener('click',apply);
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 window.addEventListener('online',()=>refresh(true));
 window.addEventListener('pageshow',()=>refresh(true));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh()});
 setInterval(()=>{if(document.visibilityState==='visible')refresh()},10*60*1000);
 // No automatic reload. Display notice for unseen new release.
 showBadge();refresh(true);
}
window.WebLabReleases={refresh,compare};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();