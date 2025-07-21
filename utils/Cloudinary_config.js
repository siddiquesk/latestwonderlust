const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Ensure environment variables are loaded
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wonderlust_web", // Folder name in Cloudinary
    allowed_formats: ["png", "jpg", "jpeg", "webp"], // Correct key is `allowed_formats`
  },
});

module.exports = {
  cloudinary,
  storage,
};
