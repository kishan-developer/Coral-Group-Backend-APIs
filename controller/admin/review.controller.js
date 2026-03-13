const Review = require("../../model/Review.model");
const Room = require("../../model/Review.model");

/* -------------------------------------------------------
   USER — ADD REVIEW (Room or Hotel)
-------------------------------------------------------- */
const addReview = async (req, res) => {
  try {
    const { rating, comment, roomId, isHotelReview } = req.body;

    const review = await Review.create({
      userId: req.user.userId,
      roomId: roomId || null,
      rating,
      comment,
      isHotelReview: isHotelReview || false,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------
   PUBLIC — GET ALL HOTEL REVIEWS
-------------------------------------------------------- */
const getHotelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isHotelReview: true }).populate("userId");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------
   PUBLIC — GET REVIEWS FOR A ROOM
-------------------------------------------------------- */
const getRoomReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      roomId: req.params.roomId,
    }).populate("userId roomId");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------
   USER — GET MY REVIEWS
-------------------------------------------------------- */
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.userId }).populate("roomId");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------
   ADMIN — GET ALL REVIEWS
-------------------------------------------------------- */
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("userId roomId");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -------------------------------------------------------
   ADMIN — DELETE REVIEW
-------------------------------------------------------- */
const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addReview,
  getHotelReviews,
  getRoomReviews,
  getMyReviews,
  getAllReviews,
  deleteReview
}