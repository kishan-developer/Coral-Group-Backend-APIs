const express = require("express");
const {
    submitQuery,
    getQueries,
    getQuery,
    updateQuery,
    deleteQuery,
    bulkUpdateQueries,
    assignLead,
    getQueryStats
} = require("../controller/query.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

// Public route for submitting queries
router.post("/", submitQuery);

// All other routes require authentication
router.use(protect);

// @route   GET /api/v1/queries
// @access  Private (Admin/Manager/Superadmin)
router.get("/", authorize("admin", "manager", "super_admin"), getQueries);

// @route   GET /api/v1/queries/stats
// @access  Private (Admin/Manager/Superadmin)
router.get("/stats", authorize("admin", "manager", "super_admin"), getQueryStats);

// @route   POST /api/v1/queries/bulk-update
// @access  Private (Admin/Manager/Superadmin)
router.post("/bulk-update", authorize("admin", "manager", "super_admin"), bulkUpdateQueries);

// @route   GET /api/v1/queries/:id
// @access  Private (Admin/Manager/Superadmin)
router.get("/:id", authorize("admin", "manager", "super_admin"), getQuery);

// @route   PATCH /api/v1/queries/:id
// @access  Private (Admin/Manager/Superadmin)
router.patch("/:id", authorize("admin", "manager", "super_admin"), updateQuery);

// @route   DELETE /api/v1/queries/:id
// @access  Private (Admin/Superadmin)
router.delete("/:id", authorize("admin", "super_admin"), deleteQuery);

// @route   POST /api/v1/queries/:id/assign
// @access  Private (Admin/Manager/Superadmin)
router.post("/:id/assign", authorize("admin", "manager", "super_admin"), assignLead);

module.exports = router;
