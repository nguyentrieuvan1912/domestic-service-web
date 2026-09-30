LẬP TRÌNH TRỰC TIẾP giao diện WEBSITE KHÁCH cho đề tài:

“Xây dựng nền tảng quản lý và điều phối dịch vụ giúp việc gia đình thông minh tích hợp trí tuệ nhân tạo”.

Đây là nền tảng ĐA DẠNG DỊCH VỤ GIA ĐÌNH, không chỉ tập trung vào vệ sinh nhà.

Ngôn ngữ : tiếng Việt

CÔNG NGHỆ:

* Next.js + ReactJS
* TypeScript
* Tailwind CSS
* Responsive cho desktop, tablet, mobile
* Component-based architecture
* Chuẩn bị tích hợp REST API từ Spring Boot
* Dữ liệu mẫu tách riêng khỏi giao diện

MỤC TIÊU:

Chỉ xây dựng WEBSITE KHÁCH ở giai đoạn này.
Chưa lập trình giao diện quản trị.

Tuy nhiên phải tổ chức kiến trúc để sau này thêm Website Quản trị trong cùng kho mã nguồn mà không phải thay đổi kiến trúc lớn.

WEBSITE KHÁCH phục vụ:

* Khách chưa đăng nhập
* Xem thông tin dịch vụ
* Xem khuyến mãi
* Xem Staff
* Xem thông tin nền tảng
* Tìm hiểu và lựa chọn dịch vụ
* Được hướng dẫn tải ứng dụng để thực hiện Booking

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

Không lập trình giao diện Admin trong nhiệm vụ hiện tại.

Tuy nhiên kiến trúc Admin phải được chuẩn bị sẵn để sau này mở rộng, đặc biệt là module quản lý tuyển dụng Staff.

---

## THANH ĐIỀU HƯỚNG

Không đưa toàn bộ chức năng lên thanh điều hướng.

Thiết kế:

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
Trên điện thoại chuyển thành hamburger.
Menu con trên điện thoại sử dụng dạng mở rộng/thu gọn.

---

## PHẠM VI DỊCH VỤ

Nền tảng phải thể hiện đầy đủ:

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

* Vệ sinh máy lạnh
* Chăm sóc trẻ em
* Giặt ủi

3. DANH MỤC DỊCH VỤ:

* Vệ sinh nhà
* Vệ sinh thiết bị
* Chăm sóc trẻ em
* Chăm sóc người cao tuổi
* Việc nhà
* Giặt ủi
* Chăm sóc thú cưng
* Chăm sóc cây cảnh

Mỗi danh mục có biểu tượng, hình ảnh và mô tả ngắn.

4. BANNER DỊCH VỤ NỔI BẬT

5. DỊCH VỤ PHỔ BIẾN

6. DỊCH VỤ ĐỀ XUẤT

7. KHUYẾN MÃI

8. GIỚI THIỆU NỀN TẢNG:

* Kết nối Customer với Staff
* Staff được tuyển chọn và quản lý
* Hệ thống hỗ trợ điều phối
* AI hỗ trợ tư vấn dịch vụ

9. QUY TRÌNH:

Chọn dịch vụ → Chọn Package → Chọn Add-on → Nhập thông tin dịch vụ → Chọn địa chỉ → Chọn thời gian → Chọn phương thức điều phối → Xác nhận Booking.

10. TẢI ỨNG DỤNG:

* Giới thiệu Mobile App
* QR mẫu
* App Store mẫu
* Google Play mẫu

11. TRỞ THÀNH STAFF:

* Quyền lợi
* Điều kiện
* Quy trình tuyển chọn
* Nút đăng ký

12. BLOG / TIN TỨC

13. FAQ

14. AI ASSISTANT:

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

VÍ DỤ:

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

Luồng:

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

* Ảnh đại diện
* Tên
* Đánh giá
* Kinh nghiệm
* Khu vực hoạt động
* Các dịch vụ Staff có thể thực hiện
* Trạng thái hoạt động

PHƯƠNG THỨC B — HỆ THỐNG TỰ ĐỘNG ĐIỀU PHỐI:

Hệ thống tìm Staff dựa trên:

* Dịch vụ
* Khu vực
* Thời gian
* Năng lực
* Trạng thái hoạt động
* Số lượng Staff cần thiết

