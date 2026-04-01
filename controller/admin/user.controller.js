const User = require("../../model/User.model");
const asyncHandler = require("express-async-handler");

// Users
exports.getAllUsers = asyncHandler(async (req, res) => {
    
    const users = await User.find({});

    if (!users) {
        return res.error("Users Not Found", 404);
    }
    return res.success("User fetched successfully", users);
});
