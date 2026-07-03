const asyncHandler = require("express-async-handler");
const Query = require("../model/Query.model");
const User = require("../model/User.model");
const Project = require("../model/Project.model");
const ActivityLog = require("../model/ActivityLog.model");

// @desc    Get dashboard statistics
// @route   GET /api/v1/dashboard/stats
// @access  Private (Admin/Manager/Superadmin)
exports.getDashboardStats = asyncHandler(async (req, res) => {
    // Get lead statistics
    const leadStats = await Query.aggregate([
        {
            $group: {
                _id: null,
                totalLeads: { $sum: 1 },
                newLeads: { $sum: { $cond: [{ $eq: ["$stage", "New"] }, 1, 0] } },
                inProgressLeads: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } },
                closedLeads: { $sum: { $cond: [{ $eq: ["$stage", "Closed"] }, 1, 0] } },
                lostLeads: { $sum: { $cond: [{ $eq: ["$stage", "Lost"] }, 1, 0] } }
            }
        }
    ]);

    // Get project statistics
    const projectStats = await Project.aggregate([
        {
            $group: {
                _id: null,
                totalProjects: { $sum: 1 },
                activeProjects: { $sum: { $cond: [{ $eq: ["$status", "Ongoing"] }, 1, 0] } },
                upcomingProjects: { $sum: { $cond: [{ $eq: ["$status", "Upcoming"] }, 1, 0] } },
                completedProjects: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } }
            }
        }
    ]);

    // Get user statistics
    const userStats = await User.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                activeUsers: { $sum: { $cond: ["$isActive", 1, 0] } },
                adminUsers: { $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] } },
                managerUsers: { $sum: { $cond: [{ $eq: ["$role", "manager"] }, 1, 0] } },
                teamUsers: { $sum: { $cond: [{ $eq: ["$role", "team"] }, 1, 0] } }
            }
        }
    ]);

    // Calculate conversion rate
    const totalLeads = leadStats[0]?.totalLeads || 0;
    const closedLeads = leadStats[0]?.closedLeads || 0;
    const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;

    // Calculate total revenue (sum of confirmed lead values)
    const confirmedLeads = await Query.find({ status: "Confirmed", value: { $exists: true } });
    const totalRevenue = confirmedLeads.reduce((sum, lead) => {
        // Parse value like "₹12.5 Cr" to number
        const valueStr = lead.value.replace(/[₹, Cr L]/g, '').trim();
        const value = parseFloat(valueStr);
        if (lead.value.includes('Cr')) {
            return sum + (value * 10000000);
        } else if (lead.value.includes('L')) {
            return sum + (value * 100000);
        }
        return sum + value;
    }, 0);

    // Format revenue
    const formatRevenue = (amount) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)} L`;
        }
        return `₹${amount.toLocaleString()}`;
    };

    res.status(200).json({
        success: true,
        data: {
            totalLeads: leadStats[0]?.totalLeads || 0,
            newLeads: leadStats[0]?.newLeads || 0,
            inProgressLeads: leadStats[0]?.inProgressLeads || 0,
            closedLeads: leadStats[0]?.closedLeads || 0,
            lostLeads: leadStats[0]?.lostLeads || 0,
            totalProjects: projectStats[0]?.totalProjects || 0,
            activeProjects: projectStats[0]?.activeProjects || 0,
            totalRevenue: formatRevenue(totalRevenue),
            revenueGrowth: "+12.5%", // This would be calculated from historical data
            conversionRate: `${conversionRate}%`,
            totalUsers: userStats[0]?.totalUsers || 0,
            activeUsers: userStats[0]?.activeUsers || 0
        }
    });
});

// @desc    Get recent activity
// @route   GET /api/v1/dashboard/recent-activity
// @access  Private (Admin/Manager/Superadmin)
exports.getRecentActivity = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const activities = await ActivityLog.find()
        .populate("userId", "firstName lastName avatar")
        .sort("-createdAt")
        .limit(parseInt(limit));

    res.status(200).json({
        success: true,
        count: activities.length,
        data: activities
    });
});

// @desc    Get revenue chart data
// @route   GET /api/v1/dashboard/revenue-chart
// @access  Private (Admin/Manager/Superadmin)
exports.getRevenueChart = asyncHandler(async (req, res) => {
    const { period = "monthly", year = new Date().getFullYear() } = req.query;

    let groupBy;
    let dateFormat;

    if (period === "monthly") {
        groupBy = { $month: "$createdAt" };
        dateFormat = "%Y-%m";
    } else if (period === "weekly") {
        groupBy = { $week: "$createdAt" };
        dateFormat = "%Y-%W";
    } else {
        groupBy = { $dayOfMonth: "$createdAt" };
        dateFormat = "%Y-%m-%d";
    }

    const revenueData = await Query.aggregate([
        {
            $match: {
                status: "Confirmed",
                createdAt: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: groupBy,
                count: { $sum: 1 },
                totalValue: { $sum: { $toDouble: { $ifNull: ["$value", 0] } } }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    // Generate labels based on period
    const labels = period === "monthly" 
        ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        : Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);

    const data = labels.map((label, index) => {
        const monthData = revenueData.find(d => d._id === index + 1);
        return monthData ? monthData.totalValue : 0;
    });

    res.status(200).json({
        success: true,
        data: {
            labels,
            datasets: [
                {
                    label: "Revenue",
                    data
                }
            ]
        }
    });
});

// @desc    Get goal progress
// @route   GET /api/v1/dashboard/goal-progress
// @access  Private (Admin/Manager/Superadmin)
exports.getGoalProgress = asyncHandler(async (req, res) => {
    // Get sales team targets and achievements
    const salesTeam = await User.find({ role: { $in: ["manager", "team"] } });

    const goals = await Promise.all(salesTeam.map(async (user) => {
        const assignedLeads = await Query.countDocuments({ assignedExecutive: user._id });
        const convertedLeads = await Query.countDocuments({ 
            assignedExecutive: user._id, 
            status: "Confirmed" 
        });

        const monthlyTarget = user.targets?.monthly || 0;
        const achievedValue = convertedLeads * 5000000; // Assuming avg 50L per conversion

        return {
            goal: `${user.firstName} ${user.lastName} - Monthly Target`,
            current: achievedValue,
            target: monthlyTarget,
            progress: monthlyTarget > 0 ? Math.min((achievedValue / monthlyTarget) * 100, 100) : 0
        };
    }));

    // Add overall company goals
    const totalLeads = await Query.countDocuments();
    const confirmedLeads = await Query.countDocuments({ status: "Confirmed" });
    const overallConversionGoal = 10; // 10% target

    goals.push({
        goal: "Overall Lead Conversion",
        current: totalLeads > 0 ? (confirmedLeads / totalLeads) * 100 : 0,
        target: overallConversionGoal,
        progress: totalLeads > 0 ? Math.min((confirmedLeads / totalLeads) * 100 / overallConversionGoal * 100, 100) : 0
    });

    res.status(200).json({
        success: true,
        data: goals
    });
});

// @desc    Get today's leads
// @route   GET /api/v1/dashboard/today-leads
// @access  Private (Admin/Manager/Superadmin)
exports.getTodayLeads = asyncHandler(async (req, res) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const leads = await Query.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    })
        .populate("propertyInterest", "title")
        .populate("verticalInterest", "name")
        .sort("-createdAt");

    res.status(200).json({
        success: true,
        count: leads.length,
        data: leads
    });
});

// @desc    Get pending follow-ups
// @route   GET /api/v1/dashboard/pending-followups
// @access  Private (Admin/Manager/Superadmin)
exports.getPendingFollowups = asyncHandler(async (req, res) => {
    const followups = await Query.find({
        stage: { $in: ["New", "Follow-up"] },
        status: { $in: ["Pending", "In Progress"] }
    })
        .populate("propertyInterest", "title")
        .populate("verticalInterest", "name")
        .populate("assignedExecutive", "firstName lastName email")
        .sort("-createdAt");

    res.status(200).json({
        success: true,
        count: followups.length,
        data: followups
    });
});

// @desc    Get activity logs
// @route   GET /api/v1/dashboard/activity-logs
// @access  Private (Admin/Superadmin)
exports.getActivityLogs = asyncHandler(async (req, res) => {
    const { userId, action, page = 1, limit = 20 } = req.query;

    let filter = {};
    if (userId) filter.userId = userId;
    if (action) filter.action = action;

    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find(filter)
        .populate("userId", "firstName lastName email")
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(filter);

    res.status(200).json({
        success: true,
        count: logs.length,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: logs
    });
});

// @desc    Get lead funnel data
// @route   GET /api/v1/dashboard/lead-funnel
// @access  Private (Admin/Manager/Superadmin)
exports.getLeadFunnel = asyncHandler(async (req, res) => {
    const funnelData = await Query.aggregate([
        {
            $group: {
                _id: "$stage",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const stages = ["New", "Follow-up", "Negotiation", "Site Visit", "Closed", "Lost"];
    const data = stages.map(stage => {
        const stageData = funnelData.find(d => d._id === stage);
        return {
            stage,
            count: stageData ? stageData.count : 0
        };
    });

    res.status(200).json({
        success: true,
        data: {
            stages: data
        }
    });
});

// @desc    Get lead source analytics
// @route   GET /api/v1/dashboard/lead-sources
// @access  Private (Admin/Manager/Superadmin)
exports.getLeadSources = asyncHandler(async (req, res) => {
    const sourceData = await Query.aggregate([
        {
            $group: {
                _id: "$source",
                count: { $sum: 1 }
            }
        }
    ]);

    const total = sourceData.reduce((sum, item) => sum + item.count, 0);

    const data = sourceData.map(item => ({
        source: item._id,
        count: item.count,
        percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) : 0
    }));

    res.status(200).json({
        success: true,
        data
    });
});
