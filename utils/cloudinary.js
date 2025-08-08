const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

const cloudinaryUploadImg = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Set a timeout for the upload
    const timeout = setTimeout(() => {
      reject(new Error('Cloudinary upload timeout after 30 seconds'));
    }, 30000);

    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        resource_type: "auto",
        timeout: 60000 // 60 seconds timeout
      }, 
      (error, result) => {
        clearTimeout(timeout);
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary upload success:', result.secure_url);
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          });
        }
      }
    );

    uploadStream.on('error', (error) => {
      clearTimeout(timeout);
      console.error('Upload stream error:', error);
      reject(error);
    });

    uploadStream.end(fileBuffer);
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
