const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        shelterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "rooms"
        },
        roomTitle: { type: String, required: true },
        roomDetails: { type: String },
        roomPrice: { type: Number, required: true },
        images: { type: [String], default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);