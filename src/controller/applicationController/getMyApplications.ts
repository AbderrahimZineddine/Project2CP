import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { Application } from '../../models/Application';

// export const getMyApplications = catchAsync(
//   async (req: MyRequest, res: Response, next: NextFunction) => {
//     const Applications = await Application.find({ worker: req.user.id });

//     res.status(200).json({
//       status: 'success',
//       Applications,
//     });
//   }
// );

export const getMyApplications = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.query.worker = req.user.id;
    next();
  }
);
