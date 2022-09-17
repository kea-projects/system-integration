import { Router } from "express";
import fs from "fs";
import path from "path";

const friendpane = fs.readFileSync(
  path.resolve("./public/friendpane/friendpane.html"),
  "utf-8"
);

export const friendpaneRouter = Router();

friendpaneRouter.get("/", (req, res) => {
  res.send(friendpane);
});
