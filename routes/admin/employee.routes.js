const express = require("express");
const employeeRoutes = express.Router();
const upload = require("../middleware/employeeUpload");

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

employeeRoutes.post("/", upload.single("profileImage"), createEmployee);

employeeRoutes.get("/", getEmployees);

employeeRoutes.get("/:id", getEmployeeById);

employeeRoutes.put("/:id", upload.single("profileImage"), updateEmployee);

employeeRoutes.delete("/:id", deleteEmployee);

module.exports = employeeRoutes;