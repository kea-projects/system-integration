FROM node:alpine

# Expose used ports
EXPOSE 8080

# Setting the work direcory for our app.
WORKDIR /app

# Copy the source code
# Note: some files are ignored in the .dockerignore of the app.
COPY ./apps/rss-path /app/

# Install dependencies
RUN ["npm", "ci"]

# Run the app
ENTRYPOINT [ "node", "app.js" ]
