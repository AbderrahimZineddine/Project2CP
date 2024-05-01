import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Post } from '../../models/Post';
import uploadController from '../uploadController';

export const updatePost = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // add new images
    // delete removed images
    // edit description
    let urls = req.post.images;
    const removed = req.body.removedPicturesUrls
      ? req.body.removedPicturesUrls instanceof Array
        ? req.body.removedPicturesUrls.length
        : 1
      : 0;
    if (removed > urls.length) {
      return next(
        new AppError(
          'Error, you are trying to remove more images than you have in this post!',
          400
        )
      );
    }

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

    req.post.images = urls;
    await req.post.save({ validateBeforeSave: false });

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        job: req.body.job,
        description: req.body.description,
        price: req.body.price,
        title: req.body.title,
        selectedWorkers: req.body.selectedWorkers,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      post,
    });
  }
);
