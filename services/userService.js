const redisModule = require("ioredis");
const bcrypt = require("bcrypt");

const config = require("../config");
const logger = require("../util/logger");

const redis = new redisModule(config.REDIS_PORT, config.REDIS_HOST);
redis.on("connect", () => {
  logger.info(`Connected to redis instance at ${config.REDIS_HOST}:${config.REDIS_PORT}`);
});

module.exports = {
  encryptPassword(plainTextPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(config.BCRYPT_SALT_ROUNDS, function (err, salt) {
        bcrypt.hash(plainTextPassword, salt, function (err, hash) {
          resolve(hash);
        });
      });
    });
  },
  createUser(requestBody) {
    return new Promise(
      (async (resolve, reject) => {
        // We only want to allow registering a username that's not already in use. To that end,
        // redis has a command "hsetnx" that will set a key only if it doesn't already exist. But
        // "hsetnx" only allows setting one field-value pair at a time, so we'll need to start a
        // transaction and chain together individual "hset" commands to set the remaining fields:
        let results = await redis.multi()
          .hsetnx(requestBody.username, "username", requestBody.username)
          .hset(requestBody.username, "password", await this.encryptPassword(requestBody.password))
          .exec();
        // Below: ioredis returns transaction results as an array of arrays representing the results
        // of each individual command. But it's good enough that we just check the result of the
        // first one, as both commands will fail or succeed together:
        if (results[0][1] === 1) {
          resolve();
        } else {
          let msg = "Username is already taken";
          logger.error(msg);
          reject(msg);
        }
      }).bind(this) // This arrow function needs to be able to access "encryptPassword" method above
    );
  },
  retrieveUser(username) {
    return new Promise(async (resolve, reject) => {
      let userObj = await redis.hgetall(username);
      // Annoyingly, "ioredis" returns an empty object when a key isn't found:
      if (userObj.username !== undefined) {
        // Callers shouldn't need access to sensitive user fields such as the password (we have an
        // "authenticateUser" function below built specifically for that purpose), so I'm removing
        // it from the user object to reduce the risk of other code mistakenly doing something
        // unsafe with it:
        let sanitizedUserObj = {
          username: userObj.username
        };
        resolve(sanitizedUserObj);
      } else {
        let msg = "No user with that username exists";
        logger.error(msg);
        reject(msg);
      }
    });
  },
  updateUser(requestBody) {
    return new Promise(
      (async (resolve, reject) => {
        let result = await redis.hset(
          requestBody.username,
          "password",
          await this.encryptPassword(requestBody.password)
        );
        // Below: the above operation returns a 0 if successful, and 1 if not.
        if (result === 0) {
          resolve();
        } else {
          let msg = "Could not update user";
          logger.error(msg);
          reject(msg);
        }
      }).bind(this) // This arrow function needs to be able to access "encryptPassword" method above
    );
  },
  deleteUser(username) {
    return new Promise(async (resolve, reject) => {
      let result = await redis.del(username);
      if (result === 1) {
        resolve();
      } else {
        let msg = "No user with that username exists";
        logger.error(msg);
        reject(msg);
      }
    });
  },
  // This function checks the password provided against the one saved in the redis store, and if
  // they match it will respond with the user object (minus sensitive fields):
  authenticateUser(username, plainTextPassword) {
    return new Promise(async (resolve, reject) => {
      let userObj = await redis.hgetall(username);
      // Annoyingly, "ioredis" returns an empty object when a key isn't found:
      if (userObj.username === undefined) {
        return reject();
      }
      bcrypt.compare(plainTextPassword, userObj.password, function (err, result) {
        if (result === true) {
          // There's no further need for the password field beyond this point, so it's probably best
          // to remove it so that other code doesn't mistakenly do something unsafe with it:
          let sanitizedUserObj = {
            username: result.username
          };
          resolve(sanitizedUserObj);
        } else {
          reject();
        }
      });
    });
  }
}