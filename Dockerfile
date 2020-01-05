FROM node

WORKDIR /app

COPY . .

RUN rm -rf /app/node_modules
ARG registry=https://registry.npm.taobao.org
ARG disturl=https://npm.taobao.org/dist
RUN npm config set disturl $disturl
RUN npm config set registry $registry
RUN npm install
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm","run","start:prod"]