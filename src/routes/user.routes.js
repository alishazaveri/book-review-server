const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const isValidUser = require("../middlewares/is-valid-user");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

module.exports = router;
