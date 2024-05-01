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
      {
        $group: {
          _id: null,
          created: {
            $sum: {
              $cond: [{ $lte: ['$createdAt', new Date()] }, 1, 0], // Count applications with createdAt >= current date
            },
          },
          accepted: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ['$_acceptedAt', new Date()] },
                    { $ifNull: ['$_acceptedAt', false] }, // Check if _acceptedAt exists or is null

                  ],
                },
                1,
                0,
              ],
            },
          },
          declined: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ['$_deletedAt', new Date()] },
                    { $ifNull: ['$_acceptedAt', true] }, // Check if _acceptedAt exists or is null
                  ],
                },
                1,
                0,
              ], // Count applications with deletedAt <= current date and acceptedAt = null
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the output
          data: [
            { name: 'Created', value: '$created' }, // Format data for Created status
            { name: 'Accepted', value: '$accepted' }, // Format data for Accepted status
            { name: 'Declined', value: '$declined' }, // Format data for Declined status
          ],
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: data.length > 0 ? data[0].data : [], // Return the formatted data or an empty array if no data found
    });
  }
);
