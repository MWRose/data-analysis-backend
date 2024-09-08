FROM node as base

WORKDIR /code

COPY package*.json ./

RUN npm install
COPY . . 

ENV NODE_PATH=./build

RUN npm run build