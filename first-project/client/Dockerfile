FROM node:16-alpine

ENV CI=true

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install --silent

COPY ./ ./

EXPOSE 3000

CMD [ "npm", "start" ]