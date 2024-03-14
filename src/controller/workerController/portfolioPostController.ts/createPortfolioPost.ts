import { MyRequest } from '../../userController';
import { NextFunction, Response, request } from 'express';
import catchAsync from '../../../utils/catchAsync';
import AppError from '../../../utils/appError';
import { PortfolioPost } from '../../../models/PortfolioPost';
import { WorkerDoc } from '../../../models/WorkerDoc';

export const createPortfolioPost = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.images || req.images.length === 0) {
      return next(
        new AppError('Please upload at least one image for this post', 500)
      );
    }
    const portfolioPost = await PortfolioPost.create({
      images: req.images,
      description: req.body.description,
    });
    if (!portfolioPost) {
      return next(new AppError('Error creating your portfolio Post', 500));
    }
    (req.user as WorkerDoc).portfolioPosts.push(portfolioPost.id);
    req.user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      portfolioPost,
    });
  }
);
