const mongoose = require("mongoose");

const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    review_text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
