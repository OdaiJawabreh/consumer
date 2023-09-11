FROM node:16.19.1-alpine3.16

# Create app directory
WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 30702

CMD [ "node", "index.js" ]
