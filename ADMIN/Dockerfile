# # Stage 1: Build React app
# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN yarn

# COPY . .
# RUN yarn build

# # Stage 2: Serve with `serve`
# FROM node:20-alpine

# WORKDIR /app

# # Install static server
# RUN yarn global add serve

# # Copy built files from builder
# COPY --from=builder /app/dist ./dist

# EXPOSE 5173

# CMD ["serve", "-s", "dist", "-l", "5173"]

# Stage 1: Build React app
FROM node:20-alpine AS builder

# ✅ Cài git trước khi chạy yarn
RUN apk add --no-cache git

WORKDIR /app

COPY package*.json ./

RUN yarn config set network-timeout 600000

RUN yarn

COPY . .
RUN yarn build

# Stage 2: Serve with `serve`
FROM node:20-alpine

WORKDIR /app


# Install static server
RUN yarn global add serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]

