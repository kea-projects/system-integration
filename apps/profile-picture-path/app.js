import chalk from "chalk";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import { picsRouter } from "./routes/pics.controller.js";

// ---- Config ----
const PORT = process.env.SERVER_PORT || 8080;

const app = express();
const server = http.createServer(app);

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Endpoints ----
app.use("/pics", picsRouter);

app.get("/", (req, res) => {
  res.send(418, {
    getAllPics: "GET /pics/",
    getPicById: "GET /pics/:picId",
    uploadPic: "POST /pics/",
    docs: "https://bit.ly/3uTw3UC",
  });
});

// ---- Server Start ----
server.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }

  // Check if the necessary environment variables are present
  if (!process.env.AZURE_CONNECTION_STRING) {
    console.log(
      chalk.redBright(
        "[ERROR] The Azure storage connection string is missing from environment variables, shutting down!"
      )
    );
    server.close();
    return;
  }
  // Check if the necessary environment variables are present
  if (!process.env.AZURE_STORAGE_ACCOUNT_NAME) {
    console.log(
      chalk.redBright(
        "[ERROR] The Azure storage name is missing from environment variables, shutting down!"
      )
    );
    server.close();
    return;
  }
  // Check if the necessary environment variables are present
  if (!process.env.AZURE_CONNECTION_STRING) {
    console.log(
      chalk.redBright(
        "[ERROR] The Azure storage container name is missing from environment variables, shutting down!"
      )
    );
    server.close();
    return;
  }

  console.log(
    chalk.yellowBright("Server has started on p̷̡̙̙͇̮̖̮̩̯̹̹͎̟̌̈̎̎͌̈́̽̐̾̊̅͘͘͠͠o̶̡̡͎̰͍̳̼̟͓̺̱͒̅̔̈̐̚͜ͅr̴̛͍̽̈́̂̏͘ţ̷̰͉͚̪̖͉͚̌́̃̑̌͆̇:"),
    chalk.redBright(PORT)
  );
});
