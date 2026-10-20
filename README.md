# CT TECH STORE - WEBSITE BÁN HÀNG CÔNG NGHỆ CHÍNH HÃNG

Hệ thống website thương mại điện tử chuyên nghiệp dành cho thiết bị công nghệ đỉnh cao, tối ưu tốc độ tải trang bằng HTML5, Tailwind CSS và JavaScript thuần (Vanilla JS), tích hợp thanh toán trực tuyến bảo mật, in và xuất hóa đơn PDF tự động, cùng hệ thống quản trị chuyên sâu.

---

## 🚀 Cấu Trúc Thư Mục Dự Án (Chuẩn 100% Theo Thiết Kế)

```text
DU_AN_JAVASCRIPT_N7
├── .vscode/
│   └── settings.json           # Cấu hình IDE VS Code định dạng code
├── src/
│   ├── home.js                 # Xử lý banner slider, flash sale & logic trang chủ
│   ├── index.css               # Import style và print media rules
│   ├── App.tsx                 # React component tích hợp
│   └── main.tsx                # Entrypoint bundler
├── index.html                  # Trang chủ CT Tech Store (Hero, Flash Sale, Featured)
├── products.html               # Trang danh mục sản phẩm (Lọc danh mục, giá, thương hiệu, sắp xếp)
├── product-detail.html         # Trang chi tiết sản phẩm (Thư viện ảnh, chọn màu, cấu hình, thông số kỹ thuật)
├── cart.html                   # Giỏ hàng (Tăng giảm số lượng, xóa sản phẩm, mã giảm giá CTTECH10)
├── checkout.html               # Thanh toán bảo mật trực tuyến (VietQR, MoMo, Visa/Master, COD) & Hóa đơn PDF
├── login.html                  # Đăng nhập (Điền nhanh tài khoản mẫu 1-click)
├── register.html               # Đăng ký thành viên mới
├── profile.html                # Quản lý tài khoản & Tra cứu lịch sử đơn hàng, in tải lại hóa đơn
├── admin.html                  # Giao diện quản trị: Thống kê doanh thu, CRUD sản phẩm, cập nhật đơn hàng
├── footer.html                 # Component chân trang dùng chung
├── data.json                   # Dữ liệu 12+ sản phẩm công nghệ cao cấp chính hãng
├── script.js                   # Engine JavaScript quản lý dữ liệu, giỏ hàng, Auth, in ấn & PDF
└── README.md                   # Tài liệu hướng dẫn sử dụng
```

---

## 🌟 Các Tính Năng Nổi Bật

### 1. Catalog & Chi Tiết Sản Phẩm Đa Dạng
- 12+ siêu phẩm công nghệ hàng đầu: **iPhone 16 Pro Max**, **MacBook Pro 16" M3 Max**, **Samsung Galaxy S24 Ultra**, **Sony WH-1000XM5**, **iPad Pro M4**, **Apple Watch Ultra 2**, **Bàn phím cơ Keychron**, **Chuột Logitech MX Master 3S**...
- Lọc tức thì theo danh mục (Điện thoại, Laptop, Tablet, Smartwatch, Âm thanh, Phụ kiện), theo khoảng giá và theo thương hiệu.
- Trang chi tiết với tùy chọn phiên bản màu sắc (Titan Sa mạc, Tự nhiên, Đen...), bộ nhớ và bảng thông số kỹ thuật chuẩn hãng.

### 2. Giỏ Hàng Thông Minh & Mã Giảm Giá
- Thêm sản phẩm, tăng/giảm số lượng mượt mà, xóa từng món hoặc xóa toàn bộ.
- Áp dụng mã ưu đãi **`CTTECH10`** (giảm ngay 10% tổng hóa đơn) hoặc **`FREESHIP`** (miễn phí vận chuyển toàn quốc).
- Tự động đồng bộ số lượng trên thanh menu (Badge Counter).

### 3. Thanh Toán Trực Tuyến An Toàn & Bảo Mật
- **VietQR 24/7**: Tự động hiển thị mã QR kèm số tài khoản MB Bank, số tiền và mã giao dịch.
- **Ví điện tử MoMo / ZaloPay**: Quét mã nhanh chóng.
- **Thẻ Quốc Tế Visa / Mastercard / JCB**: Xác thực an toàn.
- **Thanh toán tiền mặt khi nhận hàng (COD)**: Kiểm tra hàng trước khi trả tiền.

### 4. Thanh Toán Thành Công, In Hóa Đơn & Xuất PDF
- Khi đặt hàng thành công, hiển thị modal cảm ơn sang trọng cùng thông tin chi tiết.
- Nút **"In hóa đơn ngay"**: Được định dạng chuẩn in ấn nhiệt hoặc A4 (@media print).
- Nút **"Xuất hóa đơn PDF"**: Tạo và tải ngay file PDF hóa đơn chính thức (`Hoa-don-CTTech-[Mã đơn].pdf`) có đầy đủ mã số thuế, hotline, thông tin người nhận, bảng chi tiết từng món hàng và dấu xác thực.

### 5. Quản Lý Tài Khoản & Lịch Sử Đơn Hàng
- Đăng nhập, đăng ký và chỉnh sửa thông tin cá nhân.
- Tra cứu danh sách đơn hàng đã mua, theo dõi mã vận đơn, xem lại chi tiết và tải lại file PDF bất kỳ lúc nào.

### 6. Giao Diện Quản Trị Admin Chuyên Sâu (`/admin.html`)
- Theo dõi 4 chỉ số KPI chính: Tổng doanh thu, Tổng đơn hàng, Số sản phẩm, Số thành viên.
- **CRUD Sản phẩm**: Thêm máy mới, sửa giá/tồn kho/ảnh, xóa sản phẩm khỏi kho hàng.
- **Cập nhật đơn hàng**: Chuyển trạng thái đơn từ *Chờ xử lý* ➔ *Đang chuẩn bị hàng* ➔ *Đang giao hàng* ➔ *Hoàn thành* ➔ *Đã hủy*.
- Hỗ trợ khôi phục dữ liệu gốc bất kỳ lúc nào chỉ bằng 1 cú click.

---

## 🔑 Tài Khoản Thử Nghiệm Nhanh

| Vai trò | Email đăng nhập | Mật khẩu |
| :--- | :--- | :--- |
| **Khách hàng mẫu** | `user@cttech.vn` | `123` |
| **Quản trị viên (Admin)** | `admin@cttech.vn` | `admin` |

*(Có sẵn nút bấm điền tự động 1-click tại trang `login.html`)*

---

## 💻 Cách Khởi Chạy Dự Án

- **Môi trường phát triển:** Chạy `npm run dev` để khởi động máy chủ tại cổng `3000`.
- **Đóng gói dự án:** Chạy `npm run build` để kiểm tra biên dịch tối ưu hóa tất cả các trang HTML.
