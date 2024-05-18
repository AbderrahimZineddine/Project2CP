import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Post } from '../../models/Post';
import uploadController from '../uploadController';
import { WorkerDoc } from '../../models/WorkerDoc';
import { Worker } from '../../models/Worker';
import { Review } from '../../models/Review';

export const deleteReview = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const worker: WorkerDoc = await Worker.findById(req.review.worker);

    worker.ratingsNumber--;

    worker.rating =
      worker.ratingsNumber != 0
        ? (worker.rating * worker.ratingsNumber+1 - req.review.rating) / worker.ratingsNumber
        : 0;
    await worker.save({validateBeforeSave: false});

    // await Review.findByIdAndDelete(req.review.id);
    await Review.findByIdAndUpdate(
      req.params.id,
      { _deletedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
    });
  }
);
