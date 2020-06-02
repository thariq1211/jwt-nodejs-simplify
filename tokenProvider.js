const randToken = require("crypto").randomBytes(256).toString("hex");
const dotenv = require("dotenv");

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;

module.exports = TOKEN_SECRET;
