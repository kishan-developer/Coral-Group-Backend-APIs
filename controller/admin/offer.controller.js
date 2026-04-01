// Admin Offer Controller
const Offer = require("../../model/Offer.model");


// CREATE OFFER
const createOffer = async (req, res) => {
  try {
    let { discount, maxAge, maxUsageLimit, status = false } = req.body;

    // Validation
    if (!discount || !maxAge || !maxUsageLimit) {
      return res.error("Please provide all required fields", 400);
    }

    // Ensure number
    discount = Number(discount);
    maxAge = Number(maxAge);
    maxUsageLimit = Number(maxUsageLimit);

    if (maxUsageLimit <= 0) maxUsageLimit = 1;

    // Check existing offer
    const isOfferExist = await Offer.findOne({ discount });

    if (isOfferExist) {
      return res.error(`Offer with ${discount}% already exists`, 400);
    }

    const offer = await Offer.create({
      discount,
      maxAge,
      maxUsageLimit,
      status,
    });

    return res.status(201).json({
      message: "Offer created successfully",
      offer,
    });

  } catch (error) {
    console.error("Create Offer Error:", error);
    return res.error("Something went wrong while creating offer", 500);
  }
};



// UPDATE OFFER
const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.error("Please provide offer ID", 400);
    }

    const offer = await Offer.findById(id);

    if (!offer) {
      return res.error("Offer not found", 404);
    }

    // Check duplicate discount
    if (updateData.discount) {
      const existingOffer = await Offer.findOne({
        discount: updateData.discount,
        _id: { $ne: id },
      });

      if (existingOffer) {
        return res.error(
          `Offer with ${updateData.discount}% discount already exists`,
          400
        );
      }
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return res.success("Offer updated successfully", updatedOffer);

  } catch (error) {
    console.error("Update Offer Error:", error);
    return res.error("Something went wrong while updating offer", 500);
  }
};



// DELETE OFFER
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.error("Please provide offer ID", 400);
    }

    const deletedOffer = await Offer.findByIdAndDelete(id);

    if (!deletedOffer) {
      return res.error("Offer not found", 404);
    }

    return res.success("Offer deleted successfully", deletedOffer);

  } catch (error) {
    console.error("Delete Offer Error:", error);
    return res.error("Something went wrong while deleting offer", 500);
  }
};



// ADMIN GET ALL OFFERS
const adminGetOffer = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });

    if (!offers.length) {
      return res.error("No offers found", 404);
    }

    return res.status(200).json({
      total: offers.length,
      offers,
    });

  } catch (error) {
    console.error("Fetch Offer Error:", error);
    return res.error("Something went wrong while fetching offers", 500);
  }
};



module.exports = {
  createOffer,
  updateOffer,
  deleteOffer,
  adminGetOffer,
};