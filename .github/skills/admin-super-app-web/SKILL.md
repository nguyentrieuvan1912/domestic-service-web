---
name: admin-super-app-web
description: "Xây dựng và mở rộng Admin Web cho CleanMaster Super App bằng React, Vite, TypeScript và Tailwind CSS. Dùng khi tạo hoặc sửa AdminLayout, admin routes, dashboard, dịch vụ đa dạng, dynamic fields, phân quyền skills của staff, bookings, mock data và kiểm tra UI quản trị."
argument-hint: "Mô tả màn hình, route hoặc workflow Admin cần triển khai"
user-invocable: true
disable-model-invocation: false
---

# CleanMaster Admin Super App

## Mục tiêu

Xây dựng Website Quản trị độc lập cho nền tảng đa dịch vụ gia đình CleanMaster. Admin Web phục vụ quản lý dịch vụ, staff, booking và dữ liệu vận hành; không dùng chung layout trình bày với Guest Web và không gọi API thật trong giai đoạn mock UI.

## Khi sử dụng

- Tạo hoặc sửa `/admin/login`, `/admin/dashboard`, `/admin/services`, `/admin/staff` hoặc `/admin/bookings`.
- Bổ sung nhóm dịch vụ mới như vệ sinh nhà, máy lạnh, chăm sóc trẻ em, người cao tuổi, thú cưng, đi chợ và việc nhà.
- Thiết kế form dynamic fields theo từng loại dịch vụ.
- Quản lý skill/service permissions, trạng thái xác minh và trạng thái hoạt động của staff.
- Hiển thị booking có dữ liệu chi tiết khác nhau, chế độ Manual/Auto và trạng thái điều phối phức tạp.

## Quy trình

### 1. Xác nhận phạm vi và kiến trúc

1. Đọc `package.json`, `src/App.tsx`, stylesheet chính và các component/data liên quan trước khi sửa.
2. Xác định router hiện tại đang dùng; giữ nguyên router và pattern component của repository nếu đã có.
3. Tách nhánh `/admin/*` khỏi Guest Web. Admin dùng `src/layouts/AdminLayout.tsx`; không import `Header`, `Footer` hoặc `GuestLayout` vào Admin.
4. Giữ dữ liệu mock trong `src/data/` hoặc module mock gần feature, tách khỏi JSX khi dữ liệu có thể tái sử dụng.
5. Không thêm API call, auth backend hoặc dependency mới nếu yêu cầu chỉ là khung UI mock.

### 2. Dựng layout và route boundary

1. Tạo AdminLayout độc lập gồm sidebar tối, logo, menu quản trị, topbar sáng, breadcrumb, ô tìm kiếm, avatar và `<Outlet />`.
2. Sidebar phải có trạng thái active rõ ràng và không làm vỡ vùng nội dung desktop.
3. Khai báo route `/admin/login` bên ngoài layout được bảo vệ.
4. Khai báo `/admin` với redirect phù hợp, sau đó đặt các route dashboard, services, staff và bookings dưới AdminLayout.
5. Nếu repository có cơ chế auth mock, bảo vệ route sau login bằng cơ chế hiện có; nếu chưa có, lưu session mock tối thiểu bằng `localStorage` để route protection vẫn nhất quán sau khi refresh, và ghi rõ đây chỉ là mock.
6. Không để route Guest bị bọc bởi AdminLayout hoặc ngược lại.

### 3. Xây màn hình theo domain

#### Login

- Có form email/password, trạng thái submit và thông báo lỗi cơ bản.
- Submit mock lưu session bằng `localStorage` rồi chuyển hướng thẳng đến `/admin/dashboard`.
- Không giả vờ xác thực với server.

#### Dashboard

- Có bốn KPI: Tổng đơn, Doanh thu, Staff Active, Khách hàng mới.
- Có bảng “Booking mới nhất” với nhiều nhóm dịch vụ, tối thiểu gồm vệ sinh nhà, máy lạnh và trông/chăm sóc trẻ.
- Bảng phải có mã đơn, khách hàng, dịch vụ, thời gian, giá trị và trạng thái.
- Dùng badge màu có ý nghĩa, hỗ trợ trạng thái dài mà không làm vỡ layout.

