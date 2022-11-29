import { checkTokenIsValid } from "../utils/amqp-utils.js";

// TODO: CHECK IF IT IS THE CORRECT USE OF FORBIDDEN AND NOT AUTHORIZED

export const validateSocketToken = (socket, next) => {
  const token = socket.handshake.auth.token;
  const forbiddenError = getForbiddenError();

  if (token === null) {
    next(forbiddenError);
  } else {
    checkTokenIsValid(
      token,
      (message) => {
        const response = Boolean(Number(message.content.toString()));

        if (response === true) {
          next();
        } else {
          next(forbiddenError);
        }
      },
      () => {
        next(forbiddenError);
      }
    );
  }
};

const getForbiddenError = () => {
  const error = new Error("Forbidden!");
  error.data = { content: "Please retry later" };
  return error;
};
