import { MyRequest } from '../../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import AppError from '../../../utils/appError';
import { WorkerDoc } from '../../../models/WorkerDoc';

export const checkOwnerPortfolioPost = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (
      !(req.user as WorkerDoc).portfolioPosts.find(
        (val: any) => val.id === req.params.id
      )
    ) {
      return next(
        new AppError('This portfolio post not belong to this user', 404)
      );
    }
    next();
  }
);
