FROM node:latest


RUN mkdir question_server

RUN npm install pm2 -g

WORKDIR /question_server

COPY package.json .

RUN npm i

COPY src/ .

EXPOSE 8000

ENV NODE_ENV=pro
ENV PORT=8000
ENV ACCESS_TOKEN_SECRET=uieiueredsofhewefd
ENV REFRESH_TOKEN_SECRET=wqwoehoiasdfewfwebof
ENV REMOTE_DATABASE_URL=mongodb://15.207.54.186:27017/question

CMD [ "pm2-runtime", "config/process.config.js"]