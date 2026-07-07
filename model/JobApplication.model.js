const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        position: { type: String, trim: true },
        experience: { type: String, trim: true },
        coverLetter: { type: String, trim: true },
        resumeUrl: { type: String },
        status: {
            type: String,
            enum: ["new", "reviewing", "shortlisted", "rejected", "hired"],
            default: "new",
        },
    },
    { timestamps: true }
);

jobApplicationSchema.index({ email: 1 });
jobApplicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
