const express = require("express");
const adminRouter = express.Router();
const {
    isAuthenticated,
    isAdmin,
} = require("../../middleware/auth.middleware");
const userRouter = require("./user.routes");
const couponRouter = require("./coupon.routes");
const adminOfferRouter = require("./offer.routes");
const Newsletter = require("../../model/Newsletter.model");

// Hotel
const bookingRouter = require("./booking.routes");
const roomrouter = require("./room.routes");
const pageRouter = require("./page.routes");
const supportrouter = require("./support.routes");

// Private Routes For Admin - For Hotel
adminRouter.use(isAuthenticated, isAdmin);

adminRouter.use("/booking", bookingRouter);

adminRouter.use("/room", roomrouter);

adminRouter.use("/user", userRouter);

adminRouter.use("/coupon", couponRouter);

adminRouter.use("/offer", adminOfferRouter);

adminRouter.use("/page", pageRouter);

adminRouter.use("/support", supportrouter);

adminRouter.get('/newsletters', async(req, res)=>{
    try {
        const emails = await Newsletter.find({});
        return res.success("Newsletters fetched successfully", emails);
    } catch (error) {
       return res.error("Error while fetching emails", 500);
    }
})

module.exports = adminRouter;
