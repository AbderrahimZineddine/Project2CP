import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Deal, DealStatus } from '../../models/Deal';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Role } from '../../models/UserDoc';

export const finishDealRequest = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (req.dealRole === Role.Worker) {
      req.deal.status = DealStatus.FinishRequestSent;
    }
    await req.deal.save();

    res.status(200).json({
      status: 'success',
      deal: req.deal,
    });
  }
);

export const finishDealDecline = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {

    req.deal.status = DealStatus.OnGoing;

    await req.deal.save();

    res.status(200).json({
      status: 'success',
      deal: req.deal,
    });
  }
);
