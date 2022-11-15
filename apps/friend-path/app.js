import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import chalk from "chalk";

import { sendInvite } from "./utils/amqp-utils.js";
import {
  getAllUsers,
  disconnectUser,
} from "./utils/socket-utils.js";
import { validateEmail } from "./utils/validators.js";

// ---- Config ----
const PORT = process.env.SERVER_PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Endpoints ----
app.post("/friend/invite", (req, res) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    res.status(400).send("Email required.");
  }

  // TODO: Check if the email is already invited to the friend list.

  sendInvite(
    email,
    () => res.send({ message: "User invited!" }),
    () => res.status(500).send({ message: "An error has ocurred." })
  );
});

// ---- Sockets ----
io.on("connection", (socket) => {
  console.log(
    chalk.yellowBright("New socket connected:"),
    chalk.redBright(socket.id)
  );

  socket.on("disconnect", (_) => {
    disconnectUser(socket.id);
    socket.broadcast.emit("refresh");
  });

  socket.on("get-users", (data) => {
    socket.emit("all-users", { users: getAllUsers() });
  });

  socket.on("invite-user", (data) => {
    inviteUser(data.userEmail, (user) => {
      socket.emit("invite-user-success", { ...user });
      socket.broadcast.emit("refresh");
    });
  });
});

// ---- Server Start ----
server.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }

  console.log(
    chalk.yellowBright("Server has started on port:"),
    chalk.redBright(PORT)
  );
});
