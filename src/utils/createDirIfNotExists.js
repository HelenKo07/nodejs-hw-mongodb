import fs from 'node:fs/promises';

export async function createDirIfNotExists(url) {
  try {
    await fs.access(url);
  } catch (error) {
    if (error.code === 'ENDENT') {
      await fs.mkdir(url);
    }
  }
}
