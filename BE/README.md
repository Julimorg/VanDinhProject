# Multi-Module System Guide
## management-api — Spring Boot 3.5.4 + Gradle + Java 21

## 📚 Infrastructure & Deploy

Xem hướng dẫn setup server, network flow, và config tại:
→ [docs/DEPLOYMENT_WORKFLOW.md](../docs/DEPLOYMENT_WORKFLOW.md)
→ [docs/DEPLOYMENT_CONFIG.md](../docs/DEPLOYEMNT_CONFIG.md)


---

## 1. BIG PICTURE — System WorkFlow

<img width="1821" height="1021" alt="VanDinh-BackEnd-ModuleStructure drawio" src="https://github.com/user-attachments/assets/268365ff-114c-46aa-9435-f792b94b7133" />


### Chú thích

**Gradle Build** — Skeleton cho toàn bộ module system:
- `settings.gradle` → khai báo tất cả module trong project
- `build.gradle (root)` → config CHUNG cho mọi subproject (Java version, Lombok, dependency management)
- `gradle.properties` → tập trung version numbers — tránh hardcode ở nhiều nơi

**App Module (/app)** — Điểm khởi động duy nhất của application:
- Duy nhất có Spring Boot plugin → tạo executable JAR
- Chứa `Application.java` (`@SpringBootApplication`)
- Chứa `application.properties` / `.env`
- Import TẤT CẢ feature + shared modules
- KHÔNG viết business logic ở đây

> ⚠️ **Quan trọng**: Khi muốn thêm hoặc xóa bất kỳ module nào (feature hoặc shared), phải config trong `app/build.gradle`:
>
> ```groovy
> plugins {
>     id 'org.springframework.boot'
> }
> bootRun {
>     workingDir = rootProject.projectDir
> }
> dependencies {
>     implementation project(':feature:auth')
>     implementation project(':feature:user')
>     implementation project(':feature:product')
>     implementation project(':feature:notification')
>     implementation project(':feature:storage')
>     implementation project(':feature:search')
>     implementation project(':feature:report')
>     implementation project(':feature:qrcode')
>     implementation project(':feature:order')
>     implementation project(':feature:cart')
>     implementation project(':feature:supplier')
>     implementation project(':feature:color')
>     implementation project(':feature:wishlist')
>     implementation project(':feature:category')
>     implementation project(':feature:payment')
>
>     implementation project(':shared:security')
>     implementation project(':shared:api-docs')
>     implementation project(':shared:messaging')
>     implementation project(':shared:persistence')
>
>     implementation 'org.springframework.boot:spring-boot-starter-security'
>     implementation 'org.springframework.modulith:spring-modulith-starter-core'
>     implementation 'org.springframework.modulith:spring-modulith-starter-jpa'
>
>     implementation 'io.github.cdimascio:dotenv-java:3.0.2'
>     implementation 'me.paulschwarz:spring-dotenv:3.0.0'
>
>     runtimeOnly    'org.postgresql:postgresql'
>     runtimeOnly    'com.mysql:mysql-connector-j:8.3.0'
>     developmentOnly 'org.springframework.boot:spring-boot-devtools'
>
>     testImplementation 'org.springframework.modulith:spring-modulith-starter-test'
>     testImplementation 'org.springframework.security:spring-security-test'
>     testRuntimeOnly    'com.h2database:h2'
> }
> ```

**Shared Module (/shared)** — Code dùng chung, không có business logic:

| Module | Nội dung |
|---|---|
| `common` | `ApiResponse`, `BusinessException`, `BaseDTO`, Utils, **Port Interfaces** (xem mục 3.2) |
| `security` | JWT, `SecurityConfig`, OAuth2 |
| `persistence` | `BaseEntity`, `JpaAuditingConfig`, Flyway config |
| `messaging` | `WebSocketConfig` |
| `api-docs` | `SwaggerConfig`, OpenAPI |

**Feature Module (/feature)** — Mỗi feature = 1 bounded context độc lập:

