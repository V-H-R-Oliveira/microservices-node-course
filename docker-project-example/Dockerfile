FROM node:alpine

WORKDIR /usr/app

# "./" is relative to build context, which is "."
COPY ./package.json ./

RUN npm install --silent

COPY ./ ./

# docker run -p <systemport>:<exposed port>
EXPOSE 8080

CMD [ "npm", "start" ]

# sudo docker build -t vitor/dummy-server .
# sudo docker run -p <my system port>:8080 vitor/dummy-server