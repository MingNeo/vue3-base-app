FROM node:16-alpine as build-stage

WORKDIR /app

COPY .npmrc package*.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
