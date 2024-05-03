import { MyRequest } from '../userController';
import catchAsync from '../../utils/catchAsync';
import { Response } from 'express';
import { Application } from '../../models/Application';
import { Deal } from '../../models/Deal';
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

// export const applicationGeneralDonutChart = catchAsync(
//   async (req: MyRequest, res: Response) => {
//     const data = await Application.aggregate([
//       {
//         $group: {
//           _id: null,
//           created: {
//             $sum: {
//               $cond: [{ $lte: ['$createdAt', new Date()] }, 1, 0], // Count applications with createdAt >= current date
//             },
//           },
//           // accepted: {
//           //   $sum: {
//           //     $cond: [
//           //       {
//           //         $and: [
//           //           { $ne: ['$_acceptedAt', null] },
//           //           { $lte: ['$_acceptedAt', new Date()] },
//           //         ],
//           //       }, // Count applications with _acceptedAt set and less than or equal to current date (accepted)

//           //       1,
//           //       0,
//           //     ],
//           //   },
//           // },
//           // declined: {
//           //   $sum: {
//           //     $cond: [
//           //       {
//           //         $and: [
//           //           { $ifNull: ['$_deletedAt', false] }, // Check if _acceptedAt exists or is null
//           //           { $lte: ['$_deletedAt', new Date()] },
//           //           { $eq: ['$_acceptedAt', null] }, // Check if _acceptedAt exists or is null
//           //         ],
//           //       },
//           //       1,
//           //       0,
//           //     ], // Count applications with deletedAt <= current date and acceptedAt = null
//           //   },
//           // },
//         },
//       },
//       {
//         $project: {
//           _id: 0, // Exclude the _id field from the output
//           data: [
//             { _id: 'Created', count: '$created' }, // Format data for Created status
//             // { _id: 'Accepted', count: '$accepted' }, // Format data for Accepted status
//             // { _id: 'Declined', count: '$declined' }, // Format data for Declined status
//           ],
//         },
//       },
//     ]);

//     res.status(200).json({
//       status: 'success',
//       data: data.length > 0 ? data[0].data : [], // Return the formatted data or an empty array if no data found
//     });
//   }
// );

export const GeneralDonutChart1 =
  (model: any) => async (req: MyRequest, res: Response) => {
    const created = await model.countDocuments();

    const deleted = await model.countDocuments({
      _deletedAt: { $ne: null },
    });

    res.status(200).json({
      status: 'success',
      data: {
        created,
        deleted,
      },
    });
  };

export const applicationGeneralDonutChart = catchAsync(
  async (req: MyRequest, res: Response) => {
    const created = await Application.countDocuments();
    const accepted = await Application.countDocuments({
      _acceptedAt: { $ne: null },
    });
    const deleted = await Application.countDocuments({
      _acceptedAt: { $eq: null },
      _deletedAt: { $ne: null },
    });

    res.status(200).json({
      status: 'success',
      data: {
        created,
        accepted,
        deleted,
      },
    });
  }
);


