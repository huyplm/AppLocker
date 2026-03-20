# ──────────────────────────────────────────────
# Stage 1 — Build the Expo web export
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package.json package-lock.json ./

# Install all dependencies (including devDeps needed for the build)
RUN npm ci --legacy-peer-deps

# Copy the rest of the source
COPY . .

# Export as a static web bundle into /app/dist
RUN npx expo export --platform web --output-dir dist

# ──────────────────────────────────────────────
# Stage 2 — Serve with Nginx (tiny, production)
# ──────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the static bundle from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config: SPA routing (fallback to index.html for any path)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
