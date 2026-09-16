LẬP TRÌNH TRỰC TIẾP giao diện WEBSITE KHÁCH cho đề tài:

“Xây dựng nền tảng quản lý và điều phối dịch vụ giúp việc gia đình thông minh tích hợp trí tuệ nhân tạo”.

Đây là nền tảng ĐA DẠNG DỊCH VỤ GIA ĐÌNH, không chỉ tập trung vào vệ sinh nhà.

Ngôn ngữ : tiếng Việt

CÔNG NGHỆ:

* Next.js + ReactJS
* TypeScript
* Tailwind CSS
* Thiết kế đáp ứng cho máy tính, máy tính bảng và điện thoại
* Kiến trúc dựa trên thành phần
* Chuẩn bị để tích hợp API REST từ Spring Boot
* Dữ liệu mẫu tách riêng khỏi giao diện

MỤC TIÊU:
Chỉ xây dựng WEBSITE KHÁCH ở giai đoạn này.
Chưa lập trình giao diện quản trị.

Tuy nhiên phải tổ chức kiến trúc để sau này thêm Website Quản trị trong cùng kho mã nguồn mà không phải thay đổi kiến trúc lớn.

WEBSITE KHÁCH phục vụ:

* Khách chưa đăng nhập
* Khách xem thông tin dịch vụ
* Khách xem khuyến mãi
* Khách xem Staff
* Khách xem thông tin nền tảng
* Khách tìm hiểu và lựa chọn dịch vụ
* Khách được hướng dẫn tải ứng dụng để thực hiện Booking

KHÔNG xây dựng quy trình Booking và thanh toán thật trên Website Khách ở giai đoạn này.

---

## CẤU TRÚC ĐƯỜNG DẪN

WEBSITE KHÁCH:

/
/about
/services
/services/[serviceId]
/promotions
/cooperation
/cooperation/recruitment
/cooperation/staff
/download
/contact
/blog
/blog/[slug]
/faq
/terms
/privacy

CHỪA SẴN KIẾN TRÚC WEBSITE QUẢN TRỊ:

/admin
/admin/login
/admin/dashboard
/admin/staff
/admin/customers
/admin/services
/admin/bookings
/admin/orders
/admin/payments
/admin/promotions
/admin/statistics

Không lập trình giao diện Admin trong nhiệm vụ này.

---

## THANH ĐIỀU HƯỚNG

Không đưa toàn bộ chức năng lên thanh điều hướng.

Thiết kế thanh điều hướng gọn:

LOGO + “CleanMaster”

* Nhấn Logo hoặc CleanMaster → Trang chủ
* Giới thiệu
* Dịch vụ ▾
* Khuyến mãi
* Hợp tác ▾
* Blog ▾
* Hỗ trợ ▾
* Tải ứng dụng
* Nút nổi bật “Đặt dịch vụ”

Dịch vụ ▾:

* Vệ sinh nhà
* Vệ sinh thiết bị
* Chăm sóc trẻ em
* Chăm sóc người cao tuổi
* Việc nhà
* Giặt ủi
* Chăm sóc thú cưng
* Chăm sóc cây cảnh

Hợp tác ▾:

* Trở thành Staff
* Tuyển dụng
* Quy trình và quyền lợi

Blog ▾:

* Blog / Tin tức
* Mẹo chăm sóc gia đình
* Kiến thức gia đình

Hỗ trợ ▾:

* Câu hỏi thường gặp
* Liên hệ
* Chính sách và điều khoản

Thanh điều hướng cố định khi cuộn.
Menu xổ xuống có hiệu ứng nhẹ.
Trên điện thoại chuyển thành menu hamburger.
Menu con trên điện thoại sử dụng dạng mở rộng/thu gọn.

---

## PHẠM VI DỊCH VỤ

Nền tảng phải thể hiện đầy đủ các nhóm dịch vụ:

1. VỆ SINH NHÀ

* Vệ sinh nhà
* Tổng vệ sinh

2. VỆ SINH THIẾT BỊ

* Vệ sinh máy lạnh
* Bảo dưỡng máy lạnh
* Vệ sinh máy giặt
* Vệ sinh máy sấy
* Vệ sinh tủ lạnh

3. CHĂM SÓC TRẺ EM

* Chăm sóc trẻ em

4. CHĂM SÓC NGƯỜI CAO TUỔI

* Chăm sóc người cao tuổi

5. VIỆC NHÀ

* Nấu ăn gia đình
* Đi chợ hộ

6. GIẶT ỦI

* Giặt ủi

7. CHĂM SÓC THÚ CƯNG

* Chăm sóc thú cưng

