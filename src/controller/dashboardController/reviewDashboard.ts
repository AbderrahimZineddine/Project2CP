import catchAsync from '../../utils/catchAsync';
import { MyRequest } from '../../controller/userController';
import { Review } from '../../models/Review';
import { NextFunction, Response } from 'express';
import { Worker } from '../../models/Worker';

export const reviewsByRating = catchAsync(
  async (req: MyRequest, res: Response) => {
    const data = await Review.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data,
    });
  }
);

export const reviewTotal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Count the total number of applications
    const totalWorkers = await Worker.countDocuments();

    // Find the total number of distinct workers
    const totalReviews = await Review.countDocuments();

    // Calculate the average applications per worker
    const averageReviews = totalReviews / totalWorkers;

    res.status(200).json({
      status: 'success',
      total: {
        // {
        //   _id: 'Created',
        //   count: totalWorkers,
        // },
        created: totalWorkers,
        // {
        //   _id: 'Average review per worker',
        //   count: averageReviews,
        // },
        averageReviewPerWorker: averageReviews,
      },
    });
  }
);
