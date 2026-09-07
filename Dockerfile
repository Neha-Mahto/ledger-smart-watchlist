FROM node:20-alpine AS builder

WORKDIR /app

# Copy server files & install
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/
RUN cd server && npm install

# Copy client files & install
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy rest of source code
COPY server ./server
COPY client ./client

# Build client and server
RUN cd client && npm run build
RUN cd server && npx prisma generate && npm run build

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 4000

CMD ["node", "server/dist/index.js"]
