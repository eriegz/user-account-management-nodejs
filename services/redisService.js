const redisModule = require("redis");

const config = require("../config");
const logger = require("../util/logger");

const redis = redisModule.createClient(config.REDIS_PORT, config.REDIS_HOST);
redis.on("connect", () => {
  logger.info(`Connected to redis instance at ${config.REDIS_HOST}:${config.REDIS_PORT}`);
});

module.exports = {
  retrieveUser: function (key) {
    return new Promise((resolve, reject) => {
      redis.exists(key, (err, resp) => {
        if (resp === 1) {
          redis.hgetall(key, (err, resp) => {
            resolve(resp);
          });
        } else {
          let msg = "No user with that username exists";
          logger.error(msg);
          reject(msg);
        }
      });
    });
  },
  createUser: async function (key, userObj) {
    return new Promise((resolve, reject) => {
      redis.exists(key, (err, resp) => {
        if (resp !== 1) {
          redis.hmset(userObj.username, userObj);
          resolve();
        } else {
          let msg = "Username is already taken";
          logger.error(msg);
          reject(msg);
        }
      });
    });
  },
  deleteUser: async function (key) {
    return new Promise((resolve, reject) => {
      redis.exists(key, (err, resp) => {
        if (resp === 1) {
          redis.del(key, () => {
            resolve();
          });
        } else {
          let msg = "No user with that username exists";
          logger.error(msg);
          reject(msg);
        }
      });
    });
  }
}