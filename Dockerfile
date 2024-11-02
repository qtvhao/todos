FROM ghcr.io/qtvhao/debian-minimum:main

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

RUN which node || nvm install 20
RUN npm -v && node -v
RUN which yarn || npm install -g yarn

WORKDIR /app
COPY ./app/package.json ./app/yarn.lock ./
RUN yarn
COPY ./app .

RUN yarn build

CMD ["yarn", "start"]
