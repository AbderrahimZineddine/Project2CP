import { MyRequest } from 'controller/authController/authController';
import { NextFunction, Response } from 'express';
import AppError from 'utils/appError';
import catchAsync from 'utils/catchAsync';
import { Worker } from '../../models/Worker';
import { WorkerDoc } from 'models/WorkerDoc';

export const editMeWorker = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (req.body.certeficates && req.body.certeficates.length >= 1) {
      //TODO send Worker Certeficates!
    }
    // if (req.body.firstName || req.body.lastName ) {
    //     return next(new AppError('You cannot change your first name or last name', 400)) //TODO check 400 ?
    // }
    if (req.body.job) {
      (req.user as WorkerDoc).job = req.body.job;
      req.user.save({ validateModifiedOnly: true });
    }
    if (req.body.location) {
      (req.user as WorkerDoc).location = req.body.location;
      req.user.save({ validateModifiedOnly: true });
    }

    next();
  }
);
