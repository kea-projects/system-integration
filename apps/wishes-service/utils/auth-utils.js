import jwt_decode from "jwt-decode";

/**
 * Decodes the Authorization token and returns an object with the userId and Email fields
 * @param {*} req
 * @returns {{email: string, userId: UUID}} Object containing userId and email
 */
export const getUserDetails = (req) => {
  const { authorization } = req.headers;
  const token = authorization ? authorization.split(" ")[1] : null;
  const decodedToken = jwt_decode(token);

  return { email: decodedToken["sub"], userId: decodedToken["user_id"] };
};
