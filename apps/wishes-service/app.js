import chalk from "chalk";
import "dotenv/config";
import express from "express";
import { initDatabase } from "./database/database.service.js";
import { wishesRouter } from "./routes/wishes.router.js";

const PORT = process.env.SERVER_PORT || 8080;
const app = express();

app.use(express.json());
app.use("/wishes", wishesRouter);

app.all("/wishes*", (req, res) => {
  res.status(418).send({
    endpoints: {
      getAll: {
        method: "GET",
        route: "/wishes",
        returns: "A list of wishes",
      },
      makeAWish: {
        method: "POST",
        route: "/wishes",
        requirements: "Request Body with productName field, and a bearer token",
        returns: "A created wish",
      },
    },
  });
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }

  initDatabase();

  console.log(
    chalk.yellowBright("Wishes Server has started on port:"),
    chalk.redBright(`http://localhost:${PORT}`)
  );
});
