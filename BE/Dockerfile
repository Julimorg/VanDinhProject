# Stage 1: Build với Maven (caching tốt cho dependencies)
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy pom.xml trước để cache dependencies
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Download dependencies (cache layer này nếu pom không đổi)
RUN ./mvnw dependency:go-offline -B

# Copy source và build JAR (skip test để nhanh)
COPY src ./src
RUN ./mvnw package -DskipTests -B

# Stage 2: Extract layers cho optimized layering (tận dụng Spring Boot layertools)
FROM eclipse-temurin:21-jdk-alpine AS layer-extractor
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# Stage 3: Runtime image nhỏ nhất (chỉ JRE, alpine nhẹ, ~100-150MB final)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy layers theo thứ tự optimal (dependencies ít thay đổi nhất ở dưới)
COPY --from=layer-extractor /app/dependencies/ ./
COPY --from=layer-extractor /app/spring-boot-loader/ ./
COPY --from=layer-extractor /app/snapshot-dependencies/ ./
COPY --from=layer-extractor /app/application/ ./

# Expose port (thay 8080 nếu app bạn dùng port khác)
EXPOSE 8080

# Non-root user cho security
RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup
USER appuser

# Run với JarLauncher (tối ưu startup)
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]