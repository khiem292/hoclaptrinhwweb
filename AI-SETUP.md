# Web Lab 15.0 — Hỏi AI trong bài học

## Đã tích hợp

- Nút **✦ Hỏi AI** ở góc màn hình, không chiếm chỗ trên thanh công cụ iPhone.
- Gia sư tiếng Việt hỗ trợ HTML, CSS, SCSS, JavaScript và môn **Cấu trúc dữ liệu & Giải thuật (DSA)**.
- Tự nhận biết tên và mô tả bài học đang mở để giải thích đúng nội dung.
- Chỉ đính kèm mã nguồn nếu người học chủ động bật **Gửi kèm code** (mặc định TẮT).
- Hộp chat có gợi ý câu hỏi, nút xóa cuộc trò chuyện, hiển thị ví dụ code an toàn, hỗ trợ điện thoại.
- Xác thực bằng JWT của tài khoản Web Lab Cloud. Không có khóa API trong GitHub Pages.
- Supabase Edge Function `web-lab-ai` chạy API từ máy chủ với `store:false`, mặc định dùng `gpt-4.1-mini`.
- PostgreSQL RPC `web_lab_ai_take_quota()`: **12 lượt/tài khoản/ngày**, tối thiểu **20 giây giữa hai lượt**.

## Cần kích hoạt khóa API (bắt buộc để AI trả lời)

**Đã triển khai code không đồng nghĩa AI đã có khóa để hoạt động.** Người quản trị Web Lab cần tự quản lý tài khoản nhà cung cấp và chi phí API. ChatGPT Plus không bao gồm API credits. Nếu người quản trị chưa đủ tuổi để quản lý thanh toán, cần nhờ phụ huynh hoặc người giám hộ có quyền hỗ trợ.

1. Người quản trị mở [Supabase Edge Function Secrets](https://supabase.com/dashboard/project/qgkkdsaxfcclxvgauich/functions/secrets).
2. Thêm tên secret: `OPENAI_API_KEY`, giá trị là khóa API do **người quản trị** tạo và quản lý. **Không gửi khóa vào ChatGPT, không đưa lên GitHub hay mã phía trình duyệt.**
3. (Không bắt buộc) thêm `WEB_LAB_AI_MODEL` nếu muốn dùng mô hình OpenAI Responses API khác được tài khoản đó hỗ trợ. Mặc định `gpt-4.1-mini`.
4. Kiểm soát hạn mức chi tiêu API từ bảng điều khiển nhà cung cấp.
5. Mở [Web Lab 15.0](https://khiem292.github.io/hoclaptrinhwweb/?v=15.0), đăng nhập Web Lab Cloud và nhấn **✦ Hỏi AI**.
6. Nếu hiện thông báo **Gia sư AI chưa kích hoạt API key**, bước 2 chưa hoàn thành. Nếu hiện lỗi quota, hãy đợi 20 giây hoặc đến ngày hôm sau tùy thông báo.

## Kiến trúc và riêng tư

- Frontend: `ai-tutor-v15.js`, `ai-tutor-v15.css` và hộp thoại trong `index.html`.
- Backend: `supabase/functions/web-lab-ai/index.ts`, triển khai trong Supabase Edge Functions. `verify_jwt=true`.
- CSDL giới hạn: `public.web_lab_ai_usage` và `public.web_lab_ai_take_quota()`; không cho người dùng đọc/ghi trực tiếp bảng quota.
- Cuộc trò chuyện chỉ giữ tạm trong bộ nhớ trang Web Lab; không lưu vào bảng chat của Web Lab. Khi người học nhấn Gửi, yêu cầu và (nếu bật chọn) mã nguồn được gửi tới nhà cung cấp AI. Tránh nhập mã bí mật, mật khẩu và dữ liệu riêng tư.
- Không tự thực thi nội dung trả lời từ AI dưới dạng HTML hay JavaScript trên trang Web Lab.
- Chức năng học bài, chấm DSA, XP, lưu dự án và đăng nhập vẫn hoạt động ngay cả khi chưa có API key hoặc đang offline (riêng AI cần Internet).
- Nếu sau này dùng tên miền riêng, có thể cấu hình thêm origin hợp lệ bằng secret `WEB_LAB_ADDITIONAL_ORIGIN` trên Supabase (giá trị ví dụ `https://weblab.example.com`).

## Quy trình cập nhật

Khi thay đổi giao diện, tăng version script, `CACHE` trong `service-worker.js` và `release.json` để các thiết bị PWA nhận bản mới. Không xóa dữ liệu Safari để buộc làm mới vì code chưa đồng bộ có thể đang nằm trên máy.
