import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Post, PostDoc } from '../../models/Post';
import { Job, WorkerDoc } from '../../models/WorkerDoc';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import uploadController from '../uploadController';

export const ValidatePostInputs = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.body.title) {
      return next(new AppError('Please enter a title for this post', 400));
    }
    if (!req.body.job || !(req.body.job in Job)) {
      return next(new AppError('Please specify a job for this post', 400));
    }

    if (!req.body.lat || !req.body.lng || !req.body.locationTitle) {
      return next(new AppError('Missing parameters for location, make sure you entered title, lat and lng', 400));
    }
    next();
  }
);

export const createPost = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { locationTitle, lat, lng } = req.body;
    
    const post = await Post.create({
      images: req.images,
      description: req.body.description,
      price: req.body.price,
      title: req.body.title,
      job: req.body.job,
      user: req.user.id,
      selectedWorkers: req.body.selectedWorkers,
      'location.lat': lat ?? null,
      'location.lng': lng ?? null,
      'location.title': locationTitle ?? null,
    });
    if (!post) {
      if (req.images) {
        for (const image of req.images) {
          await uploadController.deleteFromCloudinary(image);
        }
      }
      return next(
        new AppError('Error creating your Post! Please try again later', 500)
      );
    }

    res.status(201).json({
      status: 'success',
      post,
    });
  }
);
