import chalk from "chalk";
import "dotenv/config";
import express from "express";

const PORT = process.env.SERVER_PORT || 8080;
const app = express();

app.use(express.json());

app.all("/wishes*", (req, res) => {
  res.status(418).send({
    endpoints: {},
  });
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }

  console.log(
    chalk.yellowBright("Wishes Server has started on port:"),
    chalk.redBright(`http://localhost:${PORT}`)
  );
});
