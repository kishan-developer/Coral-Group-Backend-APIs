const Room = require("../../model/Room.model");  
const User = require("../../model/User.model");


// ----------------------
// ROOM LISTING (Admin + User)
// ----------------------
const roomlisting = async (req, res) => {
    try {
        const { roomId } = req.body;

        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required"
            });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        res.json({
            success: true,
            data: room
        });

    } catch (error) {
        console.log("Error in roomlisting:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



// ----------------------
// CREATE BOOKING
// ----------------------
const createBooking = async (req, res) => {
    try {
        const { roomId, userId, startDate, endDate, amount, paymentId } = req.body;

        if (!roomId || !userId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Validate room
        const room = await room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "room not found"
            });
        }

        // Check date overlap
        const isBooked = await Booking.findOne({
            roomId,
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        if (isBooked) {
            return res.status(400).json({
                success: false,
                message: "room is already booked for these dates"
            });
        }

        // Create booking
        const booking = await Booking.create({
            roomId,
            userId,
            startDate,
            endDate,
            amount,
            paymentId: paymentId || null,
            status: paymentId ? "confirmed" : "pending"
        });

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });

    } catch (err) {
        console.log("Error in createBooking:", err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};



// ----------------------
// CHECK AVAILABILITY
// ----------------------
const checkAvailability = async (req, res) => {
    try {
        const { roomId, startDate, endDate } = req.body;

        if (!roomId || !startDate || !endDate) {
            return res.status(400).json({
                available: false,
                message: "Missing required fields"
            });
        }

        const isBooked = await Booking.findOne({
            roomId,
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        if (isBooked) {
            return res.json({
                available: false,
                message: "Not available for these dates"
            });
        }

        res.json({
            available: true,
            message: "room is available"
        });

    } catch (err) {
        console.log("Error in checkAvailability:", err);
        res.status(500).json({ success: false });
    }
};



// ----------------------
// GET ALL BOOKINGS (Admin)
// ----------------------
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("userId", "name email mobile")
            .populate("roomId")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings
        });

    } catch (err) {
        console.log("Error in getAllBookings:", err);
        res.status(500).json({ success: false });
    }
};



// ----------------------
// GET BOOKINGS BY room
// ----------------------
const getBookingsByroom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const bookings = await Booking.find({ roomId })
            .populate("userId")
            .sort({ startDate: 1 });

        res.json({
            success: true,
            data: bookings
        });

    } catch (err) {
        console.log("Error in getBookingsByroom:", err);
        res.status(500).json({ success: false });
    }
};



// ----------------------
// GET BOOKINGS BY USER
// ----------------------
const getBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const bookings = await Booking.find({ userId })
            .populate("roomId");

        res.json({
            success: true,
            data: bookings
        });

    } catch (err) {
        console.log("Error in getBookingsByUser:", err);
        res.status(500).json({ success: false });
    }
};



// ----------------------
// CANCEL BOOKING
// ----------------------
const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        booking.status = "cancelled";
        await booking.save();

        res.json({
            success: true,
            message: "Booking cancelled successfully"
        });

    } catch (err) {
        console.log("Error in cancelBooking:", err);
        res.status(500).json({ success: false });
    }
};



module.exports = {
    roomlisting,
    createBooking,
    checkAvailability,
    getAllBookings,
    getBookingsByroom,
    getBookingsByUser,
    cancelBooking,
};