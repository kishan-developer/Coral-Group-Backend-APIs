const express = require("express");
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  checkInBooking,
  checkOutBooking,
  cancelBooking,
  updatePaymentStatus,
  deleteBooking
} = require("../../controller/admin/booking.controller");

const {
    isAuthenticated,
    isAdmin,
} = require("../../middleware/auth.middleware");

const bookingrouter = express.Router();

/* User Side */
bookingrouter.post("/", createBooking);
bookingrouter.get("/my", getMyBookings);

/* Manager + Admin */
bookingrouter.get("/all",  getAllBookings);
bookingrouter.put("/check-in/:id",  checkInBooking);
bookingrouter.put("/check-out/:id", checkOutBooking);
bookingrouter.put("/cancel/:id",  cancelBooking);

/* Admin Only */
bookingrouter.put("/payment/:id",  updatePaymentStatus);
bookingrouter.delete("/:id", deleteBooking);

module.exports = bookingrouter;