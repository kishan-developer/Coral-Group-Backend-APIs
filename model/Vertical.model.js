const mongoose = require("mongoose");

const verticalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        icon: {
            type: String, // Icon name or SVG string
        },
        image: {
            type: String, // Banner image URL
        },
        category: {
            type: String,
            enum: ["Residential", "Commercial", "Industrial"],
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const Vertical = mongoose.model("Vertical", verticalSchema);

module.exports = Vertical;
