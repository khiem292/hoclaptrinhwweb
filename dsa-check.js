/* Web Lab 14.0 — offline algorithm tests inside a disposable Web Worker.
 * User JS executes outside the website's page context and is limited by a timeout.
 */
(()=>{
'use strict';
function workerMain(){
 "use strict";
 function same(a,b){
  if(Object.is(a,b))return true;
  if(Array.isArray(a)||Array.isArray(b)){
   return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>same(v,b[i]));
  }
  if(a&&b&&typeof a==="object"&&typeof b==="object"){
   const ak=Object.keys(a).sort(),bk=Object.keys(b).sort();
   return same(ak,bk)&&ak.every(k=>same(a[k],b[k]));
  }
  return false;
 }
 self.onmessage=async event=>{
  const {code,fn,cases}=event.data;
  const results=[];
  try{
   if(!/^[a-zA-Z_$][\w$]*$/.test(fn))throw Error("Tên hàm không hợp lệ.");
   const program=new Function('"use strict";\n'+code+'\nreturn typeof '+fn+' === "function" ? '+fn+' : undefined;');
   const algorithm=program();
   if(typeof algorithm!=="function")throw Error("Chưa tìm thấy hàm "+fn+"(). Hãy giữ đúng tên hàm và chữ hoa/chữ thường.");
   for(let i=0;i<cases.length;i++){
    const [args,expected]=cases[i];
    let actual,pass=false,reason="";
    try{
     actual=await algorithm(...structuredClone(args));
     pass=same(actual,expected);
     if(!pass)reason="Mong đợi "+JSON.stringify(expected)+", nhận "+JSON.stringify(actual);
    }catch(e){reason="Lỗi JavaScript: "+String(e?.message||e).slice(0,170)}
    results.push({id:"goal-"+i,pass,info:pass?"✅ Kiểm thử "+(i+1)+" đạt.":"❌ Kiểm thử "+(i+1)+": "+reason});
   }
   self.postMessage({results});
  }catch(e){self.postMessage({error:String(e?.message||e).slice(0,220)})}
 };
}
const workerSource='('+workerMain.toString()+')();';
function check(item,code){
 return new Promise((resolve,reject)=>{
  if(!item?.dsa||!Array.isArray(item.dsaCases))return reject(Error('Bài học này không có bộ kiểm thử DSA.'));
  if(!('Worker' in window)||!('Blob' in window)||!window.URL?.createObjectURL)return reject(Error('Trình duyệt không hỗ trợ kiểm thử thuật toán ngoại tuyến.'));
  const url=URL.createObjectURL(new Blob([workerSource],{type:'text/javascript'}));
  let worker,timer,finished=false;
  function clean(){
   if(finished)return false;
   finished=true;clearTimeout(timer);
   try{worker?.terminate()}catch{}
   URL.revokeObjectURL(url);
   return true;
  }
  try{
   worker=new Worker(url);
   timer=setTimeout(()=>{if(clean())reject(Error('Chạy quá 4 giây. Hãy kiểm tra vòng lặp vô hạn hoặc thuật toán quá chậm.'))},4000);
   worker.onmessage=e=>{
    if(!clean())return;
    if(e.data?.error)return reject(Error(e.data.error));
    if(!Array.isArray(e.data?.results)||e.data.results.length!==item.dsaCases.length)return reject(Error('Kết quả kiểm thử không hợp lệ.'));
    resolve(e.data.results);
   };
   worker.onerror=()=>{if(clean())reject(Error('Không chạy được bộ kiểm thử. Kiểm tra cú pháp JavaScript.'))};
   worker.postMessage({code:String(code||'').slice(0,80000),fn:item.dsaFn,cases:item.dsaCases});
  }catch(e){clean();reject(e)}
 });
}
window.WebLabDSA={check,workerSource};
})();