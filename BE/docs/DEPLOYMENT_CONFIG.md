# Config Files — VanDinh Self-Host Server

---

## docker-compose.yml
> Đặt tại: `/home/jianfong/app/docker-compose.yml`

```yaml
services:
  app:
    image: jianfong/van-dinh-be:latest
    ports:
      - "8080:8080"
    env_file:
      - ./.env
    restart: unless-stopped
    depends_on:
      elasticsearch:
        condition: service_healthy

  elasticsearch:
    image: elasticsearch:8.18.1
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms256m -Xmx256m
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    restart: unless-stopped
    mem_limit: 512m
    memswap_limit: 1g
    healthcheck:
      test: ["CMD-SHELL", "curl -sf http://localhost:9200/_cluster/health || exit 1"]
      interval: 15s
      timeout: 10s
      retries: 5
      start_period: 30s

volumes:
  es_data:
```

---

## Cloudflare Tunnel config.yml
> Đặt tại: `/etc/cloudflared/config.yml`

```yaml
tunnel: my-server
credentials-file: /etc/cloudflared/47d71dfd-54f6-43e7-b266-d01447897767.json

ingress:
  - hostname: api.van-dinh.net
    service: http://localhost:8080
  - service: http_status:404
```

---

## GitHub Actions CI/CD Workflow
> Đặt tại: `.github/workflows/cicd.yml`

```yaml
name: CI/CD All Projects

on:
  workflow_dispatch:
  push:
    branches: [ "main", "Fong", "bao" ]
  pull_request:
    branches: [ "main" ]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v4
        with:
          cache-read-only: ${{ github.ref != 'refs/heads/main' }}

      - name: Grant execute permission for gradlew
        working-directory: ./BE
        run: chmod +x gradlew

      - name: Build all modules (skip tests)
        working-directory: ./BE
        run: ./gradlew :app:build -x test --parallel --configuration-cache

  admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'
          cache-dependency-path: ./ADMIN/yarn.lock
      - name: Build Admin
        working-directory: ./ADMIN
        run: |
          yarn install --frozen-lockfile
          yarn build

  user:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'
          cache-dependency-path: ./USER/yarn.lock
      - name: Build User
        working-directory: ./USER
        run: |
          yarn install --frozen-lockfile
          yarn build

  docker-build-push:
    runs-on: ubuntu-latest
    needs: backend
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./BE
          push: true
          tags: |
            jianfong/van-dinh-be:latest
            jianfong/van-dinh-be:${{ github.sha }}

  deploy:
    runs-on: self-hosted
    needs: docker-build-push
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy
        run: |
          docker pull jianfong/van-dinh-be:latest
          cd /home/jianfong/app
          docker compose up -d
          docker image prune -f
```

---

## GitHub Actions Secrets

| Secret | Giá trị |
|---|---|
| `DOCKERHUB_USERNAME` | `jianfong` |
| `DOCKERHUB_TOKEN` | Personal Access Token từ Docker Hub |

---

## Các lệnh vận hành thường dùng

```bash
# Xem trạng thái containers
docker compose -f /home/jianfong/app/docker-compose.yml ps

# Xem log Spring Boot
docker compose -f /home/jianfong/app/docker-compose.yml logs -f app

# Restart app
docker compose -f /home/jianfong/app/docker-compose.yml restart app

# Xem trạng thái Cloudflare Tunnel
sudo systemctl status cloudflared

# Restart tunnel
sudo systemctl restart cloudflared

# Xem trạng thái GitHub Actions Runner
cd /home/jianfong/actions-runner/actions-runner
sudo ./svc.sh status

# Xem RAM
free -h

# Xem disk
df -h

# Xem tất cả containers
docker ps -a
```