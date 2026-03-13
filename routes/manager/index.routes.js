const express = require("express");
const managerRoutes = express.Router();
const {
    isAuthenticated,
    isAdmin,
} = require("../../middleware/auth.middleware");
// const userRouter = require("./../user/in");
// const couponRouter = require("./coupon.routes");
// const adminOfferRouter = require("./offer.routes");

// Hotel
// const bookingRouter = require("./booking.routes");
// const roomrouter = require("./room.routes");

// Private Routes For Admin - For Hotel
// managerRoutes.use(isAuthenticated, isAdmin);

// managerRoutes.use("/booking", bookingRouter);

// managerRoutes.use("/room", roomrouter)

// managerRoutes.use("/user", userRouter);

// managerRoutes.use("/coupon", couponRouter);

// managerRoutes.use("/offer", adminOfferRouter);

managerRoutes.get('/newsletters',async(req,res)=>{
    try {
        const emails = await NewsletterModel.find({});
        return res.status(200).json(emails)
    } catch (error) {
       return  res.status(500).json({
            message:"Error wile fetching  emails"
        })
    }
})

module.exports = managerRoutes;
