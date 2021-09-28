module.exports = {
  HTTP_PORT: 3000,
  HTTPS_PORT: 3443,
  VERSION: require("../package.json").version,
  SSL_CERT_PATH: "security/ssl/local/localhost-cert.crt",
  SSL_KEY_PATH: "security/ssl/local/localhost-key.pem",
  REDIS_HOST: "localhost",
  REDIS_PORT: 6379,
  BCRYPT_SALT_ROUNDS: 10,
  JWT_SECRET: "8>QrP3J8e{`FU]6d(h(;R*d~F}BSn5XVj7yyE6C}9W/(<Srt`VR#gzKF)5,(a~F[cy9Hh'UA]wMe&u4udLr>!+47?m]?AJ)>",
  JWT_LIFESPAN_DAYS: 14
};