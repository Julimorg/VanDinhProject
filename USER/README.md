# Vạn Đinh Paint — USER

Giao diện mua hàng dành cho khách (end-user) của hệ thống Vạn Đinh Paint.
React 19 + Vite + TypeScript, UI dựng bằng MUI + Tailwind CSS, data-fetching
bằng `@tanstack/react-query`, state auth/cart bằng `zustand`.

## Yêu cầu

- Node.js 20+
- Backend API của project (xem repo `BE/`) đang chạy và có thể truy cập được

## Cài đặt

```bash
npm install
```

## Biến môi trường

Tạo file `.env` ở thư mục gốc `USER/` (file này không được commit vào repo —
mỗi môi trường deploy tự tạo file riêng) với 2 biến sau:

| Biến                     | Mô tả                                                                 | Ví dụ                                  |
| ------------------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| `VITE_PUBLIC_API`         | Base URL của backend API (bao gồm `/api/v1` nếu backend cần)          | `http://localhost:8080/api/v1`          |
| `VITE_VIETNAM_ADDRESS_API`| Base URL của API tra tỉnh/huyện/xã Việt Nam dùng cho form địa chỉ      | `https://provinces.open-api.vn/api`     |

Đây là 2 biến duy nhất thực sự được code sử dụng. Mọi biến môi trường khác
không còn được tham chiếu ở đâu trong code.

## Chạy dev

```bash
npm run dev
```

Mặc định chạy ở `http://localhost:5174`.

## Build production

```bash
npm run build
```

Lệnh này chạy `tsc -b` (kiểm tra type) rồi `vite build`, xuất ra thư mục
`dist/`. Khi build production, toàn bộ `console.*`/`debugger` trong code được
Vite tự động loại bỏ (xem `esbuild.drop` trong `vite.config.ts`) — không lo
lộ log ra DevTools Console trên bản production.

Xem trước bản build:

```bash
npm run preview
```

## Deploy

`dist/` sau khi build là một static site thuần (HTML/CSS/JS) — deploy được
trên bất kỳ static hosting nào (Vercel, Netlify, Nginx, S3+CloudFront...).
Lưu ý:

- Phải cấu hình server trả về `index.html` cho mọi route không khớp file
  tĩnh nào (SPA fallback), vì app dùng `react-router-dom` (client-side
  routing).
- Nhớ set đúng `VITE_PUBLIC_API`/`VITE_VIETNAM_ADDRESS_API` **tại thời điểm
  build** (biến môi trường Vite được inline vào bundle lúc build, không đọc
  được lúc runtime).

## Thanh toán

App hiện chỉ hỗ trợ **COD (thanh toán khi nhận hàng)** và **chuyển khoản
ngân hàng qua QR** — không dùng cổng thanh toán online (VNPay đã được tắt ở
cả FE và BE, xem `PaymentMethod.tsx`).
