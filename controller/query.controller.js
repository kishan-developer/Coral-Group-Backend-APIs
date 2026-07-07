const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const Query = require("../model/Query.model");
const ActivityLog = require("../model/ActivityLog.model");

const SITE_URL = process.env.SITE_URL || "http://localhost:3000";
const LOGO_URL = `${SITE_URL}/Coral_Logo_White.png`;

const createTransporter = () =>
    nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
        tls: { rejectUnauthorized: false },
    });

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

    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !email) return;

    const transporter = createTransporter();

    const userHtml = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#111;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111;padding:30px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;border-radius:16px;overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#94cb3d,#5a8a1a);padding:32px 40px;text-align:center;">
        <img src="${LOGO_URL}" width="150" alt="Coral Group" style="display:block;margin:0 auto 10px;" />
        <p style="color:rgba(255,255,255,0.85);margin:0;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Premium Real Estate</p>
      </td></tr>
      <tr><td style="background:#1a1a1a;padding:40px;">
        <h2 style="color:#94cb3d;margin:0 0 8px;">Query Received ✓</h2>
        <p style="color:#ccc;margin:0 0 20px;">Dear <strong style="color:#fff;">${clientName}</strong>,</p>
        <p style="color:#aaa;font-size:14px;line-height:1.7;margin:0 0 24px;">Thank you for contacting Coral Group. We have received your message and one of our executives will get back to you shortly.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#242424;border-left:4px solid #94cb3d;border-radius:0 8px 8px 0;margin-bottom:24px;">
          <tr><td style="padding:18px 22px;">
            <p style="color:#94cb3d;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">Your Message</p>
            <p style="color:#ddd;font-size:14px;margin:0;">${message}</p>
          </td></tr>
        </table>
        <p style="color:#666;font-size:12px;margin:0;">Best regards,<br><strong style="color:#94cb3d;">Coral Group Team</strong></p>
      </td></tr>
      <tr><td style="background:#141414;padding:18px 40px;text-align:center;border-top:1px solid #2a2a2a;">
        <p style="color:#555;font-size:11px;margin:0;">Coral Group | info@coral-group.in | (+91) 780-000-0097</p>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;

    const adminHtml = `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#111;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111;padding:30px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;border-radius:16px;overflow:hidden;">
      <tr><td style="background:#1a1a1a;padding:22px 40px;border-bottom:3px solid #94cb3d;">
        <table width="100%"><tr>
          <td><img src="${LOGO_URL}" width="110" alt="Coral Group" /></td>
          <td align="right"><span style="background:#94cb3d;color:#000;font-size:11px;font-weight:700;padding:5px 12px;border-radius:20px;">📩 New Query</span></td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#94cb3d;padding:12px 40px;text-align:center;">
        <h2 style="color:#000;margin:0;font-size:16px;font-weight:800;">New Contact Inquiry — Action Required</h2>
      </td></tr>
      <tr><td style="background:#1a1a1a;padding:32px 40px;">
        <p style="color:#aaa;font-size:13px;margin:0 0 18px;">Received on <strong style="color:#94cb3d;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</strong></p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#242424;border-radius:10px;overflow:hidden;margin-bottom:18px;">
          <tr><td style="background:#94cb3d;padding:10px 18px;"><p style="color:#000;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin:0;">Lead Details</p></td></tr>
          <tr><td style="padding:14px 18px 4px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="color:#666;font-size:13px;padding:6px 0;border-bottom:1px solid #2e2e2e;width:35%;">Name</td><td style="color:#fff;font-size:13px;padding:6px 0;border-bottom:1px solid #2e2e2e;font-weight:600;">${clientName}</td></tr>
              <tr><td style="color:#666;font-size:13px;padding:6px 0;border-bottom:1px solid #2e2e2e;">Email</td><td style="font-size:13px;padding:6px 0;border-bottom:1px solid #2e2e2e;"><a href="mailto:${email}" style="color:#94cb3d;text-decoration:none;">${email}</a></td></tr>
              ${phone ? `<tr><td style="color:#666;font-size:13px;padding:6px 0;border-bottom:1px solid #2e2e2e;">Phone</td><td style="font-size:13px;padding:6px 0;border-bottom:1px solid #2e2e2e;"><a href="tel:${phone}" style="color:#94cb3d;text-decoration:none;">${phone}</a></td></tr>` : ""}
              <tr><td style="color:#666;font-size:13px;padding:6px 0;vertical-align:top;">Message</td><td style="color:#fff;font-size:13px;padding:6px 0;">${message}</td></tr>
            </table>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="background:#141414;padding:16px 40px;text-align:center;border-top:1px solid #2a2a2a;">
        <p style="color:#444;font-size:11px;margin:0;">Coral Group Contact Notification</p>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;

    Promise.all([
        transporter.sendMail({
            from: `"Coral Group" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `✅ Query Received — Coral Group`,
            html: userHtml,
        }),
        transporter.sendMail({
            from: `"Coral Group Website" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || "info@coral-group.in",
            replyTo: `"${clientName}" <${email}>`,
            subject: `📩 New Contact Query: ${clientName}`,
            html: adminHtml,
        }),
    ])
        .then(() => console.log(`Contact query emails sent: ${email}`))
        .catch((err) => console.error("Contact query email failed:", err.message));
});

// @desc    Get all queries/leads
// @route   GET /api/v1/queries
// @access  Public
const getQueries = asyncHandler(async (req, res) => {
    const { status, assignedTo, stage, source, page = 1, limit = 10 } = req.query;

    let filter = {};

    // If authenticated user is manager, only show queries for their assigned verticals
    if (req.user && req.user.role === 'manager' && req.user.assignedVerticals && req.user.assignedVerticals.length > 0) {
        filter.verticalInterest = { $in: req.user.assignedVerticals };
    }

    if (status) filter.status = status;
    if (assignedTo) filter.assignedExecutive = assignedTo;
    if (stage) filter.stage = stage;
    if (source) filter.source = source;

    const skip = (page - 1) * limit;

    const queries = await Query.find(filter)
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
