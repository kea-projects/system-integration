import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import chalk from "chalk";
import { friendpaneRouter } from "./routes/friendpane.js";

const PORT = process.env.SERVER_PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use(express.json());

app.use("/friendpane", friendpaneRouter);

io.on("connection", (socket) => {
  console.log(
    chalk.yellowBright("New socket connected:"),
    chalk.redBright(socket.id)
  );

  socket.on("ping", (data) => {
    console.log(
      chalk.yellowBright("Received ping: "),
      chalk.redBright(data.message)
    );
    socket.emit("pong", { message: data.message });
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
