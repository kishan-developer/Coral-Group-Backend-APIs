const express = require("express");

// routes
const authRoutes = require("./auth.routes");
const verticalRoutes = require("./vertical.routes");
const projectRoutes = require("./project.routes");
const queryRoutes = require("./query.routes");
const userRoutes = require("./user.routes");
const dashboardRoutes = require("./dashboard.routes");
const brochureRoutes = require("./brochure.routes");

const router = express.Router();

// Public / Health check
router.get("/status", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Coral Group API is live and operational",
        timestamp: new Date().toISOString()
    });
});

// Route registration
router.use("/auth", authRoutes);
router.use("/verticals", verticalRoutes);
router.use("/projects", projectRoutes);
router.use("/queries", queryRoutes);
router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/brochure", brochureRoutes);

module.exports = router;
