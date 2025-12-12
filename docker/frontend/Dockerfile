# docker/frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# ВАЖНО: НЕ задаём NODE_ENV=production до установки зависимостей!
# Устанавливаем именно devDependencies (vite) с явным production=false.
COPY frontend/package.json ./
# Если у вас есть yarn.lock — можно добавить вторую строку COPY; если файла нет — не копируйте его.
# COPY frontend/yarn.lock ./

RUN yarn --version && yarn install --production=false

# Санити-проверка: убедимся, что vite реально установлен
RUN node -v && yarn -v && ls -la node_modules/.bin && \
    [ -f node_modules/.bin/vite ] && echo "Vite OK" || (echo "Vite missing" && exit 1)

# Теперь копируем исходники
COPY frontend .

# Сборку запускаем командой из docker-compose (yarn build)