import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { Application } from '../../models/Application';
import { Deal } from '../../models/Deal';
import { Role } from '../../models/UserDoc';

export const getMyDeals = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    let deals = [];
    if (req.user.currentRole === Role.User) {
      deals = await Deal.find({ user: req.user.id });
    } else {
      deals = await Deal.find({ worker: req.user.id });
    }
    res.status(200).json({
      status: 'success',
      deals,
    });
  }
);

export const getDealById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    res.status(200).json({
      status: 'success',
      deal: req.deal,
    });
  }
);
