import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';
import { getEnvVar } from './getEnvVar.js';

export async function saveFileToUploadDir(file) {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.originalname),
    path.join(UPLOAD_DIR, file.originalname),
  );
  return `${getEnvVar('APP_DOMAIN')}/upload/${file.originalname}`;
}
