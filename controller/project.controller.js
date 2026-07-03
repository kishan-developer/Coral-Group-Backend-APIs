const asyncHandler = require("express-async-handler");
const Project = require("../model/Project.model");

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
    const { vertical, status, featured } = req.query;
    let query = {};

    if (vertical) query.vertical = vertical;
    if (status) query.status = status;
    if (featured) query.isFeatured = featured === 'true';

    const projects = await Project.find(query).populate("vertical", "name category");
    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
    });
});

// @desc    Get single project by slug
// @route   GET /api/v1/projects/:slug
// @access  Public
const getProjectBySlug = asyncHandler(async (req, res) => {
    const project = await Project.findOne({ slug: req.params.slug }).populate("vertical");
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    res.status(200).json({
        success: true,
        data: project,
    });
});

// @desc    Create new project
// @route   POST /api/v1/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
    const project = await Project.create(req.body);

    res.status(201).json({
        success: true,
        data: project,
    });
});

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
    let project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: project,
    });
});

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }

    await project.deleteOne();

    res.status(200).json({
        success: true,
        message: "Project removed successfully",
    });
});

module.exports = {
    getProjects,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject
};
