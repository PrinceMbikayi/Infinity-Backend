const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const cloudinary = require("./cloudinaryConfig"); // Importer la configuration Cloudinary
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configuration de multer pour Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Dossier où les images seront stockées dans Cloudinary
    format: async (req, file) => "jpeg", // Toujours convertir en format JPEG
    public_id: (req, file) => Date.now() + "-" + file.originalname, // Nom unique du fichier
  },
});

// Filtrage des fichiers pour accepter uniquement les images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

// Configuration de l'upload avec multer
const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 }, // Limite de taille de fichier (1MB)
});

// Middleware pour redimensionner l'image (facultatif, car Cloudinary peut le faire directement)
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      const result = await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();
      await cloudinary.uploader.upload_stream({ resource_type: "image" });
      fs.unlinkSync(file.path);
    })
  );
  next();
};

module.exports = { uploadPhoto };
