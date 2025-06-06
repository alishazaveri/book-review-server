const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const bookRoutes = require("./routes/book.routes");
const reviewRoutes = require("./routes/review.routes");

config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/review", reviewRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongo DB connected successfully!"))
  .catch((error) => console.log("Error connecting to Mongo DB", error));
