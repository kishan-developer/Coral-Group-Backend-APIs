const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  city: { type: String, required: true },
  area: String,
  size: String,
  price: Number,
  images: [String], // S3 URLs
  location: {
    lat: Number,
    lng: Number
  },
  status: { 
    type: String, 
    enum: ['Available', 'Booked', 'Maintenance'], 
    default: 'Available' 
  },
  currentOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


module.exports = mongoose.model("Shelter", shelterSchema);
