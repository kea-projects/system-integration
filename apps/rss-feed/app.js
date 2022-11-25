import chalk from "chalk";
import "dotenv/config";
import express from "express";
import RSS from "rss";
import { v4 as uuidv4 } from "uuid";
import { wishes } from "./constants/wishes.constant.js";

const PORT = process.env.SERVER_PORT || 8080;
const feed = new RSS({
  title: "The wishes",
  description: "What people wish for",
  feed_url: `localhost:${PORT}`,
  site_url: `localhost:${PORT}`,
  docs: `localhost:${PORT}`,
});
wishes.forEach((wish) => feed.item({ ...wish, guid: uuidv4() }));

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.type("text/xml").send(feed.xml());
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }

  console.log(
    chalk.yellowBright("RSS Feed Server has started on port:"),
    chalk.redBright(`http://localhost:${PORT}`)
  );
});
