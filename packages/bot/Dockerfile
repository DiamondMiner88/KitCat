FROM node:15-alpine

WORKDIR /usr/kitcat/bot

# Dependencies for node-gyp
# RUN apk add g++ make python

COPY package*.json ./

RUN npm i

COPY prisma .

RUN npx prisma generate

COPY . .

CMD npx tsc && npm run start
