const asyncHandler = require("express-async-handler");
const User = require("../model/User.model");
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

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Admin/Superadmin)
exports.getUsers = asyncHandler(async (req, res) => {
    const { role, status, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (role) filter.role = role;
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
        .select("-password -refreshToken -forgotPasswordToken")
        .populate("assignedVerticals", "name")
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
        success: true,
        count: users.length,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: users
    });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private (Admin/Superadmin)
exports.getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select("-password -refreshToken -forgotPasswordToken")
        .populate("assignedVerticals", "name");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Private (Admin/Superadmin)
exports.createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, password, role, designation, department, assignedVerticals } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        role: role || "user",
        designation,
        department,
        assignedVerticals
    });

    // Log activity
    await logActivity(
        req.user._id,
        `${req.user.firstName} ${req.user.lastName}`,
        "create",
        "User",
        user._id,
        `Created user ${email}`,
        req.ip,
        req.get("user-agent")
    );

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            designation: user.designation,
            department: user.department,
            isActive: user.isActive
        }
    });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private (Admin/Superadmin)
exports.updateUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phone, role, designation, department, assignedVerticals } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    user.designation = designation || user.designation;
    user.department = department || user.department;
    user.assignedVerticals = assignedVerticals || user.assignedVerticals;

    await user.save();

    // Log activity
    await logActivity(
        req.user._id,
        `${req.user.firstName} ${req.user.lastName}`,
        "update",
        "User",
        user._id,
        `Updated user ${user.email}`,
        req.ip,
        req.get("user-agent")
    );

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            designation: user.designation,
            department: user.department,
            isActive: user.isActive
        }
    });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private (Superadmin)
exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({
            success: false,
            message: "Cannot delete your own account"
        });
    }

    await user.deleteOne();

    // Log activity
    await logActivity(
        req.user._id,
        `${req.user.firstName} ${req.user.lastName}`,
        "delete",
        "User",
        user._id,
        `Deleted user ${user.email}`,
        req.ip,
        req.get("user-agent")
    );

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});

// @desc    Update user status (active/inactive)
// @route   PUT /api/v1/users/:id/status
// @access  Private (Admin/Superadmin)
exports.updateUserStatus = asyncHandler(async (req, res) => {
    const { isActive } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    user.isActive = isActive !== undefined ? isActive : user.isActive;
    await user.save();

    // Log activity
    await logActivity(
        req.user._id,
        `${req.user.firstName} ${req.user.lastName}`,
        "update",
        "User",
        user._id,
        `Updated user status to ${user.isActive ? 'active' : 'inactive'}`,
        req.ip,
        req.get("user-agent")
    );

    res.status(200).json({
        success: true,
        message: "User status updated successfully",
        data: {
            _id: user._id,
            isActive: user.isActive
        }
    });
});

// @desc    Invite user
// @route   POST /api/v1/users/invite
// @access  Private (Admin/Superadmin)
exports.inviteUser = asyncHandler(async (req, res) => {
    const { email, role, department } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    // TODO: Implement email invitation logic with token
    // For now, return success message
    res.status(200).json({
        success: true,
        message: "Invitation sent successfully",
        data: {
            email,
            role,
            department
        }
    });
});

// @desc    Update user targets
// @route   PUT /api/v1/users/:id/targets
// @access  Private (Admin/Manager)
exports.updateUserTargets = asyncHandler(async (req, res) => {
    const { monthly, quarterly, yearly } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    user.targets = {
        monthly: monthly || user.targets.monthly,
        quarterly: quarterly || user.targets.quarterly,
        yearly: yearly || user.targets.yearly
    };

    await user.save();

    res.status(200).json({
        success: true,
        message: "User targets updated successfully",
        data: {
            _id: user._id,
            targets: user.targets
        }
    });
});
