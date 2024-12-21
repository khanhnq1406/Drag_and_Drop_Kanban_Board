# Dockerfile for React client

# Build react client
FROM node:23-alpine

# Working directory be app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

###  Installing dependencies

RUN yarn install

RUN chown node:node node_modules/
# copy local files to app folder
COPY . .

EXPOSE 3000

CMD ["yarn","start"]