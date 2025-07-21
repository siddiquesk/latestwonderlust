const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const ATLAS_DB = process.env.MONGO_URL;
const connectDb = async () => {
  try {
    await mongoose.connect(ATLAS_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("db connected");
  } catch (err) {
    throw new Error(`MongoDB connection failed: ${err.message}`);
  }
};

module.exports = connectDb;
