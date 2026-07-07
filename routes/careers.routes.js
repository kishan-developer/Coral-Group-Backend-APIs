const express = require("express");
const { submitApplication } = require("../controller/jobApplication.controller");

const router = express.Router();

router.post("/apply", submitApplication);

module.exports = router;
