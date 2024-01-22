const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

exports.getUserInfo = (req, res, next) => {
  const { fullName, email, phone } = req.user;
  res.status(200).json({ fullName, email, phone });
};

exports.postOrder = (req, res, next) => {
  // Validation
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(422).json({ msg: err.errors[0].msg });
  }

  // console.log(req.user);
  const { cart, userInfo } = req.body;
  console.log(req.body);
  let total = 0;
  cart.map((item) => (total += item.quantity * +item.price));
  const newOrder = new Order({
    userId: req.user._id,
    products: cart,
    total: total,
    userInfo: userInfo,
  });

  newOrder.save().then(async (order) => {
    const mailContent = `
    <div>
    <h1>GM ${userInfo.fullName}</h1>
        <h3>Phone Number: ${userInfo.phone}</h3>
        <h3>Address: ${userInfo.address}</h3>
<p>Here is you order details:</p>
        <table>
          <thead>
          <tr style="border: 1px solid #dddddd; padding: 8px;">
              <th>Product</th>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Cost</th>
          </tr>
          </thead>
          <tbody>
              ${cart
                .map(
                  (product) => `
                <tr style="border: 1px solid #dddddd; padding: 8px;">
                  <td>${product.name}</td>
                  <td><img src="${
                    product.img
                  }" alt="Product Image" width="auto" height="100"></td>
                  <td>${product.price}</td>
                  <td>${product.quantity}</td>
                  <td>${product.quantity * +product.price}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
                
          <h2>Total Bill: ${total.toLocaleString()} VND</h2>
          <p>Thank you very much for your support</p>
      </div>
                `;

    // Send nodemailer
    const GOOGLE_PASS = "prvu cqkj sniz hhrl";
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: "thinhnhFX22473@funix.edu.vn",
        pass: GOOGLE_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "thinhnhFX22473@funix.edu.vn", // sender address
      to: userInfo.email, // list of receivers
      subject: "Your order is ready", // Subject line
      text: "Check out your order", // plain text body
      html: mailContent, // html body
    });
    res.status(200).json({ message: "Saved new order" });
  });
};

exports.getHistory = (req, res, next) => {
  Order.find({ userId: req.user._id })
    .populate("userId")
    .then((orders) => {
      if (orders.length === 0) {
        res.status(404).json({ msg: "No order found" });
      } else {
        res.status(200).json(orders);
      }
    });
};

exports.getOrderDetail = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId).then((order) => {
    if (!order) {
      res.status(404).json({ msg: "Order not found" });
    } else {
      res.status(200).json(order);
    }
  });
};
