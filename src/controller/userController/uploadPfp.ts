import AppError from '../../utils/appError';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { MyRequest } from '../userController/userController';
import { v2 as cloudinary } from 'cloudinary';

interface uploadedFiles {
  profilePicture: Express.Multer.File[];
  certeficatesImages: Express.Multer.File[];
}

const uploadProfilePicture = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  // Check if file exists
  const files = req.files as unknown as uploadedFiles;

  if (!files || !files.profilePicture || files.profilePicture.length === 0) {
    return next(); //500 ??
  } else if (files.profilePicture.length > 1) {
    return next(new AppError('Please upload only one profile picture', 400));
  }

  // Configure cloudinary
  cloudinary.config({
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
  });

  try {
    // Upload and resize image using cloudinary
    const result = await cloudinary.uploader.upload(files.profilePicture[0].path, {
      transformation: {
        width: 500,
        height: 500,
        crop: 'crop',
        format: 'jpg',
        quality: 90,
      },
    });

    // Update user profile picture and save
    req.user.profilePicture = result.secure_url;
    await req.user.save({ validateBeforeSave: false });
  } catch (err) {
    // Handle cloudinary upload errors
    return next(new AppError(err.message, 500));
  }

  // Continue with the next middleware
  next();
};

export default uploadProfilePicture;
