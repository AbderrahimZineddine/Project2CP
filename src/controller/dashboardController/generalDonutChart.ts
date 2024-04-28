import { MyRequest } from '../userController';
import catchAsync from '../../utils/catchAsync';
import { Response } from 'express';
import { Application } from '../../models/Application';
// Helper function to format date as "MMM DD" (e.g., "Jan 23")
export const applicationPerJobCategory = catchAsync(
  async (req: MyRequest, res: Response) => {
    const data = await Application.aggregate([
      {
        // $lookup: {
        //   from: 'workers',
        //   localField: 'worker',
        //   foreignField: '_id',
        //   as: 'workerData',
        // },
        $lookup: {
          from: 'users',
          localField: 'worker',
          foreignField: '_id',
          as: 'workerData',
        },
      },
      { $unwind: '$workerData' },
      {
        $group: {
          _id: '$workerData.job',
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


export const applicationGeneralDonutChart = catchAsync(
  async (req: MyRequest, res: Response) => {
    const data = await Application.aggregate([

      
    ]);

    res.status(200).json({
      status: 'success',
      data,
    });
  }
);
