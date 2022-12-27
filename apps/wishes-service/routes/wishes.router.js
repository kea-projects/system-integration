import { Router } from "express";
import {
  createWish,
  deleteWish,
  getWishes,
} from "../database/database.service.js";
import { validateToken } from "../middleware/auth.js";
import { getUserDetails } from "../utils/auth-utils.js";

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
  const { userId, email } = getUserDetails(req);
  res.send(await createWish(req.body.productName, userId, email));
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
  const { email } = getUserDetails(req);
  await deleteWish(req.body.productName, email);
  res.status(204).send();
});
