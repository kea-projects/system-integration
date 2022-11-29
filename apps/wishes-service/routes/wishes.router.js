import { Router } from "express";
import { createWish, getWishes } from "../database/database.service.js";

export const wishesRouter = Router();

/**
 * Get all wishes.
 * @returns a list of wishes.
 */
wishesRouter.get("/", async (_req, res) => {
  res.send(await getWishes());
});

/**
 * Make a wish
 * @returns a created wish.
 */
wishesRouter.post("/", async (req, res) => {
  if (!req.body || !req.body.productName) {
    res
      .status(400)
      .send({ message: "The body has to have a productName field" });
    return;
  }
  res.send(await createWish(req.body.productName, "23456"));
});
