import chalk from "chalk";
import cors from "cors";
import "dotenv/config";
import express from "express";
import RSS from "rss";
import { v4 as uuidv4 } from "uuid";
import { wishes } from "./constants/wishes.constant.js";

const PORT = process.env.SERVER_PORT || 8084;
const feed = new RSS({
  title: "The wishes",
  description: "What people wish for",
  feed_url: `localhost:${PORT}`,
  site_url: `localhost:${PORT}`,
  docs: `localhost:${PORT}`,
});
wishes.forEach((wish) => feed.item({ ...wish, guid: uuidv4() }));

const app = express({
  cors: {
    origin: "*",
  },
});

app.use(cors());

app.use(express.json());

app.get("/rss", (req, res) => {
  res.type("text/xml").send(feed.xml());
});

app.put("/rss", (req, res) => {
  if (!req.body || !req.body.title) {
    res.status(400).send({ message: "The body has to have a title field" });
    return;
  }
  feed.item({ title: req.body.title, guid: uuidv4() });
  res.status(201).send({ message: "Item added to the feed" });
});

app.all("/rss*", (req, res) => {
  res.status(418).send({
    endpoints: {
      getFeed: `GET /rss`,
      addToFeed: `PUT /rss - request body contains a title field`,
    },
  });
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
