import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Post } from '../../models/Post';
import uploadController from '../uploadController';
import { WorkerDoc } from '../../models/WorkerDoc';
import { Worker } from '../../models/Worker';

export const updateReview = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (req.body.review) {
      req.review.review = req.body.review;
    }
    if (req.body.rating) {
      if (req.body.rating < 0 || req.body.rating > 5) {
        return next('Rating must be between 0 and 5');
      }
      // const worker: WorkerDoc = await Worker.findById(req.review.worker);

      // worker.rating =
      //   (req.body.rating - req.review.rating + worker.rating) /
      //   worker.ratingsNumber;
      // await worker.save({validateModifiedOnly:  true});
      req.review.rating = req.body.rating;
    }

    await req.review.save({ validateBeforeSave: true });

    res.status(200).json({
      status: 'success',
      review: req.review,
    });
  }
);
