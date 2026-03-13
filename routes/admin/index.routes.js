const express = require("express");
const adminRouter = express.Router();
const {
    isAuthenticated,
    isAdmin,
} = require("../../middleware/auth.middleware");
const userRouter = require("./user.routes");
const couponRouter = require("./coupon.routes");
const adminOfferRouter = require("./offer.routes");

// Hotel
const bookingRouter = require("./booking.routes");
const roomrouter = require("./room.routes");

// Private Routes For Admin - For Hotel
adminRouter.use(isAuthenticated, isAdmin);

adminRouter.use("/booking", bookingRouter);

adminRouter.use("/room", roomrouter)

adminRouter.use("/user", userRouter);

adminRouter.use("/coupon", couponRouter);

adminRouter.use("/offer", adminOfferRouter);

adminRouter.get('/newsletters',async(req,res)=>{
    try {
        const emails = await NewsletterModel.find({});
        return res.status(200).json(emails)
    } catch (error) {
       return  res.status(500).json({
            message:"Error wile fetching  emails"
        })
    }
})

module.exports = adminRouter;
