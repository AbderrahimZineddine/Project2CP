import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { PortfolioPost } from '../../models/PortfolioPost';
import uploadController from '../uploadController';

export const updatePortfolioPost = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // add new images
    // delete removed images
    // edit description
    const post = await PortfolioPost.findById(req.params.id);
    if (!post) {
      return next(new AppError('No portfolio post found with that id', 404));
    }
    if (req.body.description) {
      post.description = req.body.description;
    }
    let urls = post.images;
    const removed = req.body.removedPicturesUrls
      ? req.body.removedPicturesUrls instanceof Array
        ? req.body.removedPicturesUrls.length
        : 1
      : 0;
    const added = req.images ? req.images.length : 0;
    if (removed > urls.length) {
      return next(
        new AppError(
          'Error, you are trying to remove more images than you have in this post!',
          400
        )
      );
    }
    if (urls.length - removed + added < 1) {
      if (req.images) {
        for (const url of req.images) {
          await uploadController.deleteFromCloudinary(url);
        }
      }
      return next(
        new AppError('You must have at least one image in your post!', 400)
      );
    }
    console.log(req.body.removedPicturesUrls);
    if (req.body.removedPicturesUrls) {
      urls = urls.filter((url) => !req.body.removedPicturesUrls.includes(url));
      // for (const url in req.body.removedPicturesUrls) {
      if (req.body.removedPicturesUrls instanceof Array) {
        for (let i = 0; i < req.body.removedPicturesUrls.length; i++) {
          try {
            await uploadController.deleteFromCloudinary(
              req.body.removedPicturesUrls[i]
            );
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              return next(
                new AppError(
                  'Error deleting pictures from cloudinary : ' + error.message,
                  500
                )
              );
            }
          }
        }
      } else {
        try {
          console.log(typeof req.body.removedPicturesUrls);
          await uploadController.deleteFromCloudinary(
            req.body.removedPicturesUrls
          );
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            return next(
              new AppError(
                'Error deleting pictures from cloudinary : ' + error.message,
                500
              )
            );
          }
        }
      }
    }
    if (req.images) {
      urls = urls.concat(req.images);
    }
    post.images = urls;

    await post.save();
    res.status(200).json({
      status: 'success',
      portfolioPost: post,
    });
  }
);
