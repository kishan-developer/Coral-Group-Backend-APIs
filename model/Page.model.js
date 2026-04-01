const mongoose = require("mongoose");

// Item inside a section (service, gallery image, feature etc.)
const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  link: String,
  price: String
});

// Main Section Schema
const sectionSchema = new mongoose.Schema({
  sectionType: { type: String, required: true }, // banner, gallery, about, services

  title: String,
  subtitle: String,
  description: String,
  images: [String], // for gallery or banner slider

  items: [itemSchema], // for services, testimonials, etc.

  order: Number, // section sorting
  isActive: { type: Boolean, default: true },
});

const pageSchema = new mongoose.Schema({
  pageName: { type: String, required: true },
  sections: [sectionSchema],
});

module.exports = mongoose.model("Page", pageSchema);