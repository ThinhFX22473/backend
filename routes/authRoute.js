const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/auth");

router.post(
  "/signup",
  [
    body("name", "Full name must not be empty").isString().notEmpty(),
    body("email", "Email is not valid").isEmail(),
    body("password", "Password must includes >=8 characters")
      .isLength({ min: 8 })
      .isAlphanumeric(),
    body("phone", "Fill your phone number").isString().notEmpty(),
  ],
  authController.postSignUp
);

router.post("/login", [
  body("email", "Email is not valid").isEmail(),
  body("password", "Password must includes >=8 characters")
    .isLength({ min: 8 })
    .isAlphanumeric(),
  authController.postLogin,
]);

router.post("/logout", authController.postLogout);

module.exports = router;
