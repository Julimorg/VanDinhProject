# VạnDinhStore - Hệ thống E-commerce Phân phối Sơn Nước

Hệ thống quản lý và bán hàng trực tuyến chuyên về **sơn nước** của VạnDinhStore.  
Dự án được xây dựng theo kiến trúc **Mono Repository**, bao gồm đầy đủ các phần: Backend, Frontend Web (Admin + User), và Mobile App.

## 🏗️ Cấu trúc dự án

Dự án gồm **4 thư mục chính**:

| Thư mục     | Công nghệ                          | Mô tả |
|-------------|------------------------------------|-------|
| **ADMIN**   | ReactJS (Vite / CRA)              | Giao diện quản trị viên (Admin Dashboard) |
| **USER**    | ReactJS (Vite / CRA)              | Giao diện khách hàng (Website bán hàng) |
| **BE**      | Spring Boot (Java)                | Backend chính, RESTful API |
| **MOBILE**  | React Native                      | Ứng dụng di động Android (APK) |

## 🛠️ Công nghệ sử dụng

### Backend
- **Spring Boot** (Java)
- Database:
  - **Neon** (PostgreSQL Cloud) – dùng cho môi trường production
  - **PostgreSQL** – dùng cho môi trường local
- Deploy: **AWS** và **OnRender**

### Frontend Web
- **ReactJS** (cả Admin và User)
- Deploy: **Vercel**

### Mobile
- **React Native**
- Build: **Android APK**

### Khác
- Mono Repository
- Hệ thống Backup & Recovery Database (từ NeonDB → PostgreSQL local)

## ✨ Tính năng nổi bật

- Quản lý sản phẩm sơn nước (danh mục, giá, tồn kho, hình ảnh…)
- Quản lý đơn hàng, khách hàng, khuyến mãi
- Dashboard thống kê doanh thu, báo cáo
- Giao diện người dùng thân thiện, responsive
- Ứng dụng di động Android
- Hệ thống backup & recovery dữ liệu tự động

## 📸 Một số hình ảnh minh họa hệ thống

*(Bạn hãy thêm các ảnh của mình vào thư mục `/images` hoặc `/screenshots` trong repo, sau đó thay link bên dưới)*

### Giao diện Admin
![Admin Dashboard](images/admin-dashboard.png)

### Giao diện Website (User)
![User Website](images/user-homepage.png)

### Ứng dụng Mobile
![Mobile App](images/mobile-screen.png)

### Flow Backup & Recovery Database
![Backup Recovery Flow](images/backup-recovery-flow.png)

## 📁 Cài đặt và chạy dự án (Local)

### 1. Clone repo
```bash
git clone https://github.com/yourusername/VanDinhStore.git
cd VanDinhStore