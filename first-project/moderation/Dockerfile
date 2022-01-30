FROM node:16-alpine

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install --silent

COPY ./ ./

EXPOSE 9091

CMD [ "npm", "start" ]