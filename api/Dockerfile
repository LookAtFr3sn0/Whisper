FROM node:bookworm

WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD [ "node", "index.ts" ]