Trạng thái:

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
* Trả lời FAQ
* Giải thích giá
* Giải thích thời lượng

Ví dụ:

“Tôi muốn vệ sinh 3 máy lạnh vào chiều thứ bảy.”

AI phân tích:

* Dịch vụ: Vệ sinh máy lạnh
* Số lượng: 3 máy
* Thời gian: Chiều thứ bảy
* Package phù hợp
* Add-on nếu có

AI chỉ hỗ trợ tư vấn.

AI KHÔNG được:

* Tạo Booking
* Xác nhận Booking
* Thanh toán
* Hoàn tiền
* Thay đổi giá
* Phân phối tiền
* Đình chỉ Staff

Trước khi Booking:

1. Xem tóm tắt
2. Chọn phương thức thanh toán
3. Chủ động xác nhận
4. Nhận kết quả

---

## DỮ LIỆU MẪU

Tạo dữ liệu mẫu:

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

Staff có năng lực khác nhau.

Ví dụ:

* Chỉ vệ sinh nhà
* Chuyên vệ sinh máy lạnh
* Chuyên vệ sinh máy giặt
* Chuyên chăm sóc trẻ em
* Chuyên chăm sóc người cao tuổi
* Chuyên giặt ủi
* Chuyên chăm sóc thú cưng
* Chuyên chăm sóc cây cảnh

Một Staff có thể có nhiều kỹ năng nhưng không mặc định có tất cả kỹ năng.

Staff có:

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

Form đăng ký phải hỗ trợ đăng ký NHIỀU DỊCH VỤ cùng lúc.

Ví dụ:

☐ Dọn nhà
☐ Tổng vệ sinh
☐ Vệ sinh máy lạnh
☐ Chăm sóc trẻ em
☐ Chăm sóc người cao tuổi
☐ Giặt ủi
☐ Chăm sóc thú cưng
☐ Chăm sóc cây cảnh

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
* Trang chi tiết
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

# PHẠM VI WEBSITE QUẢN TRỊ SAU NÀY

KHÔNG lập trình UI Admin ở giai đoạn hiện tại.

Tuy nhiên phải chuẩn bị kiến trúc để Admin sau này quản lý Staff và quy trình tuyển chọn theo mô hình sau.

## 1. LUỒNG DỮ LIỆU ĐẦU VÀO — NGUỒN ỨNG VIÊN

Ứng viên có thể đến từ:

* Website
* Google Forms
* Zalo
* Đi ngang qua
* Nguồn khác nếu cần mở rộng

Tất cả dữ liệu ứng viên mới phải đổ vào trạng thái riêng:

CHỜ DUYỆT — Pending

Admin kiểm tra thông tin tại cột CHỜ DUYỆT trước khi quyết định tiếp nhận.

Không đưa ứng viên mới trực tiếp vào các hồ sơ đang xử lý.

Hồ sơ ứng viên phải hỗ trợ các trường:

* Họ tên
* Số điện thoại
* Email
* Số CCCD
* Năm sinh
* Giới tính
* Khu vực sống
* Nguồn ứng viên
* Danh sách dịch vụ đăng ký
* Ngày đăng ký
* Ghi chú

Nguồn ứng viên:

* Web
* Google Forms
* Zalo
* Đi ngang qua

ĐĂNG KÝ ĐA DỊCH VỤ:

Ứng viên có thể chọn nhiều dịch vụ cùng lúc.

Không giới hạn mỗi ứng viên chỉ được chọn một dịch vụ.

Dữ liệu phải được thiết kế dạng danh sách kỹ năng/dịch vụ, không hard-code một trường service duy nhất.

---

## 2. QUẢN LÝ KANBAN TUYỂN DỤNG STAFF

Admin sau này sử dụng Kanban gồm đúng 4 cột:

1. CHỜ DUYỆT
2. ĐANG TIẾP NHẬN
3. ĐÀO TẠO
4. ĐÁNH GIÁ

Luồng:

CHỜ DUYỆT → ĐANG TIẾP NHẬN → ĐÀO TẠO → ĐÁNH GIÁ

Có thanh tìm kiếm:

* Tìm theo tên
* Tìm theo số điện thoại

