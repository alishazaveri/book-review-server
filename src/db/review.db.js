const Review = require("./model/review.model");

module.exports = {
  createReview,
  getReviewsByBookId,
  getReviewsByUserId,
  getReviewsByBookIdAndUserId,
  updateReview,
  deleteReview,
  getReviewById,
};

async function createReview({ review_text, rating, user_id, book_id }) {
  const review = new Review({
    review_text,
    rating,
    user_id,
    book_id,
    is_deleted: false,
  });
  await review.save();
  return review;
}

async function getReviewsByBookId({
  book_id,
  startsWith,
  pageLimit,
  pageNumber,
}) {
  const skip = (pageNumber - 1) * pageLimit;
  const limit = pageLimit;

  const reviews = await Review.find({ book_id, is_deleted: false })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return reviews;
}

async function getReviewsByUserId({
  user_id,
  startsWith,
  pageLimit,
  pageNumber,
}) {
  const skip = (pageNumber - 1) * pageLimit;
  const limit = pageLimit;

  const reviews = await Review.find({ user_id, is_deleted: false })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return reviews;
}

async function getReviewsByBookIdAndUserId({ book_id, user_id }) {
  const reviews = await Review.findOne({ book_id, user_id, is_deleted: false });
  return reviews;
}

async function updateReview({ review_id, review_text, rating }) {
  const review = await Review.findByIdAndUpdate(
    review_id,
    {
      review_text,
      rating,
    },
    { new: true }
  );

  return review;
}

async function deleteReview({ review_id }) {
  const review = await Review.findOneAndUpdate(
    { _id: review_id, is_deleted: false },
    { is_deleted: true },
    { new: true }
  );
  if (!review) {
    throw new Error("Review not found");
  }
  return review;
}

async function getReviewById({ id }) {
  const review = await Review.findOne({ _id: id, is_deleted: false });
  if (!review) {
    throw new Error("Review not found");
  }
  return review;
}
