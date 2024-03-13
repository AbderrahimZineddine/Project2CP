import { MyRequest } from 'controller/userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { v2 as cloudinary } from 'cloudinary';
import { PortfolioPost } from '../../models/PortfolioPost';
import uploadController from '../../controller/uploadController';

const uploadPortfolioPostImages = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.files) {
      // return next(
      //   new AppError('Please upload at least one image for this post', 404)
      // );
      return next()
    }
    cloudinary.config({
      api_key: process.env.API_KEY,
      cloud_name: process.env.CLOUD_NAME,
      api_secret: process.env.API_SECRET,
    });

    const urls = [];
    try {
      // const errMsgs = [];
      for (const file of req.files as Express.Multer.File[]) {
        //   try {
        const result = await cloudinary.uploader.upload(file.path, {
          transformation: {
            format: 'jpg',
          },
          folder: req.user.id,
        });
        urls.push(result.secure_url);
        //   } catch (error) {
        //     errMsgs.push(`Error uploading Image : ${error.message}`);
        //   }
      }
      // if (errMsgs.length > 0 && process.env.NODE_ENV !== 'development') {
      //   let message = '';
      //   for (const errM of errMsgs) {
      //     message += errM + '\n';
      //   }
      //   return next(new AppError(message, 500));
      // } else if (errMsgs.length > 0) {
      //   for (const url of urls) {
      //     await uploadController.deleteFromCloudinary(url);
      //   }
      //   return next(
      //     new AppError('Error uploading images please try again!', 500)
      //   );
      // }
      req.images = urls;
      next();
    } catch (error) {
      for (const url of urls) {
        await uploadController.deleteFromCloudinary(url);
      }
      return next(
        new AppError('Error uploading images please try again!', 500)
      );
    }
  }
);

export default uploadPortfolioPostImages;
