import AppError from '../../utils/appError';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { MyRequest } from '../userController/userController';
import { v2 as cloudinary } from 'cloudinary';

interface uploadedFiles {
  profilePicture : Express.Multer.File[],
  certeficatesImages : Express.Multer.File[],
}

const uploadCerteficates = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  // Check if file exists
  const files= req.files as unknown as uploadedFiles;

  if (!files || !files.certeficatesImages || files.certeficatesImages.length === 0) {
    return next();
  }

  // Configure cloudinary
  cloudinary.config({
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
  });

  try {
    const titles = req.body.certeficatesTitles;
    console.log(titles);
    console.log(titles.length)
    // console.log(req.files)
    // console.log(files.profilePicture);
    // console.log(files.certeficatesImages);
    if (titles.length != files.certeficatesImages.length) {
      return next(
        new AppError(
          'Please make sure to upload each certeficate with a title',
          400
        )
      );
    }

    let i = 0;
    // Upload and resize image using cloudinary
    const uploadPromises = files.certeficatesImages.map(
      async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        i++;
        return {
          title: titles[i] ?? file.originalname,
          image: result.secure_url,
        };
      }
    );
    // Update user profile picture and save

    const certeficates = await Promise.all(uploadPromises);
    req.certeficates = certeficates;
    console.log(req.certeficates);
    next();

  } catch (err) {
    // Handle cloudinary upload errors
    return next(new AppError('Error while uploading the files', 500));
  }
};

export default uploadCerteficates;
