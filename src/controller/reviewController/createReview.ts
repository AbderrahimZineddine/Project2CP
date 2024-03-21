import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Review } from '../../models/Review';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Post } from '../../models/Post';
import { Deal } from '../../models/Deal';

export const ValidateReviewInputs = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {

    if (!req.body.rating) {
        return next(new AppError('A review must have a rating!', 400));
    }

    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return next(
        new AppError('There is no deal with id : ' + req.params.id, 404)
      );
    }

    if (await Review.findOne({ user: req.user.id, worker: deal.worker })) {
      return next(new AppError('You already left a Review with for this worker!', 400));
    }

    req.deal = deal;
    next();
  }
);

export const createReview = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const review = await Review.create({
      user: req.user.id,
      worker: req.deal.worker,
      review : req.body.review,
      rating : req.body.rating,
    });

    if (!review) {
      return next(
        new AppError('Error creating your Review! Please try again later.', 500)
      );
    }

    //TODO : delete stuff after leaving review:  post, deal ....

    res.status(200).json({
      status: 'success',
      review,
    });
  }
);
