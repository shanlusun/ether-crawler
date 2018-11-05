FROM node:8.11.1 AS builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force

COPY . /usr/src/app

CMD node
