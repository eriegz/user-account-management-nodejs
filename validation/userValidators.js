const { body } = require("express-validator");
const passwordValidator = require('password-validator');

const passwordCriteria = new passwordValidator();
passwordCriteria
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols()
  .is().not().oneOf(['Passw0rd!', 'Password123']);

module.exports = {
  usernameAndPassword: [
    body("username")
      .exists({ checkNull: true })
      .withMessage("username field cannot be undefined or null")
      .isString()
      .withMessage("username field must be of type string")
      .isLength({ min: 3, max: 30 })
      .withMessage("username must be between 3 and 30 characters long (inclusive)")
      .isAlphanumeric()
      .withMessage("username must only contain alphanumeric characters (0–9, a–z)"),
    body("password")
      .exists({ checkNull: true })
      .withMessage("password field cannot be undefined or null")
      .isString()
      .withMessage("password field must be of type string")
      .isLength({ min: 8, max: 40 })
      .withMessage("password must be between 8 and 40 characters long (inclusive)")
      .custom(value => passwordCriteria.validate(value))
      .withMessage("password must contain an uppercase letter, a numeral, a special character (e.g.: !@#$%^&*()_+), "
        + "and must not be easily guessable")
  ]
  // Insert validations for other user-related endpoints here, as needed
}