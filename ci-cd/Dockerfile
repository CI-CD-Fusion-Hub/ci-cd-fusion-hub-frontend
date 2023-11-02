FROM node:18-alpine as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /app
COPY ci-cd/nginx.conf /etc/nginx/nginx.conf
RUN apk update && apk upgrade

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
