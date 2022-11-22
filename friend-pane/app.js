import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import chalk from "chalk";

import { usersRouter } from "./routes/users.js";
import { friendpaneRouter } from "./routes/friendpane.js";
import {
  inviteUser,
  getAllUsers,
  isEmailUsed,
  getUserByEmail,
  registerUser,
  loginUser,
  disconnectUser,
} from "./utils/socket-utils.js";

const PORT = process.env.SERVER_PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use(express.json());

app.use("/friendpane", friendpaneRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.redirect("/friendpane");
});

io.on("connection", (socket) => {
  console.log(
    chalk.yellowBright("New socket connected:"),
    chalk.redBright(socket.id)
  );

  socket.on("login-start", (data) => {
    if (isEmailUsed(data.userEmail)) {
      const user = getUserByEmail(data.userEmail);
      console.log(chalk.yellowBright("Login started for user:"), user);
      if (user.username && user.password && user.status !== "Not registered") {
        socket.emit("login-continue-password", { userEmail: data.userEmail });
      } else {
        socket.emit("login-continue-register", { userEmail: data.userEmail });
      }
    }
  });
  socket.on("login-register", (data) => {
    registerUser({ ...data, id: socket.id });
    socket.emit("login-done");
    socket.broadcast.emit("refresh");
  });
  socket.on("login-password", (data) => {
    loginUser(
      { ...data, id: socket.id },
      () => {
        socket.emit("login-done");
        socket.broadcast.emit("refresh");
      },
      () => socket.emit("login-fail")
    );
  });
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

server.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }

  console.log(
    chalk.yellowBright("Server has started on port:"),
    chalk.redBright(PORT)
  );
});
