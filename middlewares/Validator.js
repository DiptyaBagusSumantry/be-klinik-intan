const { check, validationResult } = require("express-validator");

function validationCreatePatient() {
  return [
    check('username').notEmpty().withMessage("Username Can't be Null"),
    check('password').notEmpty().withMessage("password Can't be Null"),
    check('fullname').notEmpty().withMessage("fullname Can't be Null"),
    check("email").isEmail().withMessage("Email tidak valid."),
    check("phone")
      .isNumeric()
      .withMessage("Phone Must be Number")
      .isLength({ min: 10, max: 15 })
      .withMessage("Length Phone must be 10 - 15 Number !"),

    (req, res, next) => {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(400).json({
          middleware_validation: result.array(),
        //   request_body: req.body,
        });
      }

      return next();
    },
  ];
}
function validationUpdatePatient() {
  return [
    check('username').notEmpty().withMessage("Username Can't be Null"),
    check('fullname').notEmpty().withMessage("fullname Can't be Null"),
    check("email").isEmail().withMessage("Email tidak valid."),
    check("phone")
      .isNumeric()
      .withMessage("Phone Must be Number")
      .isLength({ min: 10, max: 15 })
      .withMessage("Length Phone must be 10 - 15 Number !"),

    (req, res, next) => {
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(400).json({
          middleware_validation: result.array(),
        //   request_body: req.body,
        });
      }

      return next();
    },
  ];
}

module.exports = { validationCreatePatient, validationUpdatePatient };