Mỗi Candidate Card hiển thị tối thiểu:

* Họ tên
* Số điện thoại
* Khu vực
* Nguồn
* Dịch vụ đăng ký
* Ngày đăng ký
* Trạng thái

Không tạo thêm các cột Kanban nghiệp vụ khác nếu chưa được yêu cầu.

---

## 3. MODAL HỒ SƠ ỨNG VIÊN

Không sử dụng Progress Stepper 1-2-3.

Modal sử dụng:

* Badge trạng thái nhỏ ở phía trên
* Nội dung Form chiếm phần lớn diện tích
* Các section rõ ràng
* Nút thao tác phù hợp với trạng thái hiện tại

Không dùng Progress Stepper để tránh chiếm diện tích.

---

## 4. GIAI ĐOẠN CHỜ DUYỆT

Admin xem và kiểm tra:

* Thông tin cá nhân
* CCCD
* Email
* Số điện thoại
* Năm sinh
* Giới tính
* Khu vực sống
* Nguồn ứng viên
* Dịch vụ đăng ký
* Ghi chú

Admin có thể:

* Tiếp nhận
* Từ chối
* Xem chi tiết

Khi chọn “Tiếp nhận”:

CHỜ DUYỆT → ĐANG TIẾP NHẬN

Không tạo bước trung gian khác.

---

## 5. GIAI ĐOẠN ĐANG TIẾP NHẬN

KHÔNG có chức năng hẹn lịch.

Mô hình văn phòng mở: ứng viên đến là tiếp nhận và xử lý hồ sơ.

Form chỉ tập trung vào checklist giấy tờ:

* ☐ CCCD
* ☐ Hộ khẩu
* ☐ Giấy khám sức khỏe

Có trường:

* Nhận xét
* Ghi chú Admin

Khi hoàn tất tiếp nhận:

ĐANG TIẾP NHẬN → ĐÀO TẠO

---

## 6. GIAI ĐOẠN ĐÀO TẠO

Không cho Admin nhập tài khoản/mật khẩu thủ công.

Không tạo nhiều nút thao tác gây nhầm lẫn.

Chỉ có một thao tác chính:

“Hoàn tất Đào tạo & Cấp tài khoản”

Khi Admin thực hiện:

1. Hệ thống xác nhận hoàn tất đào tạo.
2. Sinh tài khoản Staff.
3. Gán các dịch vụ/kỹ năng đã được duyệt.
4. Giả lập gửi thông tin tài khoản qua Email.
5. Cập nhật trạng thái ứng viên.
6. Chuyển hồ sơ sang ĐÁNH GIÁ.

Luồng:

ĐÀO TẠO → ĐÁNH GIÁ

Không cho Admin nhập mật khẩu thủ công trong UI.

Không tạo nhiều nút cấp tài khoản riêng biệt.

---

## 7. GIAI ĐOẠN ĐÁNH GIÁ

Không cho Admin nhập lương thủ công.

Admin chỉ chọn Cấp bậc:

* Thực tập sinh
* Tiêu chuẩn
* Chuyên nghiệp

Hệ thống tự động ánh xạ cấp bậc với mức phí/lương tương ứng.

Hiển thị mức phí/lương dưới dạng READ-ONLY.

Ví dụ:

Cấp bậc:
[ Tiêu chuẩn ▼ ]

Mức phí/lương:
[ 45.000 VNĐ/giờ ]

Admin không thể sửa trực tiếp mức phí/lương tại Form đánh giá.

Mức phí/lương phải được thiết kế dưới dạng cấu hình/dữ liệu để sau này Backend có thể quản lý.

---

## 8. STAFF SAU KHI ĐƯỢC DUYỆT

Sau khi hoàn thành quy trình tuyển chọn, dữ liệu ứng viên có thể trở thành hồ sơ Staff.

Staff phải có:

* Thông tin cá nhân
* Email
* Số điện thoại
* CCCD
* Năm sinh
* Giới tính
* Khu vực sống
* Ảnh đại diện
* Kinh nghiệm
* Cấp bậc
* Mức phí/lương
* Danh sách kỹ năng
* Danh sách dịch vụ có thể thực hiện
* Khu vực hoạt động
* Trạng thái hoạt động
* Đánh giá

