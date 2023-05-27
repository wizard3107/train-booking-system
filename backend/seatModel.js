// seatModel.js
const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
    username: { type: String, default: '' },
    row: { type: String, required: true },
    seat: { type: Number, required: true },
    status: { type: Boolean, default: false },
    reserved: { type: Boolean, default: false },
});

const Seat = mongoose.model("Seat", seatSchema);

module.exports = Seat;
