FROM node:20.14.0-alpine

RUN apk update && apk add --no-cache curl
RUN apk add nano vim

WORKDIR /home/scrolls/base

ENV NODE_ENV=development

COPY prisma ./prisma/
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prisma:generate

CMD [ "npm", "run", "dev" ]
