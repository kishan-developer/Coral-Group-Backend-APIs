// Admin Offer Controller 
const Offer = require("../../model/Offer.model");

// Create Offer 
const createOffer = async (req, res) => {
    const { discount, maxAge, maxUsageLimit, status = false } = req.body; // get required body data

    // Validat Data That We Have Got..
    if (!discount || !maxAge || !maxUsageLimit)
        return res.error("please provide all required field");
    try {
        // If WE Got 0 Usage Limit Then  make SUre Atleat Usage  Make One..
        if (maxUsageLimit === 0) {
            maxUsageLimit = 1;
        }
        // Before Creating Any New Offer  Check Is There is ANy Offer Exit WIth Same discount percentage
        const isOfferExit = await Offer.findOne({ discount });

        if (isOfferExit) {
            return res.error("Offer Already Exit", 400);
        }
        const offer = await Offer.create({
            discount,
            maxAge,
            maxUsageLimit,
            status,
        });
        return res.status(201).json(offer.discount);
        
    } catch (error) {
        return res.error("Something went wrong");
    }
};

// Update Offers
const updateOffer = async (req, res) => {
    const updateData = req.body;
    const { id } = req.params;

    if (!id) {
        return res.error("Please provide offer ID", 400);
    }

    try {
        const offer = await Offer.findById(id);
        if (!offer) {
            return res.error("Offer not found", 404);
        }

        // Check if another offer already has this discount (excluding current one)
        const existingOffer = await Offer.findOne({
            discount: updateData.discount,
        });

        if (existingOffer && !existingOffer._id.equals(offer._id)) {
            return res.error(
                `An offer with ${updateData.discount}% discount already exists.`,
                400
            );
        }

        const updatedOffer = await Offer.findByIdAndUpdate(
            id,
            {
                ...updateData,
                createdAt: new Date(), //  Intentionally resetting for expiry logic
            },
            { new: true }
        );

        return res.success("Offer updated successfully.", updatedOffer);
    } catch (error) {
        console.error("Error updating offer:", error);
        return res.error("Something went wrong while updating the offer.", 500);
    }
};

// Delete Offers
const deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.error("Please provide offer id", 500);
        }

        const deletedOffer = await Offer.findByIdAndDelete(id);
        return res.success("Offer updated successfully.", deletedOffer);
    } catch (error) {
        console.error("Error updating offer:", error);
        return res.error("Something went wrong while updating the offer.", 500);
    }
};

// Admin Get Offers
const adminGetOffer = async (req, res) => {
    try {
        const offers = await Offer.find();

        if (!offers.length) {
            return res.error("No active offer found.", 404);
        }

        return res.status(200).json(offers);
    } catch (error) {
        console.error("Error fetching offer:", error);
        return res.error("Something went wrong while fetching the offer.", 500);
    }
};


module.exports = {
    createOffer,
    updateOffer,
    adminGetOffer,
    deleteOffer,
};
