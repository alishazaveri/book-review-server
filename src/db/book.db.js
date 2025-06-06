const Book = require("./model/book.model");
const Review = require("./model/review.model");
const mongoose = require("mongoose");

module.exports = {
  createBook,
  getBookByISBN,
  getAllBooks,
  getBookById,
};

async function createBook({ ISBN, title, author, genre, created_by }) {
  const book = new Book({ ISBN, title, author, genre, created_by });
  await book.save();
  return book;
}

async function getBookByISBN({ ISBN }) {
  const book = await Book.findOne({ ISBN });
  return book;
}

async function getAllBooks({
  searchText,
  pageLimit = 10,
  pageNumber = 1,
  genre,
}) {
  const skip = (pageNumber - 1) * pageLimit;

  const searchQuery = [];

  if (searchText) {
    searchQuery.push(
      { title: { $regex: searchText, $options: "i" } },
      { author: { $regex: searchText, $options: "i" } }
    );
  }

  if (genre) {
    searchQuery.push({ genre: { $regex: genre, $options: "i" } });
  }

  const filter = searchQuery.length > 0 ? { $or: searchQuery } : {};

  const [books, total] = await Promise.all([
    Book.find(filter).skip(skip).limit(pageLimit).sort({ createdAt: -1 }),
    Book.countDocuments(filter),
  ]);

  return {
    books,
    total,
    totalPages: Math.ceil(total / pageLimit),
    currentPage: pageNumber,
  };
}

async function getBookById({ id, pageLimit = 10, pageNumber = 1 }) {
  const skip = (pageNumber - 1) * pageLimit;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid book ID");
  }

  const bookObjectId = new mongoose.Types.ObjectId(id);

  const [book, reviews, totalReviews, avgRatingResult] = await Promise.all([
    Book.findById(bookObjectId),
    Review.find({ book_id: bookObjectId })
      .populate({
        path: "user_id",
        select: "username emailId",
        model: "User",
      })
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 }),
    Review.countDocuments({ book_id: bookObjectId }),
    Review.aggregate([
      { $match: { book_id: bookObjectId } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]),
  ]);

  if (!book) {
    throw new Error("Book not found");
  }

  return {
    book,
    reviews: {
      data: reviews,
      total: totalReviews,
      totalPages: Math.ceil(totalReviews / pageLimit),
      currentPage: pageNumber,
    },
    averageRating: avgRatingResult?.[0]?.averageRating || 0,
  };
}
