const express = require("express");
const expressValidator = require("express-validator");

const userValidation = require("../validation/userValidators");
const userService = require("../services/userService");
const logger = require("../util/logger");

const router = express.Router();

router.get("/user/:username", (req, res) => {
  userService.retrieveUser(req.params.username).then((result) => {
    // Remove sensitive fields such as password from the response body:
    let sanitizedUserObj = {
      username: result.username
    }
    res.send(sanitizedUserObj);
  }).catch((error) => {
    res.status(404).send({ error });
  });
});

router.post("/user/register", ...userValidation.registration, (req, res) => {
  const validationErrors = expressValidator.validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).send({
      error: "One or more fields are invalid",
      errors: validationErrors.errors
    });
  }

  userService.createUser(req.body).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(400).send({ error });
  });
});

router.delete("/user/:username", (req, res) => {
  userService.deleteUser(req.params.username).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(400).send({ error });
  });
});

router.post("/user/login", ...userValidation.login, (req, res) => {
  const validationErrors = expressValidator.validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).send({
      error: "One or more fields are invalid",
      errors: validationErrors.errors
    });
  }

  userService.authenticateUser(req.body.username, req.body.password).then((result) => {
    // TODO: return JWT in a "set cookie" header
    res.send();
  }).catch((error) => {
    let msg = "Invalid username or password";
    logger.error(msg);
    res.status(401).send({ error: msg });
  });
});

module.exports = router;