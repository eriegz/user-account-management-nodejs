const express = require("express");
const router = express.Router();

const config = require("../config");

// The rationale for this simple endpoint is that, despite its simplicity, a "/version" endpoint actually offers a lot
// of value as a testing / debugging / smoke testing tool. I.e.: it tells us that:
//   - the server hasn't crashed
//   - the server is running the code we expect it to be running, and
//   - the network communication is flowing correctly
router.get("/version", (req, res) => {
  res.send({
    version: config.VERSION
  });
});

module.exports = router;