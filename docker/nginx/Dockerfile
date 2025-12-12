# docker/nginx/Dockerfile
FROM nginx:1.27-alpine

# Наш конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Статика фронта смонтирована volume-ом в /usr/share/nginx/html