import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { Application } from '../../models/Application';
import { Review } from '../../models/Review';
import { Role } from '../../models/UserDoc';

export const getMyReviews = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // const reviews = await Review.find({ user: req.user.id });

    // res.status(200).json({
    //   status: 'success',
    //   reviews,
    // });
    req.query.user = req.params.id
    next();
  }
);

export const getWorkerReviews = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.query.worker = req.params.id;
    next();
  }
);

export const getMyWorkerReviews = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const reviews = await Review.find({ worker: req.user.id });

    res.status(200).json({
      status: 'success',
      reviews,
    });
  }
);
