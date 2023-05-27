// seatRoutes.js
const express = require("express");
const router = express.Router();
const seatController = require("./seatController");

router.post("/reserve-seats", seatController.reserveSeats);
router.get("/reserved-seats", seatController.getReservedSeats);
router.post("/user-seats",seatController.getUserSeats);
router.post("/unreserve-seats", seatController.unreserveSeats);

module.exports = router;
