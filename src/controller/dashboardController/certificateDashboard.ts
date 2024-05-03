import { MyRequest } from '../../controller/userController';
import { NextFunction, Response } from 'express';
import { Certificate } from '../../models/Certificate';
import catchAsync from '../../utils/catchAsync';
import { Worker } from '../../models/Worker';

export const certificateGeneralDonutChart = catchAsync(
  async (req: MyRequest, res: Response) => {
    const created = await Certificate.countDocuments();
    const accepted = await Certificate.countDocuments({
      _acceptedAt: { $ne: null },
    });
    const deleted = await Certificate.countDocuments({
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

export const certificateTotal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Count the total number of applications
    const totalWorkers = await Worker.countDocuments();
    const totalCertified = await Worker.countDocuments({
      certificates: { $exists: true, $not: { $size: 0 } },
    });

    const percentage = (totalCertified / totalWorkers) * 100;

    res.status(200).json({
      status: 'success',
      data: [
        {
          _id: 'Created',
          count: totalWorkers,
        },
        {
          _id: 'Certified Workers',
          count: totalWorkers,
        },
        {
          _id: 'Not-Certified Workers',
          count: totalCertified,
        },
        {
          _id: 'Certified workers percentage',
          count: percentage,
        },
      ],
    });
  }
);
