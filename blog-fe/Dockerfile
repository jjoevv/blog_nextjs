FROM node:18-slim

USER root

# Tạo thư mục nếu chưa có, rồi gán quyền cho user node
RUN mkdir -p /home/node && chown -R node:node /home/node

# Set lại biến môi trường HOME cho đúng
ENV HOME=/home/node

USER node
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:18-alpine
USER root
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
