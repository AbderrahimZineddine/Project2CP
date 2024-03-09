import multer from 'multer';
import { MyRequest } from '../userController';
import AppError from '../../utils/appError';

const multerStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const multerFilter = (
  req: MyRequest,
  file: Express.Multer.File,
  cb: (error: Error | null, bool: boolean) => void
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export default upload;
