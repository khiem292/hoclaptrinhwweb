/* Web Lab 17.0 — Detailed offline code explainer. No API, network or evaluation. */
(()=>{
'use strict';
const jsMap={
 const:'Khai báo biến không thể gán lại tên. Nếu là mảng/object, phần tử bên trong vẫn có thể đổi.',
 let:'Khai báo biến có thể gán giá trị mới.',var:'Cách khai báo biến cũ; hiện thường dùng const hoặc let.',
 function:'Khai báo hàm: nhóm lệnh có thể gọi để tái sử dụng.',return:'Trả kết quả từ hàm và kết thúc lượt gọi.',
 if:'Nếu điều kiện đúng, thực hiện khối lệnh.',else:'Nhánh khác khi điều kiện if không đúng.',
 for:'Vòng lặp chạy các bước lặp lại.',while:'Lặp khi điều kiện còn đúng.',
 do:'Kết hợp với while để chạy thân lặp ít nhất một lần.',of:'Trong for...of: lấy lần lượt từng giá trị.',in:'Duyệt khóa object hoặc kiểm tra thuộc tính.',
 break:'Thoát vòng lặp hoặc switch.',continue:'Bỏ qua phần cuối lượt lặp hiện tại.',
 switch:'Chọn cách xử lý tùy giá trị.',case:'Một trường hợp trong switch.',default:'Nhánh mặc định trong switch.',
 true:'Giá trị đúng (Boolean).',false:'Giá trị sai (Boolean).',null:'Giá trị rỗng có chủ ý.',
 undefined:'Giá trị chưa được gán hoặc không tìm thấy.',NaN:'Giá trị đặc biệt biểu thị không phải số.',
 async:'Đánh dấu hàm bất đồng bộ, thường trả Promise.',await:'Chờ kết quả Promise trong ngữ cảnh hỗ trợ async.',
 try:'Thử chạy đoạn có thể phát sinh lỗi.',catch:'Bắt lỗi từ try.',finally:'Khối được thực hiện sau try/catch.',
 throw:'Chủ động báo lỗi.',new:'Tạo một đối tượng mới từ constructor/class.',
 class:'Định nghĩa lớp đối tượng.',constructor:'Hàm khởi tạo đối tượng từ lớp.',extends:'Lớp kế thừa từ lớp khác.',super:'Truy cập constructor/phương thức của lớp cha.',
 this:'Đối tượng gắn với ngữ cảnh hàm đang chạy.',static:'Thuộc tính hoặc hàm thuộc về lớp.',
 import:'Nhập giá trị từ một module.',export:'Công khai thành phần để module khác có thể nhập.',from:'Cho biết module nguồn.',
 typeof:'Kiểm tra kiểu của giá trị, trả chuỗi.',instanceof:'Kiểm tra đối tượng có thuộc loại nguyên mẫu này không.',
 console:'Đối tượng cung cấp công cụ in thông tin khi gỡ lỗi.',log:'console.log in giá trị vào Console của trình duyệt.',
 warn:'console.warn hiển thị cảnh báo ở Console.',error:'console.error hiển thị lỗi ở Console.',
 document:'Đối tượng đại diện nội dung trang HTML (DOM).',window:'Đối tượng cửa sổ trình duyệt.',
 getElementById:'Tìm phần tử có id tương ứng.',querySelector:'Lấy phần tử đầu tiên khớp bộ chọn CSS.',
 querySelectorAll:'Lấy tất cả phần tử khớp bộ chọn CSS.',addEventListener:'Đăng ký hàm xử lý khi có sự kiện như click.',
 removeEventListener:'Gỡ hàm xử lý sự kiện trước đó.',textContent:'Thuộc tính chứa văn bản thuần.',
 innerHTML:'Thuộc tính chứa HTML; tránh gán dữ liệu không tin cậy để ngăn mã độc chèn vào.',
 value:'Giá trị ô nhập hoặc thuộc tính trong object.',length:'Độ dài của chuỗi hoặc số phần tử mảng.',
 push:'Thêm phần tử vào cuối mảng.',pop:'Lấy phần tử cuối và xóa nó khỏi mảng.',
 shift:'Lấy/xóa phần tử đầu mảng.',unshift:'Thêm phần tử vào đầu mảng.',
 map:'Tạo mảng mới bằng cách biến đổi từng phần tử.',filter:'Tạo mảng gồm các phần tử thỏa điều kiện.',
 reduce:'Gộp mảng thành một kết quả qua hàm xử lý.',find:'Tìm phần tử đầu tiên thỏa điều kiện.',
 includes:'Kiểm tra sự xuất hiện của phần tử/chuỗi.',forEach:'Gọi hàm cho mỗi phần tử.',
 sort:'Sắp xếp mảng; với số thường dùng (a,b)=>a-b.',slice:'Lấy một đoạn mảng hoặc chuỗi mà không sửa dữ liệu gốc.',
 splice:'Thay đổi phần tử trong mảng tại vị trí chỉ định.',split:'Tách chuỗi thành mảng.',
 join:'Ghép các phần tử mảng thành chuỗi.',trim:'Xóa khoảng trắng đầu/cuối.',
 toLowerCase:'Chuyển chữ thường.',toUpperCase:'Chuyển chữ hoa.',
 JSON:'Đối tượng chuyển đổi dữ liệu JSON.',parse:'Chuyển chuỗi JSON thành dữ liệu.',
 stringify:'Chuyển dữ liệu thành chuỗi JSON.',Math:'Cung cấp các phép toán.',
 max:'Trả số lớn nhất.',min:'Trả số nhỏ nhất.',floor:'Làm tròn xuống.',round:'Làm tròn gần nhất.',random:'Sinh số ngẫu nhiên giả.',
 String:'Chuyển giá trị thành chuỗi.',Number:'Chuyển giá trị thành số.',Boolean:'Chuyển thành đúng/sai.',
 Array:'Kiểu dữ liệu mảng.',Object:'Kiểu object gồm cặp khóa và giá trị.',Map:'Cấu trúc ánh xạ khóa và giá trị.',Set:'Tập hợp không trùng phần tử.',
 Promise:'Đại diện kết quả một tác vụ bất đồng bộ.',fetch:'Gửi yêu cầu mạng, trả Promise.',
 then:'Đăng ký hàm khi Promise hoàn thành.',alert:'Hiện hộp thoại thông báo.',
 setTimeout:'Gọi hàm sau một thời gian trễ (mili giây).',setInterval:'Gọi lại hàm theo chu kỳ.',
 preventDefault:'Chặn hành vi mặc định của sự kiện.',target:'Phần tử phát sinh sự kiện.'
};
const ops={
 '=>':'Ký hiệu hàm mũi tên.', '=':'Gán giá trị bên phải cho bên trái.',
 '===':'So sánh bằng nhau cả giá trị lẫn kiểu.', '==':'So sánh bằng nhau có chuyển kiểu; thường nên dùng ===.',
 '!==':'So sánh khác nhau cả kiểu lẫn giá trị.','!=':'So sánh khác nhau, có thể chuyển kiểu.',
 '>':'Lớn hơn.','<':'Nhỏ hơn.','>=':'Lớn hơn hoặc bằng.','<=':'Nhỏ hơn hoặc bằng.',
 '+':'Cộng số hoặc nối chuỗi.','-':'Trừ số hoặc đổi dấu.','*':'Nhân.','/':'Chia.','%':'Chia lấy dư.','**':'Lũy thừa.',
 '++':'Tăng một đơn vị.','--':'Giảm một đơn vị.','+=':'Cộng rồi gán lại.','-=':'Trừ rồi gán lại.',
 '&&':'Và logic, kiểm tra hai vế.','||':'Hoặc logic hoặc lấy giá trị dự phòng khi vế trái falsy.',
 '??':'Lấy giá trị dự phòng nếu vế trái null/undefined.','!':'Phủ định điều kiện.',
 '?.':'Truy cập an toàn khi giá trị có thể null/undefined.',
 '?':'Toán tử điều kiện hoặc dấu tùy chọn (TS).',':':'Phân tách khóa/giá trị hoặc nhánh điều kiện.',
 ';':'Kết thúc một câu lệnh.',',':'Ngăn cách các phần tử hoặc tham số.','.':'Truy cập thuộc tính/phương thức.',
 '(':'Mở phần tham số/đối số hoặc nhóm biểu thức.',')':'Đóng phần tham số/đối số hoặc nhóm.',
 '{':'Mở khối lệnh hoặc object.','}':'Đóng khối lệnh hoặc object.',
 '[':'Mở mảng hoặc truy cập phần tử theo chỉ số.',']':'Đóng mảng hoặc phần chỉ số.',
 '...':'Trải phần tử (spread) hoặc gom đối số còn lại (rest).'
};
const tags={
 html:'Phần gốc tài liệu HTML.',head:'Vùng chứa thông tin cấu hình trang.',body:'Phần nội dung chính hiển thị.',
 title:'Tên trên tab trình duyệt.',meta:'Khai báo charset hoặc thông tin trang.',link:'Nối tài nguyên như CSS.',
 script:'Nhúng hoặc liên kết JavaScript.',style:'Chứa khai báo CSS.',
 div:'Hộp chia vùng bố cục.',span:'Bao một phần nhỏ nội dung.',
 h1:'Tiêu đề cấp 1.',h2:'Tiêu đề cấp 2.',h3:'Tiêu đề cấp 3.',h4:'Tiêu đề cấp 4.',
 p:'Đoạn văn.',a:'Liên kết có thể bấm.',img:'Hiển thị ảnh.',button:'Nút tương tác.',
 input:'Ô nhập liệu.',textarea:'Ô nhập nhiều dòng.',label:'Nhãn của ô nhập.',form:'Biểu mẫu thu thập dữ liệu.',
 select:'Hộp chọn.',option:'Một lựa chọn.',ul:'Danh sách dấu đầu dòng.',ol:'Danh sách đánh số.',li:'Mục trong danh sách.',
 table:'Bảng.',thead:'Đầu bảng.',tbody:'Thân bảng.',tr:'Hàng trong bảng.',td:'Ô dữ liệu.',th:'Ô tiêu đề.',
 header:'Khu vực đầu.',footer:'Khu vực cuối.',main:'Nội dung chính.',nav:'Khu điều hướng.',
 section:'Nhóm nội dung cùng chủ đề.',article:'Nội dung độc lập.',aside:'Nội dung bổ sung.',
 strong:'Đoạn nhấn mạnh.',em:'Nhấn mạnh bằng ngữ nghĩa.',br:'Xuống dòng.',hr:'Phân cách nội dung.',
 pre:'Hiển thị nguyên khoảng trắng.',code:'Đánh dấu đoạn mã.',small:'Văn bản bổ sung nhỏ.',
 canvas:'Vùng vẽ bằng JavaScript.',svg:'Đồ họa vector.',dialog:'Hộp thoại.',
 details:'Vùng có thể mở/đóng.',summary:'Tiêu đề của details.'
};
const attrs={
 id:'Tên riêng của phần tử, dùng trong CSS và JavaScript.',class:'Tên nhóm để CSS/JS truy cập.',
 href:'Địa chỉ khi bấm liên kết.',src:'Đường dẫn tài nguyên cần tải.',alt:'Văn bản mô tả ảnh.',
 type:'Loại nút, ô nhập hay tài nguyên.',placeholder:'Chữ gợi ý trong ô nhập trống.',
 value:'Giá trị dữ liệu.',name:'Tên trường dữ liệu gửi biểu mẫu.',
 title:'Mô tả bổ sung.',lang:'Ngôn ngữ tài liệu.',charset:'Kiểu mã hóa, thường là UTF-8.',
 content:'Nội dung thiết lập của meta.',rel:'Quan hệ liên kết, ví dụ stylesheet.',
 target:'Nơi mở liên kết (_blank: tab mới).',width:'Chiều rộng.',height:'Chiều cao.',
 style:'CSS đặt trực tiếp trên phần tử.',role:'Vai trò hỗ trợ tiếp cận.',
 'aria-label':'Tên truy cập của phần tử cho trình đọc màn hình.',
 'aria-hidden':'Cho biết phần tử có ẩn với trình đọc màn hình không.',
 'aria-expanded':'Cho biết phần nội dung liên quan đang mở không.',
 disabled:'Khóa tương tác.',checked:'Trạng thái được chọn.',required:'Bắt buộc nhập.',
 autocomplete:'Gợi ý trình duyệt điền tự động.',defer:'Hoãn chạy script đến sau khi phân tích HTML.',
 async:'Cho phép tải script bất đồng bộ.',onclick:'Xử lý sự kiện nhấn trực tiếp.',
 for:'Nối label với id của ô nhập.',method:'Phương thức gửi dữ liệu.',action:'Nơi nhận dữ liệu gửi.',
 min:'Giá trị tối thiểu.',max:'Giá trị tối đa.'
};
const props={
 color:'Màu chữ.','background-color':'Màu nền.',background:'Nền, có thể gồm màu và hình.',
 'font-size':'Kích thước chữ.','font-family':'Phông chữ.','font-weight':'Độ đậm chữ.',
 'line-height':'Khoảng cách dòng.','text-align':'Căn văn bản.','text-decoration':'Gạch dưới, gạch ngang...',
 margin:'Khoảng cách bên ngoài.',padding:'Khoảng cách bên trong so với viền.',
 border:'Viền phần tử.','border-radius':'Bo góc.','box-shadow':'Bóng đổ.',
 display:'Chọn cơ chế hiển thị/bố cục như block, flex, grid.',
 width:'Chiều rộng.',height:'Chiều cao.','min-width':'Chiều rộng tối thiểu.','max-width':'Chiều rộng tối đa.',
 gap:'Khoảng cách các phần tử Flex/Grid.','flex-direction':'Hướng sắp xếp Flex.',
 'justify-content':'Căn theo trục chính.','align-items':'Căn theo trục phụ.',
 'flex-wrap':'Cho phép mục Flex xuống dòng.',flex:'Quy tắc co giãn phần tử Flex.',
 'grid-template-columns':'Định nghĩa các cột Grid.','grid-template-rows':'Định nghĩa hàng Grid.',
 'grid-column':'Vị trí cột Grid.','grid-row':'Vị trí hàng Grid.',
 position:'Chế độ định vị: static/relative/absolute/fixed/sticky.',
 top:'Khoảng cách mép trên.',left:'Khoảng cách mép trái.',right:'Khoảng cách mép phải.',bottom:'Khoảng cách mép dưới.',
 'z-index':'Thứ tự xếp chồng.',overflow:'Cách xử lý nội dung tràn.',
 opacity:'Độ trong suốt.',cursor:'Kiểu con trỏ.',transition:'Hiệu ứng chuyển trạng thái.',
 transform:'Biến đổi kích thước/góc/vị trí.',animation:'Chạy hoạt ảnh.',
 'box-sizing':'Cách tính width/height với padding và border.',
 'object-fit':'Cách ảnh/video lấp đầy khung.','white-space':'Cách xử lý dấu cách và xuống dòng.'
};
const values={flex:'Bố cục Flexbox.',grid:'Bố cục Grid.',block:'Hiển thị theo khối.',
 none:'Ẩn hoặc tắt tùy thuộc tính.',center:'Căn giữa.','space-between':'Đẩy các phần tử ra hai đầu.',
 column:'Xếp theo cột.',row:'Xếp theo hàng.',absolute:'Đặt vị trí tuyệt đối.',relative:'Định vị tương đối.',
 fixed:'Ghim theo khung nhìn.',sticky:'Bám cạnh khi cuộn.',solid:'Đường viền liền.',
 auto:'Để trình duyệt tự tính.',hidden:'Ẩn phần tràn.',scroll:'Hiển thị thanh cuộn khi cần.',
 bold:'Giá trị chữ đậm.',normal:'Kiểu hiển thị thông thường.'};
const tokenPattern=/(\/\/.*|\/\*.*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\x60(?:\\.|[^\x60\\])*\x60|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$]*|===|!==|=>|\?\.|\?\?|&&|\|\||==|!=|<=|>=|\+\+|--|\+=|-=|\*=|\/=|\*\*|\.\.\.|[{}()[\].,;:?<>!=+\-*\/%&|]|\S)/g;
function jsDetail(token,prev,next){
 if(/^\/[/*]/.test(token))return'Chú thích dành cho người đọc; không chạy.';
 if(/^["'\x60]/.test(token))return'Chuỗi ký tự (String) chứa văn bản; dấu nháy bao quanh.';
 if(/^\d+(?:\.\d+)?$/.test(token))return'Giá trị số '+token+'.';
 if(jsMap[token])return jsMap[token];
 if(ops[token])return ops[token];
 if(/^[A-Za-z_$][\w$]*$/.test(token)){
  if(['let','var','const'].includes(prev))return'Tên biến "'+token+'" do người viết đặt.';
  if(['function','class'].includes(prev))return'Tên hàm/lớp "'+token+'" do người viết đặt.';
  if(prev==='.')return'Thuộc tính hoặc phương thức "'+token+'" của đối tượng trước dấu chấm.';
  if(next==='(')return'Tên hàm "'+token+'" được khai báo/gọi; ý nghĩa cụ thể tùy định nghĩa.';
  if(next===':')return'Tên khóa "'+token+'" trong object.';
  return'Tên "'+token+'" có thể là biến, tham số, hoặc thuộc tính; cần xem định nghĩa để biết chính xác.';
 }
 return'Ký hiệu "'+token.slice(0,45)+'", tùy ngữ cảnh có thể mang ý nghĩa riêng.';
}
function jsLine(code){
 const s=code.trim();const tokens=[...code.matchAll(tokenPattern)].map(m=>m[0]);
 const summary=!s?'Dòng trống để tách các phần code.':
 /^\s*(?:\/\/|\/\*|\*)/.test(s)?'Chú thích mô tả code, không chạy như câu lệnh.':
 /\bconsole\.(log|warn|error)\s*\(/.test(s)?'Gọi Console để in kết quả hoặc thông báo phục vụ gỡ lỗi.':
 /\b(?:const|let|var)\s+/.test(s)?'Khai báo biến để chứa dữ liệu hoặc kết quả.':
 /\bfunction\b/.test(s)?'Định nghĩa hàm có thể được gọi từ nơi khác.':
 /\b(?:if|else if)\s*\(/.test(s)?'Kiểm tra điều kiện để quyết định chạy khối lệnh.':
 /\belse\b/.test(s)?'Nhánh dự phòng nếu điều kiện trước không đúng.':
 /\bfor\s*\(/.test(s)?'Bắt đầu vòng lặp thực hiện một thao tác nhiều lần.':
 /\bwhile\s*\(/.test(s)?'Lặp khi điều kiện còn đúng.':
 /\breturn\b/.test(s)?'Trả giá trị từ hàm và kết thúc lượt chạy.':
 /\baddEventListener\s*\(/.test(s)?'Lắng nghe sự kiện của người dùng, ví dụ click.':
 /\bdocument\.(querySelector|getElementById)/.test(s)?'Truy cập một phần tử trên trang HTML (DOM).':
 /\b(?:import|export)\b/.test(s)?'Nhập hoặc xuất thành phần của module.':
 /^\s*[{};]+\s*$/.test(s)?'Mở/đóng khối code hoặc kết thúc câu lệnh.':
 'Dòng JavaScript thực hiện một phần công việc; đọc từng ký hiệu bên dưới.';
 return{summary,items:tokens.map((token,i)=>({token,why:jsDetail(token,tokens[i-1],tokens[i+1])}))};
}
const cssTokens=/(\/\*.*?\*\/|\/\/.*|#[a-fA-F0-9]{3,8}\b|\$[\w-]+|@[a-zA-Z-]+|--[\w-]+|-?\d+(?:\.\d+)?(?:px|rem|em|vh|vw|dvh|dvw|%|fr|s|ms)?|!important|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[a-zA-Z_-][\w-]*|[{}:;(),.#>+~[\]=*]|\S)/g;
function cssDetail(t,prev,next){
 if(t.startsWith('$'))return'Biến SCSS dùng lưu giá trị tái sử dụng.';
 if(/^#[a-f0-9]{3,8}$/i.test(t))return'Màu theo hệ thập lục phân, ví dụ #fff là trắng.';
 if(/^-?\d+(?:\.\d+)?(px|rem|em|%|vh|vw|dvh|dvw|fr|s|ms)$/.test(t)){
  const u=t.match(/[a-z%]+$/)[0];
  const unit={px:'pixel CSS',rem:'đơn vị dựa theo cỡ chữ gốc',em:'đơn vị dựa theo cỡ chữ tham chiếu','%':'phần trăm',vh:'chiều cao viewport',vw:'chiều rộng viewport',fr:'phần tỉ lệ trong Grid',s:'giây',ms:'mili giây'};
  return'Giá trị '+t+' (đơn vị '+(unit[u]||u)+').';
 }
 if(/^-?\d+(?:\.\d+)?$/.test(t))return'Giá trị số; ý nghĩa phụ thuộc thuộc tính CSS.';
 if(props[t])return'Thuộc tính CSS "'+t+'": '+props[t];
 if(values[t])return'Giá trị CSS: '+values[t];
 if(t===':')return'Phân tách tên thuộc tính và giá trị.';
 if(t===';')return'Kết thúc khai báo CSS.';
 if(t==='{')return'Mở khối quy tắc cho selector trước đó.';
 if(t==='}')return'Đóng khối quy tắc.';
 if(t==='.')return'Dấu chấm trước tên class của bộ chọn.';
 if(t==='#')return'Dấu # trước tên id của bộ chọn.';
 if(t==='>')return'Chọn phần tử con trực tiếp.';
 if(t===',')return'Ngăn cách selector hoặc giá trị.';
 if(t==='!important')return'Tăng ưu tiên khai báo CSS; nên dùng có cân nhắc.';
 if(t.startsWith('/*')||t.startsWith('//'))return'Chú thích, không tạo kiểu.';
 if(t.startsWith('@'))return t==='@media'?'Bắt đầu điều kiện kích thước/môi trường hiển thị.':t==='@mixin'?'Định nghĩa nhóm quy tắc SCSS tái sử dụng.':t==='@include'?'Chèn nội dung của mixin SCSS.':'Quy tắc bắt đầu bằng @ trong CSS/SCSS.';
 if(prev==='.'||prev==='#')return'Tên '+(prev==='.'?'class':'id')+' trong selector: '+t+'.';
 if(next===':')return'Tên thuộc tính/khóa "'+t+'" trong khai báo.';
 return'Từ "'+t+'" cần đọc cùng selector hoặc thuộc tính để xác định cụ thể.';
}
function cssLine(code){
 const s=code.trim(),t=[...code.matchAll(cssTokens)].map(x=>x[0]);
 const summary=!s?'Dòng trống phân tách các khối định dạng.':
 /^\/[/*]/.test(s)?'Chú thích trong CSS/SCSS.':
 /^\$[\w-]+\s*:/.test(s)?'Khai báo biến SCSS để tái sử dụng.':
 /^@(?:mixin|include|use|function|each|if)\b/.test(s)?'Lệnh SCSS mở rộng khả năng của CSS.':
 /^@media\b/.test(s)?'Quy tắc responsive chỉ áp dụng khi điều kiện thỏa.':
 /^[^{};]+:\s*[^;{}]+;?$/.test(s)?'Gán giá trị cho một thuộc tính CSS.':
 s.includes('{')?'Mở khối CSS cho selector phía trước.':
 s.includes('}')?'Đóng một khối CSS/SCSS.':'Một phần của bộ chọn hoặc giá trị CSS.';
 return{summary,items:t.map((token,i)=>({token,why:cssDetail(token,t[i-1],t[i+1])}))};
}
function htmlLine(code){
 const s=code.trim(),items=[],re=/(<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[A-Za-z][^>]*?>)/gi;
 if(!s)return{summary:'Dòng trống giúp bố cục HTML dễ đọc.',items:[]};
 let pos=0;
 for(const found of code.matchAll(re)){
  const outside=code.slice(pos,found.index).trim();
  if(outside)items.push({token:outside,why:'Văn bản hiển thị giữa các thẻ (nếu không nằm trong script/style).'});
  const raw=found[0];
  if(/^<!--/.test(raw))items.push({token:raw,why:'Chú thích HTML không xuất hiện trong nội dung trang.'});
  else if(/^<!doctype/i.test(raw))items.push({token:raw,why:'Khai báo sử dụng chuẩn HTML5.'});
  else{
   const t=/^<(\/?)([\w:-]+)/.exec(raw);
   if(t){
    const name=t[2].toLowerCase(),closing=!!t[1];
    items.push({token:'<'+(closing?'/':'')+t[2]+'>',why:(closing?'Đóng':'Mở')+' thẻ '+t[2]+'. '+(tags[name]||'Thẻ HTML; tác dụng chi tiết phụ thuộc bối cảnh.')});
    if(!closing){
     const rest=raw.slice(t[0].length).replace(/\/?>$/,'');
     const reAttr=/([:@a-zA-Z_][\w:.-]*)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>\x60]+))?/g;
     for(const a of rest.matchAll(reAttr)){
      const key=a[1].toLowerCase();
      items.push({token:a[1],why:attrs[key]||(/^data-/.test(key)?'Thuộc tính dữ liệu riêng dành cho JavaScript.':'Thuộc tính của thẻ; cần xem tài liệu/thư viện để hiểu chính xác.')});
      if(a[2]!==undefined)items.push({token:a[2],why:'Giá trị dành cho thuộc tính '+a[1]+'.'});
     }
    }
   }
  }
  pos=found.index+raw.length;
 }
 const tail=code.slice(pos).trim();
 if(tail)items.push({token:tail,why:'Nội dung văn bản hoặc phần còn lại của đoạn HTML.'});
 if(!items.length)items.push({token:s,why:'Một phần nội dung/thẻ HTML; có thể thẻ đang trải qua nhiều dòng.'});
 return{summary:/^<!--/.test(s)?'Chú thích HTML.':/^<!doctype/i.test(s)?'Khai báo HTML5.':/^<\//.test(s)?'Đóng một phần tử HTML.':/^</.test(s)?'Tạo phần tử HTML, có thể kèm thuộc tính.':'Nội dung văn bản hoặc một phần thẻ HTML.',items};
}
function jsonLine(code){
 const t=[...code.matchAll(/"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b|[{}[\]:,]|\S/g)].map(x=>x[0]);
 return{summary:/^\s*"[^"]+"\s*:/.test(code)?'Khai báo cặp tên thuộc tính và giá trị JSON.':/[{[]/.test(code)?'Bắt đầu object hoặc mảng JSON.':/[}\]]/.test(code)?'Kết thúc object hoặc mảng JSON.':'Dữ liệu hoặc ký hiệu trong file JSON.',
 items:t.map((token,i)=>({token,why:token.startsWith('"')?(t[i+1]===':'?'Tên khóa (key) trong object JSON.':'Giá trị chuỗi JSON.'):/^-?\d/.test(token)?'Giá trị số JSON.':token==='null'?'Giá trị rỗng (null).':token==='true'||token==='false'?'Giá trị Boolean đúng/sai.':({':':'Tách khóa và giá trị.',',':'Ngăn cách các phần tử.','{':'Mở object.','}':'Đóng object.','[':'Mở mảng.',']':'Đóng mảng.'}[token]||'Ký hiệu JSON.')}))};
}
function detect(source,filename=''){
 const ext=filename.toLowerCase().split('.').pop();
 if(['html','htm'].includes(ext))return'html';
 if(['css','scss','sass','json'].includes(ext))return ext==='sass'?'scss':ext;
 if(['js','mjs','cjs','jsx','ts','tsx'].includes(ext))return'js';
 const s=source.trim();
 if(/^<!doctype html|^<(html|main|div|h[1-6]|button|form|script|style)\b/i.test(s))return'html';
 try{if(/^[\[{]/.test(s)){JSON.parse(s);return'json'}}catch{}
 if(/^\$[\w-]+\s*:|@mixin\b/.test(s))return'scss';
 if(/[.#]?[a-z-]+\s*\{[^}]{0,180}(?:color|display|margin|padding)\s*:/.test(s))return'css';
 return'js';
}
function explain(source,language='auto',filename=''){
 if(typeof source!=='string')throw Error('Mã nguồn phải là văn bản.');
 const text=source.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n'),lines=text.split('\n');
 if(!text.trim())throw Error('Hãy dán mã nguồn hoặc tải lên một file.');
 if(text.length>110000||lines.length>700)throw Error('Giới hạn một lần: 110.000 ký tự hoặc 700 dòng. Hãy chia file lớn thành các phần nhỏ để tránh treo điện thoại.');
 const lang=language==='auto'?detect(text,filename):language;
 if(!['html','css','scss','js','json'].includes(lang))throw Error('Ngôn ngữ chưa được hỗ trợ.');
 let inner=null,total=0,nonblank=0;
 const result=lines.map((code,i)=>{
  let mode=lang;
  if(lang==='html'){
   if(/<script\b/i.test(code))inner='js';
   if(/<style\b/i.test(code))inner='css';
   if(/<\/(?:style|script)\s*>/i.test(code)){mode='html';inner=null;}
   else if(/<\s*(?:script|style)\b/i.test(code))mode='html';
   else if(inner)mode=inner;
  }
  const info=mode==='html'?htmlLine(code):mode==='css'||mode==='scss'?cssLine(code):mode==='json'?jsonLine(code):jsLine(code);
  total+=info.items.length;
  if(code.trim())nonblank++;
  return{number:i+1,code,language:mode,summary:info.summary,items:info.items};
 });
 return{language:lang,filename:filename||'',overview:{
  html:'HTML định nghĩa cấu trúc và nội dung của trang: thẻ tạo phần tử, thuộc tính bổ sung thông tin.',
  css:'CSS dùng các bộ chọn, thuộc tính và giá trị để quyết định kiểu hiển thị.',
  scss:'SCSS bổ sung biến, lồng nhau, mixin; cần biên dịch thành CSS để dùng trong trình duyệt.',
  js:'JavaScript điều khiển dữ liệu và hành vi của trang qua biến, hàm, toán tử và sự kiện.',
  json:'JSON mô tả dữ liệu gồm các object, mảng, chuỗi, số, Boolean và null.'
 }[lang],lineCount:lines.length,nonblank,tokenCount:total,lines:result,
 note:'Đây là giải thích tự động dựa trên quy tắc, không phải AI tạo sinh; code không được chạy hoặc gửi lên mạng. Tên biến và logic dài có thể cần xem nhiều dòng cùng lúc, nên công cụ không đảm bảo hiểu đúng mọi trường hợp.'};
}
window.WebLabCodeExplainer={explain,detect,limits:{chars:110000,lines:700}};
})();