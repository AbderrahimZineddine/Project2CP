import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Application } from '../../models/Application';
import { WorkerDoc } from '../../models/WorkerDoc';
import { Post } from '../../models/Post';
import { UserDoc } from '../../models/UserDoc';

export const checkOwnerApplication = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return next(new AppError('No Application found with that id!', 404));
    }
    console.log(req.user.id);
    console.log(application.worker);
    if ((application.worker as unknown as WorkerDoc).id != req.user.id) {
      return next(
        new AppError(
          'You do not have the permission to update this Application!',
          404
        )
      );
    }
    req.application = application;
    next();
  }
);

export const checkSentApplication = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return next(new AppError('No Application found with that id!', 404));
    }

    const post = await Post.findById(application.post);
    if (!post) {
      return next(
        new AppError(
          'No Post found with that id! (post in application not found)',
          404
        )
      );
    }
    console.log('req.user.id : ', req.user.id);
    console.log('post.user.id : ', (post.user as unknown as UserDoc).id);
    if (req.user.id != (post.user as unknown as UserDoc).id) {
      return next(
        new AppError(
          'You do not have the permission to update this Application!',
          404
        )
      );
    }

    req.application = application;
    next();
  }
);