| Module | Chức năng |
|---|---|
| `auth` | Register, login, refresh token |
| `cart` | Giỏ hàng |
| `category` | Danh mục sản phẩm |
| `notification` | Email, SendGrid, Thymeleaf |
| `order` | Đặt hàng, quản lý đơn |
| `product` | Catalog sản phẩm |
| `qrcode` | ZXing QR generation |
| `search` | Elasticsearch |
| `storage` | Cloudinary, file upload |
| `supplier` | Nhà cung cấp |
| `user` | Profile, address |
| `wishlist` | Danh sách yêu thích |

### Dependency flow — CORE

```
:app  -->  :shared:*  <--  :feature:*
               ↑
   Chiều phụ thuộc DUY NHẤT: feature depend vào shared, không ai depend vào feature

⚠️ CÁC MODULE KHÔNG ĐƯỢC DEPEND LẪN NHAU:
SAI:  :feature:order  →  :feature:product   ❌ (feature phụ thuộc feature)
SAI:  :shared:common  →  :feature:auth      ❌ (shared không được depend vào feature)

✅ ĐÚNG: Nếu :feature:order cần data của :feature:product
   → Định nghĩa interface tại :shared:common  (ProductQueryPort)
   → :feature:product   implement interface đó
   → :feature:order     gọi interface — không biết implementation ở đâu
   (xem chi tiết hướng dẫn tại mục 3.2)
```

---

## 2. FOLDER STRUCTURE

```
BE/
│
├── settings.gradle              ← khai báo tất cả module
├── build.gradle                 ← config chung (subprojects block)
├── gradle.properties            ← tập trung version
├── .env                         ← secrets, không commit lên git
│
├── app/                         ← entry point duy nhất
│   ├── build.gradle
│   └── src/main/
│       ├── java/com/example/Application.java
│       └── resources/application.properties
│
├── shared/                      ← code dùng chung, không có business logic
│   ├── common/                  ← ApiResponse, Exception, BaseDTO, Utils, Port Interfaces
│   ├── security/                ← JWT, SecurityConfig, OAuth2
│   ├── persistence/             ← BaseEntity, JpaAuditingConfig, Flyway
│   ├── messaging/               ← WebSocketConfig
│   └── api-docs/                ← SwaggerConfig, OpenAPI
│
└── feature/                     ← mỗi feature = 1 bounded context
    ├── auth/                    ← register, login, refresh token
    ├── user/                    ← profile, address
    ├── product/                 ← catalog, category
    ├── notification/            ← email, sendgrid, thymeleaf
    ├── storage/                 ← cloudinary, file upload
    ├── search/                  ← elasticsearch
    ├── report/                  ← excel, csv export
    └── qrcode/                  ← ZXing QR generation
```

### Cấu trúc bên trong mỗi feature module

```
feature/auth/
└── src/
    ├── main/
    │   ├── java/com/example/auth/
    │   │   ├── controller/       ← REST endpoints (@RestController)
    │   │   ├── service/          ← implementation (@Service)
    │   │   ├── repository/       ← JPA repositories (@Repository)
    │   │   └── mapper/           ← MapStruct mappers (@Mapper)
    │   └── resources/
    │       └── (nếu cần template, config riêng)
    └── test/
        └── java/com/example/auth/
```

---

## 3. WORKFLOW — KHI VIẾT CODE

### 3.1 Thêm class/interface vào module có sẵn

Ví dụ: thêm `ForgotPasswordService` vào `:feature:auth`

```
1. Tạo file đúng package:
   feature/auth/src/main/java/com/example/auth/service/ForgotPasswordService.java

2. Package declaration phải khớp với đường dẫn:
   package com.example.auth.service;

3. Không cần config gì thêm — Spring Boot scan toàn bộ com.example.* từ Application.java
```

### 3.2 Gọi data giữa các feature module — SOLID Interface Pattern

> **Nguyên tắc**: Các feature module KHÔNG được depend trực tiếp lẫn nhau. Nếu `:feature:order`
> cần data từ `:feature:product`, phải đi qua một interface định nghĩa ở `:shared:common`.
> Đây là ứng dụng của **Dependency Inversion Principle (D trong SOLID)**.

**KHÔNG làm (vi phạm nguyên tắc):**

