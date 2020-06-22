const jwt = require("jsonwebtoken");
const TOKEN = require("../helpers/tokenProvider");

const getTokenFromHeader = (req) => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const generateAccessToken = (username) => {
  // expires after a hour
  return jwt.sign(username, TOKEN, { expiresIn: "3600s" });
};

const authenticateToken = (req, res, next) => {
  // Gather the jwt access token from the request params
  const authorization = getTokenFromHeader(req);
  const authHeader = authorization;
  if (authHeader == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(authHeader, TOKEN, (error, user) => {
    if (error) return res.send({ error });
    req.user = user;
    next();
  });
};

module.exports = { getTokenFromHeader, generateAccessToken, authenticateToken };