#### Services

- Hiển thị danh sách dịch vụ và nhóm dịch vụ.
- Cho phép mô hình hóa cấu hình field theo loại dịch vụ, không ép mọi dịch vụ dùng cùng một form.
- Ví dụ dynamic fields: `Số lượng ngựa` cho máy lạnh, `Độ tuổi` cho chăm sóc trẻ, số lượng thú cưng hoặc loại công việc cho dịch vụ tương ứng.
- Field config nên có type, label, required/options khi phù hợp để sau này map sang API REST.

#### Staff

- Hiển thị trạng thái xác minh và hoạt động.
- Bắt buộc có UI checklist skills/services theo từng staff.
- Chỉ những dịch vụ được tick mới được phép nhận; không gán toàn bộ dịch vụ mặc định cho mọi staff.
- Tách skill assignment khỏi trạng thái active và verification để người dùng quản trị dễ hiểu.

#### Bookings

- Hiển thị chi tiết động dựa trên loại dịch vụ.
- Thể hiện rõ dispatch mode: `Manual` / khách tự chọn và `Auto` / hệ thống tự động.
- Hỗ trợ các trạng thái: `Đang tìm Staff`, `Đã tìm thấy`, `Không tìm thấy`, `Staff từ chối`, `Đang tìm thay thế`, `Hoàn thành`.
- Dữ liệu mock phải có nhiều trạng thái và nhóm dịch vụ để kiểm tra bảng, filter và badge.

### 4. Chọn mức thay đổi

- Nếu route hoặc layout đã tồn tại, sửa tại abstraction sở hữu hành vi thay vì tạo bản sao.
- Nếu thiếu router, thêm cấu hình nhỏ nhất phù hợp với thư viện hiện có.
- Nếu thiếu component Data Table, bắt đầu bằng semantic HTML table có header, empty state và overflow; chỉ thêm thư viện khi repository đã dùng hoặc yêu cầu tương tác phức tạp.
- Nếu yêu cầu mở rộng vượt các route cốt lõi, hoàn thành route hiện tại trước rồi mới thêm menu/placeholder có chủ đích.

### 5. Kiểm tra và nghiệm thu

1. Chạy typecheck/build hoặc lệnh kiểm tra tương ứng trong `package.json`.
2. Kiểm tra trực tiếp các URL `/admin/login`, `/admin/dashboard`, `/admin/services`, `/admin/staff`, `/admin/bookings`.
3. Kiểm tra login redirect.
4. Kiểm tra Admin không hiển thị Header/Footer của Guest.
5. Kiểm tra sidebar active, breadcrumb, bảng overflow và khả năng đọc trên màn hình desktop.
6. Kiểm tra mock data có đủ nhóm dịch vụ, dynamic field examples, skill assignments, dispatch modes và toàn bộ booking statuses.
7. Kiểm tra không có API thật, secret, hoặc dependency không cần thiết.
8. Nếu có lỗi, sửa trong đúng feature vừa chạm và chạy lại cùng lệnh kiểm tra trước khi mở rộng phạm vi.

## Tiêu chí hoàn thành

- Admin route hoạt động độc lập với Guest route.
- AdminLayout bao bọc đúng các màn hình đã yêu cầu và Login không bị bọc sai.
- Dashboard có đủ KPI và bảng booking đa dịch vụ.
- Services thể hiện được cấu hình dynamic fields theo domain.
- Staff có checklist skills theo staff, cùng verification và active status.
- Bookings hiển thị dynamic details, Manual/Auto dispatch và đủ trạng thái điều phối.
- UI không gọi API thật và lệnh validation chính của repository chạy thành công.

## Ví dụ prompt

- `Dùng skill admin-super-app-web, tạo route /admin/services với form dynamic fields cho máy lạnh và chăm sóc trẻ.`
- `Mở rộng /admin/staff để checklist skill theo từng nhân viên, giữ layout Admin độc lập.`
- `Kiểm tra /admin/bookings: bổ sung Manual/Auto dispatch và toàn bộ trạng thái điều phối bằng mock data.`
- `Review Admin Web theo checklist của skill, ưu tiên lỗi route boundary và dữ liệu domain.`
