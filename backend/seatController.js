// seatController.js
const Seat = require("./seatModel");
const User = require("./userModel");
const maxTicketsPerUser = 7 // Maximum tickets per user

async function reserveSeats(req, res) {
    const selectedSeats = req.body.selectedSeats;
    const userName = req.body.username;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const tickets = req.body.tickets;

    // // Insert User to DB
    if (userName) {
        let user = await User.find({ username: userName });
        if (user.length === 0) {
            try {
                User.insertMany({
                    username: userName,
                    email: email,
                    mobile: mobile,
                    tickets: tickets,
                })
            }
            catch (err) {
                res.status(500).json({ error: `Cannot create user ${userName}` })
            }
        }
    }
    // Check if the number of selected seats is within the allowed limit
    if (selectedSeats.length <= maxTicketsPerUser) {
        try {
            Seat.updateMany({
                $or: selectedSeats.map(seat => ({
                    row: seat.row,
                    seat: seat.seat
                })
                )
            },
                {
                    status: true,
                    username: userName,
                    reserved: true
                })
                .then((reservedSeats) => {
                    res.status(201).json({ reservedSeats, message: `${tickets} tickets booked successfully` });
                })
                .catch((error) => {
                    res.status(500).json({ error: `${error} Failed to create seats` });
                });
        } catch (error) {
            res.status(500).json({ error: `${error} Failed to reserve seats.` });
        }
    } else {
        res.status(400).json({ error: "You can only select a maximum of " + maxTicketsPerUser + " seats." });
    }
}

function getReservedSeats(req, res) {
    Seat.find({ status: true })
        .then((reservedSeats) => {
            res.json(reservedSeats.map(seat => ({ row: seat.row, seat: seat.seat, status: seat.status, reserved: seat.reserved })));
        })
        .catch((error) => {
            res.status(500).json({ error: `${error}Failed to retrieve reserved seats` });
        });
};
function unreserveSeats(req, res) {
    const userName = req.body.username || '';
    if (userName) {
        const count = Seat.find({ username: userName }).count();
        Seat.updateMany({ username: userName }, { reserved: false, status: false, username: '' })
            .then(() => {
                res.status(201).json({ message: `${count} tickets unreserved successfully` });
            })
            .catch((error) => {
                res.status(500).json({ error: `${error} Failed to unreserve seats` });
            });
    }
    else {
        const count = Seat.find({ reserved: true }).count().exec();
        Seat.updateMany({ reserved: true }, { reserved: false, status: false, username: '' })
            .then(() => {
                res.status(201).json({ message: `${count} --tickets unreserved successfully` });
            })
            .catch((error) => {
                res.status(500).json({ error: `${error} Failed to unreserve seats` });
            });
    }
}
function getUserSeats(req, res) {
    const username = req.body.username;
    Seat.find({ username: username })
        .then((reservedSeats) => {
            res.json(reservedSeats.map(seat => ({ row: seat.row, seat: seat.seat, status: seat.status, reserved: seat.reserved })));
        })
        .catch((error) => {
            res.status(500).json({ error: `Failed to retrieve reserved seats` });
        });
}
module.exports = {
    reserveSeats,
    getReservedSeats,
    getUserSeats,
    unreserveSeats
}