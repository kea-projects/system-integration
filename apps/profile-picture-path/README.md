# Profile Picture Azure Integration

This service allows the users to fetch URLs for pictures stored on Azure, as well as upload, update and delete them.

Done with Azure storage Accounts, NodeJs and Express.

## Setup and running the app

Create a `.env` file based on the [`.env.example`](.env.example) file, and fill out its properties (you will need an Azure account). The app won't run unless these variables are provided.

Use `npm install` to install the app.

Use `npm start` to run the app.

Call `GET localhost:8080/pictures` to get a list of endpoints and their info.