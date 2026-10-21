# Web Lab — chuẩn bị tích hợp Sign in with ChatGPT

**Trạng thái:** Chuẩn bị giao diện và kiến trúc, **CHƯA** có OAuth client được OpenAI phê duyệt. Nút "Đăng nhập với ChatGPT" chưa được kích hoạt. Web Lab vẫn có chế độ trợ lý miễn phí (trả lời theo bài học/quy tắc) và OpenAI API (cần khóa hợp lệ).

## 1. Chọn luồng đúng cho Web Lab

- Web Lab hiện là **website công khai**: `https://khiem292.github.io/hoclaptrinhwweb/`, lưu trữ tĩnh trên GitHub Pages và dùng Supabase để xác thực, đồng bộ.
- Theo tài liệu chính thức [Sign in with ChatGPT trên website](https://developers.openai.com/siwc/website), đăng nhập trên website đang dành cho các đối tác được chấp thuận. Chưa thể gọi OAuth thật nếu chưa có `client_id` và `redirect_uri` đã đăng ký.
- Theo [Sign in with ChatGPT mã nguồn mở](https://developers.openai.com/siwc/token-sharing-open-source/sign-in), cơ chế dùng gói ChatGPT dành cho ứng dụng cục bộ dùng callback `http://127.0.0.1:<port>/auth/callback` và lưu token trên thiết bị trong runtime được bảo vệ. **Không dùng luồng này thay thế callback website GitHub Pages, không đưa ChatGPT refresh/access token vào GitHub, Supabase hoặc localStorage của trình duyệt.**
- **Đăng nhập bằng ChatGPT** (OIDC: định danh tài khoản) và **dùng quota gói ChatGPT để tạo câu trả lời** là hai quyền khác nhau. Muốn dùng gói ChatGPT trong website cần phê duyệt riêng và scope phù hợp. Kết nối danh tính không tự cấp quyền AI hoặc khóa API.

## 2. Cần chủ dự án đăng ký

1. Đọc [website integration](https://developers.openai.com/siwc/website), [quickstart](https://developers.openai.com/siwc/quickstart) và [điều khoản tích hợp](https://openai.com/policies/sign-in-with-chatgpt-terms/).
2. Chủ dự án/đại diện được phép gửi [biểu mẫu quan tâm của OpenAI](https://openai.com/form/sign-in-with-chatgpt-interest/), mô tả Web Lab là nền tảng học lập trình, nêu rõ mong muốn **đăng nhập** và (nếu được cho phép) **ChatGPT plan usage**. Không giả vờ đã được phê duyệt và không khai sai thông tin đăng ký.
3. Chờ OpenAI cấp thông tin OAuth cho ứng dụng: `client_id` dạng `oaiapp_...`, danh sách `redirect_uri` được phép, scopes và phương thức xác thực token endpoint, các giới hạn về quyền sử dụng gói ChatGPT.
4. Nếu cần thiết lập thông tin tổ chức hoặc thanh toán, nhờ phụ huynh/người giám hộ hoặc người quản trị hợp lệ hỗ trợ. Không đưa bất cứ mật khẩu, khóa bí mật, cookie, mã xác thực hay access/refresh token nào vào chat.

## 3. Việc cần làm sau khi được cấp quyền

**Chỉ triển khai sau khi có cấu hình thật được OpenAI cấp.** GitHub Pages không có máy chủ xử lý OAuth callback, vì vậy dùng Supabase Edge Function (hoặc máy chủ riêng) cho các bước máy chủ sau:

- Tạo điểm bắt đầu `/auth/openai/start` với PKCE S256 + giá trị state, nonce ngẫu nhiên cho từng lần đăng nhập; lưu giao dịch có hạn và không lộ secret cho JavaScript phía trình duyệt.
- Dẫn người dùng đến authorization URL từ OpenID discovery. Yêu cầu phạm vi `openid profile email` cho định danh. **Không tự thêm scopes dùng ChatGPT plan trừ khi đã được cấp quyền và người dùng đồng ý riêng.**
- Xử lý callback qua URL **đã đăng ký chính xác**. Xác thực state, thời hạn, một lần sử dụng, sau đó đổi code bằng verifier từ cùng giao dịch trên backend.
- Kiểm tra chữ ký ID token theo JWKS; kiểm tra issuer, audience, nonce, exp và dùng `sub` làm định danh ổn định.
- Liên kết với Web Lab Cloud hiện tại **bằng bước xác nhận**. Không tự ghép hai tài khoản chỉ vì cùng email.
- Duy trì phiên Web Lab riêng bằng cookie `HttpOnly; Secure; SameSite=Lax` theo hướng dẫn OAuth. Giới hạn CORS/origin, thời hạn phiên, phòng CSRF và chặn lặp callback.
- Nếu được chấp thuận dùng gói ChatGPT, thực hiện luồng cấp scope/token tương ứng theo hợp đồng chính thức, không dùng tài khoản/chat session của người khác và không tạo các request dùng quota khi người dùng không cho phép.
- Kiểm thử callback lỗi, token giả, CSRF, account mix-up, lỗi refresh và các trường hợp từ chối quyền trước khi công bố nút đăng nhập.

**KHÔNG** phát minh `client_id`, `client_secret`, OAuth URL/callback chưa đăng ký; không sao chép token từ phiên đăng nhập chatgpt.com hoặc yêu cầu người dùng dán cookie.

## 4. Những gì đã sẵn sàng trong Web Lab

- Giao diện trong hộp **✦ Hỏi AI** có 3 lựa chọn: **Trợ lý miễn phí**, **OpenAI API**, **ChatGPT tài khoản (chờ cấp quyền)**.
- Chế độ ChatGPT chỉ hiển thị thông báo chính xác và liên kết tài liệu/biểu mẫu chính thức, không tự gửi code, không tạo session, không nhận mật khẩu và không giả mạo trang OAuth.
- Chế độ OpenAI API trước đây vẫn dùng Supabase Edge Function `web-lab-ai`, yêu cầu khóa thật trong secret `OPENAI_API_KEY`. Khóa API là giải pháp riêng, không phải Sign in with ChatGPT.
- Chế độ trợ lý miễn phí tiếp tục hoạt động cục bộ không cần khóa; 84 bài học, DSA, XP, đăng nhập Supabase và dữ liệu học tập không bị thay đổi.

## 5. Các liên kết

- [Quickstart](https://developers.openai.com/siwc/quickstart)
- [Tích hợp trên website](https://developers.openai.com/siwc/website)
- [OSS client và callback loopback](https://developers.openai.com/siwc/token-sharing-open-source/sign-in)
- [Biểu mẫu quan tâm của OpenAI](https://openai.com/form/sign-in-with-chatgpt-interest/)
- [Sign in with ChatGPT Terms](https://openai.com/policies/sign-in-with-chatgpt-terms/)

> Ghi chú: tài liệu này không phải giấy chấp thuận của OpenAI và chưa chứng minh Web Lab đủ điều kiện dùng gói ChatGPT trực tiếp trong website.
