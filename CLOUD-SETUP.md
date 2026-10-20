# Bật đăng nhập và đồng bộ đám mây cho Web Lab

GitHub Pages chỉ phục vụ HTML/CSS/JavaScript tĩnh. **Phải có dự án Supabase** để đăng ký/đăng nhập và lưu tiến độ giữa các thiết bị. Khi chưa cấu hình, Web Lab vẫn hoạt động offline và lưu tiến độ cục bộ như cũ.

1. Tạo dự án tại https://supabase.com/dashboard bằng tài khoản do bạn quản lý.
2. Mở **SQL Editor** của dự án, chạy toàn bộ nội dung file `supabase-setup.sql`. RLS bảo đảm mỗi tài khoản chỉ đọc/ghi hàng dữ liệu của mình. Đừng tắt RLS.
3. Trong **Authentication → Providers → Email**, bật đăng ký và xác nhận email theo nhu cầu (khuyến nghị bật xác nhận email). Thiết lập Site URL trỏ tới `https://khiem292.github.io/hoclaptrinhwweb/`. Đăng nhập bằng email + mật khẩu; không sử dụng mật khẩu GitHub.
4. Trong **Project Settings / Connect / API Keys**, lấy **Project URL** (`https://...supabase.co`) và **Publishable key** (`sb_publishable_...`, hoặc legacy anon key). Điền hai giá trị đó vào `cloud-config.js` trong repository GitHub và commit. Không đưa API secret key, service_role hoặc mật khẩu vào GitHub!
5. Đợi GitHub Pages deploy thành công, mở Web Lab rồi chọn **☁ Tài khoản** để đăng ký hoặc đăng nhập. Đăng nhập cùng tài khoản trên máy khác và nhấn **Đồng bộ ngay** để kéo tiến độ.

**Dữ liệu đồng bộ:** bài đã học, dấu yêu thích, bài tập đã hoàn thành, nháp code HTML/CSS/SCSS/JS. Khi đăng nhập, tiến độ đã lưu trên thiết bị sẽ được kết hợp với bản trên đám mây. Nháp trùng tên bài ưu tiên bản sửa có thời điểm mới hơn; nếu chưa có dấu thời gian, ưu tiên bản đám mây. Khi làm xong, Web Lab tự lưu với độ trễ ngắn; nút Đồng bộ ngay buộc lưu/đọc mới nhất.

**Lưu ý:** Tiến độ không tự đồng bộ nếu mạng bị mất, tài khoản chưa đăng nhập, hoặc dự án Supabase chưa được cấu hình. Đăng xuất không xóa dữ liệu lưu offline trên máy hiện tại; trên máy công cộng cần xóa dữ liệu website sau khi đăng xuất. Quyền truy cập được kiểm soát bằng Supabase Auth và Row Level Security. Những tài khoản dùng chung thiết bị nên đăng xuất sau khi học. Dữ liệu này được gửi tới dự án Supabase của chủ website, vì vậy cần cung cấp thông báo quyền riêng tư phù hợp cho người học.

**Bảo mật:** Dự án cần HTTPS, RLS và xác nhận email. Tuyệt đối không dùng service_role hay secret key trên frontend. Có thể bật CAPTCHA hoặc giới hạn đăng ký trong phần Supabase Auth. 
