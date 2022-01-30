# base
FROM alpine

# software dependency
RUN apk add --update redis
RUN apk add --update gcc
RUN apk add --update clang

# running command
CMD [ "redis-server" ]