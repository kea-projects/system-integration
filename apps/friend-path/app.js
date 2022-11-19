import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import chalk from "chalk";

import { sendInvite, checkUserIsInvited } from "./utils/amqp-utils.js";
import { getSocketUser, emitStatusUpdate } from "./utils/socket-utils.js";
import { validateEmail } from "./utils/validators.js";
import { getAuthUser } from "./utils/auth-utils.js";
import { validateToken } from "./middleware/auth.js";
import { validateSocketToken } from "./middleware/socket-auth.js";

// ---- Config ----
const PORT = process.env.SERVER_PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  transports: ["polling", "websocket"],
});

// ---- Middleware ----
app.use(cors());
app.use(express.json());

io.use(validateSocketToken);

// ---- Endpoints ----
app.get("/friend/health", (_, res) => {
  res.send({ message: "Up and running!" });
});

app.post("/friend/invite", validateToken, (req, res) => {
  const { email } = req.body;

  if (!email || !validateEmail(email)) {
    res.status(400).send("Email required.");
  }

  checkUserIsInvited(
    {
      invitee: getAuthUser(req),
      invited: email,
    },
    (message) => {
      const response = Boolean(Number(message.content.toString()));

      if (response === true) {
        res.status(400).send({ message: "Email already invited." });
      } else {
        sendInvite(
          {
            invitee: getAuthUser(req),
            invited: email,
          },
          () => res.send({ message: "User invited!" }),
          () => res.status(500).send({ message: "An error has ocurred." })
        );
      }
    },
    () => res.status(500).send({ message: "An error has ocurred." })
  );
});

// ---- Sockets ----
io.on("connection", (socket) => {
  console.log(
    chalk.yellowBright("New socket connected:"),
    chalk.redBright(socket.id),
    chalk.yellowBright("from user:"),
    chalk.redBright(getSocketUser(socket))
  );
  // TODO Update the users list for this dude.
  socket.broadcast.emit("refresh");

  socket.on("status", async (_) => {
    console.log(
      chalk.yellowBright("Socket:"),
      chalk.redBright(socket.id),
      chalk.yellowBright("from user:"),
      chalk.redBright(getSocketUser(socket)),
      chalk.yellowBright("requested the friends status.")
    );

    emitStatusUpdate(socket, io);
  });

  socket.on("disconnect", (_) => {
    console.log(
      chalk.yellowBright("Socket:"),
      chalk.redBright(socket.id),
      chalk.yellowBright("from user:"),
      chalk.redBright(getSocketUser(socket)),
      chalk.yellowBright("disconnected.")
    );
    // TODO Update the users list for this dude.
    socket.broadcast.emit("refresh");
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
