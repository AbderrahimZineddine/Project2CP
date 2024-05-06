import catchAsync from '../../utils/catchAsync';
import { MyRequest } from '../../controller/userController';
import { Worker } from '../../models/Worker';
import { NextFunction, Response } from 'express';
import { Deal } from '../../models/Deal';
import { Review } from '../../models/Review';

export const workersPerWilaya = catchAsync(
  async (req: MyRequest, res: Response) => {
    const data = await Worker.aggregate([
      {
        $group: {
          _id: '$wilaya',
          count: { $sum: 1 },
        },
      },
    ]);

    // Sort the data in descending order of count
    data.sort((a, b) => b.count - a.count);

    // Get the top 5 wilayas and sum up the counts of others
    const topFive = data.slice(0, 5);
    const othersCount = data
      .slice(5)
      .reduce((sum, wilaya) => sum + wilaya.count, 0);

    // Create the final result array
    const result = [...topFive, { _id: 'others', count: othersCount }];

    res.status(200).json({
      status: 'success',
      data : result,
    });
  }
);

export const workersPerJob = catchAsync(
  async (req: MyRequest, res: Response) => {
    const data = await Worker.aggregate([
      {
        $group: {
          _id: '$job',
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

export const workerTotal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Count the total number of applications
    const totalWorkers = await Worker.countDocuments();

    // Find the total number of distinct workers
    const totalReviews = await Review.countDocuments();
    const totalDeals = await Deal.countDocuments();

    // Calculate the average applications per worker
    const averageReviews = totalReviews / totalWorkers;
    const averageDeals = totalDeals / totalWorkers;

    res.status(200).json({
      status: 'success',
      data: {
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
        // {
        //   _id: 'Average deals per worker',
        //   count: averageDeals,
        // },
        averageDealsPerWorker: averageDeals,
      },
    });
  }
);
