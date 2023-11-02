FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN node --version
RUN npm install

COPY . .
ENV VITE_SERVER_BASE_URL=https://cuartz.tv/api
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /app
COPY ci-cd/nginx.conf /etc/nginx/nginx.conf
RUN apk update && apk upgrade

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
