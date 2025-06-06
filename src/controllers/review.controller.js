const reviewsDb = require("../db/review.db");
const booksDb = require("../db/book.db");
const Joi = require("joi");

async function createReview(req, res) {
  try {
    const { review_text, rating } = req.body;
    const book_id = req.params.bookId;

    const user_id = req.user._id;

    validate({ review_text, rating, user_id, book_id });

    const book = await booksDb.getBookById({ id: book_id });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingReview = await reviewsDb.getReviewsByBookIdAndUserId({
      book_id,
      user_id,
    });

    console.log({ existingReview });
    if (existingReview) {
      return res.status(400).json({ message: "Review already exists" });
    }

    const review = await reviewsDb.createReview({
      review_text,
      rating,
      user_id,
      book_id,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  function validate({ review_text, rating, user_id, book_id }) {
    const schema = Joi.object({
      review_text: Joi.string().required(),
      rating: Joi.number().required(),
      user_id: Joi.string().required(),
      book_id: Joi.string().required(),
    });

    const { error } = schema.validate({
      review_text,
      rating,
      user_id,
      book_id,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function getAllReviewsByBookId(req, res) {
  try {
    const book_id = req.params.bookId;
    const { startsWith, pageLimit, pageNumber } = req.query;

    validate({ book_id, startsWith, pageLimit, pageNumber });

    const reviews = await reviewsDb.getReviewsByBookId({
      book_id,
      startsWith,
      pageLimit,
      pageNumber,
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  function validate({ book_id, startsWith, pageLimit, pageNumber }) {
    const schema = Joi.object({
      book_id: Joi.string().required(),
      startsWith: Joi.string().optional(),
      pageLimit: Joi.number().optional(),
      pageNumber: Joi.number().optional(),
    });

    const { error } = schema.validate({
      book_id,
      startsWith,
      pageLimit,
      pageNumber,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function getAllReviewsByUserId(req, res) {
  try {
    const { startsWith, pageLimit, pageNumber } = req.query;
    const user_id = req.user._id;

    validate({ user_id, startsWith, pageLimit, pageNumber });

    const reviews = await reviewsDb.getReviewsByUserId({
      user_id,
      startsWith,
      pageLimit,
      pageNumber,
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  function validate({ user_id, startsWith, pageLimit, pageNumber }) {
    const schema = Joi.object({
      user_id: Joi.string().required(),
      startsWith: Joi.string().optional(),
      pageLimit: Joi.number().optional(),
      pageNumber: Joi.number().optional(),
    });

    const { error } = schema.validate({
      user_id,
      startsWith,
      pageLimit,
      pageNumber,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  const { error } = schema.validate({
    user_id,
    startsWith,
    pageLimit,
    pageNumber,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function getAllReviewsByBookIdAndUserId(req, res) {
  try {
    const book_id = req.params.bookId;
    const user_id = req.user._id;

    validate({ book_id, user_id });

    const reviews = await reviewsDb.getAllReviewsByBookIdAndUserId({
      book_id,
      user_id,
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  function validate({ book_id, user_id }) {
    const schema = Joi.object({
      book_id: Joi.string().required(),
      user_id: Joi.string().required(),
    });

    const { error } = schema.validate({
      book_id,
      user_id,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  const { error } = schema.validate({ book_id, user_id });

  if (error) {
    throw new Error(error.message);
  }
}

async function updateReview(req, res) {
  try {
    const review_id = req.params.reviewId;
    const { review_text, rating } = req.body;
    const user_id = req.user._id;

    validate({ review_id, review_text, rating });

    const existingReview = await reviewsDb.getReviewById({
      id: review_id,
    });
    if (!existingReview.user_id.equals(user_id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this review" });
    }

    const review = await reviewsDb.updateReview({
      review_id,
      review_text,
      rating,
    });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  function validate({ review_id, review_text, rating }) {
    const schema = Joi.object({
      review_id: Joi.string().required(),
      review_text: Joi.string(),
      rating: Joi.number(),
    });

    const { error } = schema.validate({ review_id, review_text, rating });

    if (error) {
      throw new Error(error.message);
    }
  }

  const { error } = schema.validate({ review_id, review_text, rating });

  if (error) {
    throw new Error(error.message);
  }
}

async function deleteReview(req, res) {
  try {
    const review_id = req.params.reviewId;
    const user_id = req.user._id;

    validate({ review_id, user_id });

    const existingReview = await reviewsDb.getReviewById({ id: review_id });

    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (!existingReview.user_id.equals(user_id)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    const review = await reviewsDb.deleteReview({ review_id });
    res.status(200).json(review);
  } catch (error) {
    if (error.message === "Review not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }

  function validate({ review_id, user_id }) {
    const schema = Joi.object({
      review_id: Joi.string().required(),
      user_id: Joi.string().required(),
    });

    const { error } = schema.validate({ review_id, user_id });

    if (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = {
  createReview,
  getAllReviewsByBookId,
  getAllReviewsByUserId,
  getAllReviewsByBookIdAndUserId,
  updateReview,
  deleteReview,
};
