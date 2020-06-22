const express = require("express");
const app = express();
const auth = require("./auth");
const user = require("./user");
const dotenv = require("dotenv");

dotenv.config();

app.use("/auth", auth);
app.use("/user", user);

app.get("/", (req, res) => {
  res.send(
    "server up in port " +
      process.env.PORT +
      " and secure port " +
      process.env.SECURE_PORT
  );
});

module.exports = app;
