const asyncHandler = require("express-async-handler");
const User = require("../model/User.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

// Generate Tokens
const generateTokens = async (userId) => {
    const user = await User.findById(userId);
    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { token, refreshToken };
};

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, password, role, designation, department } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        role: role || "user",
        designation,
        department
    });

    const { token, refreshToken } = await generateTokens(user._id);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            designation: user.designation,
            department: user.department,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const { token, refreshToken } = await generateTokens(user._id);

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    res.cookie("token", token, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: `Welcome back, ${user.firstName}`,
        token,
        user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            designation: user.designation,
            department: user.department,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
});

// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
});

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate("assignedVerticals");
    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            designation: user.designation,
            department: user.department,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            assignedVerticals: user.assignedVerticals,
            lastLogin: user.lastLogin,
            targets: user.targets,
            performance: user.performance,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
});
