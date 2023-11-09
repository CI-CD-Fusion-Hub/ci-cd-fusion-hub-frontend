FROM node:18-alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install
ENV VITE_backendUrl=VITE_backendUrl_REPLACE
RUN npm run lint:fix
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /app
COPY ci-cd/nginx.conf /etc/nginx/nginx.conf
RUN apk update && apk upgrade

# Running the script at container run
COPY ci-cd/env_replace.sh /docker-entrypoint.d/env_replace.sh
RUN chmod +x /docker-entrypoint.d/env_replace.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
