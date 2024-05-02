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
      req.deal.statusOrd = 1;
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
    req.deal.statusOrd = 2;

    await req.deal.save();

    res.status(200).json({
      status: 'success',
      deal: req.deal,
    });
  }
);

export const finishDealAccept = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.deal.status = DealStatus.Finished;
    req.deal.statusOrd = 3;
    req.deal._finishedAt = new Date(Date.now());
    req.deal._deletedAt = new Date(Date.now());

    await req.deal.save();

    res.status(200).json({
      status: 'success',
      deal: req.deal,
    });
  }
);
