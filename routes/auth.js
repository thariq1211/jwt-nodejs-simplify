const express = require("express");
const router = express.Router();
const account = require("../helpers/account");
const { generateAccessToken } = require("../controller/jwtProvider");

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username && !password) {
    res.status(500).json({
      success: 0,
      message: "Username and Password not given in request Body!",
    });
  } else {
    const found = account.find(
      (el) => el.username === username && el.password === password
    );
    if (found) {
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

module.exports = router;
