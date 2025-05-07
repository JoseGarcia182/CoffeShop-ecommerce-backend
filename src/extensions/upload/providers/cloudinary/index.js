'use strict';

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

module.exports = {
  async upload(file, config) {
    cloudinary.config({
      cloud_name: config.cloud_name,
      api_key: config.api_key,
      api_secret: config.api_secret,
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (err, result) => {
          if (err) return reject(err);

          resolve({
            url: result.secure_url,
            provider_metadata: {
              public_id: result.public_id,
            },
          });
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  },

  async delete(file, config) {
    cloudinary.config({
      cloud_name: config.cloud_name,
      api_key: config.api_key,
      api_secret: config.api_secret,
    });

    const publicId = file.provider_metadata?.public_id;
    if (!publicId) return;

    return cloudinary.uploader.destroy(publicId);
  },
};
