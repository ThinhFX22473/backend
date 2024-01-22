const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user", require: true },
  products: [{ type: Object, require: true }],
  total: { type: Number, require: true },
  userInfo: { type: Object, require: true },
});

module.exports = mongoose.model("order", orderSchema);
