# Stage 1: Build ứng dụng
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy source code
COPY . .

# Cấp quyền thực thi cho mvnw rồi build
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Chạy ứng dụng
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy file jar từ stage build
COPY --from=build /app/target/*.jar app.jar

# Render sẽ inject PORT, mình expose mặc định 8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
