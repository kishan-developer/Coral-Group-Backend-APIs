const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
    {
        clientName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
        },
        propertyInterest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
        verticalInterest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vertical",
        },
        message: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Confirmed", "Cancelled"],
            default: "Pending",
        },
        assignedExecutive: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Usually a Manager
        },
        source: {
            type: String,
            enum: ["Website", "Referral", "Advertisement", "Social Media", "Walk-in"],
            default: "Website",
        },
        stage: {
            type: String,
            enum: ["New", "Follow-up", "Negotiation", "Site Visit", "Closed", "Lost"],
            default: "New",
        },
        value: {
            type: String, // e.g., "₹12.5 Cr"
        },
        notes: [
            {
                content: String,
                admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

const Query = mongoose.model("Query", querySchema);

module.exports = Query;
