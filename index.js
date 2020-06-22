const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const https = require("https");
const http = require("http");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 3007;
const SPORT = process.env.SPORT || 3008;
const TOKEN = require("./tokenProvider");

app.use(express.json());
app.use(cors());

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

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username && !password) {
    res.status(500).json({
      success: 0,
      message: "Username and Password not given in request Body!",
    });
  } else {
    const account = {
      username: "agent1",
      password: "1234",
    };
    if (username === account.username && password === account.password) {
      const token = generateAccessToken({ username });
      res.json({
        success: 1,
        message: "success",
        token,
      });
    } else {
      res.json({
        success: 0,
        message: "username or password wrong",
      });
    }
  }
});

app.get("/hello", authenticateToken, (req, res) => {
  console.log(req.headers);
  res.json({ message: `hello ${req.user.username}` });
});

http.createServer(app).listen(PORT, () => {
  console.log("server run on port ", PORT);
});

https
  .createServer(
    {
      key: fs.readFileSync("/home/thor/key/key.pem"),
      cert: fs.readFileSync("/home/thor/key/cert.pem"),
    },
    app
  )
  .listen(SPORT, () => {
    console.log("server https on PORT " + SPORT);
  });
