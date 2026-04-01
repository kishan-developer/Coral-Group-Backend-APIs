const Booking = require("../../model/Booking.model");
const Room = require("../../model/Room.model");

/* -------------------------------------------------------
    USER — CREATE BOOKING
-------------------------------------------------------- */
const createBooking = async (req, res) => {
  try {
    const { roomId, userId, checkIn, checkOut, guests, totalAmount } = req.body;

    // create new booking
    const booking = await Booking.create({
      roomId,
      userId,
      checkIn,
      checkOut,
      guests,
      totalAmount,
      paymentStatus: "pending",
      status: "Booked",
    });

    // Mark room unavailable
    await Room.findByIdAndUpdate(roomId, { isAvailable: false });

    // send the create response in backend api server
    return res.success("Booking Created Successfully", booking);
  } catch (error) {
    return res.error(error.message, 500);
  }
};


/* -------------------------------------------------------
    USER — GET MY BOOKINGS
-------------------------------------------------------- */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("roomId");

    return res.success("Bookings fetched successfully", bookings);
  } catch (error) {
    return res.error(error.message, 500);
  }
};


/* -------------------------------------------------------
    MANAGER / ADMIN — GET ALL BOOKINGS
-------------------------------------------------------- */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("roomId")
      .populate("userId");

    return res.success("All bookings fetched successfully", bookings);
  } catch (error) {
    return res.error(error.message, 500);
  }
};


/* -------------------------------------------------------
    MANAGER — CHECK-IN GUEST
-------------------------------------------------------- */
const checkInBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "CheckedIn" },
      { new: true }
    );

    // update room using room id and avilability if available than show other wise hide room not available 
    await Room.findByIdAndUpdate(booking.roomId, { isAvailable: false });

    return res.success("Guest Checked-In Successfully", booking);
  } catch (error) {
    return res.error(error.message, 500);
  }
};


/* -------------------------------------------------------
    MANAGER — CHECK-OUT GUEST
-------------------------------------------------------- */
const checkOutBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "CheckedOut" },
      { new: true }
    );

    // Room becomes available again
    await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });

    return res.success("Guest Checked-Out Successfully", booking);
  } catch (error) {
    return res.error(error.message, 500);
  }
};


/* -------------------------------------------------------
    MANAGER — CANCEL BOOKING
-------------------------------------------------------- */
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "Cancelled" },
      { new: true }
    );

    // Room becomes available again
    await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });

    return res.success("Booking Cancelled Successfully", booking);
  } catch (error) {
    return res.error(error.message, 500);
  }
};


/* -------------------------------------------------------
    ADMIN — UPDATE PAYMENT STATUS
-------------------------------------------------------- */
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus },
      { new: true }
    );

    return res.success("Payment Status Updated", booking);
  } catch (error) {
    return res.error(error.message, 500);
  }
};


/* -------------------------------------------------------
    ADMIN — DELETE BOOKING
-------------------------------------------------------- */
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);

    // Make room available again
    await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });

    await Booking.findByIdAndDelete(bookingId);

    return res.success("Booking Deleted Successfully");
  } catch (error) {
    return res.error(error.message, 500);
  }
};

module.exports= {
  createBooking,
  getMyBookings,
  getAllBookings,
  checkInBooking,
  checkOutBooking,
  cancelBooking,
  updatePaymentStatus,
  deleteBooking
}