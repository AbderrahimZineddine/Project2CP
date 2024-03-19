import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Deal } from '../../models/Deal';
import { Role } from '../../models/UserDoc';

export const checkOwnerDeal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return next(new AppError('No Deal found with that id!', 404));
    }
    console.log(req.user._id)
    console.log(deal.user)
    console.log(deal.worker)
    if (req.user.id === deal.user.toString()) {
        
      req.dealRole = Role.User;
    } else if (req.user.id === deal.worker.toString()) {
      req.dealRole = Role.Worker;
    } else {
      return next(
        new AppError(
          'You do not have the permission to update this deal!',
          404
        )
      );
    }
    req.deal = deal;
    next();
  }
);
