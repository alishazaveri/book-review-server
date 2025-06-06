const booksDb = require("../db/book.db");
const Joi = require("joi");

async function createBook(req, res) {
  try {
    const { ISBN, title, author, genre } = req.body;

    const user_id = req.user._id;

    validate({ ISBN, title, author, genre });

    const existingBook = await booksDb.getBookByISBN({ ISBN });
    if (existingBook) {
      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists" });
    }

    const book = await booksDb.createBook({
      ISBN,
      title,
      author,
      genre,
      created_by: user_id,
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  function validate({ ISBN, title, author, genre }) {
    const schema = Joi.object({
      ISBN: Joi.string().required(),
      title: Joi.string().required(),
      author: Joi.string().required(),
      genre: Joi.string().required(),
    });

    const { error } = schema.validate({ ISBN, title, author, genre });

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function getAllBooks(req, res) {
  try {
    const { searchText, startsWith, pageLimit, pageNumber, genre } = req.query;

    validate({ searchText, startsWith, pageLimit, pageNumber, genre });

    const books = await booksDb.getAllBooks({
      searchText,
      startsWith,
      pageLimit,
      pageNumber,
      genre,
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  function validate({ searchText, startsWith, pageLimit, pageNumber, genre }) {
    const schema = Joi.object({
      searchText: Joi.string().optional(),
      startsWith: Joi.string().optional(),
      pageLimit: Joi.number().optional(),
      pageNumber: Joi.number().optional(),
      genre: Joi.string().optional(),
    });

    const { error } = schema.validate({
      searchText,
      startsWith,
      pageLimit,
      pageNumber,
      genre,
    });

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const { pageLimit, pageNumber } = req.query;

    validate({ id, pageLimit, pageNumber });

    const book = await booksDb.getBookById({
      id,
      pageLimit: parseInt(pageLimit),
      pageNumber: parseInt(pageNumber),
    });
    res.status(200).json(book);
  } catch (error) {
    if (error.message === "Book not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }

  function validate({ id, pageLimit, pageNumber }) {
    const schema = Joi.object({
      id: Joi.string().required(),
      pageLimit: Joi.number().optional(),
      pageNumber: Joi.number().optional(),
    });

    const { error } = schema.validate({ id, pageLimit, pageNumber });

    if (error) {
      throw new Error(error.message);
    }
  }
}

async function getBookByISBN(req, res) {
  try {
    const { ISBN } = req.params;
    validate({ ISBN });

    const book = await booksDb.getBookByISBN({ ISBN });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  function validate({ ISBN }) {
    const schema = Joi.object({
      ISBN: Joi.string().required(),
    });

    const { error } = schema.validate({ ISBN });

    if (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  getBookByISBN,
};
