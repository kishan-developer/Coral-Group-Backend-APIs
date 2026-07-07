const mongoose = require("mongoose");

const brochureRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    projectType: {
      type: String,
      required: true,
      enum: ["2bhk", "3bhk", "4bhk", "commercial", "other"],
    },
    brochureType: {
      type: String,
      required: true,
      enum: ["coral-skyline", "coral-studio", "coral-garden", "brochure-access"],
    },
    brochureTitle: {
      type: String,
      required: true,
    },
    downloaded: {
      type: Boolean,
      default: false,
    },
    downloadedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "converted", "closed"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
brochureRequestSchema.index({ email: 1 });
brochureRequestSchema.index({ brochureType: 1 });
brochureRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model("BrochureRequest", brochureRequestSchema);
