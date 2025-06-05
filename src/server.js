const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user.routes");

config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongo DB connected successfully!"))
  .catch((error) => console.log("Error connecting to Mongo DB", error));
