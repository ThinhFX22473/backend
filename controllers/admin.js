const { validationResult } = require("express-validator");
const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");

exports.postLogin = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error.errors[0].msg);
    return res.status(422).json({ msg: error.errors[0].msg });
  }
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ msg: "This email has not been registered" });
      }

      return bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          if (user.role === "admin" || user.role === "support") {
            req.session.user = user;
            req.session.loggedIn = true;
            res.cookie("name", user.fullName, {
              sameSite: "none",
              secure: true,
            });
            res.status(200).json(user);
          } else {
            res.status(401).json({ msg: "Unauthorized access" });
          }
        } else {
          res.status(404).json({ msg: "Password is incorrect" });
        }
      });
    })
    .catch((err) => console.trace(err));
};

exports.postLogout = (req, res, next) => {
  console.log("logout", req.session);
  req.session.destroy((err) => console.log(err));
  res.clearCookie("connect.sid");
  res.clearCookie("name");
  res.status(200).send("Delete succeeded");
};

exports.getProducts = (req, res, next) => {
  Product.find().then((prods) => {
    if (!prods) {
      res.status(404).json({ msg: "No products" });
    } else {
      console.log(prods);
      res.status(200).json(prods);
    }
  });
};
