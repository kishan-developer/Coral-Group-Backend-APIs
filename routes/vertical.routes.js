const express = require("express");
const { 
    getVerticals, 
    getVerticalBySlug, 
    createVertical, 
    updateVertical, 
    deleteVertical 
} = require("../controller/vertical.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/")
    .get(getVerticals)
    .post(protect, authorize("admin", "super_admin"), createVertical);

router.route("/:slug")
    .get(getVerticalBySlug);

router.route("/:id")
    .put(protect, authorize("admin", "super_admin"), updateVertical)
    .delete(protect, authorize("admin", "super_admin"), deleteVertical);

module.exports = router;
