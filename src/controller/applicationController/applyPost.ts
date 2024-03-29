import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Application } from '../../models/Application';
import { Job, WorkerDoc } from '../../models/WorkerDoc';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import uploadController from '../uploadController';
import { Post } from '../../models/Post';

export const ValidateApplicationInputs = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.body.description) {
      return next(
        new AppError('Please enter a description for this application', 400)
      );
    }

    console.log(req);
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(
        new AppError('There is no post with id ' + req.params.id, 404)
      );
    }

    if (await Application.findOne({ worker: req.user.id, post: post.id })) {
      return next(new AppError('You have already applied for this post!', 400));
    }

    req.post = post;
    next();
  }
);

export const applyPost = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const application = await Application.create({
      description: req.body.description,
      price: req.body.price,
      worker: req.user.id,
      post: req.post.id,
    });

    if (!application) {
      return next(
        new AppError(
          'Error creating your application! Please try again later.',
          500
        )
      );
    }

    res.status(200).json({
      status: 'success',
      application,
    });
  }
);
