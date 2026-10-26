# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/futelatosomba-react-app/package*.json ./
RUN npm ci
COPY frontend/futelatosomba-react-app/ ./
RUN npm run build

# Stage 2: Run Express backend + serve built frontend
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./
COPY --from=frontend-build /app/frontend/build ../frontend/futelatosomba-react-app/build

EXPOSE 5000
CMD ["node", "server.js"]
