# Multi-Module System Guide
## management-api — Spring Boot 3.5.4 + Gradle + Java 21

---

## 1. BIG PICTURE — System WorkFlow

```
┌─────────────────────────────────────────────────────────────────┐
│                         GRADLE BUILD                            │
│                                                                 │
│  settings.gradle → khai báo tất cả module                      │
│  build.gradle (root) → config CHUNG cho mọi subproject         │
│  gradle.properties → tập trung version numbers                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        /app module                              │
│                                                                 │
│  • Duy nhất có Spring Boot plugin → tạo executable JAR          │
│  • Chứa Application.java (@SpringBootApplication)               │
│  • Chứa application.properties / .env                           │
│  • Import TẤT CẢ feature + shared modules                       │
│  • KHÔNG viết business logic ở đây                              │
└───────────────────────┬─────────────────────────────────────────┘
                        │ depends on
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
   :feature:auth  :feature:user  :feature:product  ...
          │             │              │
          └─────────────┼──────────────┘
                        │ depends on
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
   :shared:common  :shared:security  :shared:persistence  ...
```

### Dependency flow — CORE

```
:app  -->  :feature:*  -->  :shared:*
                    ↑
         :feature có thể depend vào :feature khác
         nhưng KHÔNG được tạo vòng tròn (circular)

ĐÚNG:   :feature:order  →  :feature:product  ✅
SAI:    :feature:product → :feature:order    ❌ (circular)
SAI:    :shared:common  → :feature:auth      ❌ (shared không được depend vào feature)
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
│   ├── common/                  ← ApiResponse, Exception, BaseDTO, Utils
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
    │   │   ├── service/          ← interface
    │   │   │   └── impl/         ← implementation (@Service)
    │   │   ├── repository/       ← JPA repositories (@Repository)
    │   │   └── domain/
    │   │       ├── entity/       ← JPA entities (@Entity)
    │   │       ├── dto/          ← Request/Response objects
    │   │       └── mapper/       ← MapStruct mappers
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

### 3.2 Dùng class từ module khác

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

### 3.3 Thêm thư viện bên ngoài (external library)

Có 2 trường hợp:

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
New-Item -ItemType Directory -Force -Path feature/cart/src/main/java/com/example/cart/service/impl
New-Item -ItemType Directory -Force -Path feature/cart/src/main/java/com/example/cart/repository
New-Item -ItemType Directory -Force -Path feature/cart/src/main/java/com/example/cart/domain/entity
New-Item -ItemType Directory -Force -Path feature/cart/src/main/java/com/example/cart/domain/dto
New-Item -ItemType Directory -Force -Path feature/cart/src/main/java/com/example/cart/domain/mapper
New-Item -ItemType Directory -Force -Path feature/cart/src/test/java/com/example/cart
```

**Git Bash / WSL:**
```bash
mkdir -p feature/cart/src/main/java/com/example/cart/{controller,service/impl,repository,domain/{entity,dto,mapper}}
mkdir -p feature/cart/src/test/java/com/example/cart
```

### Bước 3 — Tạo `feature/cart/build.gradle`
```groovy
dependencies {
    implementation project(':shared:common')
    implementation project(':shared:security')
    implementation project(':shared:persistence')
    // Thêm nếu cart cần biết về product:
    implementation project(':feature:product')

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
    annotationProcessor 'org.projectlombok:lombok'                       // [1] Lombok trước
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
com.example.auth.service.impl    ← AuthServiceImpl.java
com.example.auth.repository      ← UserRepository.java
com.example.auth.domain.entity   ← User.java
com.example.auth.domain.dto      ← LoginRequest.java, LoginResponse.java
com.example.auth.domain.mapper   ← UserMapper.java

com.example.common.response      ← ApiResponse.java
com.example.common.exception     ← BusinessException.java
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
□ Viết code theo thứ tự: entity → repository → service interface → impl → controller
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
     Hoặc dùng event-driven (ApplicationEvent) thay vì direct dependency
```