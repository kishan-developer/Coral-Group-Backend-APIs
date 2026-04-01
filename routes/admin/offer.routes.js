const express = require("express");
const adminOfferRouter = express.Router();
const {
  createOffer,
  updateOffer,
  deleteOffer,
  adminGetOffer,
} = require("../../controller/admin/offer.controller");


// Create Offer
adminOfferRouter.post("/create", createOffer);

// Get All Offers
adminOfferRouter.get("/", adminGetOffer);

// Update Offer
adminOfferRouter.put("/:id", updateOffer);

// Delete Offer
adminOfferRouter.delete("/:id", deleteOffer);

module.exports = adminOfferRouter;