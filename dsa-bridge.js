/* Web Lab DSA bridge.
 * Capture original Vietnamese algorithm guides before legacy roadmap auto-generator.
 * Restore them and register the eighth learning path once base roadmaps are ready.
 */
(()=>{
'use strict';
const dsa=window.WebLabDSACourse;
if(!dsa?.track||!Array.isArray(dsa.lessons))return;
const originals=new Map(dsa.lessons.map(item=>[item.id,item.guide]));
window.WebLabDSABridge={
 activate(){
  for(const item of dsa.lessons){
   if(originals.has(item.id))item.guide=originals.get(item.id);
  }
  const course=window.WebLabCourse;
  if(course?.tracks&&!course.tracks.some(track=>track.id==='dsa')){
   course.tracks.push(dsa.track);
  }
  course?.render?.();
 }
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>window.WebLabDSABridge?.activate(),{once:true});
else queueMicrotask(()=>window.WebLabDSABridge?.activate());
})();