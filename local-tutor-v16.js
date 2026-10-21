/* Web Lab 16: Offline study helper, not generative AI.
 * No network requests; does not run learner JavaScript.
 */
(()=>{
'use strict';
const norm=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
const has=(text,...words)=>words.some(w=>norm(text).includes(norm(w)));
const short=(s,n=650)=>String(s??'').slice(0,n);
const mark=String.fromCharCode(96);
const fenced=(lang,s)=>mark.repeat(3)+lang+'\n'+short(s,1000).replaceAll(mark.repeat(3),"'''")+'\n'+mark.repeat(3);
const lessons=()=>window.HTML_LAB_DATA?.LESSONS||[];
function pick(question,current){
 const q=norm(question);
 const aliases=['mảng','array','stack','queue','linked list','hash map','binary search','tìm kiếm nhị phân','bubble sort','insertion sort','fibonacci','đệ quy','tree','bfs','big o','flexbox','grid','scss','css','javascript'];
 for(const keyword of aliases){
  if(q.includes(norm(keyword))){
   const target=lessons().find(l=>norm(l.name).includes(norm(keyword)));
   if(target)return target;
  }
 }
 return current||lessons()[0]||null;
}
function heading(lesson){return lesson?'📘 Bài tham khảo: '+lesson.name+'\n\n':'📘 Web Lab — Trợ lý học tập miễn phí\n\n';}
function subject(lesson){
 const topics=lesson?.guide?.topics||[];
 return topics[0]||null;
}
function explain(lesson){
 const topic=subject(lesson);
 if(!lesson)return 'Hãy mở một bài học để nhận hướng dẫn tương ứng.';
 const meaning=topic?.deep?.meaning||topic?.why||lesson.guide?.intro||lesson.summary;
 const steps=topic?.deep?.steps||lesson.tip;
 const sample=topic?.example?'\n\nVí dụ:\n'+fenced(topic.tab||'js',topic.example):'';
 return heading(lesson)+short(meaning,700)+'\n\n**Thực hành:** '+short(steps,450)+sample;
}
function hint(lesson){
 const topic=subject(lesson);
 return heading(lesson)+'💡 **Gợi ý từng bước:**\n1. '+short(lesson?.summary||'Xác định dữ liệu đầu vào và đầu ra.',230)+
 '\n2. '+short(topic?.deep?.steps||lesson?.tip||'Chia yêu cầu thành các phần nhỏ và giải từng phần.',380)+
 '\n3. Thử trường hợp cơ bản, rồi thử trường hợp rỗng, số âm hoặc dữ liệu biên.\n\n'+
 (lesson?.dsa?'Bạn có thể nhấn **Kiểm tra bài làm** để chạy ca kiểm thử thực tế.':'Bấm **Chạy thử** để quan sát kết quả.');
}
function bigO(lesson){
 if(lesson?.dsa){
  const t=(lesson.guide?.topics||[]).find(x=>norm(x.title).includes('phuc tap'));
  return heading(lesson)+'⏱️ **Độ phức tạp của bài:**\n'+short(t?.deep?.meaning||t?.why||lesson.syntax,550);
 }
 return '**Big O** ước lượng số bước tăng theo kích thước dữ liệu n.\n\nO(1): không phụ thuộc nhiều vào n.\nO(log n): chia đôi mỗi bước.\nO(n): duyệt một lần.\nO(n²): thường có hai vòng lặp lồng nhau.\n\nHãy mở một bài DSA để xem phân tích riêng.';
}
function exercise(lesson){
 return heading(lesson)+'🎯 **Thử thách nhỏ:** '+short(lesson?.summary||'Hãy chọn một bài học.',300)+
 '\n\n'+short(lesson?.tip||'Tự viết lời giải rồi kiểm tra.',420)+
 (lesson?.dsa?'\n\nViết hàm '+mark+lesson.dsaFn+'()'+mark+' trong tab JS rồi nhấn **Kiểm tra bài làm**.':'\n\nHãy tự sửa code mẫu rồi nhấn **Chạy thử**.');
}
function inspect(code){
 if(!code)return ['Bạn chưa chọn phân tích code. Tích ô **Phân tích code hiện tại** để kiểm tra ngay trên thiết bị.'];
 const js=String(code.js||''),html=String(code.html||''),css=String(code.css||'');
 const issues=[];
 if(/\bconsole\.long\s*\(/.test(js))issues.push('JavaScript: Có thể bạn đã gõ console.long thay vì console.log.');
 if(/\bgetElementByID\s*\(/.test(js))issues.push('JavaScript: Hãy dùng getElementById, chữ d cuối viết thường.');
 if(/\bqueryselector\s*\(/.test(js))issues.push('JavaScript: Tên đúng là querySelector (chữ S viết hoa).');
 if(/\.sort\(\s*\)/.test(js))issues.push('JavaScript: Khi sắp xếp số, dùng sort((a,b)=>a-b) thay vì sort() mặc định.');
 if(/\binnerHTML\s*=/.test(js))issues.push('JavaScript: Với văn bản người dùng nhập, hãy dùng textContent để giảm rủi ro chèn mã.');
 if(js.trim()&&!/^\s*(import|export)\s/m.test(js)){
  try{new Function(js)}catch(e){issues.push('JavaScript: Phát hiện lỗi cú pháp: '+short(e.message,180));}
 }
 if(/<img\b/i.test(html)&&!/\balt\s*=/i.test(html))issues.push('HTML: Ảnh nên có thuộc tính alt.');
 if(/<a\b/i.test(html)&&!/\bhref\s*=/i.test(html))issues.push('HTML: Liên kết thường cần href.');
 if(/\bcolor\s*=/.test(css))issues.push('CSS: Viết color: red; thay vì color = red.');
 if(!issues.length)issues.push('Chưa phát hiện lỗi cú pháp JS hoặc lỗi phổ biến. Điều này không đảm bảo chương trình đúng; hãy chạy thử và kiểm tra Console.');
 return issues.slice(0,6);
}
function answer(question,{lesson=null,code=null}={}){
 const q=norm(question),item=pick(question,lesson);
 if(!q.trim())return 'Hãy hỏi về bài học, Big O, gợi ý, bài tập hoặc kiểm tra code.';
 if(has(q,'kiem tra code','sua loi','debug','loi code','bug','kiem tra loi','phan tich code'))return heading(item)+'🐞 **Nhận xét code (kiểm tra tĩnh):**\n\n'+inspect(code).map((x,i)=>(i+1)+'. '+x).join('\n')+'\n\nTrợ lý không chạy code và không thể bảo đảm giải pháp chính xác tuyệt đối.';
 if(has(q,'big o','o(n','do phuc tap','thoi gian chay','complexity'))return bigO(item);
 if(has(q,'goi y','huong dan','bat dau','cach giai','tu duy'))return hint(item);
 if(has(q,'bai tap','luyen tap','thu thach','bai thuc hanh'))return exercise(item);
 if(has(q,'xin chao','chao ban','hello'))return 'Xin chào! 👋 Mình là **trợ lý miễn phí dựa trên nội dung và quy tắc**, không phải AI tạo sinh. Hãy hỏi: Giải thích bài học, Big O, Gợi ý, Bài tập hoặc Kiểm tra code.';
 if(has(q,'giai thich','la gi','vi du','khai niem','hoc','stack','queue','array','mang','js','html','css','thuat toan','scss','tim kiem','sap xep','de quy'))return explain(item);
 return explain(item)+'\n\nTrợ lý miễn phí trả lời theo kiến thức có sẵn. Nếu cần hội thoại AI linh hoạt hơn, chọn chế độ OpenAI sau khi máy chủ có khóa API hợp lệ.';
}
window.WebLabLocalTutor={answer,inspect,pick};
})();