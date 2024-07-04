FROM node:16

# # Install Python
# RUN apt-get update && \
#     apt-get install -y python3 python3-pip
# Create app directory
WORKDIR /opt/data-reader
COPY .env ./

COPY /data-reader/package.json ./
RUN npm cache clean --force && rm -rf node_modules && npm i && npm audit fix || true

COPY /data-reader .

CMD ["npm", "start"]
