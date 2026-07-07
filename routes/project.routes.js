const express = require("express");
const { 
    getProjects, 
    getProjectBySlug, 
    createProject, 
    updateProject, 
    deleteProject 
} = require("../controller/project.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/")
    .get(getProjects)
    .post(protect, authorize("admin", "manager", "super_admin"), createProject);

router.route("/slug/:slug")
    .get(getProjectBySlug);

router.route("/:id")
    .put(protect, authorize("admin", "manager", "super_admin"), updateProject)
    .delete(protect, authorize("admin", "super_admin"), deleteProject);

module.exports = router;
