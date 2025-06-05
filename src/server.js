const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");

config();

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`server started at ${process.env.PORT}`);
});
