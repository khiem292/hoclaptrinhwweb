# Web Lab AI — hướng dẫn kích hoạt

Web Lab 11.0 đã có giao diện **✦ Hỏi AI** để người học hỏi trực tiếp về HTML, CSS, SCSS, JavaScript và bài hiện tại.

## Kiến trúc

- GitHub Pages: `ai-tutor.js` hiển thị hội thoại, gửi câu hỏi lên Supabase Edge Function.
- Supabase Edge Function: `web-lab-ai`, chỉ nhận người dùng đã đăng nhập Web Lab Cloud qua JWT.
- PostgreSQL: `web_lab_ai_usage` và RPC `web_lab_ai_take_quota()` kiểm soát tối đa **12 yêu cầu/người/ngày** và khoảng cách **20 giây**.
- OpenAI API: mô hình mặc định `gpt-5.4-mini`, giới hạn đầu ra; `store:false`.
- Mã người học đang viết chỉ được gửi khi chủ động bật ô **Gửi kèm mã ở tab đang mở**. Lịch sử chat chỉ giữ trong bộ nhớ trang hiện tại.

## Kích hoạt nhà cung cấp AI (cần người quản trị có quyền)

Chủ dự án hoặc người quản trị dịch vụ AI cần có khóa API hợp lệ và quản lý hạn mức phí. **Không đặt khóa API trong GitHub hoặc mã JavaScript chạy trên trình duyệt, không chia sẻ qua tin nhắn hoặc ảnh chụp màn hình.**

1. Mở Supabase Dashboard của dự án `qgkkdsaxfcclxvgauich`.
2. Vào **Edge Functions > Secrets**: `https://supabase.com/dashboard/project/qgkkdsaxfcclxvgauich/functions/secrets`.
3. Thêm secret **Name**: `OPENAI_API_KEY`; **Value**: khóa API của nhà cung cấp OpenAI do người quản trị tạo, sau đó Save.
4. (Tuỳ chọn) Thêm `WEB_LAB_AI_MODEL` nếu muốn chọn mô hình khác được tài khoản OpenAI API hỗ trợ.
5. Mở `https://khiem292.github.io/hoclaptrinhwweb/`, đăng nhập Web Lab Cloud, mở **✦ Hỏi AI** và hỏi thử.

Nếu thiếu `OPENAI_API_KEY`, Edge Function trả thông báo **chưa kích hoạt**. Web Lab vẫn học và làm bài tập bình thường; không có mô hình giả tạo câu trả lời. Khóa API có thể phát sinh phí theo mức sử dụng và không đi kèm gói ChatGPT.

## Bảo mật và riêng tư

- Người dùng phải đăng nhập tài khoản Supabase thật.
- Edge Function bật `verify_jwt=true` và giới hạn nguồn truy cập GitHub Pages.
- Chỉ những câu hỏi người dùng chủ động gửi mới được chuyển tới nhà cung cấp mô hình AI.
- Không lưu lịch sử trò chuyện thành dữ liệu Web Lab; không nhập mật khẩu, token, thông tin nhạy cảm.
- Không được cung cấp khóa `service_role`/secret keys trong `cloud-config.js`.
- Nếu cần thay đổi quy định hạn mức, cập nhật đồng thời SQL RPC và thông báo ở giao diện.