Danh sách dịch vụ của Staff được kế thừa từ năng lực/dịch vụ đã được duyệt.

Không tự động gán toàn bộ dịch vụ cho Staff.

---

## 9. KIẾN TRÚC ADMIN SAU NÀY

Admin phải có Layout và Navigation riêng với Website Khách.

Các module dự kiến:

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

Module Staff sau này có thể mở rộng:

/admin/staff
/admin/staff/candidates
/admin/staff/active
/admin/staff/recruitment

Không triển khai các màn hình trên ở giai đoạn hiện tại.

---

## KIẾN TRÚC DỰ ÁN

src/
├── app/
│ ├── (guest)/
│ └── admin/
├── components/
│ ├── common/
│ ├── guest/
│ └── admin/
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

Kiến trúc phải cho phép phát triển Admin sau này mà không ảnh hưởng lớn đến Guest.

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

Bổ sung các type phục vụ tuyển dụng Staff:

* Candidate
* CandidateSource
* CandidateStatus
* RecruitmentStage
* RecruitmentDocument
* StaffLevel
* StaffSalaryConfig

Candidate phải hỗ trợ:

* Thông tin cá nhân
* Nguồn ứng viên
* Danh sách dịch vụ đăng ký
* Trạng thái tuyển dụng
* Giấy tờ
* Nhận xét
* Thông tin đào tạo
* Cấp bậc

CandidateStatus phải hỗ trợ tối thiểu:

* PENDING
* RECEIVING
* TRAINING
* EVALUATION

CandidateSource:

* WEB
* GOOGLE_FORMS
* ZALO
* WALK_IN

StaffLevel:

* INTERN
* STANDARD
* PROFESSIONAL

ServiceRequirement phải hỗ trợ thông tin khác nhau tùy loại dịch vụ.

Thiết kế TypeScript types để sau này dễ ánh xạ với REST API Spring Boot.

---

## YÊU CẦU GIAO DIỆN

Thiết kế hiện đại, chuyên nghiệp, đáng tin cậy và thân thiện với gia đình.

Có thể tham khảo cách tổ chức nội dung và UX của các nền tảng dịch vụ gia đình nhưng:

* Không sao chép giao diện
* Không sao chép nội dung
* Không sao chép hình ảnh
* Không sao chép thương hiệu

Ưu tiên nhận diện riêng cho CleanMaster.

Yêu cầu:

* Responsive
* Typography rõ ràng
* Khoảng trắng hợp lý
* Hệ thống màu nhất quán
* Card nhất quán
* CTA rõ ràng
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

Phần Admin chỉ được chuẩn bị kiến trúc, TypeScript types và cấu trúc thư mục cần thiết.

KHÔNG tự động triển khai Admin UI.

---

## SAU KHI HOÀN THÀNH

1. Kiểm tra toàn bộ đường dẫn Website Khách.
2. Kiểm tra thanh điều hướng và menu xổ xuống.
3. Kiểm tra tất cả nhóm dịch vụ.
4. Kiểm tra giao diện chi tiết nhiều loại dịch vụ.
5. Kiểm tra form thay đổi theo từng dịch vụ.
6. Kiểm tra dữ liệu Staff và kỹ năng Staff.
7. Kiểm tra giao diện AI Assistant.
8. Kiểm tra responsive desktop/tablet/mobile.
9. Kiểm tra toàn bộ TypeScript.
10. Chạy lệnh build và sửa toàn bộ lỗi.
11. Tạo README mô tả cấu trúc.
12. Giữ nguyên kiến trúc /admin.
13. Không tự chuyển sang lập trình Admin.
14. Đảm bảo kiến trúc Admin sau này hỗ trợ luồng tuyển dụng:
    CHỜ DUYỆT → ĐANG TIẾP NHẬN → ĐÀO TẠO → ĐÁNH GIÁ.
15. Đảm bảo Candidate hỗ trợ đa dịch vụ và nhiều nguồn ứng viên.
16. Đảm bảo Staff có danh sách kỹ năng riêng.
17. Đảm bảo cấp bậc Staff có thể ánh xạ tự động với mức phí/lương.
18. Không để các logic tuyển dụng Admin làm ảnh hưởng đến Website Khách.
