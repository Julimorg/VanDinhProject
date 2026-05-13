# ============================================================
# Stage 1: Build với Gradle Multi-Module
# ============================================================
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Gradle wrapper & root config trước để cache
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .
COPY gradle.properties .

# Copy từng build.gradle của subprojects (cache layer dependencies)
COPY app/build.gradle                     app/
COPY shared/common/build.gradle           shared/common/
COPY shared/security/build.gradle         shared/security/
COPY shared/persistence/build.gradle      shared/persistence/
COPY shared/messaging/build.gradle        shared/messaging/
COPY shared/api-docs/build.gradle         shared/api-docs/
COPY feature/auth/build.gradle            feature/auth/
COPY feature/user/build.gradle            feature/user/
COPY feature/product/build.gradle         feature/product/
COPY feature/notification/build.gradle    feature/notification/
COPY feature/storage/build.gradle         feature/storage/
COPY feature/search/build.gradle          feature/search/
COPY feature/report/build.gradle          feature/report/
COPY feature/qrcode/build.gradle          feature/qrcode/
COPY feature/order/build.gradle           feature/order/
COPY feature/cart/build.gradle            feature/cart/
COPY feature/color/build.gradle           feature/color/
COPY feature/supplier/build.gradle        feature/supplier/
COPY feature/wishlist/build.gradle        feature/wishlist/
COPY feature/category/build.gradle        feature/category/
COPY feature/payment/build.gradle         feature/payment/

RUN chmod +x gradlew

# Download dependencies (layer này được cache nếu các build.gradle không đổi)
RUN ./gradlew dependencies --no-daemon -q || true

# Copy toàn bộ source rồi build bootJar
COPY . .
RUN ./gradlew :app:bootJar -x test --no-daemon --parallel --configuration-cache

# ============================================================
# Stage 2: Extract Spring Boot layers
# ============================================================
FROM eclipse-temurin:21-jdk-alpine AS layer-extractor
WORKDIR /app
COPY --from=builder /app/app/build/libs/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# ============================================================
# Stage 3: Runtime image (JRE only, ~100-150MB)
# ============================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user cho security
RUN addgroup -g 1001 -S appgroup && \
    adduser  -u 1001 -S appuser -G appgroup

# Copy layers theo thứ tự tối ưu (ít thay đổi nhất ở dưới)
COPY --from=layer-extractor /app/dependencies/          ./
COPY --from=layer-extractor /app/spring-boot-loader/    ./
COPY --from=layer-extractor /app/snapshot-dependencies/ ./
COPY --from=layer-extractor /app/application/           ./

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]