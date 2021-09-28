module.exports = {
  PORT: 3000,
  VERSION: require("../package.json").version,
  REDIS_HOST: "localhost",
  REDIS_PORT: 6379,
  BCRYPT_SALT_ROUNDS: 10,
  JWT_SECRET: "8>QrP3J8e{`FU]6d(h(;R*d~F}BSn5XVj7yyE6C}9W/(<Srt`VR#gzKF)5,(a~F[cy9Hh'UA]wMe&u4udLr>!+47?m]?AJ)>",
  JWT_LIFESPAN_DAYS: 14
};