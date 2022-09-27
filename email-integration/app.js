import chalk from "chalk";
import "dotenv/config";
import express from "express";

import { emailsRouter } from "./routes/emails.js";

const PORT = process.env.SERVER_PORT || 8080;

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use("/emails", emailsRouter);

app.get("/", (req, res) => {
  res.redirect("/emails");
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }

  console.log(
    chalk.yellowBright("Server has started on port:"),
    chalk.redBright(`http://localhost:${PORT}`)
  );
});
