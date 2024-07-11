# FROM node:alpine AS builder

FROM node:alpine

WORKDIR /app/frontend

# COPY .env /app/frontend/
COPY arduino-client/public/ /app/frontend/public
COPY arduino-client/src/ /app/frontend/src
COPY arduino-client/. /app/frontend/

RUN npm install && npm run build && npm run preview

EXPOSE 4173

CMD ["serve", "-l", "80", "-s", "build"]
