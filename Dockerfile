FROM node

WORKDIR /app

COPY . .

RUN rm -rf /app/node_modules
RUN npm install
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm","run","start:prod"]