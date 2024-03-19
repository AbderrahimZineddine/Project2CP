import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Application } from '../../models/Application';

export const checkOwnerApplication = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return next(new AppError('No Application found with that id!', 404));
    }
    if (application.worker != req.user.id) {
      return next(
        new AppError('You do not have the permission to update this Application!', 404)
      );
    }
    req.application = application;
    next();
  }
);
