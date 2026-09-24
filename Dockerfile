# Multi-stage: build the static assets, then serve them with nginx. Fully
# self-contained -- unlike an earlier version of this pipeline, no other
# repo's build ever reaches into this one (or vice versa). nginx reverse-
# proxies /api and /ws to BACKEND_HOST so the browser sees one origin,
# while the two services stay two independently built/deployed images.
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
ENV BACKEND_HOST=backend:8080
EXPOSE 80
