FROM node:20

WORKDIR /app
COPY ./app/package.json ./app/yarn.lock ./
RUN yarn
COPY ./app .

RUN yarn test:e2e && yarn build

CMD ["yarn", "start"]
