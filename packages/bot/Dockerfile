FROM node:15-alpine as BUILD

# --unsafe-perm
RUN npm -g i pnpm

WORKDIR /usr/app

RUN apk add --no-cache \
  build-base \
  g++ \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

COPY src ./

RUN npx tsc && pnpm prune --prod && pnpm store prune

FROM node:15-alpine

WORKDIR /usr/app

COPY --from=BUILD /usr/app/dist /user/app/package.json /user/app/node_modules ./
COPY --from=BUILD /.pnpn-store /
COPY --from=BUILD /user/app/src/gql ./dist

CMD cd dist && node index.js
