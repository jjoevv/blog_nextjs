# Base image
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production image
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app ./my-blog-vite
COPY package*.json ./
RUN npm install --production

EXPOSE 3000

CMD ["npm", "start"]
