const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const isValidUser = require("../middlewares/is-valid-user");

router.post("/create", isValidUser, bookController.createBook);
router.get("/", isValidUser, bookController.getAllBooks);
router.get("/:id", isValidUser, bookController.getBookById);
router.get("/:ISBN", isValidUser, bookController.getBookByISBN);

module.exports = router;
