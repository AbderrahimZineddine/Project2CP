import AppError from '../../utils/appError';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { MyRequest } from '../userController';
import { v2 as cloudinary } from 'cloudinary';



const uploadCertificate = async (req: MyRequest, res: Response, next: NextFunction) => {
  // Check if file exists
  const file = req.file

  if (!file) {
    return next(new AppError('Certificate image not found', 404)); //404 ??
  } 

  // Configure cloudinary
  cloudinary.config({
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
  });

  try {
    // Upload and resize image using cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      transformation: {
        format: 'jpg',
      },
      folder: req.user.id,
    });

    // Update user profile picture and save
    req.certificate = result.secure_url;
  } catch (err) {
    // Handle cloudinary upload errors
    return next(new AppError(err.message, 500));
  }

  // Continue with the next middleware
  next();
};

export default uploadCertificate;
