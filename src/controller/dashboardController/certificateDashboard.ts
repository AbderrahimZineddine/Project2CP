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
      data: [
        {
          _id: 'created',
          count: created,
        },
        {
          _id: 'accepted',
          count: accepted,
        },
        {
          _id: 'deleted',
          count: deleted,
        },
      ],
    });
  }
);

export const certificateTotal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Count the total number of applications
    const totalWorkers = await Worker.countDocuments();
    const totalCertified = await Worker.countDocuments({
      isCertified: true,
    });

    const percentage = (totalCertified / totalWorkers) * 100;

    res.status(200).json({
      status: 'success',
      data: {
        // {
        //   _id: 'Created',
        //   count: totalWorkers,
        // },
        created: totalWorkers,
        // {
        //   _id: 'Certified Workers',
        //   count: totalCertified,
        // },
        certifiedWorkers: totalCertified,
        // {
        //   _id: 'Not-Certified Workers',
        //   count: totalWorkers - totalCertified,
        // },
        notCertifiedWorkers: totalWorkers - totalCertified,
        // {
        //   _id: 'Certified workers percentage',
        //   count: percentage,
        // },
        certifiedWorkersPercentage: percentage,
      },
    });
  }
);