8. CHĂM SÓC CÂY CẢNH

* Chăm sóc cây cảnh

Không dùng một mẫu thông tin giống nhau cho tất cả dịch vụ.

---

## TRANG CHỦ

Trang chủ phải thể hiện nền tảng đa dịch vụ gia đình.

1. PHẦN GIỚI THIỆU CHÍNH:

* Tiêu đề nổi bật
* Mô tả ngắn
* Hình ảnh minh họa
* Nút “Đặt dịch vụ”
* Nút “Tải ứng dụng”

2. THANH TÌM KIẾM DỊCH VỤ:
   Cho phép tìm kiếm dịch vụ theo tên.
   Ví dụ:
   “Vệ sinh máy lạnh”
   “Chăm sóc trẻ em”
   “Giặt ủi”

3. DANH MỤC DỊCH VỤ:
   Hiển thị các danh mục:

* Vệ sinh nhà
* Vệ sinh thiết bị
* Chăm sóc trẻ em
* Chăm sóc người cao tuổi
* Việc nhà
* Giặt ủi
* Chăm sóc thú cưng
* Chăm sóc cây cảnh

Mỗi danh mục có biểu tượng, hình ảnh và mô tả ngắn.

4. BANNER DỊCH VỤ NỔI BẬT:
   Hiển thị các dịch vụ hoặc chương trình nổi bật.

5. DỊCH VỤ PHỔ BIẾN:
   Hiển thị các dịch vụ có lượt sử dụng/quan tâm cao bằng dữ liệu mẫu.

6. DỊCH VỤ ĐỀ XUẤT:
   Hiển thị một số dịch vụ đề xuất dựa trên dữ liệu mẫu.

7. KHUYẾN MÃI:
   Hiển thị các chương trình khuyến mãi nổi bật.

8. GIỚI THIỆU NỀN TẢNG:

* Nền tảng kết nối Customer với Staff
* Staff được tuyển chọn và quản lý
* Hệ thống hỗ trợ điều phối
* AI hỗ trợ tư vấn dịch vụ

9. QUY TRÌNH:
   Chọn dịch vụ → Chọn Package → Chọn Add-on → Nhập thông tin dịch vụ → Chọn địa chỉ → Chọn thời gian → Chọn phương thức điều phối → Xác nhận Booking.

10. TẢI ỨNG DỤNG:

* Giới thiệu Mobile App
* Mã QR mẫu
* App Store mẫu
* Google Play mẫu

11. TRỞ THÀNH STAFF:

* Quyền lợi
* Điều kiện
* Quy trình tuyển chọn
* Nút đăng ký

12. BLOG / TIN TỨC

13. FAQ

14. NÚT AI ASSISTANT:
    Có nút nổi hoặc khu vực mở AI Assistant.
    AI hỗ trợ tư vấn lựa chọn dịch vụ.

AI không tự tạo Booking hoặc thanh toán.

15. CHÂN TRANG:

* Giới thiệu
* Dịch vụ
* Hợp tác
* Hỗ trợ
* Liên hệ
* Chính sách
* Mạng xã hội
* Bản quyền

---

## TRANG DỊCH VỤ

Trang dịch vụ phải hỗ trợ nhiều loại dịch vụ khác nhau.

Hiển thị:

* Danh mục
* Tên dịch vụ
* Hình ảnh
* Mô tả
* Package
* Giá mẫu
* Thời lượng
* Add-on
* Đánh giá
* Nút xem chi tiết

Có bộ lọc theo danh mục.

---

## TRANG CHI TIẾT DỊCH VỤ

KHÔNG sử dụng một biểu mẫu chung cho tất cả dịch vụ.

Thông tin và trường nhập phải thay đổi theo loại dịch vụ.

Ví dụ:

VỆ SINH MÁY LẠNH:

* Loại máy lạnh
* Số lượng máy
* Vị trí lắp đặt
* Có cần bảo dưỡng không

CHĂM SÓC TRẺ EM:

* Độ tuổi của trẻ
* Thời gian chăm sóc
* Yêu cầu đặc biệt
* Người liên hệ khẩn cấp

CHĂM SÓC NGƯỜI CAO TUỔI:

* Độ tuổi
* Mức độ hỗ trợ
* Thời gian chăm sóc
* Yêu cầu đặc biệt
* Người liên hệ khẩn cấp

GIẶT ỦI:

* Số lượng/quy mô
* Loại quần áo
* Yêu cầu đặc biệt

CHĂM SÓC THÚ CƯNG:

* Loại thú cưng
* Số lượng
* Thời gian chăm sóc
* Yêu cầu đặc biệt

CHĂM SÓC CÂY CẢNH:

