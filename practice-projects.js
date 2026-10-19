/* Dự án liên môn để luyện trực tiếp tại Web Lab. */
(() => {
  'use strict';
  const projects = [
    {
      slug:'profile', title:'01 · Trang giới thiệu cá nhân', level:'Dễ', summary:'Ghép tiêu đề, đoạn văn, danh sách, liên kết và CSS để làm một trang giới thiệu.',
      html:'<main class="profile">\n  <h1>Xin chào! Mình là...</h1>\n  <!-- TODO: thêm đoạn giới thiệu, danh sách sở thích và liên kết -->\n</main>',
      css:'.profile { padding: 24px; }\n/* TODO: thêm background và màu chữ */', js:'',
      goals:[['html','<p','Có đoạn văn giới thiệu'],['html','<ul','Có danh sách sở thích'],['html','<a','Có liên kết'],['css','background','Có màu nền CSS']]
    },
    {
      slug:'contact', title:'02 · Biểu mẫu liên hệ', level:'Dễ', summary:'Kết hợp form, label, input, button và các thuộc tính để tạo biểu mẫu dễ sử dụng.',
      html:'<main>\n  <h2>Gửi lời nhắn</h2>\n  <form>\n    <!-- TODO: thêm label, input email, textarea và button -->\n  </form>\n</main>',
      css:'form { display: grid; gap: 12px; max-width: 390px; }\n/* TODO: thiết kế input và button */', js:'',
      goals:[['html','<label','Có nhãn cho ô nhập'],['html','type="email"','Có input email'],['html','<textarea','Có textarea'],['html','<button','Có nút gửi']]
    },
    {
      slug:'cards', title:'03 · Danh sách thẻ sản phẩm', level:'Trung bình', summary:'Thực hành HTML semantic, CSS Flexbox/Grid và giao diện responsive.',
      html:'<section class="products">\n  <h2>Sản phẩm nổi bật</h2>\n  <div class="product-grid">\n    <!-- TODO: thêm ít nhất 3 article sản phẩm -->\n  </div>\n</section>',
      css:'.product-grid { /* TODO: grid hoặc flex */ }\n/* TODO: thêm media query cho điện thoại */',js:'',
      goals:[['html','<article','Có thẻ sản phẩm article'],['css','display: grid','Dùng CSS Grid'],['css','grid-template-columns','Định nghĩa các cột'],['css','@media','Có CSS responsive']]
    },
    {
      slug:'scss', title:'04 · Component với SCSS', level:'Trung bình', summary:'Kết hợp biến $color, selector lồng nhau, mixin và HTML.',
      html:'<section class="feature">\n  <h2>Component của mình</h2>\n  <button class="feature-btn">Bắt đầu</button>\n</section>',
      css:'', scss:'$primary: #7653d8;\n/* TODO: thêm mixin, @include và selector lồng nhau */',js:'',
      goals:[['scss','$primary','Có khai báo biến SCSS'],['scss','@mixin','Có mixin SCSS'],['scss','@include','Có sử dụng mixin'],['scss','&:hover','Có trạng thái hover lồng nhau']]
    },
    {
      slug:'counter', title:'05 · Bộ đếm tương tác', level:'Trung bình', summary:'Thực hành querySelector, addEventListener và thay đổi DOM khi bấm nút.',
      html:'<main>\n  <h2>Bộ đếm</h2>\n  <p id="count">0</p>\n  <button id="increase">Tăng +1</button>\n  <!-- TODO: thêm nút giảm -->\n</main>',
      css:'button { padding: 10px 16px; margin: 5px; border-radius: 8px; }',
      js:'let count = 0;\n// TODO: bắt sự kiện click và cập nhật #count',
      goals:[['html','id="decrease"','Có nút giảm với id decrease'],['js','addEventListener','Dùng sự kiện addEventListener'],['js','textContent','Cập nhật nội dung DOM'],['js','count++','Có phép tăng bộ đếm']]
    },
    {
      slug:'todo', title:'06 · Ứng dụng danh sách việc làm', level:'Khá', summary:'Kết hợp form, mảng JavaScript, DOM, CSS và sự kiện để tạo Todo App.',
      html:'<main class="todo">\n  <h2>Công việc hôm nay</h2>\n  <form id="todoForm">\n    <input id="newTask" placeholder="Nhập việc cần làm">\n    <button>Thêm</button>\n  </form>\n  <ul id="taskList"></ul>\n</main>',
      css:'.todo { max-width: 440px; padding: 24px; }\n/* TODO: trang trí danh sách công việc */',
      js:'const tasks = [];\n// TODO: lắng nghe submit, lưu vào tasks rồi tạo li mới',
      goals:[['js','addEventListener','Bắt sự kiện thêm việc'],['js','preventDefault','Ngăn form tải lại trang'],['js','createElement','Tạo phần tử DOM mới'],['js','append','Gắn công việc vào danh sách']]
    },
    {
      slug:'quiz', title:'07 · Trò chơi trắc nghiệm mini', level:'Khá', summary:'Ghép button, lựa chọn, DOM, sự kiện click và hiển thị điểm số.',
      html:'<main class="quiz">\n  <h2>HTML có phải ngôn ngữ lập trình?</h2>\n  <button data-answer="yes">Đúng</button>\n  <button data-answer="no">Sai</button>\n  <p id="result" aria-live="polite"></p>\n</main>',
      css:'.quiz { padding: 24px; border-radius: 16px; }\n/* TODO: tô màu button và thêm :hover */',
      js:'// TODO: chọn các nút, kiểm tra data-answer và thông báo kết quả',
      goals:[['js','querySelectorAll','Chọn danh sách nút'],['js','addEventListener','Bắt sự kiện click'],['js','dataset','Đọc thuộc tính data-answer'],['js','textContent','Hiển thị đáp án']]
    },
    {
      slug:'landing', title:'08 · Landing page responsive', level:'Nâng cao', summary:'Dự án cuối: tạo trang có header, hero, 3 thẻ nội dung, bố cục responsive và nút tương tác.',
      html:'<header><nav>Web của mình</nav></header>\n<main>\n  <section class="hero"><h1>Chào mừng!</h1><button id="cta">Khám phá</button></section>\n  <section class="features"><!-- TODO: 3 article --></section>\n</main>\n<footer>© Web Lab</footer>',
      css:'.hero { padding: 24px; }\n/* TODO: Grid hoặc Flex, media query cho mobile */',
      js:'// TODO: thêm tương tác cho #cta',
      goals:[['html','<article','Có các thẻ nội dung'],['css','display: grid','Sử dụng CSS Grid'],['css','@media','Responsive theo màn hình'],['js','addEventListener','Nút CTA có sự kiện']]
    }
  ];
  for (const p of projects) window.HTML_LAB_DATA.LESSONS.push({
    id:'project:'+p.slug,kind:'web',name:'Bài tập tổng hợp · '+p.title,
    cat:'web-projects',summary:p.summary,syntax:'HTML + CSS + SCSS + JavaScript',
    html:p.html,css:p.css,scss:p.scss||'',js:p.js,
    tip:'Làm lần lượt các yêu cầu, nhấn Chạy thử rồi Kiểm tra bài tập. Bạn có thể dùng Gợi ý khi gặp khó khăn.',
    challenge:'Hoàn thành dự án '+p.title+' và kiểm tra từng yêu cầu bên dưới.',
    related:[],practice:{level:p.level,goals:p.goals}
  });
})();
