# Bun Dockerfile for TanStack Start app on port 3000
FROM oven/bun:latest
WORKDIR /app
COPY . .
RUN bun install
RUN bun run vite build
EXPOSE 3000
CMD ["bun", "run", "dist/server/server.js"]
