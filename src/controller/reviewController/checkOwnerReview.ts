import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Review } from '../../models/Review';
import { Role } from '../../models/UserDoc';

export const checkOwnerReview = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return next(new AppError('No review found with that id!', 404));
    }
    console.log(req.user.id)
    console.log(review.user.toString())
    console.log(review.worker)
    if (req.user.id != review.user.toString()) {
      return next(
        new AppError(
          'You do not have the permission to update this review!',
          404
        )
      );
    }

    req.review = review;
    next();
  }
);
