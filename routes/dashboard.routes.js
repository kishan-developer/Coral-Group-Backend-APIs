const express = require("express");
const {
    getDashboardStats,
    getRecentActivity,
    getRevenueChart,
    getGoalProgress,
    getTodayLeads,
    getPendingFollowups,
    getActivityLogs,
    getLeadFunnel,
    getLeadSources
} = require("../controller/dashboard.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

// @route   GET /api/v1/dashboard/stats
// @access  Private (Admin/Manager/Superadmin)
router.get("/stats", authorize("admin", "manager", "super_admin"), getDashboardStats);

// @route   GET /api/v1/dashboard/recent-activity
// @access  Private (Admin/Manager/Superadmin)
router.get("/recent-activity", authorize("admin", "manager", "super_admin"), getRecentActivity);

// @route   GET /api/v1/dashboard/revenue-chart
// @access  Private (Admin/Manager/Superadmin)
router.get("/revenue-chart", authorize("admin", "manager", "super_admin"), getRevenueChart);

// @route   GET /api/v1/dashboard/goal-progress
// @access  Private (Admin/Manager/Superadmin)
router.get("/goal-progress", authorize("admin", "manager", "super_admin"), getGoalProgress);

// @route   GET /api/v1/dashboard/today-leads
// @access  Private (Admin/Manager/Superadmin)
router.get("/today-leads", authorize("admin", "manager", "super_admin"), getTodayLeads);

// @route   GET /api/v1/dashboard/pending-followups
// @access  Private (Admin/Manager/Superadmin)
router.get("/pending-followups", authorize("admin", "manager", "super_admin"), getPendingFollowups);

// @route   GET /api/v1/dashboard/activity-logs
// @access  Private (Admin/Superadmin)
router.get("/activity-logs", authorize("admin", "super_admin"), getActivityLogs);

// @route   GET /api/v1/dashboard/lead-funnel
// @access  Private (Admin/Manager/Superadmin)
router.get("/lead-funnel", authorize("admin", "manager", "super_admin"), getLeadFunnel);

// @route   GET /api/v1/dashboard/lead-sources
// @access  Private (Admin/Manager/Superadmin)
router.get("/lead-sources", authorize("admin", "manager", "super_admin"), getLeadSources);

module.exports = router;
