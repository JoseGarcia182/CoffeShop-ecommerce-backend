import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

type UploadResult = {
  secure_url: string;
  public_id: string;
};

const cloudinaryProvider = {
  init({ cloud_name, api_key, api_secret }) {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
    });

    return {
      upload(file) {
        return new Promise<UploadResult>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) return reject(error);
              if (!result || typeof result !== 'object' || !('secure_url' in result)) {
                return reject(new Error('Upload failed: invalid Cloudinary response'));
              }
              resolve(result as UploadResult);
            }
          );

          if (file.buffer) {
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
          } else {
            reject(new Error('File buffer is missing'));
          }
        });
      },

      delete(file) {
        return new Promise((resolve, reject) => {
          if (!file.provider_metadata?.public_id) {
            return reject(new Error('Missing public_id in provider_metadata'));
          }

          cloudinary.uploader.destroy(file.provider_metadata.public_id, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
        });
      },
    };
  },
};

export default cloudinaryProvider;
