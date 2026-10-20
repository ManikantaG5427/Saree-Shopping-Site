import { config } from '../config/index.js';
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/errors.js';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const cloudinaryService = {
  async uploadImage(fileBuffer, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'saree-web',
          transformation: options.transformation || [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
          tags: options.tags,
          context: options.context,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(new AppError('Image upload failed', 500, 'UPLOAD_FAILED', error));
            return;
          }
          resolve({
            public_id: result.public_id,
            url: result.url,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  },

  async uploadMultipleImages(files, options = {}) {
    return Promise.all(files.map((file) => this.uploadImage(file, options)));
  },

  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new AppError('Failed to delete image', 500, 'DELETE_FAILED', error);
    }
  },

  async deleteMultipleImages(publicIds) {
    try {
      await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
      throw new AppError('Failed to delete images', 500, 'DELETE_FAILED', error);
    }
  },

  async getImageInfo(publicId) {
    try {
      return await cloudinary.api.resource(publicId);
    } catch (error) {
      throw new AppError('Failed to get image info', 500, 'GET_IMAGE_FAILED', error);
    }
  },

  generateImageUrl(publicId, transformations = []) {
    return cloudinary.url(publicId, {
      secure: true,
      transformation: transformations,
    });
  },

  generateThumbnailUrl(publicId, width = 300, height = 300) {
    return this.generateImageUrl(publicId, [
      { width, height, crop: 'fill', gravity: 'auto' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ]);
  },

  generateProductUrls(publicId) {
    return {
      thumbnail: this.generateThumbnailUrl(publicId, 300, 400),
      medium: this.generateImageUrl(publicId, [
        { width: 600, height: 800, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ]),
      large: this.generateImageUrl(publicId, [
        { width: 1200, height: 1600, crop: 'limit' },
        { quality: 'auto:best' },
        { fetch_format: 'auto' },
      ]),
      original: cloudinary.url(publicId, { secure: true }),
    };
  },
};

export default cloudinaryService;
