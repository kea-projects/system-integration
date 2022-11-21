FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY ./apps/email-service/ .

RUN npm ci --only=production


EXPOSE 8080
ENTRYPOINT [ "node", "app.js" ]