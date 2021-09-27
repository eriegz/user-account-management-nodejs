module.exports = {
  PORT: 3000,
  VERSION: require("../package.json").version,
  REDIS_HOST: "localhost",
  REDIS_PORT: 6379,
  BCRYPT_SALT_ROUNDS: 10
};