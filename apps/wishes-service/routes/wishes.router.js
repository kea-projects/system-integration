import { Router } from "express";
import {
  createWish,
  deleteWish,
  getWishes,
} from "../database/database.service.js";
import { validateToken } from "../middleware/auth.js";
import { getUserId } from "../utils/auth-utils.js";

export const wishesRouter = Router();

/**
 * Get all wishes.
 * @returns a list of wishes.
 */
wishesRouter.get("/", validateToken, async (req, res) => {
  res.send(await getWishes());
});

/**
 * Make a wish
 * @returns a created wish.
 */
wishesRouter.post("/", validateToken, async (req, res) => {
  if (!req.body || !req.body.productName) {
    res
      .status(400)
      .send({ message: "The body has to have a productName field" });
    return;
  }
  const userId = getUserId(req);
  res.send(await createWish(req.body.productName, userId));
});

/**
 * Delete a wish
 * @returns a deleted wish.
 */
wishesRouter.delete("/", validateToken, async (req, res) => {
  if (!req.body || !req.body.productName) {
    res
      .status(400)
      .send({ message: "The body has to have a productName field" });
    return;
  }
  const userId = getUserId(req);
  await deleteWish(req.body.productName, userId);
  res.status(204).send({ message: "Deleted" });
});