```groovy
// feature/order/build.gradle
implementation project(':feature:product')  // ❌ feature depend vào feature
```

```java
// Trong OrderServiceImpl
@Autowired
private ProductRepository productRepository;  // ❌ vượt qua module boundary
```

**ĐÚNG — 4 bước theo DIP:**

**Bước 1** — Định nghĩa Port Interface + DTO tại `:shared:common`

```java
// shared/common/src/main/java/com/example/common/port/ProductQueryPort.java
package com.example.common.port;

public interface ProductQueryPort {
    ProductInfo findById(Long productId);
    boolean existsById(Long productId);
}
```

```java
// shared/common/src/main/java/com/example/common/port/ProductInfo.java
package com.example.common.port;

import java.math.BigDecimal;

public record ProductInfo(Long id, String name, BigDecimal price, Integer stock) {}
```

**Bước 2** — `:feature:product` implement interface

```java
// feature/product/src/main/java/com/example/product/adapter/ProductQueryAdapter.java
package com.example.product.adapter;

import com.example.common.port.ProductQueryPort;
import com.example.common.port.ProductInfo;
import com.example.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductQueryAdapter implements ProductQueryPort {

    private final ProductRepository productRepository;

    @Override
    public ProductInfo findById(Long productId) {
        return productRepository.findById(productId)
            .map(p -> new ProductInfo(p.getId(), p.getName(), p.getPrice(), p.getStock()))
            .orElseThrow(() -> new BusinessException("Product not found: " + productId));
    }

    @Override
    public boolean existsById(Long productId) {
        return productRepository.existsById(productId);
    }
}
```

**Bước 3** — `:feature:order` chỉ gọi interface, không biết implementation

```java
// feature/order/src/main/java/com/example/order/service/OrderServiceImpl.java
package com.example.order.service;

import com.example.common.port.ProductQueryPort;   // ← từ shared:common
import com.example.common.port.ProductInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final ProductQueryPort productQueryPort;  // ← inject interface, không biết ProductRepository

    public OrderResponse createOrder(CreateOrderRequest request) {
        ProductInfo product = productQueryPort.findById(request.getProductId());

        if (product.stock() < request.getQuantity()) {
            throw new BusinessException("Insufficient stock");
        }
        // ... tạo order logic ...
    }
}
```

**Bước 4** — Cấu hình `build.gradle`

```groovy
// feature/order/build.gradle
dependencies {
    implementation project(':shared:common')   // ✅ chỉ depend vào shared
    // KHÔNG có ':feature:product'             // ✅ không biết product module
}

// feature/product/build.gradle
dependencies {
    implementation project(':shared:common')   // ✅ implement interface từ shared
}
```

**Luồng hoạt động lúc runtime:**

```
:feature:order
    │  inject ProductQueryPort (interface)
    └──────────────────────────────────────────────────────────────┐
                                                                   ▼
                                                    :shared:common
                                                    (ProductQueryPort — interface)
                                                                   ▲
                                                    :feature:product
                                                    (ProductQueryAdapter — implements)

Spring Boot tự inject ProductQueryAdapter vào OrderServiceImpl lúc runtime.
:feature:order không biết gì về :feature:product module.
```

### 3.3 Dùng class từ module khác

Ví dụ: `AuthServiceImpl` cần dùng `ApiResponse` từ `:shared:common`

```
1. Kiểm tra feature/auth/build.gradle đã có dependency chưa:
   implementation project(':shared:common')   ← nếu có rồi, chỉ cần import

2. Nếu chưa có, thêm vào build.gradle của module đó:
   dependencies {
       implementation project(':shared:common')  // thêm vào
   }

3. Import trong Java như bình thường:
   import com.example.common.response.ApiResponse;
```

### 3.4 Thêm thư viện bên ngoài (external library)

**Trường hợp A — Lib chỉ dùng trong 1 module:**
```groovy
// Thêm vào build.gradle của module đó
// Ví dụ: feature/report/build.gradle
dependencies {
    implementation 'org.apache.poi:poi:5.3.0'   // thêm trực tiếp với version
}
```

