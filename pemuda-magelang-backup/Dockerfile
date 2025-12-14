FROM node:18-alpine

# Install PostgreSQL Client (agar bisa pg_dump)
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Environment variable default (bisa ditimpa docker-compose)
ENV TZ=Asia/Jakarta

CMD ["npm", "start"]