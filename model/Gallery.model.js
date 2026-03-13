const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Rooms", "Restaurant", "Events", "Amenities", "Exterior"],
      required: true,
    },
    imageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);