**Trường hợp B — Lib dùng ở nhiều module (khuyến khích):**
```
1. Thêm version vào gradle.properties:
   poiVersion=5.3.0

2. Dùng trong build.gradle của từng module cần:
   implementation "org.apache.poi:poi:${poiVersion}"
```

**Trường hợp C — Lib đã có trong Spring Boot BOM (không cần ghi version):**
```groovy
// Những lib này Spring Boot quản lý version, KHÔNG cần ghi version:
implementation 'org.springframework.boot:spring-boot-starter-web'
implementation 'org.flywaydb:flyway-core'
implementation 'org.postgresql:postgresql'
// Xem đầy đủ tại: https://docs.spring.io/spring-boot/docs/current/reference/html/dependency-versions.html
```

**Trường hợp D — Lib ở shared module cần expose cho các module con (transitive):**

Khi một lib được khai báo ở shared module và các feature module cần dùng trực tiếp
các class/annotation của lib đó (ví dụ `@Entity`, `@Valid`), dùng `api` thay vì `implementation`:

```groovy
// shared/persistence/build.gradle
dependencies {
    // 'api' → expose ra ngoài, các module depend vào :shared:persistence
    // sẽ tự động có starter-data-jpa trên compile classpath
    api 'org.springframework.boot:spring-boot-starter-data-jpa'    // ✅ transitive
    api 'org.springframework.boot:spring-boot-starter-validation'   // ✅ transitive

    // 'implementation' → chỉ dùng nội bộ, không expose
    implementation 'org.flywaydb:flyway-core'
}
```

Kết quả — feature module không cần khai báo lại:

```groovy
// feature/product/build.gradle
dependencies {
    implementation project(':shared:persistence')
    // @Entity, @Repository, @Valid đều hoạt động — kế thừa từ :shared:persistence ✓
    // Không cần thêm spring-boot-starter-data-jpa
}
```

| | `implementation` | `api` |
|---|---|---|
| Visible với consumer | ❌ Không | ✅ Có (compile classpath) |
| Build performance | Tốt hơn (ít recompile) | Kém hơn (cascade recompile) |
| Dùng khi | Lib chỉ dùng nội bộ module | Lib là phần API public của module |

---

## 4. THÊM MODULE MỚI — TỪNG BƯỚC

Ví dụ: thêm module `:feature:cart`

### Bước 1 — Khai báo trong `settings.gradle`
```groovy
// Thêm vào cuối file
include ':feature:cart'
```

### Bước 2 — Tạo thư mục

**Windows PowerShell:**
```powershell
New-Item -ItemType Directory -Force -Path feature/cart/src/main/java/com/example/cart/controller
New-Item -ItemType Directory -Force -Path feature/cart/src/main/java/com/example/cart/service
New-Item -ItemType Directory -Force -Path feature/cart/src/main/java/com/example/cart/repository
New-Item -ItemType Directory -Force -Path feature/cart/src/main/java/com/example/cart/mapper
New-Item -ItemType Directory -Force -Path feature/cart/src/test/java/com/example/cart
```

**Git Bash / WSL:**
```bash
mkdir -p feature/cart/src/main/java/com/example/cart/{controller,service,repository,mapper}
mkdir -p feature/cart/src/test/java/com/example/cart
```

### Bước 3 — Tạo `feature/cart/build.gradle`
```groovy
dependencies {
    implementation project(':shared:common')
    implementation project(':shared:security')
    implementation project(':shared:persistence')

    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'

    // MapStruct (chỉ thêm nếu module này cần mapping)
    implementation "org.mapstruct:mapstruct:${mapstructVersion}"
    annotationProcessor 'org.projectlombok:lombok-mapstruct-binding:0.2.0'
    annotationProcessor "org.mapstruct:mapstruct-processor:${mapstructVersion}"
}
```

### Bước 4 — Thêm vào `app/build.gradle`
```groovy
dependencies {
    // ... existing dependencies ...
    implementation project(':feature:cart')   // thêm dòng này
}
```

### Bước 5 — Verify
```bash
./gradlew projects            # phải thấy :feature:cart
./gradlew :feature:cart:build # phải pass
```

---

## 5. MAPSTRUCT + LOMBOK — THỨ TỰ BẮT BUỘC

