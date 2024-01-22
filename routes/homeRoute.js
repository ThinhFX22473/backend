const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home");

router.get("/", homeController.getTrendingProducts);

module.exports = router;
