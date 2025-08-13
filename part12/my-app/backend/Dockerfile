FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV PORT=3003

EXPOSE 3003

CMD ["npm", "run", "dev"]