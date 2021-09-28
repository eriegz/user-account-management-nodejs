const express = require("express");
const expressValidator = require("express-validator");
const jwt = require("jsonwebtoken");

const config = require("../config");
const logger = require("../util/logger");
const authValidation = require("../validation/authValidators");
const userService = require("../services/userService");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Simple endpoint to test authentication via the "Cookie" header:
router.get("/auth/authenticate", authMiddleware, (req, res) => {
  res.send();
});

// Our login endpoint, which does what you would expect it to, i.e.:
//   - it checks the password provided against the one saved in the redis store, and
//   - if they match, it will respond with a JWT token in the "Set-Cookie" header
router.post("/auth/login", ...authValidation.login, (req, res) => {
  const validationErrors = expressValidator.validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).send({
      error: "One or more fields are invalid",
      errors: validationErrors.errors
    });
  }

  userService.authenticateUser(req.body.username, req.body.password).then((userJson) => {
    // Generate the user's authentication token.
    let payload = { u: userJson.username }; // "u" == "username" (to keep payload as small as possible)
    let token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: `${config.JWT_LIFESPAN_DAYS} days` });
    let tokenLifespanMilliseconds = config.JWT_LIFESPAN_DAYS * 24 * 3600 * 1000;
    // Finally, return the token inside the "Set-Cookie" response header:
    res.cookie("token", token, { maxAge: tokenLifespanMilliseconds });
    res.send();
  }).catch(() => {
    let msg = "Invalid username or password";
    logger.error(msg);
    res.status(401).send({ error: msg });
  });
});

module.exports = router;