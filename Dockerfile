FROM ghcr.io/qtvhao/node-20.12.2:main

WORKDIR /app
COPY ./app/package.json ./app/yarn.lock ./
RUN yarn
COPY ./app .

RUN yarn build

CMD ["yarn", "start"]
