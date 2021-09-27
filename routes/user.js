const express = require("express");

const redisService = require("../services/redisService");

const router = express.Router();

router.get("/user/:username", (req, res) => {
  redisService.retrieve(req.params.username).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(404).send({ error });
  });
});

router.post("/user/register", (req, res) => {
  let newUser = {
    username: req.body.username
  };
  redisService.save(req.body.username, newUser).then((result) => {
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
  redisService.remove(req.params.username).then((result) => {
    res.send(result);
  }).catch((error) => {
    res.status(400).send({ error });
  });
});

module.exports = router;