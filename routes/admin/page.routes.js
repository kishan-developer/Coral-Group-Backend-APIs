const express = require("express");
const pageRouter = express.Router();
// const upload = require("../middleware/upload");

const {
  getPage,
  addSection,
  updateSection,
  deleteSection,
  addItem,
  deleteItem
} = require("../../controller/admin/page.controller");

pageRouter.get("/:page", getPage);

pageRouter.post(
  "/home/section",
  // upload.array("images", 10),
  addSection
);

pageRouter.put(
  "/section/:sectionId",
  // upload.array("images", 10),
  updateSection
);

pageRouter.delete("/section/:sectionId", deleteSection);

pageRouter.post(
  "/section/:sectionId/item",
  // upload.single("image"),
  addItem
);

pageRouter.delete(
  "/section/:sectionId/item/:itemId",
  deleteItem
);

module.exports = pageRouter;