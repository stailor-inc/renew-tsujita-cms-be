FROM node:18.13.0-alpine
WORKDIR /app
COPY . .
RUN yarn install


EXPOSE 3000