* Số lượng cây
* Loại cây
* Tình trạng
* Yêu cầu chăm sóc

NẤU ĂN:

* Số người
* Loại bữa ăn
* Thời gian
* Yêu cầu về món ăn

Mỗi dịch vụ có thể có các trường dữ liệu riêng.

---

## LUỒNG BOOKING

Website chỉ mô phỏng/giới thiệu luồng, không thực hiện Booking thật.

Luồng nghiệp vụ:

1. Chọn nhóm dịch vụ
2. Chọn dịch vụ
3. Chọn Package
4. Chọn Add-on
5. Nhập thông tin riêng của dịch vụ
6. Chọn địa chỉ
7. Chọn ngày và giờ
8. Chọn phương thức điều phối
9. Chọn số lượng Staff
10. Áp dụng khuyến mãi
11. Xem tóm tắt Booking
12. Chọn phương thức thanh toán
13. Xác nhận Booking
14. Hiển thị kết quả

Có hai phương thức điều phối:

PHƯƠNG THỨC A — KHÁCH CHỌN STAFF:
Cho phép xem:

* Ảnh đại diện
* Tên
* Đánh giá
* Kinh nghiệm
* Khu vực hoạt động
* Các dịch vụ Staff có thể thực hiện
* Trạng thái hoạt động

PHƯƠNG THỨC B — HỆ THỐNG TỰ ĐỘNG ĐIỀU PHỐI:
Khách không cần chọn Staff.
Hệ thống tìm Staff dựa trên:

* Dịch vụ
* Khu vực
* Thời gian
* Năng lực
* Trạng thái hoạt động
* Số lượng Staff cần thiết

Trạng thái giao diện cần hỗ trợ:

* Đang tìm Staff
* Đã tìm thấy Staff
* Không tìm thấy Staff
* Staff từ chối
* Đang tìm Staff thay thế
* Booking đã được nhận

Không gán tất cả dịch vụ cho tất cả Staff.

Staff phải có danh sách kỹ năng/dịch vụ riêng.

---

## AI ASSISTANT

AI có thể:

* Phân tích nhu cầu bằng ngôn ngữ tự nhiên
* Đề xuất dịch vụ
* Đề xuất Package
* Đề xuất Add-on
* Đề xuất thời gian
* Hỗ trợ nhập thông tin Booking
* Trả lời câu hỏi thường gặp
* Giải thích giá
* Giải thích thời lượng

Ví dụ người dùng nhập:

“Tôi muốn vệ sinh 3 máy lạnh vào chiều thứ bảy.”

AI phải có khả năng phân tích thành:

* Dịch vụ: Vệ sinh máy lạnh
* Số lượng: 3 máy
* Thời gian: Chiều thứ bảy
* Package phù hợp
* Add-on nếu có

AI chỉ hỗ trợ tư vấn.

AI KHÔNG được tự ý:

* Tạo Booking
* Xác nhận Booking
* Thanh toán
* Hoàn tiền
* Thay đổi giá
* Phân phối tiền
* Đình chỉ Staff

Trước khi thực hiện Booking, Customer phải:

1. Xem tóm tắt
2. Chọn phương thức thanh toán
3. Chủ động xác nhận
4. Nhận kết quả

---

## DỮ LIỆU MẪU

Tạo dữ liệu mẫu đa dạng:

* Service
* Category
* ServicePackage
* AddOn
* Staff
* Customer
* Booking
* Promotion
* Notification
* Conversation
* Review

Staff phải có năng lực khác nhau.

Ví dụ:

* Staff chỉ vệ sinh nhà
* Staff chuyên vệ sinh máy lạnh
* Staff chuyên vệ sinh máy giặt
* Staff chuyên chăm sóc trẻ em
* Staff chuyên chăm sóc người cao tuổi
* Staff chuyên giặt ủi
* Staff chuyên chăm sóc thú cưng
* Staff chuyên chăm sóc cây cảnh

Một Staff có thể có nhiều kỹ năng nhưng không được mặc định có tất cả kỹ năng.

Staff phải có:

* Thông tin cơ bản
* Ảnh đại diện
* Kinh nghiệm
* Đánh giá
* Khu vực hoạt động
* Danh sách dịch vụ có thể thực hiện
* Trạng thái hoạt động

---

## HỢP TÁC / STAFF

Hiển thị:

* Cơ hội trở thành Staff
* Điều kiện
* Quyền lợi
* Quy trình tuyển chọn
* Các nhóm dịch vụ có thể cung cấp
* Biểu mẫu đăng ký

Staff KHÔNG tự tạo tài khoản ứng dụng.

