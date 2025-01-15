const mongoose = require("mongoose");

const connection = (url) =>
  mongoose
    .connect(url)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

module.exports = connection;
