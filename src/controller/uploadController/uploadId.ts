import AppError from '../../utils/appError';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { MyRequest } from '../userController';
import { v2 as cloudinary } from 'cloudinary';

interface uploadedFiles {
  idPicture: Express.Multer.File[];
  certificatesImages: Express.Multer.File[];
}

const uploadId = async (req: MyRequest, res: Response, next: NextFunction) => {
  // Check if file exists
  const files = req.files as unknown as uploadedFiles;

  if (!files || !files.idPicture || files.idPicture.length === 0) {
    return next(); 
  } else if (files.idPicture.length > 1) {
    return next(new AppError('Please upload only ONE id picture', 400));
  }

  // Configure cloudinary
  cloudinary.config({
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
  });

  try {
    // Upload and resize image using cloudinary
    const result = await cloudinary.uploader.upload(files.idPicture[0].path, {
      transformation: {
        format: 'jpg',
      },
      folder: req.user.id,
    });

    // Update user profile picture and save
    req.idPicture = result.secure_url;
  } catch (err) {
    // Handle cloudinary upload errors
    return next(new AppError(err.message, 500));
  }

  // Continue with the next middleware
  next();
};

export default uploadId;
