const fs = require("fs");
const http = require("http");
const https = require("https");
const dotenv = require("dotenv");

dotenv.config();

const startServer = (app) => {
  http.createServer(app).listen(process.env.PORT, () => {
    console.log("=============================");
    console.log("== server http on PORT " + process.env.PORT);
    console.log("=============================");
  });

  https
    .createServer(
      {
        key: fs.readFileSync("./cert/key.pem"),
        cert: fs.readFileSync("./cert/cert.pem"),
      },
      app
    )
    .listen(process.env.SECURE_PORT, () => {
      console.log("== server https on PORT " + process.env.SECURE_PORT);
      console.log("=============================");
    });
};

module.exports = startServer;
