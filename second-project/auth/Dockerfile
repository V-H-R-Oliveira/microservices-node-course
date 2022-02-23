FROM node:16-alpine

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install --silent --only=prod

COPY ./ ./

ENV PORT=3000

EXPOSE ${PORT}

CMD [ "npm", "run", "dev" ]