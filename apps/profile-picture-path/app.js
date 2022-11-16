import chalk from "chalk";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";

// ---- Config ----
const PORT = process.env.SERVER_PORT || 8080;

const app = express();
const server = http.createServer(app);

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Endpoints ----
app.get("/", (req, res) => {
  res.send(418, {
    message: "ya yeet",
  });
});

// ---- Server Start ----
server.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }

  console.log(
    chalk.yellowBright("Server has started on p̷̡̙̙͇̮̖̮̩̯̹̹͎̟̌̈̎̎͌̈́̽̐̾̊̅͘͘͠͠o̶̡̡͎̰͍̳̼̟͓̺̱͒̅̔̈̐̚͜ͅr̴̛͍̽̈́̂̏͘ţ̷̰͉͚̪̖͉͚̌́̃̑̌͆̇:"),
    chalk.redBright(PORT)
  );
});
