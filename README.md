# Web Lab 3.0 — HTML, CSS, SCSS, JavaScript và PWA cho iPhone

## Cách dùng

- **Chỉ muốn học ngay trên máy tính:** mở `Web-Lab-3-Mo-Ngay.html` bằng trình duyệt. Đây là bản **một file**, dùng offline, nhưng **không cài được như PWA** (vì không có service worker chạy qua HTTPS). SCSS có trình biên dịch cú pháp cơ bản offline.
- **Muốn biến trang thành app trên iPhone/Android:** giải nén `Web-Lab-3-PWA-GitHub-Pages.zip` rồi **tải tất cả tệp và ba file ảnh biểu tượng nằm BÊN TRONG zip vào THƯ MỤC GỐC repository** GitHub (cùng cấp với `index.html`). Không tải nguyên thư mục bao ngoài. Sau đó bật GitHub Pages.

## Lên GitHub Pages

1. Repository trên GitHub → **Add file → Upload files**; kéo các file: `index.html`, `style.css`, `html-data.js`, `extra-data.js`, `scss-data.js`, `scss-compiler.js`, `script.js`, `pwa.js`, `service-worker.js`, `manifest.webmanifest` và ba file ảnh biểu tượng. **Lưu ý:** Xóa hoặc thay thế các file cũ tương ứng, tránh 2 `index.html` ở hai thư mục khác nhau.
2. Commit changes vào nhánh `main`.
3. **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**.
4. Sau khi GitHub Pages xuất bản, mở URL dạng `https://username.github.io/ten-repository/`.
5. Trên **Safari iPhone**: mở URL → nút **Chia sẻ** → **Thêm vào Màn hình chính** → bật **Mở dưới dạng ứng dụng** (nếu hiện) → **Thêm**. App sẽ có icon Web Lab và mở ở chế độ riêng, không phải app gốc App Store.
6. Mở khi có mạng một lần và đợi tải đủ nội dung để các tệp cốt lõi được cache offline.

> Mở `index.html` bằng `file:///` không đăng ký service worker hoặc lưu offline kiểu PWA. GitHub Pages HTTPS là lựa chọn được hỗ trợ.

## Thực hành SCSS

1. Chọn bộ lọc SCSS hoặc `SCSS · Bắt đầu` ở sidebar.
2. Mở bài `SCSS là gì?`, chọn tab **SCSS**, chỉnh code và nhấn **Chạy thử**.
3. Mở phần **CSS được biên dịch từ SCSS** để xem kết quả; preview là CSS đã biên dịch + CSS từ tab CSS.
4. Offline, trình biên dịch **giản lược** hỗ trợ các ví dụ cơ bản: `$biến`, selector lồng nhau, `&:hover`, `@mixin/@include` đơn giản, `@media`. Đây không phải Dart Sass. Khi có Internet ứng dụng có thể tải **Sass.js (LibSass)** trên cdnjs (không tương thích cú pháp module mới như `@use`).
5. Để thực hành đầy đủ, cài Dart Sass trên máy tính với `npm install -D sass` rồi chạy `npx sass --watch scss/style.scss css/style.css`. Trình duyệt trực tiếp dùng file CSS, không chạy SCSS gốc.

## Tệp nguồn

- `index.html`, `style.css` — giao diện ứng dụng.
- `html-data.js` — kiến thức HTML ban đầu.
- `extra-data.js` — CSS, JavaScript, công cụ và dự án Web.
- `scss-data.js`, `scss-compiler.js` — bài học và biên dịch SCSS (có giới hạn).
- `script.js` — bộ lọc, trình chỉnh sửa, chạy thử và tiến độ học.
- `manifest.webmanifest` và ba file biểu tượng — tên và icon ứng dụng PWA.
- `pwa.js`, `service-worker.js` — hướng dẫn cài và lưu tệp cần thiết để xem offline.

## Lưu ý

- Ứng dụng dùng `localStorage` để lưu tiến độ và code theo trình duyệt / app đã cài; không đồng bộ giữa thiết bị.
- Các bài có code JavaScript được chạy trong iframe sandbox riêng. API mạng phụ thuộc quyền và CORS.
- Trên iOS, hành vi PWA phụ thuộc phiên bản iOS/Safari. Không có tệp `.ipa` và không cần App Store.
- Khi cập nhật PWA trên GitHub Pages, một số người dùng có thể cần đóng mở lại ứng dụng hoặc tải lại trang để nhận phiên bản mới.
