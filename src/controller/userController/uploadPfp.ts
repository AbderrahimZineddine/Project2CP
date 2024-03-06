import AppError from '../../utils/appError';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { MyRequest } from './userController';
import { v2 as cloudinary } from 'cloudinary';

const uploadProfilePicture = async (req: MyRequest, res: Response, next: NextFunction) => {
  // Multer storage configuration
  const multerStorage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  // Multer filter for checking if the uploaded file is an image
  const multerFilter = (
    req: MyRequest,
    file: Express.Multer.File,
    cb: (error: Error | null, bool: boolean) => void
  ) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      // Error if file is not an image
      cb(new AppError('Not an image! Please upload only images', 400), false);
    }
  };

  // Multer upload configuration
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  }).single('profilePicture');

  // Call upload middleware
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer errors
      return next(new AppError('An error occurred during file upload', 500));
    } else if (err) {
      // Handle other errors
      return next(err);
    }

    // Check if file exists
    if (!req.file) {
      return next();
    }

    // Configure cloudinary
    cloudinary.config({
      api_key: process.env.API_KEY,
      cloud_name: process.env.CLOUD_NAME,
      api_secret: process.env.API_SECRET,
    });

    try {
      // Upload and resize image using cloudinary
      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          transformation: {
            width: 500,
            height: 500,
            crop: 'crop',
            format: 'jpg',
            quality: 90,
          },
        }
      );

      // Update user profile picture and save
      req.user.profilePicture = result.secure_url;
      await req.user.save({ validateBeforeSave: false });
    } catch (err) {
      // Handle cloudinary upload errors
      return next(new AppError(err.message, 500));
    }

    // Continue with the next middleware
    next();
  });
};

export default uploadProfilePicture;
