require("./config/env"); 
const cloudinary = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Wanderlust_DEV",
    allowedFormats: ["png", "jpeg", "jpg"],
  },
});
console.log("Cloudinary loaded:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_KEY,
  secret: process.env.CLOUDINARY_SECRET,
});


module.exports = { cloudinary, storage };
