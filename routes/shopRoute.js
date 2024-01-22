const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const shopController = require("../controllers/shop");

router.get("/userInfo", shopController.getUserInfo);

router.post(
  "/order",
  [
    body("userInfo.fullName", "Name must not be empty").isLength({ min: 1 }),
    body("userInfo.email", "Invalid email").isEmail(),
    body("userInfo.phone", "Invalid phone number").isLength({ min: 1 }),
    body("userInfo.address", "Address must be filled").isLength({ min: 1 }),
  ],
  shopController.postOrder
);

router.get("/history/:orderId", shopController.getOrderDetail);
router.get("/history", shopController.getHistory);

module.exports = router;
