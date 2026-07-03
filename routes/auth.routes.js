const express = require("express");
const {
    login,
    registerUser,
    logoutUser,
    getMe
} = require("../controller/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// @route   POST /api/v1/auth/register
router.post("/register", registerUser);

// @route   POST /api/v1/auth/login
router.post("/login", login);

// @route   GET /api/v1/auth/logout
router.get("/logout", logoutUser);

// @route   GET /api/v1/auth/me
router.get("/me", protect, getMe);

module.exports = router;
