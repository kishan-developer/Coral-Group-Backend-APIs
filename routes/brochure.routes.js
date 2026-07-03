const express = require("express");
const router = express.Router();
const brochureController = require("../controller/brochure.controller");

// Submit brochure request
router.post("/request", brochureController.submitBrochureRequest);

module.exports = router;
