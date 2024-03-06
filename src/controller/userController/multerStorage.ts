import AppError from '../../utils/appError';
import { Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { MyRequest } from './userController';
import { v2 as cloudinary } from 'cloudinary';


// const multerStorage = multer.diskStorage({
//   destination: (
//     _req: Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) => {
//     cb(null, 'src/public/img/users');
//   },
//   filename: (
//     req: MyRequest,
//     file: Express.Multer.File,
//     cb: (error: Error | null, filename: string) => void
//   ) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage(); // cz we first need to resize it !

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
const upload = multer({ storage: multerStorage, fileFilter: multerFilter }); // if not specified ( call multer() ), stored only in memory

export const uploadProfilePicture = upload.single('profilePicture');
export const resizeProfilePicture = (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next();
  }
  //cz we need it later
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  //width, height : we need  a square, this crops by default !
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`src/public/img/users/${req.file.filename}`); //TODO check quality
    
  // console.log(process.env.API_KEY);

  console.log(req.file);
  cloudinary.config({
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
    
  });
  
  cloudinary.uploader.upload(
    `src/public/img/users/${req.file.filename}`,
    function (err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({
          message: 'error',
        });
      }
      
    }
  );
  next(); // to editMeUser
};
