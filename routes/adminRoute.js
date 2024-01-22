const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const adminController = require("../controllers/admin");

router.post("/login", [
  body("email", "Email is not valid").isEmail(),
  body("password", "Password must includes >=8 characters")
    .isLength({ min: 8 })
    .isAlphanumeric(),
  adminController.postLogin,
]);

router.post("/logout", adminController.postLogout);

router.get("/products", adminController.getProducts);

module.exports = router;
