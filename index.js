const express = require("express");
const app = express();
const http = require("http");
const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 3000;
const TOKEN = require("./tokenProvider");

const generateAccessToken = (username) => {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(username, TOKEN, { expiresIn: "3600s" });
};

const authenticateToken = (req, res, next) => {
  // Gather the jwt access token from the request header
  const authHeader = req.params.token;
  // console.log(authHeader);
  // const token = authHeader && authHeader.split(' ')[1]
  if (authHeader == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(authHeader, TOKEN, (error, user) => {
    if (error) return res.send({ error });
    req.user = user;
    next();
  });
};

app.get("/:username", (req, res) => {
  // res.send("process.env.TOKEN_SECRET", process.env.TOKEN_SECRET);
  const { username } = req.params;
  const token = generateAccessToken({ username });
  res.json({ TOKEN_SECRET: token });
});

app.get("/login/:username/:token", authenticateToken, (req, res) => {
  // console.log("kenapa ", req.user);
  res.json(req.user);
});

http.createServer(app).listen(PORT, () => {
  console.log("server run on port ", PORT);
});
