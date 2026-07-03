const express = require("express");
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    inviteUser,
    updateUserTargets
} = require("../controller/user.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/v1/users
// @access  Private (Admin/Superadmin)
router.get("/", authorize("admin", "super_admin"), getUsers);

// @route   GET /api/v1/users/:id
// @access  Private (Admin/Superadmin)
router.get("/:id", authorize("admin", "super_admin"), getUser);

// @route   POST /api/v1/users
// @access  Private (Admin/Superadmin)
router.post("/", authorize("admin", "super_admin"), createUser);

// @route   PUT /api/v1/users/:id
// @access  Private (Admin/Superadmin)
router.put("/:id", authorize("admin", "super_admin"), updateUser);

// @route   DELETE /api/v1/users/:id
// @access  Private (Superadmin)
router.delete("/:id", authorize("super_admin"), deleteUser);

// @route   PUT /api/v1/users/:id/status
// @access  Private (Admin/Superadmin)
router.put("/:id/status", authorize("admin", "super_admin"), updateUserStatus);

// @route   POST /api/v1/users/invite
// @access  Private (Admin/Superadmin)
router.post("/invite", authorize("admin", "super_admin"), inviteUser);

// @route   PUT /api/v1/users/:id/targets
// @access  Private (Admin/Manager)
router.put("/:id/targets", authorize("admin", "manager"), updateUserTargets);

module.exports = router;
