import jwt_decode from "jwt-decode";
import { getUserFriends } from "./amqp-utils.js";
import chalk from "chalk";

export const getSocketUser = (socket) => {
  const token = socket.handshake.auth.token;
  const decodedToken = jwt_decode(token);

  return decodedToken["sub"];
};

export const emitStatusUpdate = async (socket, io) => {
  const statusList = [
    {
      email: getSocketUser(socket),
      status: "online",
    },
  ];

  getUserFriends(
    getSocketUser(socket),
    async (response) => {
      const friendsList = JSON.parse(response.content.toString());
      for (const friend of friendsList) {
        let status = friend.isRegistered ? "offline" : "not-registered";

        if (await userIsConnected(friend.email, io)) {
          status = "online";
        }

        statusList.push({ email: friend.email, status });
      }

      console.log(
        chalk.yellowBright("Message:"),
        chalk.redBright(JSON.stringify(statusList)),
        chalk.yellowBright("sent to socket:"),
        chalk.redBright(getSocketUser(socket)),
        chalk.yellowBright("from user:"),
        chalk.redBright(getSocketUser(socket))
      );
      socket.emit("statusUpdate", statusList);
    },
    () => null
  );
};

const userIsConnected = async (email, io) => {
  const sockets = await io.fetchSockets();

  for (const socket of sockets) {
    if (getSocketUser(socket) === email) {
      return true;
    }
  }
  return false;
};