**Đây là lỗi thường gặp nhất khi setup.** Trong mọi `build.gradle` có dùng MapStruct:

```groovy
dependencies {
    // 1. Lombok compileOnly (không vào JAR)
    compileOnly 'org.projectlombok:lombok'

    // 2. Annotation processors — THỨ TỰ NÀY KHÔNG ĐƯỢC ĐỔI
    annotationProcessor 'org.projectlombok:lombok'                          // [1] Lombok trước
    annotationProcessor 'org.projectlombok:lombok-mapstruct-binding:0.2.0' // [2] Bridge
    annotationProcessor "org.mapstruct:mapstruct-processor:${mapstructVersion}" // [3] MapStruct sau

    // 3. MapStruct runtime
    implementation "org.mapstruct:mapstruct:${mapstructVersion}"
}
```

**Lưu ý:** Lombok đã được apply ở `subprojects {}` trong root `build.gradle`,
nhưng `lombok-mapstruct-binding` và `mapstruct-processor` phải khai báo lại ở từng module dùng MapStruct.

---

## 6. PACKAGE NAMING — QUY TẮC

```
com.example.{module-name}.{layer}

Ví dụ:
com.example.auth.controller      ← AuthController.java
com.example.auth.service         ← AuthService.java (interface)
com.example.auth.service         ← AuthServiceImpl.java (@Service)
com.example.auth.repository      ← UserRepository.java
com.example.auth.mapper          ← UserMapper.java

com.example.common.response      ← ApiResponse.java
com.example.common.exception     ← BusinessException.java
com.example.common.port          ← ProductQueryPort.java (cross-module interfaces)
com.example.security.config      ← SecurityConfig.java
com.example.security.jwt         ← JwtService.java
com.example.persistence.entity   ← BaseEntity.java
```

**Tại sao quan trọng?** `Application.java` dùng:
```java
@SpringBootApplication(scanBasePackages = "com.example")
```
→ Spring scan tất cả class có `com.example` prefix, bất kể nằm ở module nào.

---

## 7. CÁC LỆNH GRADLE THƯỜNG DÙNG

```bash
# Xem tất cả module
./gradlew projects

# Build toàn bộ (skip test)
./gradlew build -x test

# Build 1 module cụ thể
./gradlew :feature:auth:build

# Chạy app
./gradlew :app:bootRun

# Chạy test toàn bộ
./gradlew test

# Chạy test 1 module
./gradlew :feature:auth:test

# Xem dependency tree của 1 module
./gradlew :feature:auth:dependencies

# Xem dependency tree chỉ runtimeClasspath
./gradlew :app:dependencies --configuration runtimeClasspath

# Clean build cache
./gradlew clean

# Clean + build lại từ đầu
./gradlew clean build -x test

# Kiểm tra conflict version giữa modules
./gradlew :app:dependencyInsight --dependency spring-security-core
```

---

## 8. SPRING MODULITH — KIỂM TRA BOUNDARIES

Project đang dùng `spring-modulith`. Nó giúp enforce module boundaries theo package.

**Test tự động kiểm tra architecture:**
```java
// app/src/test/java/com/example/ModularityTest.java
package com.example;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.modulith.docs.Documenter;

class ModularityTest {

    ApplicationModules modules = ApplicationModules.of(Application.class);

    @Test
    void verifiesModularStructure() {
        modules.verify();  // fail nếu có circular dependency hoặc vi phạm boundary
    }

    @Test
    void generateDocumentation() {
        new Documenter(modules)
            .writeModulesAsPlantUml()   // xuất diagram
            .writeIndividualModulesAsPlantUml();
    }
}
```

---

## 9. THÊM CONFIG PROPERTY CHO MODULE

Ví dụ: module `:feature:notification` cần đọc `mail.sendgrid.api-key`

```java
// feature/notification/src/main/java/com/example/notification/config/SendGridProperties.java
package com.example.notification.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "mail.sendgrid")
public class SendGridProperties {
    private String apiKey;   // maps to mail.sendgrid.api-key trong .properties
}
```

