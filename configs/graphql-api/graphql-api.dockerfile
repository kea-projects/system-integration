FROM node:alpine

RUN apk add python3 make gcc libc-dev g++

# Expose used ports
EXPOSE 5500

# Setting the work direcory for our app.
WORKDIR /app

# RUN npm install sqlite3

COPY ./apps/graphql-api/package.json /app/package.json
COPY ./apps/graphql-api/package-lock.json /app/package-lock.json
# Copy the source code
# Note: some files are ignored in the .dockerignore of the app.
RUN npm install --only-production --force

COPY ./apps/graphql-api /app/


# Install dependencies

# Run the app
ENTRYPOINT [ "npm", "start" ]