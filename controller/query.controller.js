const asyncHandler = require("express-async-handler");
const Query = require("../model/Query.model");
const ActivityLog = require("../model/ActivityLog.model");

// Helper function to log activity
const logActivity = async (userId, userName, action, entity, entityId, description, ipAddress, userAgent) => {
    try {
        await ActivityLog.create({
            userId,
            userName,
            action,
            entity,
            entityId,
            description,
            ipAddress,
            userAgent
        });
    } catch (error) {
        console.error("Error logging activity:", error);
    }
};

// @desc    Submit new inquiry
// @route   POST /api/v1/queries
// @access  Public
const submitQuery = asyncHandler(async (req, res) => {
    const { clientName, email, phone, message, propertyInterest, verticalInterest, source } = req.body;

    const query = await Query.create({
        clientName,
        email,
        phone,
        message,
        propertyInterest,
        verticalInterest,
        source: source || "Website"
    });

    res.status(201).json({
        success: true,
        message: "Inquiry submitted successfully. Our team will contact you soon.",
        data: query
    });
});

// @desc    Get all queries/leads
// @route   GET /api/v1/queries
// @access  Private (Admin/Manager)
const getQueries = asyncHandler(async (req, res) => {
    const { status, assignedTo, stage, source, page = 1, limit = 10 } = req.query;

    let filter = {};

    // If manager, only show queries for their assigned verticals
    if (req.user.role === 'manager' && req.user.assignedVerticals && req.user.assignedVerticals.length > 0) {
        filter.verticalInterest = { $in: req.user.assignedVerticals };
    }

    if (status) filter.status = status;
    if (assignedTo) filter.assignedExecutive = assignedTo;
    if (stage) filter.stage = stage;
    if (source) filter.source = source;

    const skip = (page - 1) * limit;

    const queries = await Query.find(filter)
        .populate("propertyInterest", "title slug")
        .populate("verticalInterest", "name slug")
        .populate("assignedExecutive", "firstName lastName email")
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Query.countDocuments(filter);

    res.status(200).json({
        success: true,
        count: queries.length,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: queries
    });
});

// @desc    Get single query
// @route   GET /api/v1/queries/:id
// @access  Private (Admin/Manager)
const getQuery = asyncHandler(async (req, res) => {
    const query = await Query.findById(req.params.id)
        .populate("propertyInterest", "title slug description images")
        .populate("verticalInterest", "name description")
        .populate("assignedExecutive", "firstName lastName email phone")
        .populate("notes.admin", "firstName lastName");

    if (!query) {
        return res.status(404).json({
            success: false,
            message: "Inquiry not found"
        });
    }

    res.status(200).json({
        success: true,
        data: query
    });
});

// @desc    Update query status/assignment
// @route   PATCH /api/v1/queries/:id
// @access  Private (Admin/Manager)
const updateQuery = asyncHandler(async (req, res) => {
    const { status, assignedExecutive, stage, value, note } = req.body;
    let query = await Query.findById(req.params.id);

    if (!query) {
        return res.status(404).json({
            success: false,
            message: "Inquiry not found"
        });
    }

    if (status) query.status = status;
    if (assignedExecutive) query.assignedExecutive = assignedExecutive;
    if (stage) query.stage = stage;
    if (value) query.value = value;

    if (note) {
        query.notes.push({
            content: note,
            admin: req.user._id
        });
    }

    await query.save();

    // Log activity
    await logActivity(
        req.user._id,
        `${req.user.firstName} ${req.user.lastName}`,
        "update",
        "Query",
        query._id,
        `Updated query for ${query.clientName}`,
        req.ip,
        req.get("user-agent")
    );

    res.status(200).json({
        success: true,
        data: query
    });
});

// @desc    Delete query
// @route   DELETE /api/v1/queries/:id
// @access  Private (Admin/Superadmin)
const deleteQuery = asyncHandler(async (req, res) => {
    const query = await Query.findById(req.params.id);

    if (!query) {
        return res.status(404).json({
            success: false,
            message: "Inquiry not found"
        });
    }

    await query.deleteOne();

    // Log activity
    await logActivity(
        req.user._id,
        `${req.user.firstName} ${req.user.lastName}`,
        "delete",
        "Query",
        query._id,
        `Deleted query for ${query.clientName}`,
        req.ip,
        req.get("user-agent")
    );

    res.status(200).json({
        success: true,
        message: "Inquiry deleted successfully"
    });
});

// @desc    Bulk update queries
// @route   POST /api/v1/queries/bulk-update
// @access  Private (Admin/Manager)
const bulkUpdateQueries = asyncHandler(async (req, res) => {
    const { queryIds, updates } = req.body;

    if (!queryIds || !Array.isArray(queryIds) || queryIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Please provide query IDs"
        });
    }

    if (!updates) {
        return res.status(400).json({
            success: false,
            message: "Please provide updates"
        });
    }

    const result = await Query.updateMany(
        { _id: { $in: queryIds } },
        updates
    );

    // Log activity
    await logActivity(
        req.user._id,
        `${req.user.firstName} ${req.user.lastName}`,
        "update",
        "Query",
        null,
        `Bulk updated ${result.modifiedCount} queries`,
        req.ip,
        req.get("user-agent")
    );

    res.status(200).json({
        success: true,
        message: `${result.modifiedCount} queries updated successfully`,
        modifiedCount: result.modifiedCount
    });
});

// @desc    Assign lead to executive
// @route   POST /api/v1/queries/:id/assign
// @access  Private (Admin/Manager)
const assignLead = asyncHandler(async (req, res) => {
    const { assignedExecutive } = req.body;
    let query = await Query.findById(req.params.id);

    if (!query) {
        return res.status(404).json({
            success: false,
            message: "Inquiry not found"
        });
    }

    query.assignedExecutive = assignedExecutive;
    await query.save();

    // Log activity
    await logActivity(
        req.user._id,
        `${req.user.firstName} ${req.user.lastName}`,
        "update",
        "Query",
        query._id,
        `Assigned lead ${query.clientName} to executive`,
        req.ip,
        req.get("user-agent")
    );

    res.status(200).json({
        success: true,
        message: "Lead assigned successfully",
        data: query
    });
});

// @desc    Get lead statistics
// @route   GET /api/v1/queries/stats
// @access  Private (Admin/Manager)
const getQueryStats = asyncHandler(async (req, res) => {
    const stats = await Query.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
                inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } },
                confirmed: { $sum: { $cond: [{ $eq: ["$status", "Confirmed"] }, 1, 0] } },
                cancelled: { $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] } },
                new: { $sum: { $cond: [{ $eq: ["$stage", "New"] }, 1, 0] } },
                followUp: { $sum: { $cond: [{ $eq: ["$stage", "Follow-up"] }, 1, 0] } },
                negotiation: { $sum: { $cond: [{ $eq: ["$stage", "Negotiation"] }, 1, 0] } },
                siteVisit: { $sum: { $cond: [{ $eq: ["$stage", "Site Visit"] }, 1, 0] } },
                closed: { $sum: { $cond: [{ $eq: ["$stage", "Closed"] }, 1, 0] } },
                lost: { $sum: { $cond: [{ $eq: ["$stage", "Lost"] }, 1, 0] } }
            }
        }
    ]);

    const sourceStats = await Query.aggregate([
        {
            $group: {
                _id: "$source",
                count: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: {
            overview: stats[0] || {},
            bySource: sourceStats
        }
    });
});

module.exports = {
    submitQuery,
    getQueries,
    getQuery,
    updateQuery,
    deleteQuery,
    bulkUpdateQueries,
    assignLead,
    getQueryStats
};
