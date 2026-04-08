# ---------- Stage 1: Build ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build production assets
RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:1.27-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config (optional but recommended)
#COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
