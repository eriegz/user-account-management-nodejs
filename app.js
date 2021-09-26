const express = require("express");

const config = require("./config");
const version = require("./routes/version");
const logger = require("./util/logger");

const app = express();

app.use("/api", version);

app.listen(config.PORT, () => {
  console.log(require("./banner.js").green);
  console.log("      - Version:     " + `${config.VERSION}`.yellow);
  console.log("      - Environment: " + `${process.env.NODE_ENV}`.yellow);
  console.log("      - Port:        " + `${config.PORT}`.yellow);
  console.log("\n");

  logger.info("REST API up and running")
});