Property vẫn khai báo trong `app/src/main/resources/application.properties`.
Module chỉ đọc — không tự tạo property file riêng (trừ trường hợp test).

---

## 10. FLYWAY MIGRATION — ĐẶT FILE Ở ĐÂU

```
app/src/main/resources/db/migration/
├── V1__create_users_table.sql
├── V2__create_products_table.sql
├── V3__create_orders_table.sql
└── V4__create_cart_table.sql
```

**Quy tắc đặt tên:**
```
V{số_thứ_tự}__{mô_tả}.sql
V1__init.sql
V2__add_role_column_to_users.sql
V3__create_products_table.sql
```

Tất cả SQL đặt tập trung ở `:app` — không phân tán vào từng feature module.

---

## 11. MULTI-MODULE VS MONOLITH — SO SÁNH NHANH

| | Monolith cũ | Multi-module mới |
|---|---|---|
| Tất cả code | `src/main/java/...` | Phân tán vào từng module |
| Build | 1 lần toàn bộ | Có thể build từng module |
| Dependency | Tất cả trong 1 `build.gradle` | Mỗi module khai báo riêng |
| Thêm feature | Tạo package mới | Tạo module mới |
| Thay đổi 1 chỗ | Rebuild toàn bộ | Chỉ rebuild module bị ảnh hưởng |
| Circular dependency | Không bị phát hiện | Gradle báo lỗi ngay |
| Test isolation | Khó test riêng | Test từng module độc lập |

---

## 12. CHECKLIST KHI THÊM FEATURE MỚI

```
□ Thêm include ':feature:tenmodule' vào settings.gradle
□ Tạo thư mục đúng cấu trúc
□ Tạo feature/tenmodule/build.gradle với đúng dependencies
□ Thêm implementation project(':feature:tenmodule') vào app/build.gradle
□ Chạy ./gradlew projects → thấy module mới
□ Chạy ./gradlew :feature:tenmodule:build → pass
□ Đặt package đúng: com.example.tenmodule.*
□ Viết code theo thứ tự: entity → repository → service → controller
□ Nếu cần gọi module khác → định nghĩa Port Interface ở shared:common trước
□ Chạy ./gradlew :app:bootRun → verify app vẫn start được
```

---

## 13. LỖI THƯỜNG GẶP VÀ CÁCH FIX

### Lỗi: `Could not resolve project :feature:cart`
```
Nguyên nhân: Chưa có include trong settings.gradle
Fix: Thêm include ':feature:cart' vào settings.gradle
```

### Lỗi: `Cannot find symbol @Getter / @Entity`
```
Nguyên nhân: Module thiếu dependency
Fix:
- @Getter/@Setter → Lombok đã có sẵn trong subprojects, kiểm tra lại
- @Entity        → thêm implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
- @Component     → thêm implementation 'org.springframework.boot:spring-boot-starter-web'
```

### Lỗi: `MapStruct không generate code`
```
Nguyên nhân: Sai thứ tự annotationProcessor
Fix: Đảm bảo thứ tự trong build.gradle:
  1. annotationProcessor 'org.projectlombok:lombok'
  2. annotationProcessor 'org.projectlombok:lombok-mapstruct-binding:0.2.0'
  3. annotationProcessor "org.mapstruct:mapstruct-processor:..."
```

### Lỗi: `No qualifying bean of type 'XxxService'`
```
Nguyên nhân: Bean ở module khác không được scan
Fix: Kiểm tra package bắt đầu bằng com.example.*
     Kiểm tra Application.java có scanBasePackages = "com.example"
```

### Lỗi: `${DB_URL}` không được resolve
```
Nguyên nhân: dotenv không tìm thấy .env file
Fix: Kiểm tra .env nằm ở BE/ (root project)
     Kiểm tra app/build.gradle có bootRun { workingDir = rootProject.projectDir }
```

### Lỗi: Circular dependency between projects
```
Nguyên nhân: A depends B, B depends A
Fix: Tìm class bị chia sẻ → chuyển vào :shared:common
     Hoặc dùng Port Interface pattern (xem mục 3.2)
     Hoặc dùng event-driven (ApplicationEvent) thay vì direct dependency
```
