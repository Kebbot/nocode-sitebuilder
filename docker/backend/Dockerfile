FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# + КЛИЕНТ Postgres (даёт pg_isready и psql)
RUN apk add --no-cache bash curl postgresql15-client

COPY backend/package.json ./
RUN yarn install --production=false

COPY backend .

# wait script
COPY tools/scripts/wait-for-postgres.sh /usr/local/bin/wait-for-postgres.sh
RUN sed -i 's/\r$//' /usr/local/bin/wait-for-postgres.sh && chmod +x /usr/local/bin/wait-for-postgres.sh

CMD ["sh","-lc","wait-for-postgres.sh && node src/server.js"]