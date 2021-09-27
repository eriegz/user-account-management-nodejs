const redisModule = require("redis");
const bcrypt = require("bcrypt");

const config = require("../config");
const logger = require("../util/logger");

const redis = redisModule.createClient(config.REDIS_PORT, config.REDIS_HOST);
redis.on("connect", () => {
  logger.info(`Connected to redis instance at ${config.REDIS_HOST}:${config.REDIS_PORT}`);
});

module.exports = {
  encryptPassword: async function (plainTextPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(config.BCRYPT_SALT_ROUNDS, function (err, salt) {
        bcrypt.hash(plainTextPassword, salt, function (err, hash) {
          resolve(hash);
        });
      });
    });
  },
  retrieveUser: function (username) {
    return new Promise((resolve, reject) => {
      redis.hgetall(username, (err, resp) => {
        if (resp !== null) {
          resolve(resp);
        } else {
          let msg = "No user with that username exists";
          logger.error(msg);
          reject(msg);
        }
      });
    });
  },
  createUser: function (requestBody) {
    return new Promise(
      ((resolve, reject) => {
        redis.exists(requestBody.username, async (err, resp) => {
          if (resp !== 1) {
            // Encrypt user's plain text password before storing it in the database:
            let sanitizedUserObj = {
              username: requestBody.username,
              password: await this.encryptPassword(requestBody.password)
            };
            redis.hmset(requestBody.username, sanitizedUserObj);
            resolve();
          } else {
            let msg = "Username is already taken";
            logger.error(msg);
            reject(msg);
          }
        });
      }).bind(this) // This arrow function needs to be able to access "encryptPassword" method above
    );
  },
  deleteUser: function (username) {
    return new Promise((resolve, reject) => {
      redis.exists(username, (err, resp) => {
        if (resp === 1) {
          redis.del(username, () => {
            resolve();
          });
        } else {
          let msg = "No user with that username exists";
          logger.error(msg);
          reject(msg);
        }
      });
    });
  },
  authenticateUser: function (username, plainTextPassword) {
    return new Promise((resolve, reject) => {
      redis.hgetall(username, (err, userJson) => {
        if (userJson === null) {
          return reject();
        }
        bcrypt.compare(plainTextPassword, userJson.password, function (err, result) {
          if (result === true) {
            resolve();
          } else {
            reject();
          }
        });
      });
    });
  }
}