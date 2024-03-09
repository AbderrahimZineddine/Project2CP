import AppError from '../../utils/appError';
import { Request, Response, NextFunction } from 'express';
import { MyRequest } from '../userController';
import { v2 as cloudinary } from 'cloudinary';



const uploadProfilePicture = async (req: MyRequest, res: Response, next: NextFunction) => {
  // Check if file exists
  const file = req.file

  if (!file) {
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
    const result = await cloudinary.uploader.upload(file.path, {
      transformation: {
        width: 500,
        height: 500,
        crop: 'crop',
        format: 'jpg',
        quality: 90,
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

export default uploadProfilePicture;
