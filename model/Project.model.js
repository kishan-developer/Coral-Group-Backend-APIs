const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
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
        location: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        priceRange: {
            type: String, // e.g., "₹85L - ₹12.5Cr"
        },
        status: {
            type: String,
            enum: ["Upcoming", "Ongoing", "Completed"],
            default: "Ongoing",
        },
        features: [
            {
                type: String,
            }
        ],
        amenities: [
            {
                type: String,
            }
        ],
        specifications: {
            type: mongoose.Schema.Types.Mixed,
        },
        metaTitle: {
            type: String,
        },
        metaDescription: {
            type: String,
        },
        images: [
            {
                type: String, // Array of image URLs
            }
        ],
        vertical: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vertical",
            required: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
