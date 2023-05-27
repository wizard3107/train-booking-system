// userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: false },
    mobile: { type: String, required: true },
    tickets: { type: Number, default:0 },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
