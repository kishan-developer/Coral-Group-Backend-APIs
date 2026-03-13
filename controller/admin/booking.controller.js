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
    res.status(201).json({
      message: "Booking Created Successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* -------------------------------------------------------
    USER — GET MY BOOKINGS
-------------------------------------------------------- */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate("roomId");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.json({
      message: "Guest Checked-In Successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.json({
      message: "Guest Checked-Out Successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.json({
      message: "Booking Cancelled Successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.json({
      message: "Payment Status Updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.json({ message: "Booking Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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