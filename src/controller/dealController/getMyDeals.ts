import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { Application } from '../../models/Application';
import { Deal } from '../../models/Deal';
import { Role } from '../../models/UserDoc';

// export const getMyDeals = catchAsync(
//   async (req: MyRequest, res: Response, next: NextFunction) => {
//     let deals = [];
//     if (req.user.currentRole === Role.User) {
//       deals = await Deal.find({ user: req.user.id });
//     } else {
//       deals = await Deal.find({ worker: req.user.id });
//     }
//     res.status(200).json({
//       status: 'success',
//       deals,
//     });
//   }
// );

export const getMyDeals = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (req.user.currentRole === Role.User) {
      req.query.user = req.user.id;
    } else {
      req.query.worker = req.user.id;
    }
    next();
  }
);

export const getDealsFromUserById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.query.user = req.params.id;
    next();
  }
);

export const getDealsFromWorkerById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.query.worker = req.params.id;
    next();
  }
);

export const getDealById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.query._id = req.params.id;
    next()
  }
);
