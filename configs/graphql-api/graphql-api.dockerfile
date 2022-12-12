FROM node:alpine

# Expose used ports
EXPOSE 5500

# Setting the work direcory for our app.
WORKDIR /app

# Copy the source code
# Note: some files are ignored in the .dockerignore of the app.
COPY ./apps/graphql-api /app/

RUN apk add python3 make gcc libc-dev g++
RUN npm install sqlite3
# Install dependencies
RUN npm install --only-production --force

# Run the app
ENTRYPOINT [ "npm", "start" ]