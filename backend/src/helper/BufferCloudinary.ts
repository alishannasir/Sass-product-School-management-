import cloudinary from '../utils/Cloudinary.js';

export function uploadBufferToCloudinary(buffer: Buffer, folder = 'owners') {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || '');
      }
    );
    stream.end(buffer);
  });
}