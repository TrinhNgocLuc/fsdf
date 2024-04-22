Đây là một ứng dụng web được xây dựng bằng Node.js và Express.js, kết nối với cơ sở dữ liệu MySQL để quản lý các thiết bị IoT.

Tính năng
Lấy danh sách các cảm biến (nhiệt độ, độ ẩm, ánh sáng) từ cơ sở dữ liệu
Thêm mới một cảm biến vào cơ sở dữ liệu
Lấy danh sách các thiết bị (quạt, đèn) từ cơ sở dữ liệu
Cập nhật trạng thái của một thiết bị (bật/tắt)
Cài đặt
Clone repository về máy:
Copier
git clone https://github.com/your-username/iot-management-app.git
Cài đặt các dependencies:
Copier
cd iot-management-app
npm install
Cấu hình kết nối với cơ sở dữ liệu MySQL:
Mở file app.js
Sửa đổi các thông tin kết nối trong connection.createConnection() để phù hợp với cơ sở dữ liệu của bạn
Khởi chạy ứng dụng:
Copier
npm start
Ứng dụng sẽ chạy trên cổng 3000 (hoặc cổng được cấu hình trong biến môi trường PORT).

API Endpoints
Cảm biến:
GET /sensors: Lấy danh sách các cảm biến, có thể sử dụng các query param sort, search, filter để lọc và sắp xếp kết quả.
POST /sensors: Thêm một cảm biến mới vào cơ sở dữ liệu.
Thiết bị:
GET /devices: Lấy danh sách các thiết bị, có thể sử dụng các query param sort, search, filter để lọc và sắp xếp kết quả.
PUT /devices/:id: Cập nhật trạng thái của một thiết bị.
Cấu trúc dữ liệu
Ứng dụng này sử dụng 2 bảng trong cơ sở dữ liệu MySQL:

Bảng cambien:

id: Primary key, tự động tăng
Nhiet_do: Nhiệt độ
Do_am: Độ ẩm
Anh_sang: Ánh sáng
Bảng quatvaden:

id: Primary key, tự động tăng
deviceID: Mã thiết bị
status: Trạng thái thiết bị (0: tắt, 1: bật)
Tùy chỉnh
Bạn có thể tùy chỉnh các tính năng của ứng dụng bằng cách sửa đổi mã nguồn trong app.js. Ví dụ, bạn có thể thêm các endpoint mới, thay đổi logic xử lý, hoặc mở rộng chức năng tìm kiếm/lọc dữ liệu.

Đóng góp
Nếu bạn phát hiện lỗi hoặc muốn đóng góp ý tưởng mới, vui lòng tạo một issue hoặc pull request trên GitHub.
