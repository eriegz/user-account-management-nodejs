const jwt = require("jsonwebtoken");

const config = require("../config");

module.exports = (req, res, next) => {
  // We could do this validation using the "express-validator" module like in userController.js, but that feels like
  // overkill here:
  if (typeof req.headers.cookie !== "string") {
    return res.status(401).send();
  }

  // There's no doubt other ways to extract the auth token from incoming requests, but I find it simplest and easiest to
  // just "slice" it out of the "Cookie" header manually:
  let token = req.headers.cookie.split("token=")[1].split(";")[0];

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err === null) {
      // Note: there is no *authorization* checking done here, including preventing a "User A" from making changes to a
      // "User B"'s data. Authorization would need to get implemented later, as needed.
      next();
    } else {
      res.status(401).send();
    }
  });
};