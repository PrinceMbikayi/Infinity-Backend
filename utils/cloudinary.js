const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

const cloudinaryUploadImg = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    }).end(fileBuffer); // Use `.end()` to stream the buffer directly to Cloudinary
  });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve) => {
    cloudinary.uploader.destroy(fileToDelete, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          result,
        });
      }
    });
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
