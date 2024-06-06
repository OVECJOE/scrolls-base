FROM node:20.14.0-alpine

WORKDIR /app

COPY package*.json .

RUN npm install
RUN npm install -g pm2

COPY . .

RUN npm run prisma:generate
RUN npm run build

COPY .env .
COPY start.sh .

RUN chmod +x start.sh

ENV NODE_ENV=production

EXPOSE 4000

CMD ["./start.sh"]
