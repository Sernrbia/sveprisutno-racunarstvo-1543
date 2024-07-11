FROM node:16

WORKDIR /opt/bluetooth-node
COPY .env ./opt/bluetooth-node

COPY ./bluetooth-node/. /opt/bluetooth-node
COPY ./bluetooth-node/node_modules /opt/bluetooth-node/node_modules

CMD ["npm", "start"]
