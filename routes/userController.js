const express = require("express");
const expressValidator = require("express-validator");

const userValidation = require("../validation/userValidators");
const userService = require("../services/userService");

const router = express.Router();

// "Create":
router.post("/user/register", ...userValidation.usernameAndPassword, (req, res) => {
  // Validate the incoming request to ensure things such as username format, password complexity, etc.:
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

// "Read":
router.get("/user/:username", (req, res) => {
  userService.retrieveUser(req.params.username).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(404).send({ error });
  });
});

// "Update":
router.put("/user", ...userValidation.usernameAndPassword, (req, res) => {
  // Validate the incoming request to ensure things such as username format, password complexity, etc.:
  const validationErrors = expressValidator.validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).send({
      error: "One or more fields are invalid",
      errors: validationErrors.errors
    });
  }

  userService.updateUser(req.body).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(400).send({ error });
  });
});

// "Delete":
router.delete("/user/:username", (req, res) => {
  userService.deleteUser(req.params.username).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(400).send({ error });
  });
});

module.exports = router;