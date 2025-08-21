import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public'); // مكان التخزين
    },
    filename: (req, file, cb) => {
      // خلي الاسم unique عشان ما يكتبش فوق ملفات تانية
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
};
