const asyncHandler = require("express-async-handler");
const Vertical = require("../model/Vertical.model");

// @desc    Get all verticals
// @route   GET /api/v1/verticals
// @access  Public
const getVerticals = asyncHandler(async (req, res) => {
    const verticals = await Vertical.find({ status: "active" });
    res.status(200).json({
        success: true,
        data: verticals,
    });
});

// @desc    Get single vertical by slug
// @route   GET /api/v1/verticals/:slug
// @access  Public
const getVerticalBySlug = asyncHandler(async (req, res) => {
    const vertical = await Vertical.findOne({ slug: req.params.slug });
    if (!vertical) {
        res.status(404);
        throw new Error("Vertical not found");
    }
    res.status(200).json({
        success: true,
        data: vertical,
    });
});

// @desc    Create new vertical
// @route   POST /api/v1/verticals
// @access  Private/Admin
const createVertical = asyncHandler(async (req, res) => {
    const { name, slug, description, category, icon, image } = req.body;
    
    const verticalExists = await Vertical.findOne({ slug });
    if (verticalExists) {
        res.status(400);
        throw new Error("Vertical with this slug already exists");
    }

    const vertical = await Vertical.create({
        name,
        slug,
        description,
        category,
        icon,
        image
    });

    res.status(201).json({
        success: true,
        data: vertical,
    });
});

// @desc    Update vertical
// @route   PUT /api/v1/verticals/:id
// @access  Private/Admin
const updateVertical = asyncHandler(async (req, res) => {
    const vertical = await Vertical.findById(req.params.id);

    if (!vertical) {
        res.status(404);
        throw new Error("Vertical not found");
    }

    const updatedVertical = await Vertical.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: updatedVertical,
    });
});

// @desc    Delete vertical
// @route   DELETE /api/v1/verticals/:id
// @access  Private/Admin
const deleteVertical = asyncHandler(async (req, res) => {
    const vertical = await Vertical.findById(req.params.id);

    if (!vertical) {
        res.status(404);
        throw new Error("Vertical not found");
    }

    await vertical.deleteOne();

    res.status(200).json({
        success: true,
        message: "Vertical removed successfully",
    });
});

module.exports = {
    getVerticals,
    getVerticalBySlug,
    createVertical,
    updateVertical,
    deleteVertical
};
