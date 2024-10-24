const multer = require("multer");
const sharp = require("sharp");
const { cloudinaryUploadImg } = require("../utils/cloudinary");

// Set storage to memory, so files are stored in memory as buffer
const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

// Set up multer with memory storage and file filter
const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 }, // 1MB limit for file size
});

// Resize images for products
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const resizedImageBuffer = await sharp(file.buffer)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer(); // Process image in memory

        // Upload resized image to Cloudinary directly
        const cloudinaryResponse = await cloudinaryUploadImg(resizedImageBuffer);
        file.cloudinaryUrl = cloudinaryResponse.url; // Save the URL to the file object for later use
      })
    );
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image processing failed" });
  }
};

// Resize images for blogs
const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const resizedImageBuffer = await sharp(file.buffer)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer(); // Process image in memory

        // Upload resized image to Cloudinary directly
        const cloudinaryResponse = await cloudinaryUploadImg(resizedImageBuffer);
        file.cloudinaryUrl = cloudinaryResponse.url; // Save the URL to the file object for later use
      })
    );
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image processing failed" });
  }
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
