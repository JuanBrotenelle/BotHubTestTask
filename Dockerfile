FROM node:20.17.0

WORKDIR /app

COPY package*.json ./

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "start:dev"]