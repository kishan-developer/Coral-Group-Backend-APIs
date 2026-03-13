const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },

    guests: { type: Number, required: true },

    // Reception panel
    status: {
      type: String,
      enum: ["Booked", "CheckedIn", "CheckedOut", "Cancelled"],
      default: "Booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);