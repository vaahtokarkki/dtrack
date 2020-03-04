FROM node:12.2.0-alpine

WORKDIR /frontend
ENV PATH /frontend/node_modules/.bin:$PATH

COPY package*.json /frontend/
RUN npm install --silent

COPY . ./frontend

CMD ["npm", "start"]