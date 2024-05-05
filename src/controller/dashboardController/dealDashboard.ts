import { MyRequest } from '../../controller/userController';
import { NextFunction, Response } from 'express';
import { Deal } from '../../models/Deal';
import catchAsync from '../../utils/catchAsync';
import { User } from '../../models/User';
import { Worker } from '../../models/Worker';

export const dealGeneralDonutChart = catchAsync(
  async (req: MyRequest, res: Response) => {
    const created = await Deal.countDocuments();
    const finished = await Deal.countDocuments({
      _finishedAt: { $ne: null },
    });
    const declined = await Deal.countDocuments({
      _finishedAt: { $eq: null },
      _deletedAt: { $ne: null },
    });

    res.status(200).json({
      status: 'success',
      data: [
        {
          _id: 'created',
          count: created,
        },
        {
          _id: 'finished',
          count: finished,
        },
        {
          _id: 'declined',
          count: declined,
        },
      ],
    });
  }
);

export const dealTotal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Count the total number of applications
    const totalUsers = await User.countDocuments();
    const totalWorkers = await Worker.countDocuments();

    // Find the total number of distinct workers
    const totalDeals = await Deal.countDocuments();

    // Calculate the average applications per worker
    const averageDeals = totalDeals / totalUsers;
    const averageDeals2 = totalDeals / totalWorkers;

    res.status(200).json({
      status: 'success',
      data: {
        // {
        //   _id: 'Created',
        //   count: totalDeals,
        // },
        created: totalDeals,
        // {
        //   _id: 'Average deal per user',
        //   count: averageDeals,
        // },
        averageDealPerUser: averageDeals,
        // {
        //   _id: 'Average deal per worker',
        //   count: averageDeals2,
        // },
        averageDealPerWorker: averageDeals2,
      },
    });
  }
);
