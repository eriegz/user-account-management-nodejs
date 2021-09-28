const express = require("express");
const bodyParser = require("body-parser");

const config = require("./config");
const logger = require("./util/logger");

const versionController = require("./routes/versionController");
const authController = require("./routes/authController");
const userController = require("./routes/userController");

// Configure Express.js with our desired settings:
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Wire up our various endpoints:
app.use("/api", versionController);
app.use("/api", authController);
app.use("/api", userController);

// Start the server and display a welcome message in the console once it's ready:
app.listen(config.PORT, () => {
  console.log(require("./banner.js").green);
  console.log("      - Version:     " + `${config.VERSION}`.yellow);
  console.log("      - Environment: " + `${process.env.NODE_ENV}`.yellow);
  console.log("      - Port:        " + `${config.PORT}`.yellow);
  console.log("\n");

  logger.info("REST API up and running");
});