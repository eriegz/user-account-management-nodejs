const express = require("express");
const expressValidator = require("express-validator");

const userValidation = require("../validation/userValidators");
const redisService = require("../services/redisService");

const router = express.Router();

router.get("/user/:username", (req, res) => {
  redisService.retrieveUser(req.params.username).then((result) => {
    res.send(result);
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

  let newUser = {
    username: req.body.username
  };
  redisService.createUser(req.body.username, newUser).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(400).send({ error });
  })
}
);

router.post("/user/login", (req, res) => {
  // TODO: Flesh this out:
  res.send();
});

router.delete("/user/:username", (req, res) => {
  redisService.deleteUser(req.params.username).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(400).send({ error });
  });
});

module.exports = router;