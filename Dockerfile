FROM node:alpine

ENV NODE_ENV=development

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install && npm install -g sequelize-cli

COPY . .

CMD [ "npm", "run", "db:reset:dev" ]