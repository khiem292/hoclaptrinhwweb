/* Web Lab 12.0 — thử thách và bảng thành tích.
 * XP chỉ được tính từ dữ liệu học và kết quả bài tập đã được Web Lab lưu.
 * Không cần tài khoản mới, không có điểm thưởng lặp khi tải lại trang.
 */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lessons=window.HTML_LAB_DATA?.LESSONS||[];
const roadmap=lessons.filter(l=>l.kind==='roadmap'&&l.practice);
const validIds=new Set(lessons.map(l=>l.id));
const course=()=>window.WebLabCourse;
const tracks=()=>course()?.tracks||[];
const read=(name,fallback)=>{
 try{const raw=localStorage.getItem('webLab:'+name);return raw===null?fallback:JSON.parse(raw)}catch{return fallback}
};
const ranks=['Người mới bắt đầu','Tập sự HTML','Người học CSS','Thực hành JavaScript','Thợ xây giao diện','Frontend Explorer','Frontend Developer'];
function rankFor(level){return ranks[Math.min(ranks.length-1,Math.floor((level-1)/3))]}
function summary(){
 const savedCompleted=read('completed',[]);
 const completed=new Set((Array.isArray(savedCompleted)?savedCompleted:[]).filter(x=>validIds.has(x)));
 const values=read('practiceV4',{});
 const practice=values&&typeof values==='object'&&!Array.isArray(values)?values:{};
 let passed=0,goalsPassed=0,goalTotal=0,points=completed.size*10;
 const solved=new Set();
 const counted={};
 for(const item of roadmap){
  const goals=item.practice.goals||[];
  const ids=new Set(Array.isArray(practice[item.id])?practice[item.id]:[]);
  const n=goals.reduce((total,g,index)=>total+(ids.has('goal-'+index)?1:0),0);
  goalTotal+=goals.length;goalsPassed+=n;
  points+=n*10;
  counted[item.id]=n;
  if(goals.length&&n===goals.length){passed++;solved.add(item.id);points+=30}
 }
 const level=Math.floor(points/150)+1;
 return {xp:points,level,title:rankFor(level),completed:completed.size,solved:passed,goalsPassed,goalTotal,
  completedIDs:completed,solvedIDs:solved,counts:counted};
}
let tab='overview',track='all';
function progressBlock(label,done,total){
 const percent=total?Math.min(100,Math.round(done/total*100)):0;
 return '<div class="wl-gam-progress-row"><div class="wl-gam-progress-title"><strong>'+esc(label)+'</strong><span>'+done+'/'+total+'</span></div>'+
  '<div class="wl-gam-progress-track"><div style="width:'+percent+'%"></div></div></div>';
}
function renderOverview(root,stats){
 const current=stats.xp%150;
 const milestones=[
  {name:'🌱 Bước chân đầu tiên',desc:'Hoàn thành bài học đầu tiên',earned:stats.completed>=1||stats.solved>=1},
  {name:'💻 Người biết thực hành',desc:'Hoàn thành 3 bài tập',earned:stats.solved>=3},
  {name:'⚡ Không ngại thử thách',desc:'Hoàn thành 10 bài tập',earned:stats.solved>=10},
  {name:'🏆 Bền bỉ học hỏi',desc:'Tích lũy ít nhất 1000 XP',earned:stats.xp>=1000}
 ];
 const groups=tracks().map(group=>{
  const ids=group.ids||[],count=ids.filter(id=>stats.solvedIDs.has(id)).length;
  return progressBlock((group.icon||'📚')+' '+group.title,count,ids.length);
 });
 root.innerHTML=
 '<div class="wl-gam-summary">'+
 '<div class="wl-gam-level"><span>LEVEL '+stats.level+'</span><strong>'+esc(stats.title)+'</strong><small>'+stats.xp.toLocaleString('vi-VN')+' XP đã tích lũy</small></div>'+
 '<div class="wl-gam-stat"><strong>'+stats.completed+'</strong><small>Bài đã đánh dấu học</small></div>'+
 '<div class="wl-gam-stat"><strong>'+stats.solved+'</strong><small>Bài tập đã vượt qua</small></div></div>'+
 '<p class="wl-gam-minor">Còn <b>'+(150-current)+'</b> XP để lên cấp tiếp theo.</p>'+
 '<div class="wl-gam-progress-track wl-gam-levelbar"><div style="width:'+Math.round(current/150*100)+'%"></div></div>'+
 '<div class="wl-gam-two">'+
 '<section class="wl-gam-panel"><h3>📊 Tiến độ '+tracks().length+' lộ trình</h3>'+groups.join('')+'</section>'+
 '<section class="wl-gam-panel"><h3>🎖️ Huy hiệu thành tích</h3><div class="wl-gam-badges">'+milestones.map(m=>
 '<div class="wl-gam-badge '+(m.earned?'earned':'locked')+'"><strong>'+esc(m.name)+'</strong><span>'+esc(m.desc)+(m.earned?' · Đã đạt':' · Chưa mở khóa')+'</span></div>').join('')+
 '</div></section></div>'+
 '<p class="wl-gam-hint">XP được tính từ tiến độ đã lưu: +10 cho bài đã học, +10 cho mỗi yêu cầu thực hành đạt và +30 khi hoàn thành toàn bộ yêu cầu của một bài lộ trình. Điểm không nhân đôi khi tải lại trang.</p>';
}
function renderChallenges(root,stats){
 const selectedTrack=tracks().find(t=>t.id===track);
 const byTrack=selectedTrack?new Set(selectedTrack.ids):null;
 const options='<div class="wl-gam-filter"><label for="wlGamFilter">Chọn lộ trình</label><select id="wlGamFilter"><option value="all">Tất cả 7 lộ trình</option>'+
 tracks().map(t=>'<option value="'+esc(t.id)+'"'+(t.id===track?' selected':'')+'>'+esc((t.icon||'📚')+' '+t.title)+'</option>').join('')+'</select></div>';
 const items=roadmap.filter(item=>!byTrack||byTrack.has(item.id));
 root.innerHTML='<div class="wl-gam-challenge-head"><div><h3>🎯 Thử thách lập trình</h3><p>'+roadmap.length+' bài thực hành có tiêu chí kiểm tra. Chọn bài đang mở, tự sửa code và bấm <b>✓ Kiểm tra bài làm</b>.</p></div></div>'+
 options+'<div class="wl-gam-challenge-grid">'+items.map(item=>{
  const total=item.practice.goals.length,passed=stats.counts[item.id]||0;
  const done=passed===total;
  const unlocked=!!course()?.unlockedId(item.id);
  const subtitle=item.practice.goals.map(g=>g[2]).filter(Boolean).slice(0,3).join(' · ');
  const state=done?'✅ Hoàn thành':unlocked?'✍️ Đang mở':'🔒 Chưa mở khóa';
  const stateClass=done?'completed':unlocked?'available':'blocked';
  return '<article class="wl-gam-challenge '+stateClass+'"><div class="wl-gam-challenge-top"><strong>'+esc(item.name)+'</strong><span>'+passed+'/'+total+' yêu cầu</span></div>'+
   '<p>'+esc(subtitle)+'</p><div class="wl-gam-challenge-bottom"><small>'+state+'</small>'+
   '<button type="button" data-wl-challenge="'+esc(item.id)+'"'+(unlocked?'':' disabled')+'>'+ (done?'Ôn tập →':unlocked?'Bắt đầu →':'Đã khóa')+'</button></div></article>';
 }).join('')+'</div><p class="wl-gam-hint">Các thử thách sử dụng bộ kiểm tra HTML/CSS/JavaScript hiện có. Kết quả chỉ kiểm tra những tiêu chí cơ bản, không đánh giá toàn diện giao diện hoặc hành vi chương trình.</p>';
 root.querySelector('#wlGamFilter')?.addEventListener('change',e=>{track=e.target.value;render()});
 root.querySelectorAll('[data-wl-challenge]').forEach(btn=>btn.addEventListener('click',()=>{
  const id=btn.dataset.wlChallenge;
  if(!course()?.unlockedId(id))return;
  $('gamificationDialog')?.close();
  window.WEB_LAB_NAVIGATE?.(id);
  requestAnimationFrame(()=>$('#detailPanel')?.scrollIntoView({block:'start',behavior:'smooth'}));
 }));
}
function render(){
 const s=summary();
 const preview=$('gamificationXP');
 if(preview)preview.textContent=s.xp>=1000?(s.xp/1000).toFixed(1)+'k':String(s.xp);
 // Draft autosave dispatches dataChanged on every keystroke.
 // Never rebuild 66 challenge cards while the dialog is closed.
 const root=$('gamificationContent');
 if(!root||!$('gamificationDialog')?.open)return;
 root.textContent='';
 if(tab==='challenges')renderChallenges(root,s);
 else renderOverview(root,s);
 $('gamificationOverviewTab')?.setAttribute('aria-selected',String(tab==='overview'));
 $('gamificationChallengeTab')?.setAttribute('aria-selected',String(tab==='challenges'));
 $('gamificationOverviewTab')?.classList.toggle('selected',tab==='overview');
 $('gamificationChallengeTab')?.classList.toggle('selected',tab==='challenges');
}
function show(nextTab){
 tab=nextTab||tab;
 const modal=$('gamificationDialog');
 if(modal&&!modal.open)modal.showModal();
 render();
}
function init(){
 const open=$('gamificationBtn'),dialog=$('gamificationDialog');
 if(!open||!dialog)return;
 open.addEventListener('click',()=>show('overview'));
 $('gamificationHeroBtn')?.addEventListener('click',()=>show('challenges'));
 $('gamificationClose')?.addEventListener('click',()=>dialog.close());
 $('gamificationOverviewTab')?.addEventListener('click',()=>{tab='overview';render()});
 $('gamificationChallengeTab')?.addEventListener('click',()=>{tab='challenges';render()});
 dialog.addEventListener('click',ev=>{if(ev.target===dialog)dialog.close()});
 window.addEventListener('webLab:dataChanged',render);
 window.addEventListener('weblab:practice-passed',render);
 window.addEventListener('pageshow',render);
 render();
}
window.WebLabGame={summary,render,show};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();