Website chỉ tiếp nhận thông tin đăng ký.
Sau khi được công ty tuyển chọn, tài khoản Staff được tạo bởi quản trị viên.

---

## TRANG KHUYẾN MÃI

Hiển thị:

* Danh sách khuyến mãi
* Tên chương trình
* Mức giảm
* Thời gian áp dụng
* Điều kiện
* Trạng thái
* Chi tiết

---

## TRANG GIỚI THIỆU

Hiển thị:

* Về nền tảng
* Mục tiêu
* Giá trị
* Các nhóm dịch vụ
* Cách nền tảng hoạt động
* Customer
* Staff
* Admin
* AI
* Hệ thống điều phối

---

## TRANG BLOG

* Danh sách bài viết
* Danh mục
* Tìm kiếm
* Lọc
* Bài viết nổi bật
* Trang chi tiết bài viết
* Dữ liệu mẫu

---

## TRANG HỖ TRỢ

* FAQ
* Liên hệ
* Biểu mẫu liên hệ
* Hotline mẫu
* Email mẫu
* Địa chỉ mẫu
* Chính sách
* Điều khoản

---

## KIẾN TRÚC DỰ ÁN

src/
├── app/
│   ├── (guest)/
│   └── admin/
├── components/
│   ├── common/
│   ├── guest/
│   └── admin/
├── data/
├── types/
├── lib/
├── hooks/
├── services/
├── assets/
└── styles/

Website Khách và Website Quản trị phải có Layout và Navigation riêng.

Các thành phần dùng chung đặt trong common.

Không đưa logic quản trị vào Website Khách.

---

## KIỂU DỮ LIỆU

Tạo TypeScript types cho:

* Category
* Service
* ServicePackage
* AddOn
* ServiceRequirement
* Staff
* StaffSkill
* Customer
* Booking
* Promotion
* Notification
* Conversation
* Review

Thiết kế kiểu dữ liệu để sau này dễ ánh xạ với API Spring Boot.

Đặc biệt ServiceRequirement phải hỗ trợ thông tin khác nhau tùy loại dịch vụ.

---

## YÊU CẦU GIAO DIỆN

Thiết kế hiện đại, chuyên nghiệp, đáng tin cậy và thân thiện với gia đình.

Có thể tham khảo cách tổ chức nội dung và trải nghiệm người dùng của bTaskee nhưng:

* Không sao chép giao diện
* Không sao chép nội dung
* Không sao chép hình ảnh
* Không sao chép thương hiệu

Ưu tiên thiết kế nhận diện riêng cho CleanMaster.

Yêu cầu:

* Responsive
* Typography rõ ràng
* Khoảng trắng hợp lý
* Hệ thống màu sắc nhất quán
* Card nhất quán
* Nút hành động rõ ràng
* Animation nhẹ
* Accessibility cơ bản
* Loading state
* Empty state
* Error state
* Hover/focus state

---

## QUY ĐỊNH QUAN TRỌNG

Đây là WEBSITE KHÁCH.

Không lập trình Admin UI ở nhiệm vụ này.

Không tạo đăng nhập Customer trên Website Khách.

Không tạo Booking thật.

Không tạo thanh toán thật.

Không gọi API thật.

Không viết logic nghiệp vụ phía máy chủ.

Không hard-code logic backend.

Không giới hạn nền tảng chỉ ở dịch vụ vệ sinh nhà.

Phải thể hiện đầy đủ nền tảng đa dạng dịch vụ gia đình.

Không dùng một biểu mẫu giống nhau cho tất cả dịch vụ.

Không gán tất cả dịch vụ cho tất cả Staff.

Không cho AI tự ý tạo Booking hoặc thanh toán.

---

## SAU KHI HOÀN THÀNH

1. Kiểm tra toàn bộ đường dẫn Website Khách.
2. Kiểm tra thanh điều hướng và các menu xổ xuống.
3. Kiểm tra tất cả nhóm dịch vụ.
4. Kiểm tra giao diện chi tiết của nhiều loại dịch vụ.
5. Kiểm tra khả năng hiển thị khác nhau của biểu mẫu theo từng dịch vụ.
6. Kiểm tra dữ liệu Staff và kỹ năng Staff.
7. Kiểm tra giao diện AI Assistant.
8. Kiểm tra responsive trên máy tính, máy tính bảng và điện thoại.
9. Kiểm tra toàn bộ mã TypeScript.
10. Chạy lệnh xây dựng dự án và sửa toàn bộ lỗi.
11. Tạo README mô tả cấu trúc.
12. Giữ nguyên kiến trúc `/admin`.
13. Không tự chuyển sang lập trình Admin khi chưa được yêu cầu.
