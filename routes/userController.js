const express = require("express");
const expressValidator = require("express-validator");

const userValidation = require("../validation/userValidators");
const userService = require("../services/userService");

const router = express.Router();

// Below: a more or less CRUD implementation for users (we're just missing an "update" endpoint, as there wasn't a need
// for one during development, and the requirements didn't specifically ask for one).

// The "create" endpoint:
router.post("/user/register", ...userValidation.registration, (req, res) => {
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

// The "read" endpoint, which wasn't specifically requested in the requirements, but it was useful during development,
// so I've just left it here:
router.get("/user/:username", (req, res) => {
  userService.retrieveUser(req.params.username).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(404).send({ error });
  });
});

// And the "delete" endpoint, which also wasn't specifically requested in the requirements, but it was useful during
// development and so I've just left it here:
router.delete("/user/:username", (req, res) => {
  userService.deleteUser(req.params.username).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(400).send({ error });
  });
});

module.exports = router;