const Product = require("../models/Product");
exports.getTrendingProducts = (req, res, next) => {
  Product.find().then((prods) => res.status(200).json(prods));
};
