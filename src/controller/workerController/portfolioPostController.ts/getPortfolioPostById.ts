import { MyRequest } from '../../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import AppError from '../../../utils/appError';
import { PortfolioPost } from '../../../models/PortfolioPost';
import { Like } from '../../../models/Like';

export const getPortfolioPostById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const portfolioPost = await PortfolioPost.findById(req.params.id);
    if (!portfolioPost) {
      return next(new AppError('No portfolio post found with that id', 404));
    }
    const like = await Like.findOne({
      userId: req.user.id,
      postId: req.params.id,
    });
    let isLiked = false;
    if (like) {
      isLiked = true;
    }
    res.status(200).json({
      status: 'success',
      portfolioPost,
      isLiked,
    });
  }
);
