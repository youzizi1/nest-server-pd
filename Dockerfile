FROM node:12

WORKDIR /app

COPY . .

RUN rm -rf /app/node_modules
RUN npm cache clean -f
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm","run","start:prod"]