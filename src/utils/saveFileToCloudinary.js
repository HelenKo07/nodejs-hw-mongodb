import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import createHttpError from 'http-errors';

import { getEnvVar } from '../utils/getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  try {
    if (!file) {
      throw createHttpError(400, 'No file provided');
    }

    const response = await cloudinary.v2.uploader.upload(file.path, {
      folder: 'contacts',
      resource_type: 'auto',
    });

    await fs.unlink(file.path).catch(console.error);

    return response.secure_url;
  } catch (error) {
    await fs.unlink(file.path).catch(console.error);

    if (error.http_code) {
      throw createHttpError(error.http_code, error.message);
    }
    throw createHttpError(500, 'Error uploading file to Cloudinary');
  }
};
