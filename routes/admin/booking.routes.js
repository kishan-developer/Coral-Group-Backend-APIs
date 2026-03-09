const {
    createBooking,
    checkAvailability,
    getAllBookings,
    getBookingsByUser,
    cancelBooking,
} = require("../../controller/admin/booking.controller");

const bookingRouter = require("express").Router();

// CREATE BOOKING
bookingRouter.post("/create", createBooking);

// CHECK AVAILABILITY (use POST because we send dates)
bookingRouter.post("/check-availability", checkAvailability);

// GET ALL BOOKINGS
bookingRouter.get("/all", getAllBookings);

// GET BOOKINGS BY A SPECIFIC SHELTER
// bookingRouter.get("/shelter/:shelterId", getBookingsByShelter);

// GET BOOKINGS BY USER
bookingRouter.get("/user/:userId", getBookingsByUser);

// CANCEL BOOKING
bookingRouter.patch("/cancel/:bookingId", cancelBooking);

module.exports = bookingRouter;

