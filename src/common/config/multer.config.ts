import { memoryStorage } from 'multer';

export const multerConfig = {
  storage: memoryStorage(), // يخزن الملف في RAM فقط
};
