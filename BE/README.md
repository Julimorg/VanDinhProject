# Ecommerce — Spring Boot Multi-Module (Feature-based)

## Kiến trúc module

```
ecommerce/
├── shared/          # BaseEntity, ApiResponse, AppException, GlobalExceptionHandler
├── user/            # Đăng ký, đăng nhập, JWT, quản lý tài khoản
├── product/         # Sản phẩm, danh mục, tìm kiếm, quản lý kho
├── order/           # Giỏ hàng, đặt hàng, cập nhật trạng thái
├── payment/         # Khởi tạo thanh toán, VNPay callback, hoàn tiền
├── notification/    # Email listener (Spring Events + Async)
└── app/             # Entry point, SecurityConfig, application.yml
```

### Dependency graph
```
app  ──depends──▶  user, product, order, payment, notification
order ──depends──▶ product, shared
payment ──────────▶ order, shared
notification ─────▶ order, shared
user, product ────▶ shared
```

## Yêu cầu
- Java 21+
- Gradle 8.7+
- MySQL 8+ (hoặc chạy profile `dev` để dùng H2)

## Chạy nhanh (dev với H2)

```bash
# Clone và build
./gradlew :app:bootRun --args='--spring.profiles.active=dev'

# H2 Console: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:ecommercedb
```

## Chạy với MySQL

```bash
# Tạo database
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Đặt biến môi trường
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export JWT_SECRET=$(openssl rand -base64 64)

./gradlew :app:bootRun
```

## Build JAR

```bash
./gradlew :app:bootJar
java -jar app/build/libs/ecommerce.jar
```

## API Endpoints

### Auth
| Method | URL | Mô tả |
|--------|-----|-------|
| POST | `/api/v1/auth/register` | Đăng ký tài khoản |
| POST | `/api/v1/auth/login` | Đăng nhập, nhận JWT |

### Products
| Method | URL | Auth |
|--------|-----|------|
| GET | `/api/v1/products` | Public |
| GET | `/api/v1/products/{id}` | Public |
| POST | `/api/v1/products` | ADMIN/SELLER |
| PUT | `/api/v1/products/{id}` | ADMIN/SELLER |
| DELETE | `/api/v1/products/{id}` | ADMIN |

### Cart
| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/api/v1/cart` | Xem giỏ hàng |
| POST | `/api/v1/cart/items` | Thêm sản phẩm |
| PATCH | `/api/v1/cart/items/{itemId}` | Cập nhật số lượng |
| DELETE | `/api/v1/cart` | Xoá giỏ hàng |

### Orders
| Method | URL | Mô tả |
|--------|-----|-------|
| POST | `/api/v1/orders` | Đặt hàng từ giỏ |
| GET | `/api/v1/orders` | Lịch sử đơn hàng |
| GET | `/api/v1/orders/{id}` | Chi tiết đơn |
| POST | `/api/v1/orders/{id}/cancel` | Huỷ đơn |
| PATCH | `/api/v1/orders/{id}/status` | Cập nhật trạng thái (ADMIN) |

### Payments
| Method | URL | Mô tả |
|--------|-----|-------|
| POST | `/api/v1/payments` | Khởi tạo thanh toán |
| GET | `/api/v1/payments/order/{orderId}` | Trạng thái payment |
| GET | `/api/v1/payments/vnpay/callback` | VNPay webhook |
| POST | `/api/v1/payments/refund` | Hoàn tiền (ADMIN) |

## Roles
- `CUSTOMER` — user mặc định, có thể mua hàng
- `SELLER` — có thể thêm/sửa sản phẩm
- `ADMIN` — toàn quyền

## Mở rộng tiếp theo
- [ ] Review & Rating module
- [ ] Voucher / Coupon module
- [ ] Inventory audit log
- [ ] Redis cache cho Product search
- [ ] Kafka thay Spring Events cho Notification
- [ ] Tách microservices khi cần scale
