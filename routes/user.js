const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../controller/jwtProvider");

router.get("/hello", authenticateToken, (req, res) => {
  res.json({ message: `hello ${req.user.username}` });
});

module.exports = router;
