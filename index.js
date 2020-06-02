const express = require("express");
const app = express();
const http = require("http");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 3000;
const TOKEN = require("./tokenProvider");

const generateAccessToken = (username) => {
  // expires after a hour
  return jwt.sign(username, TOKEN, { expiresIn: "3600s" });
};

const authenticateToken = (req, res, next) => {
  // Gather the jwt access token from the request params
  const authHeader = req.params.token;
  if (authHeader == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(authHeader, TOKEN, (error, user) => {
    if (error) return res.send({ error });
    req.user = user;
    next();
  });
};

app.get("/:username", (req, res) => {
  const { username } = req.params;
  const token = generateAccessToken({ username });
  res.json({ TOKEN_SECRET: token });
});

app.get("/login/:username/:token", authenticateToken, (req, res) => {
  res.json(req.user);
});

http.createServer(app).listen(PORT, () => {
  console.log("server run on port ", PORT);
});
