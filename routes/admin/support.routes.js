const express = require("express");
const supportrouter = express.Router();

const {
  createSupport,
  getAllSupport,
  getSingleSupport,
  updateSupportStatus,
  replySupport,
  deleteSupport,
} = require("../../controller/admin/support.controller");

supportrouter.post("/", createSupport);

supportrouter.get("/", getAllSupport);

supportrouter.get("/:id", getSingleSupport);

supportrouter.put("/status/:id", updateSupportStatus);

supportrouter.put("/reply/:id", replySupport);

supportrouter.delete("/:id", deleteSupport);

module.exports = supportrouter;