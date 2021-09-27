const express = require("express");
const bodyParser = require("body-parser");

const config = require("./config");
const logger = require("./util/logger");
const version = require("./routes/version");
const user = require("./routes/user");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use("/api", version);
app.use("/api", user);

app.listen(config.PORT, () => {
  console.log(require("./banner.js").green);
  console.log("      - Version:     " + `${config.VERSION}`.yellow);
  console.log("      - Environment: " + `${process.env.NODE_ENV}`.yellow);
  console.log("      - Port:        " + `${config.PORT}`.yellow);
  console.log("\n");

  logger.info("REST API up and running");
});