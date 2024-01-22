const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  phone: { type: String, require: true },
  role: {
    type: String,
    enum: ["client", "support", "admin"],
    default: "client",
    require: true,
  },
});

module.exports = mongoose.model("user", userSchema);
