import jwt_decode from "jwt-decode";

export const getAuthUser = (req) => {
  const { authorization } = req.headers;
  const token = authorization ? authorization.split(" ")[1] : null;
  const decodedToken = jwt_decode(token);

  return decodedToken["sub"];
};
