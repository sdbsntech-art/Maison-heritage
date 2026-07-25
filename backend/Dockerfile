FROM node:22-alpine

WORKDIR /var/www/html

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
