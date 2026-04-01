const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "My Website",
    },

    logo: {
      type: String, // URL or filename
    },

    favicon: {
      type: String,
    },

    contactEmail: {
      type: String,
      default: "",
    },

    contactPhone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      metaKeywords: { type: String, default: "" },
    },

    theme: {
      primaryColor: { type: String, default: "#000000" },
      secondaryColor: { type: String, default: "#ffffff" },
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    smtp: {
      host: { type: String, default: "" },
      port: { type: Number, default: 587 },
      user: { type: String, default: "" },
      pass: { type: String, default: "" },
      secure: { type: Boolean, default: false },
    },

    paymentGateway: {
      razorpayKey: { type: String, default: "" },
      razorpaySecret: { type: String, default: "" },
    },

    updatedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);