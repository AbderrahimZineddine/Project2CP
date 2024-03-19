import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Deal } from '../../models/Deal';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Role } from '../../models/UserDoc';

export const updateDeal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (req.dealRole === Role.Worker) {
      if (req.body.title) {
        req.deal.workerTitle = req.body.title;
      }
      if (req.body.description) {
        req.deal.workerDescription = req.body.description;
      }
    } else {
      if (req.body.title) {
        req.deal.userTitle = req.body.title;
      }
      if (req.body.description) {
        req.deal.userDescription = req.body.description;
      }
    }
    await req.deal.save();

    res.status(200).json({
      status: 'success',
      deal: req.deal,
    });
  }
);
