const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const isValidUser = require("../middlewares/is-valid-user");

router.post("/create/:bookId", isValidUser, reviewController.createReview);
router.get("/userId", isValidUser, reviewController.getAllReviewsByUserId);
router.get("/:bookId", isValidUser, reviewController.getAllReviewsByBookId);
router.get(
  "/userId/:bookId",
  isValidUser,
  reviewController.getAllReviewsByBookIdAndUserId
);
router.put("/:reviewId", isValidUser, reviewController.updateReview);
router.delete("/:reviewId", isValidUser, reviewController.deleteReview);

module.exports = router;
