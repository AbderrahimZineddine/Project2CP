import AppError from '../../utils/appError';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { MyRequest } from '../userController';
import { v2 as cloudinary } from 'cloudinary';
import { CertificateDoc } from 'models/Certificate';

interface uploadedFiles {
  profilePicture: Express.Multer.File[];
  certificatesImages: Express.Multer.File[];
}

const uploadCertificates = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  // Check if file exists
  const files = req.files as unknown as uploadedFiles;

  if (
    !files ||
    !files.certificatesImages ||
    files.certificatesImages.length === 0
  ) {
    return next();
  }

  // Configure cloudinary
  cloudinary.config({
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
  });

  try {
    const titles = req.body.certificatesTitles;
    console.log(titles);
    console.log(titles.length);
    // console.log(req.files)
    // console.log(files.profilePicture);
    // console.log(files.certificatesImages);
    if (titles.length != files.certificatesImages.length) {
      return next(
        new AppError(
          'Please make sure to upload each certificate with a title',
          400
        )
      );
    }

    let i = 0;
    // Upload and resize image using cloudinary
    const uploadPromises = files.certificatesImages.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        transformation: {
          format: 'jpg',
        },
        folder: req.user.id,
      });
      i++;
      return {
        title: titles[i] ?? file.originalname,
        image: result.secure_url,
      };
    });
    // Update user profile picture and save

    const certificates = await Promise.all(uploadPromises);
    req.certificates = certificates;
    console.log(req.certificates);
    next();
  } catch (err) {
    // Handle cloudinary upload errors
    return next(new AppError('Error while uploading the files', 500));
  }
};

export default uploadCertificates;
