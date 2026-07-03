const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema(
    {
        avatar: {
            type: String,
        },
        firstName: {
            type: String,
            required: true,
            lowercase: true,
        },
        lastName: {
            type: String,
            required: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ["user", "admin", "manager", "team", "super_admin"],
            default: "user",
        },
        designation: {
            type: String, // e.g., "Sales Head", "Marketing Executive"
        },
        department: {
            type: String, // e.g., "Real Estate", "Administration"
        },
        assignedVerticals: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Vertical",
            },
        ],
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
        forgotPasswordToken: {
            value: { type: String },
            expiresAt: { type: Date },
        },
        refreshToken: {
            type: String,
        },
        // Sales team specific fields
        targets: {
            monthly: { type: Number, default: 0 },
            quarterly: { type: Number, default: 0 },
            yearly: { type: Number, default: 0 },
        },
        performance: {
            leadsAssigned: { type: Number, default: 0 },
            leadsConverted: { type: Number, default: 0 },
            conversionRate: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            role: this.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            isAdmin: this.isAdmin,
            email: this.email,
            role: this.role,
        },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
