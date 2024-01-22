const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.postSignUp = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error.errors[0].msg);
    return res.status(422).json({ msg: error.errors[0].msg });
  }
  // console.log(error);
  const { name, email, password, phone } = req.body;

  User.findOne({ email: email })
    .then((data) => {
      if (data) {
        return res.json({ msg: "Email has been existed" });
      }
      bcrypt
        .hash(password, 12)
        .then((hashPassword) => {
          const newUser = new User({
            fullName: name,
            email: email,
            password: hashPassword,
            phone: phone,
          });

          return newUser.save();
        })
        .then((result) => res.status(200).json(result));
    })
    .catch((err) => console.trace(err));
};

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
          req.session.user = user;
          req.session.loggedIn = true;
          res.cookie("name", user.fullName, {
            sameSite: "None",
            secure: true,
            httpOnly: true,
          });
          res.status(200).json(user);
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
