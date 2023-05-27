// routes.js
const express = require("express");
const router = express.Router();
const seatRoutes = require("./seatRoutes");

router.use("/seats", seatRoutes);

module.exports = router;
