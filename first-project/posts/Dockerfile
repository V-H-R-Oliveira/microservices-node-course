FROM node:16-alpine

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install --silent

COPY ./ ./

EXPOSE 8000

CMD [ "npm", "start" ]