
(()=>{
'use strict';
const TRACKS=[{"id":"advanced","title":"HTML & CSS nâng cao","subtitle":"Semantic, accessibility, CSS hiện đại và responsive","icon":"🎨","entries":[["Cấu trúc semantic","Viết một trang có điều hướng và nội dung rõ ràng","<main><!-- Header, navigation và article -->\n</main>","","","",[["html","<nav","Thêm điều hướng nav"],["html","<article","Thêm nội dung article"]]],["Bảng dữ liệu","Lập bảng HTML dễ đọc","<main><!-- Tạo bảng trong đây --></main>","","","",[["html","<table","Tạo bảng table"],["html","<th","Thêm ô tiêu đề th"],["html","<td","Thêm ô dữ liệu td"]]],["Form dễ tiếp cận","Kết hợp label, input và thuộc tính bắt buộc","<main><!-- Tạo form có nhãn rõ ràng --></main>","","","",[["html","<label","Viết nhãn label"],["html","<input","Viết input"],["html","required","Thêm required"]]],["Hình ảnh tối ưu","Mô tả và tối ưu ảnh cho người dùng","<main><!-- Thêm ảnh minh họa --></main>","","","",[["html","<img","Thêm ảnh img"],["html","alt=","Viết văn bản thay thế alt"]]],["CSS pseudo-class","Tạo hiệu ứng cho nút khi rê chuột","<button class=\"action\">Thử nút</button>","/* Viết hover, transition */","","",[["css",":hover","Tạo trạng thái hover"],["css","transition:","Chuyển đổi hiệu ứng mềm mại"]]],["Thiết kế thẻ đẹp","Kết hợp shadow, border radius và padding","<article class=\"card\">Sản phẩm mới</article>","/* Trang trí card */","","",[["css","border-radius:","Bo góc card"],["css","box-shadow:","Tạo bóng đổ"],["css","padding:","Thêm khoảng đệm"]]],["Flex nâng cao","Căn giữa nhiều thành phần","<div class=\"toolbar\"><button>A</button><button>B</button></div>","/* Căn giữa toolbar */","","",[["css","display:flex","Bật Flexbox"],["css","justify-content:","Căn theo trục chính"],["css","align-items:","Căn theo trục phụ"]]],["Grid nâng cao","Tạo các cột thích ứng","<div class=\"gallery\"><div>1</div><div>2</div><div>3</div></div>","/* Grid tự thích ứng */","","",[["css","display:grid","Bật Grid"],["css","minmax(","Dùng minmax cho cột"]]],["Responsive thực hành","Điều chỉnh giao diện cho điện thoại","<main class=\"layout\"><section>Nội dung</section></main>","/* Thiết lập breakpoint và max-width */","","",[["css","@media","Thêm media query"],["css","max-width:","Hạn chế chiều rộng trang"]]],["Landing page HTML/CSS","Tổng hợp các phần trên thành landing page","<main><!-- Xây landing page --></main>","/* Thiết kế trang */","","",[["html","<header","Tạo header"],["html","<section","Tạo section"],["css","display:grid","Sắp xếp bằng Grid"]]]]},{"id":"javascript","title":"JavaScript từ cơ bản đến nâng cao","subtitle":"Biến, hàm, DOM, dữ liệu và lập trình bất đồng bộ","icon":"⚡","entries":[["Biến và dữ liệu","Tạo biến và hiển thị kết quả","<p>Xem Console bên dưới.</p>","","","// Khai báo biến ở đây",[["js","const ","Khai báo biến const"],["js","console.log","In kết quả ra Console"]]],["Hàm và return","Viết hàm tính toán đơn giản","<p>Xem Console.</p>","","","// Viết hàm",[["js","function ","Tạo function"],["js","return ","Trả kết quả bằng return"]]],["Điều kiện if","Thử kiểm tra một điều kiện","<p>Xem Console.</p>","","","// Tạo biến và kiểm tra điều kiện",[["js","if(","Sử dụng if"],["js","console.log","In thông báo"]]],["Mảng JavaScript","Duyệt một mảng danh sách","<p>Xem Console.</p>","","","// Tạo mảng",[["js","const ","Tạo biến dữ liệu"],["js","forEach(","Lặp phần tử với forEach"]]],["map và filter","Xử lý dữ liệu danh sách","<p>Xem Console.</p>","","","// Viết map và filter",[["js","map(","Biến đổi mảng bằng map"],["js","filter(","Lọc mảng bằng filter"]]],["Truy cập DOM","Tìm phần tử và đổi nội dung","<p id=\"message\">Thông báo</p>","","","// Truy cập DOM",[["js","querySelector(","Tìm phần tử"],["js","textContent","Thay đổi nội dung"]]],["Sự kiện form","Xử lý submit không tải lại trang","<form id=\"contact\"><input name=\"name\"><button>Gửi</button></form>","","","// Xử lý sự kiện submit",[["js","addEventListener","Lắng nghe submit"],["js","preventDefault(","Ngăn tải lại trang"]]],["DOM động","Tạo một mục mới từ JavaScript","<ul id=\"list\"></ul>","","","// Thêm phần tử li",[["js","createElement(","Tạo element"],["js","appendChild(","Chèn element"]]],["LocalStorage","Lưu và đọc dữ liệu","<input id=\"note\" placeholder=\"Nhập ghi chú\"><button id=\"save\">Lưu</button>","","","// Lưu vào trình duyệt",[["js","localStorage","Truy cập localStorage"],["js","setItem(","Lưu bằng setItem"]]],["Fetch API","Tìm hiểu yêu cầu mạng bất đồng bộ","<p>Xem Console. Yêu cầu mạng cần kết nối Internet.</p>","","","// Thử fetch với một API public",[["js","fetch(","Gửi yêu cầu fetch"],["js","await ","Chờ kết quả bằng await"]]]]},{"id":"scss","title":"SCSS & thiết kế giao diện","subtitle":"Biến Sass, nesting, mixin và xây dựng thư viện giao diện","icon":"💎","entries":[["Biến SCSS","Tái sử dụng màu với biến $primary","<div class=\"card\">SCSS</div>","","/* Đặt biến và dùng biến màu */","",[["scss","$primary:","Khai báo biến $primary"],["scss","color:$primary","Dùng biến trong thuộc tính color"]]],["Nesting","Viết selector lồng nhau","<div class=\"card\"><h2>Thẻ</h2></div>","","/* Style .card và h2 lồng trong */","",[["scss",".card","Tạo quy tắc .card"],["scss","h2","Thêm selector h2 bên trong"]]],["Pseudo selector &","Tạo trạng thái hover trong SCSS","<button class=\"btn\">Thử</button>","","/* Viết &:hover */","",[["scss","&:hover","Dùng ký hiệu & cho hover"],["scss","background:","Đặt màu nền"]]],["Mixin","Tạo mixin để tái sử dụng mã","<button class=\"btn\">Nút</button>","","/* Viết @mixin và @include */","",[["scss","@mixin","Khai báo mixin"],["scss","@include","Áp dụng mixin"]]],["Thiết kế nút","Phối hợp SCSS với HTML","<button class=\"btn\">Xác nhận</button>","","/* Thiết kế button */","",[["scss","$primary:","Đặt màu chủ đạo"],["scss",".btn","Style nút .btn"]]],["SCSS & responsive","Sử dụng media query trong nesting","<section class=\"container\">Giao diện</section>","","/* @media trong selector */","",[["scss","@media","Tạo breakpoint"],["scss",".container","Thiết kế container"]]],["SCSS component card","Tạo thẻ nội dung có style riêng","<article class=\"card\">Sản phẩm</article>","","/* Card có padding và bo góc */","",[["scss",".card","Dùng selector .card"],["scss","padding:","Thêm padding"],["scss","border-radius:","Bo góc"]]],["Mini design system","Tổng hợp biến, mixin và component","<div class=\"card\"><button class=\"btn\">Mua hàng</button></div>","","/* Tạo token và mixin */","",[["scss","$primary:","Tạo biến màu"],["scss","@mixin","Tạo mixin"],["scss","@include","Sử dụng mixin"]]]]},{"id":"design","title":"Thiết kế UI/UX cho web","subtitle":"Typography, layout, animation và trải nghiệm thiết bị di động","icon":"🧩","entries":[["Typography","Tạo hệ chữ dễ đọc","<h1>Tiêu đề lớn</h1><p>Nội dung mẫu</p>","/* Định dạng font-size và line-height */","","",[["css","font-size:","Thiết lập kích thước chữ"],["css","line-height:","Thiết lập giãn dòng"]]],["Màu sắc","Tạo bảng màu giao diện","<div class=\"panel\">Màu sắc</div>","/* Đặt màu nền và màu chữ */","","",[["css","background-color:","Tạo nền"],["css","color:","Đổi màu chữ"]]],["Khoảng trắng","Thiết kế giao diện thoáng","<section class=\"section\">Nội dung</section>","/* Padding và margin */","","",[["css","padding:","Khoảng cách bên trong"],["css","margin:","Khoảng cách bên ngoài"]]],["Nút tương tác","Trạng thái hover và focus","<button class=\"btn\">Tiếp tục</button>","/* Hiệu ứng nút */","","",[["css",":hover","Trạng thái chuột"],["css",":focus-visible","Trạng thái bàn phím"]]],["Thẻ UI","Card hoàn chỉnh","<article class=\"card\"><h2>Card</h2></article>","/* Trang trí card */","","",[["css","border-radius:","Bo góc"],["css","box-shadow:","Đổ bóng"]]],["Menu linh hoạt","Thiết kế menu responsive","<nav class=\"menu\"><a>Trang chủ</a><a>Blog</a></nav>","/* Flex và responsive */","","",[["css","display:flex","Bố cục flex"],["css","@media","Tạo breakpoint"]]],["Animation nhẹ","Tạo hiệu ứng chuyển động","<div class=\"bubble\">Hiệu ứng</div>","/* Animation */","","",[["css","@keyframes","Định nghĩa chuyển động"],["css","animation:","Sử dụng animation"]]],["Dark mode cơ bản","Chuyển theme bằng JavaScript","<button id=\"toggle\">Đổi giao diện</button>","/* CSS cho theme */","","// Tạo sự kiện chuyển theme",[["css","background-color:","Thiết lập màu nền"],["js","addEventListener","Tạo sự kiện chuyển giao diện"]]]]},{"id":"projects","title":"Dự án thực chiến","subtitle":"Làm sản phẩm từ thiết kế đến tương tác chạy được","icon":"🚀","entries":[["Portfolio cá nhân","Trang giới thiệu có điều hướng và style","<main><!-- Portfolio -->\n</main>","/* Thiết kế portfolio */","","",[["html","<header","Header giới thiệu"],["html","<section","Nội dung từng mục"],["css","display:flex","Menu linh hoạt"]]],["Trang sản phẩm","Tạo lưới sản phẩm đẹp","<main><!-- Danh sách sản phẩm --></main>","/* CSS Grid */","","",[["html","<article","Tạo card sản phẩm"],["css","display:grid","Dùng Grid"]]],["Form liên hệ","Nhập và kiểm tra dữ liệu form","<form id=\"contact\"><input id=\"email\"><button>Gửi</button></form>","","","// Xử lý dữ liệu form",[["html","type=\"email\"","Nhập email đúng loại"],["js","addEventListener","Lắng nghe gửi form"],["js","preventDefault(","Ngăn tải lại"]]],["Todo list","Thêm công việc trực tiếp trên web","<input id=\"task\"><button id=\"add\">Thêm</button><ul id=\"tasks\"></ul>","","","// Viết chức năng thêm việc",[["js","addEventListener","Lắng nghe click"],["js","createElement(","Tạo item mới"],["js","appendChild(","Chèn item vào danh sách"]]],["Quiz trắc nghiệm","Tạo câu hỏi có nút kiểm tra","<h1>Câu hỏi</h1><button id=\"answer\">Trả lời</button><p id=\"result\"></p>","","","// Hiển thị kết quả",[["js","addEventListener","Xử lý nút trả lời"],["js","textContent","Hiện kết quả"]]],["Bộ đếm","Xây dựng bộ đếm tương tác","<button id=\"plus\">+</button><strong id=\"count\">0</strong>","","","// Tạo biến và cập nhật số",[["js","let ","Khai báo biến đếm"],["js","addEventListener","Sự kiện tăng số"],["js","textContent","Hiện số mới"]]],["Dashboard mini","Tạo giao diện số liệu","<main><!-- Thẻ chỉ số -->\n</main>","/* Grid số liệu */","","",[["html","<section","Thêm khu vực thống kê"],["css","display:grid","Bố cục Grid"],["css","gap:","Khoảng cách thẻ"]]],["Website hoàn chỉnh","Ghép HTML, CSS và JavaScript","<main><!-- Website cuối khóa -->\n</main>","/* Responsive */","","// Tương tác",[["html","<header","Header hoàn chỉnh"],["html","<form","Form"],["css","@media","Responsive"],["js","addEventListener","Tương tác"]]]]},{"id":"web","title":"Kỹ năng website hiện đại","subtitle":"SEO, hiệu năng, truy cập và bảo trì giao diện","icon":"🌐","entries":[["Metadata SEO","Cấu trúc tài liệu và mô tả trang","<!-- Viết meta description và title -->","","","",[["html","<title","Tạo tiêu đề trang"],["html","name=\"description\"","Viết mô tả SEO"]]],["Accessibility","Nút và ô nhập dễ tiếp cận","<main><!-- Nút có aria-label và label cho input --></main>","","","",[["html","aria-label","Đặt tên cho nút"],["html","<label","Đặt nhãn input"]]],["Media đa phương tiện","Thêm video với controls","<main><!-- Thêm video --></main>","","","",[["html","<video","Tạo video"],["html","controls","Hiển thị nút điều khiển"]]],["Tối ưu hình ảnh","Ảnh tải lười và có alt","<main><!-- Tạo ảnh tối ưu --></main>","","","",[["html","<img","Chèn hình"],["html","loading=\"lazy\"","Tải lười"],["html","alt=","Văn bản thay thế"]]],["Đo lường tương tác","Ghi log sự kiện người dùng","<button id=\"click\">Thử</button>","","","// Ghi lại tương tác",[["js","addEventListener","Lắng nghe click"],["js","console.log","Ghi log"]]],["URL và điều hướng","Đọc thông tin URL trong JS","<p>Mở Console</p>","","","// Phân tích URL",[["js","new URL","Tạo URL object"],["js","searchParams","Đọc tham số query"]]],["Lưu cấu hình","Lưu cài đặt trên trình duyệt","<button id=\"save\">Lưu</button>","","","// Lưu theme",[["js","localStorage","Truy cập LocalStorage"],["js","setItem(","Lưu cấu hình"]]],["Checklist hoàn thiện web","Tổng hợp semantic, responsive và tương tác","<main><!-- Trang kiểm thử -->\n</main>","/* CSS */","","// JavaScript",[["html","<main","Nội dung chính"],["css","@media","Responsive"],["js","addEventListener","Sự kiện tương tác"]]]]}];
const catalogue=window.HTML_LAB_DATA.LESSONS;
const existing=catalogue.filter(item=>item.kind==='roadmap'&&item.id.startsWith('roadmap:'));
existing.forEach(item=>{item.pathId='basics';item.pathTitle='Frontend từ A–Z';});
const basics={id:'basics',title:'Frontend từ A–Z',subtitle:'Nền tảng HTML, CSS, SCSS, JS và dự án cuối khóa',icon:'🏁',ids:existing.map(l=>l.id)};
const tracks=[basics];
for(const track of TRACKS){
  const ids=[];
  track.entries.forEach((row,index)=>{
    const id='path:'+track.id+':'+String(index+1).padStart(2,'0');
    ids.push(id);
    catalogue.push({
      id,kind:'roadmap',cat:'web-projects',pathId:track.id,pathTitle:track.title,
      name:String(index+1)+'. '+row[0],
      summary:row[1]+' — Bài '+String(index+1)+'/'+track.entries.length+' thuộc lộ trình '+track.title+'.',
      syntax:'Bài '+String(index+1)+'/'+track.entries.length+' · '+track.title,
      html:row[2],css:row[3],scss:row[4],js:row[5],
      tip:'Đọc phần Học trước khi làm, tự thực hành trong trình soạn thảo rồi nhấn Kiểm tra bài làm.',
      practice:{level:'BÀI '+String(index+1),goals:row[6]},
      related:[]
    });
  });
  tracks.push({id:track.id,title:track.title,subtitle:track.subtitle,icon:track.icon,ids});
}
const courseMap=new Map(catalogue.filter(x=>x.kind==='roadmap').map(x=>[x.id,x]));
const reading=[
 ['<h1','Thẻ h1 là tiêu đề quan trọng nhất của trang, thường dùng một lần cho chủ đề chính.','<h1>Học làm website</h1>'],
 ['<p','Thẻ p dùng viết đoạn văn.','<p>Đây là đoạn văn giới thiệu.</p>'],
 ['<header','header chứa phần đầu trang hoặc đầu một khu vực, như logo hay tiêu đề.','<header><h1>Trang cá nhân</h1></header>'],
 ['<section','section nhóm nội dung theo chủ đề, thường có tiêu đề.','<section><h2>Giới thiệu</h2><p>Nội dung</p></section>'],
 ['<nav','nav nhóm các liên kết điều hướng.','<nav><a href="#about">Giới thiệu</a></nav>'],
 ['<article','article chứa nội dung độc lập như bài blog hoặc thẻ sản phẩm.','<article><h2>Bài viết</h2></article>'],
 ['<a','a tạo liên kết. Thuộc tính href chứa địa chỉ đích.','<a href="https://example.com">Xem thêm</a>'],
 ['<img','img hiển thị hình ảnh; src là đường dẫn và alt mô tả ảnh cho người không nhìn thấy.','<img src="hinh.jpg" alt="Ảnh minh họa">'],
 ['<form','form chứa các trường nhập thông tin, thường kết hợp label và button.','<form><label>Email<input type="email"></label><button>Gửi</button></form>'],
 ['<input','input tạo ô nhập dữ liệu; type quyết định kiểu nhập.','<input type="text" placeholder="Tên của bạn">'],
 ['<button','button tạo nút tương tác, ví dụ gửi form hoặc chạy JavaScript.','<button type="button">Nhấn thử</button>'],
 ['<label','label cho biết ô nhập dùng để làm gì; for nên trùng với id của input.','<label for="email">Email</label><input id="email">'],
 ['required','required buộc người dùng nhập dữ liệu trước khi gửi form HTML.','<input required>'],
 ['<table','table trình bày dữ liệu dạng hàng và cột, không dùng để chia bố cục web.','<table><tr><th>Tên</th><td>Lan</td></tr></table>'],
 ['<th','th là ô tiêu đề của bảng.','<th>Họ tên</th>'],
 ['<td','td là ô dữ liệu bình thường trong bảng.','<td>Nguyễn Văn A</td>'],
 ['alt=','alt là mô tả ngắn gọn cho ảnh, rất quan trọng với khả năng tiếp cận.','<img src="logo.png" alt="Logo công ty">'],
 ['aria-label','aria-label đặt tên dễ tiếp cận cho nút hoặc thành phần chưa có văn bản hiển thị.','<button aria-label="Đóng">×</button>'],
 ['type="email"','type=email bật kiểm tra định dạng email cơ bản trong trình duyệt.','<input type="email" name="email">'],
 ['loading="lazy"','loading=lazy hoãn tải ảnh ngoài vùng đang xem, giúp tăng tốc trang dài.','<img src="photo.jpg" loading="lazy" alt="Ảnh">'],
 ['<video','video nhúng video; nên có controls để người xem tự điều khiển.','<video controls src="demo.mp4"></video>'],
 ['controls','controls hiển thị thanh phát/tạm dừng của video hoặc audio.','<video controls src="video.mp4"></video>'],
 ['<title','title xuất hiện trên tab trình duyệt và có ích cho SEO.','<head><title>Web cá nhân</title></head>'],
 ['name="description"','meta description tóm tắt nội dung trang cho công cụ tìm kiếm.','<meta name="description" content="Blog học HTML và CSS">'],
 ['<main','main là vùng nội dung chính, nên chỉ có một main đang hiển thị trên mỗi trang.','<main><h1>Nội dung chính</h1></main>'],
 ['color:','color thay đổi màu chữ của phần tử CSS.','h1 { color: #673ab7; }'],
 ['margin:','margin tạo khoảng trống phía ngoài viền của phần tử.','h1 { margin: 20px; }'],
 ['padding:','padding tạo khoảng trống bên trong viền của phần tử.','.card { padding: 16px; }'],
 ['border:','border vẽ viền quanh phần tử.','.card { border: 1px solid #ddd; }'],
 ['display:flex','display:flex sắp xếp phần tử con trên một trục, thường dùng cho hàng ngang.','.menu { display: flex; }'],
 ['display:grid','display:grid tạo bố cục theo hàng và cột.','.grid { display: grid; }'],
 ['gap:','gap tạo khoảng cách giữa các phần tử của Flexbox hoặc Grid.','.grid { gap: 16px; }'],
 ['grid-template-columns','grid-template-columns quy định số lượng và kích thước các cột.','.grid { grid-template-columns: repeat(2, 1fr); }'],
 ['minmax(','minmax xác định khoảng chiều rộng tối thiểu và tối đa của cột Grid.','.grid { grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); }'],
 ['@media','@media áp dụng CSS khi điều kiện màn hình đúng, rất cần cho responsive.','@media (max-width: 600px) { .card { width: 100%; } }'],
 ['max-width:','max-width giới hạn chiều rộng lớn nhất mà phần tử được phép có.','.container { max-width: 900px; }'],
 [':hover',':hover áp dụng CSS khi con trỏ chuột nằm trên phần tử.','button:hover { background: purple; }'],
 [':focus-visible',':focus-visible làm nổi bật phần tử khi được chọn bằng bàn phím.','button:focus-visible { outline: 2px solid blue; }'],
 ['transition:','transition giúp thay đổi thuộc tính CSS mượt hơn.','button { transition: background .2s; }'],
 ['border-radius:','border-radius bo tròn góc của phần tử.','.card { border-radius: 12px; }'],
 ['box-shadow:','box-shadow đổ bóng, tạo cảm giác nổi trên nền.','.card { box-shadow: 0 4px 12px #0002; }'],
 ['justify-content:','justify-content căn phần tử con trên trục chính của Flexbox.','.menu { justify-content: space-between; }'],
 ['align-items:','align-items căn phần tử con trên trục phụ của Flexbox.','.menu { align-items: center; }'],
 ['font-size:','font-size quy định kích thước chữ.','h1 { font-size: 28px; }'],
 ['line-height:','line-height quy định chiều cao mỗi dòng chữ.','p { line-height: 1.6; }'],
 ['background-color:','background-color đặt màu nền cho phần tử.','.panel { background-color: #f6f3ff; }'],
 ['@keyframes','@keyframes mô tả các bước trong một chuyển động CSS.','@keyframes fade { from { opacity: 0; } to { opacity: 1; } }'],
 ['animation:','animation gọi một bộ @keyframes để chạy chuyển động.','.box { animation: fade 1s; }'],
 ['$primary:','Biến SCSS bắt đầu bằng $. Gán màu một lần và sử dụng nhiều nơi.',' $primary: #6a4ad6;'],
 ['color:$primary','Dùng biến SCSS cho CSS: viết color: $primary; bên trong selector.','.card { color: $primary; }'],
 ['.card','Selector .card chọn phần tử có class="card" để trang trí.','.card { padding: 20px; }'],
 ['.btn','Selector .btn chọn nút có class="btn".','.btn { background: purple; }'],
 ['.container','Selector .container chọn phần tử có class="container".','.container { max-width: 960px; }'],
 ['h2','h2 là tiêu đề cấp hai, phù hợp cho mục nhỏ hoặc card.','<h2>Thông tin</h2>'],
 ['&:hover','Trong SCSS, ký hiệu & chỉ selector cha. &:hover tương đương .btn:hover.','.btn { &:hover { background: violet; } }'],
 ['background:','background đặt màu nền hoặc hình nền.','.btn { background: purple; }'],
 ['@mixin','@mixin khai báo nhóm thuộc tính SCSS có thể tái sử dụng.','@mixin rounded { border-radius: 10px; }'],
 ['@include','@include chèn các thuộc tính được định nghĩa bởi mixin.','.card { @include rounded; }'],
 ['const ','const khai báo biến JavaScript không thể gán lại.','const name = "An";'],
 ['let ','let khai báo biến JavaScript có thể gán giá trị mới.','let count = 0;'],
 ['function ','function khai báo một hàm tái sử dụng.','function add(a,b) { return a+b; }'],
 ['return ','return trả một giá trị từ hàm.','return total;'],
 ['if(','if kiểm tra điều kiện. Khối lệnh chỉ chạy khi điều kiện đúng.','if (count > 0) { console.log(count); }'],
 ['console.log','console.log xuất dữ liệu trong khu vực Console để kiểm tra.','console.log("Xin chào");'],
 ['forEach(','forEach lặp qua từng phần tử mảng để thực hiện một hành động.','[1,2,3].forEach(x => console.log(x));'],
 ['map(','map tạo mảng mới bằng cách biến đổi mỗi phần tử.','[1,2].map(x => x*2);'],
 ['filter(','filter tạo mảng mới gồm các phần tử thỏa điều kiện.','[1,2,3].filter(x => x>1);'],
 ['getElementById','getElementById tìm phần tử theo thuộc tính id.','const node = document.getElementById("btn");'],
 ['querySelector(','querySelector chọn phần tử đầu tiên phù hợp selector CSS.','const title = document.querySelector("h1");'],
 ['addEventListener','addEventListener đăng ký xử lý sự kiện như click hoặc submit.','document.querySelector("button").addEventListener("click",()=>{});'],
 ['textContent','textContent đọc hoặc đổi văn bản hiển thị bên trong phần tử.','document.querySelector("p").textContent = "Đã cập nhật";'],
 ['localStorage','localStorage lưu dữ liệu dạng chuỗi ngay trên trình duyệt hiện tại.','localStorage.setItem("theme", "dark");'],
 ['setItem(','setItem(key,value) ghi một chuỗi vào localStorage.','localStorage.setItem("note","Xin chào");'],
 ['preventDefault(','preventDefault ngăn hành vi mặc định, ví dụ tải lại trang khi submit.','event.preventDefault();'],
 ['createElement(','createElement tạo phần tử DOM mới bằng JavaScript.','const li=document.createElement("li");'],
 ['appendChild(','appendChild đưa một phần tử con vào cuối phần tử cha.','document.querySelector("ul").appendChild(li);'],
 ['fetch(','fetch gửi yêu cầu HTTP, trả về Promise. Phụ thuộc Internet và CORS.','const response=await fetch("https://example.com/data.json");'],
 ['await ','await đợi một Promise hoàn thành trong hàm async hoặc module.','const response=await fetch(url);'],
 ['searchParams','URLSearchParams giúp đọc tham số từ URL.','new URL(location.href).searchParams.get("q");'],
 ['new URL','new URL biến một chuỗi địa chỉ thành đối tượng để phân tích.','const url=new URL("https://example.com?q=html");']
];
const DOCS=Object.fromEntries(reading.map(row=>[row[0],{why:row[1],example:row[2].trim()}]));
const TOPIC={
 basics:'Thực hiện từng mục tiêu nhỏ của bài; ví dụ HTML căn bản yêu cầu tiêu đề và đoạn văn.',
 advanced:'Chọn đúng ngữ nghĩa thẻ HTML và dùng CSS để tạo giao diện dễ đọc, dễ dùng.',
 javascript:'Kết hợp JavaScript với HTML; chú ý xem khung Kết quả và Console.',
 scss:'SCSS là ngôn ngữ mở rộng CSS, phải biên dịch mới hiển thị. Bộ biên dịch offline hỗ trợ cú pháp cơ bản.',
 design:'Tập trung vào giao diện dễ đọc, khoảng cách hợp lý và trải nghiệm đa thiết bị.',
 projects:'Tự tạo chức năng hoàn chỉnh bằng HTML, CSS và JavaScript.',
 web:'Tập trung khả năng tiếp cận, hiệu năng và cách vận hành website thực tế.'
};
for(const item of courseMap.values()){
 const topics=item.practice.goals.map(([tab,key,label])=>({
   tab,key,title:label,
   why:(DOCS[key]&&DOCS[key].why)||('Đây là thành phần '+key+' trong '+tab.toUpperCase()+'. Viết đúng cú pháp trong tab '+tab.toUpperCase()+' để thực hiện yêu cầu.'),
   example:(DOCS[key]&&DOCS[key].example)||((tab==='html')?key+' ...':tab==='js'?'// Ví dụ sử dụng '+key:key+' ...')
 }));
 item.guide={intro:TOPIC[item.pathId]||TOPIC.basics,topics};
}
let selected='basics';
const progressKey='webLab:practiceV4';
const stored=()=>{try{return JSON.parse(localStorage.getItem(progressKey)||'{}')||{}}catch{return {}}};
const passed=(item,progress)=>item.practice.goals.every((_,i)=>(progress[item.id]||[]).includes('goal-'+i));
const pathFor=(id)=>tracks.find(t=>t.ids.includes(id));
const escaped=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function unlockedId(id){
 const track=pathFor(id);if(!track)return true;
 const index=track.ids.indexOf(id);if(index<=0)return true;
 const progress=stored();
 return track.ids.slice(0,index).every(entry=>passed(courseMap.get(entry),progress));
}
function nextId(id){
 const track=pathFor(id);if(!track)return null;
 return track.ids[track.ids.indexOf(id)+1]||null;
}
function render(){
 const root=document.getElementById('roadmapStepsV5'), tabs=document.getElementById('roadmapTracksV6');
 if(!root||!tabs)return;
 const coursePath=tracks.find(t=>t.id===selected)||tracks[0], progress=stored();
 tabs.innerHTML=tracks.map(track=>{
   const done=track.ids.filter(id=>passed(courseMap.get(id),progress)).length;
   return '<button type="button" class="learning-track'+(track.id===selected?' active':'')+'" data-path="'+escaped(track.id)+'" aria-pressed="'+(track.id===selected)+'"><strong>'+escaped(track.icon+' '+track.title)+'</strong><small>'+done+'/'+track.ids.length+' bài đã xong</small></button>';
 }).join('');
 document.getElementById('roadmapProgressV5').textContent=coursePath.icon+' '+coursePath.title+' • '+coursePath.ids.filter(id=>passed(courseMap.get(id),progress)).length+'/'+coursePath.ids.length+' bài hoàn thành';
 const about=document.getElementById('roadmapAboutV6');if(about)about.textContent=coursePath.subtitle;
 root.innerHTML=coursePath.ids.map((id,index)=>{
   const item=courseMap.get(id),complete=passed(item,progress),open=unlockedId(id);
   return '<button type="button" class="roadmap-card-v5'+(complete?' done':'')+'" data-course="'+escaped(id)+'"'+(open?'':' disabled')+'><b>'+(complete?'✓':open?index+1:'🔒')+'</b><span><strong>'+escaped(item.name)+'</strong><small>'+(complete?'Đã hoàn thành':open?'Đọc hướng dẫn và làm bài thực hành':'Hoàn thành bài trước trong cùng lộ trình')+'</small></span></button>';
 }).join('');
 tabs.querySelectorAll('[data-path]').forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.path;render();}));
 root.querySelectorAll('[data-course]').forEach(btn=>btn.addEventListener('click',()=>{
   document.getElementById('roadmapDialog').close();
   window.WEB_LAB_NAVIGATE?.(btn.dataset.course);
   document.getElementById('detailPanel')?.scrollIntoView({behavior:'smooth',block:'start'});
 }));
}
function showPath(id){const path=pathFor(id);if(path)selected=path.id;render();}
window.WebLabCourse={
 tracks,lessons:[...courseMap.values()],isCourse:id=>courseMap.has(id),
 unlockedId,nextId,render,showPath,
 get activePath(){return selected;}
};
document.addEventListener('DOMContentLoaded',()=>{
 document.getElementById('roadmapBtn')?.addEventListener('click',()=>setTimeout(render,0));
 render();
});
window.addEventListener('weblab:practice-passed',render);
})();