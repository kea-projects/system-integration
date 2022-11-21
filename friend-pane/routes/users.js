import { Router } from "express";
import { inviteUser, createUser } from "../utils/socket-utils.js";

export const usersRouter = Router();

usersRouter.post("/invite", (req, res) => {
  inviteUser(
    req.body.email,
    () => res.send({ message: "User invited!" }),
    () => res.send({ message: "Email already used!" })
  );
});

usersRouter.post("/create", (req, res) => {
  const { email, username, password } = req.body;
  createUser(
    { email, username, password },
    (user) => res.send(user),
    () => res.send({ message: "Email already used!" })
  );
});
