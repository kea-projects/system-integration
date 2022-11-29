import { checkTokenIsValid } from "../utils/amqp-utils.js";

// TODO: CHECK IF IT IS THE CORRECT USE OF FORBIDDEN AND NOT AUTHORIZED

export const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization ? authorization.split(" ")[1] : null;

  if (token === null) {
    res.status(403).send({ message: "Forbidden!" });
  } else {
    checkTokenIsValid(
      token,
      (message) => {
        const response = Boolean(Number(message.content.toString()));

        if (response === true) {
          next();
        } else {
          res.status(403).send({ message: "Forbidden!" });
        }
      },
      () => {
        res.status(403).send({ message: "Forbidden!" });
      }
    );
  }
};
