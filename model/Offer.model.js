const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String, // banner image
    },

    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    maxUsageLimit: {
      type: Number,
      required: true,
      min: 1,
    },

    usageCount: {
      type: Number,
      default: 0,
    },

    validFrom: {
      type: Date,
      required: true,
      default: Date.now,
    },

    validTill: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);


//  Virtual Field → Check Expiry
offerSchema.virtual("isExpired").get(function () {
  const now = new Date();
  return now > this.validTill;
});


//  Virtual Field → Check Usage Limit
offerSchema.virtual("isUsageLimitReached").get(function () {
  return this.usageCount >= this.maxUsageLimit;
});


//  Auto Expire Middleware
offerSchema.pre("save", function (next) {
  const now = new Date();

  if (now > this.validTill) {
    this.status = "expired";
  }

  next();
});


//  Include virtual fields in JSON
offerSchema.set("toJSON", { virtuals: true });
offerSchema.set("toObject", { virtuals: true });


const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;