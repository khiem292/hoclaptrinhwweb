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

## Web Lab 16.0 — Trợ lý miễn phí không cần khóa API

Web Lab nay có 2 chế độ trong hộp thoại **✦ Hỏi AI**:

1. **📗 Trợ lý miễn phí (mặc định):** Hoạt động trực tiếp trên trình duyệt, dùng nội dung bài học hiện có và các quy tắc hỗ trợ; không cần đăng nhập, không cần API key, có thể chạy offline sau khi trang đã lưu cache. Hỗ trợ giải thích bài học, gợi ý làm bài, Big O, bài thực hành và phát hiện một số lỗi HTML/CSS/JS. **Đây không phải mô hình AI tạo sinh**, không có khả năng trả lời linh hoạt như ChatGPT.
2. **✦ OpenAI trực tuyến (tùy chọn):** Cần tài khoản Web Lab Cloud, Internet và khóa `OPENAI_API_KEY` **thật** do người quản trị dịch vụ OpenAI API quản lý. Khóa minh họa không hoạt động. Mọi vấn đề API 401 / 403 sẽ hiển thị trong hộp chat.

Người dùng chuyển chế độ bằng menu chọn ngay dưới tên bài học. Khi chuyển chế độ, Web Lab xóa nội dung trò chuyện của chế độ trước và bỏ chọn phân tích code để tránh gửi nhầm nội dung sang máy chủ.

Ở chế độ miễn phí, chỉ khi chọn **Phân tích code hiện tại** thì trợ lý mới đọc code bài đang mở. Việc phân tích này chạy trong trình duyệt và **không gửi code đi đâu**. Trình phân tích chỉ có các quy tắc tĩnh, không chạy JavaScript của người dùng. Trong chế độ OpenAI, ô chọn tương tự có nghĩa là đính kèm code trong yêu cầu gửi đến nhà cung cấp AI, nên người học cần tự kiểm tra nội dung trước khi gửi.

Các tệp chính:
- `local-tutor-v16.js`: bộ trợ lý học tập cục bộ, không có lệnh gọi network.
- `ai-tutor-v15.js`: hộp chat, chọn chế độ và nút gửi.
- `ai-tutor-v15.css`: giao diện trên máy tính và điện thoại.
- `release.json`, `service-worker.js`: ghi chú cập nhật và cache PWA.

**Không cần thay khóa Supabase không hợp lệ để dùng chế độ miễn phí.** Đừng cung cấp mật khẩu hoặc khóa API trong hội thoại.

## Web Lab 16.2 — API v2 được làm lại

Web Lab đã triển khai lại Supabase Edge Function `web-lab-ai` với cơ chế `status` và `ask`. `status` kiểm tra khóa và mô hình trước khi đếm lượt; không tạo câu trả lời hoặc trừ lượt học viên. Nếu máy chủ báo lỗi, giao diện hiển thị nút **📗 Dùng trợ lý miễn phí ngay →**. Trợ lý miễn phí không cần khóa và không sử dụng OpenAI.

Các lỗi API hiện phân biệt `not_configured`, `invalid_format` (khóa mẫu), `invalid_key` (OpenAI trả 401), `access_denied` (403), `model_unavailable` (404), `provider_quota` (429). Không trả lại khóa bí mật hay toàn bộ thông báo thô từ OpenAI. Giới hạn vẫn giữ **12 lượt/ngày/tài khoản**, cách nhau **20 giây**.

**Lưu ý:** Mã API không thể tự sinh khóa OpenAI hợp lệ. Chỉ chủ tài khoản API có quyền mới có thể quản lý khóa, quyền dự án và thanh toán. Nếu cần, hãy nhờ người giám hộ hỗ trợ. Không nhập chuỗi minh họa, không gửi khóa vào hội thoại hoặc đẩy lên GitHub.
