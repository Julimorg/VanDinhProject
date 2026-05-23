# System Workflow — VanDinh Self-Host Server

---

## 1. Request Flow (Browser → API)

```
User Browser
     │
     │  HTTPS https://api.van-dinh.net
     ▼
Cloudflare Edge (Singapore)
     │
     │  Cloudflare Tunnel (QUIC protocol, mã hóa)
     │  Không cần mở port, không cần IP tĩnh
     ▼
cloudflared service (chạy trên laptop)
     │
     │  http://localhost:8080
     ▼
Docker Container: Spring Boot App
     │
     ├── PostgreSQL (NeonDB - cloud)
     ├── Elasticsearch (Docker container)
     └── Cloudinary, VNPay, SendGrid... (external services)
```

**Lưu ý:** Nginx hiện tại đang chạy trên port 80 nhưng **không nằm trong request flow** của API.
Cloudflare Tunnel đi thẳng vào port 8080 của Spring Boot.
Nginx có thể dùng sau này nếu cần serve nhiều service trên cùng domain.

---

## 2. CI/CD Deploy Flow (Push code → Deploy)

```
Developer máy local
     │
     │  git push origin main
     ▼
GitHub Repository (Julimorg/VanDinhProject)
     │
     │  Trigger GitHub Actions workflow
     ▼
Job 1: backend (runs-on: ubuntu-latest)
     │  - Checkout code
     │  - Setup JDK 21
     │  - ./gradlew :app:build -x test
     ▼
Job 2: docker-build-push (runs-on: ubuntu-latest)
     │  - Login Docker Hub
     │  - Build Docker image từ ./BE/Dockerfile
     │  - Push image lên Docker Hub
     │    → jianfong/van-dinh-be:latest
     │    → jianfong/van-dinh-be:{git-sha}
     ▼
Job 3: deploy (runs-on: self-hosted)
     │  ← Runner này chạy TRÊN laptop server
     │  - docker pull jianfong/van-dinh-be:latest
     │  - cd /home/jianfong/app
     │  - docker compose up -d
     │  - docker image prune -f
     ▼
Spring Boot container restart với image mới ✅
```

---

## 3. Docker Compose Architecture

```
/home/jianfong/app/
├── docker-compose.yml
└── .env

Docker Network (bridge):
┌─────────────────────────────────────┐
│                                     │
│  [app container]      port 8080     │──► host:8080
│   Spring Boot                       │
│   jianfong/van-dinh-be:latest       │
│   depends_on: elasticsearch healthy │
│                                     │
│  [elasticsearch container]          │
│   elasticsearch:8.18.1              │──► host:9200
│   ES_JAVA_OPTS=-Xms256m -Xmx256m   │
│   mem_limit: 512m                   │
│   volume: es_data                   │
│                                     │
└─────────────────────────────────────┘
```

---

## 4. Cloudflare Tunnel hoạt động như thế nào?

```
Bình thường (không có tunnel):
  Internet → Router → Port Forwarding → Server
  ❌ Cần IP tĩnh
  ❌ Cần mở port trên router
  ❌ Lộ IP thật

Với Cloudflare Tunnel:
  Internet → Cloudflare Edge → Tunnel → cloudflared → Server
  ✅ Không cần IP tĩnh
  ✅ Không cần mở port
  ✅ IP thật được ẩn
  ✅ HTTPS tự động
  ✅ DDoS protection của Cloudflare
```

---

## 5. Self-Hosted Runner hoạt động như thế nào?

```
Bình thường (SSH deploy):
  GitHub Actions → SSH → Server
  ❌ Server phải có public IP
  ❌ Phải mở port SSH ra internet

Với Self-Hosted Runner:
  GitHub Actions ←→ Runner (trên server) ←→ GitHub
  Runner tự kết nối ra GitHub, không cần inbound
  ✅ Không cần public IP
  ✅ Không cần mở port
  ✅ Runner chạy deploy ngay trên server
```

---

## 6. Tóm tắt Ports

| Port | Service | Accessible từ |
|------|---------|--------------|
| 8080 | Spring Boot | localhost (qua Cloudflare Tunnel) |
| 9200 | Elasticsearch | localhost only |
| 80 | Nginx | LAN (192.168.1.x) |
| 22 | SSH | LAN only |