import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { PortfolioPost } from '../../models/PortfolioPost';
import uploadController from '../uploadController';
import { Like } from '../../models/Like';
import { Worker } from '../../models/Worker';
import { WorkerDoc } from '../../models/WorkerDoc';

export const deletePortfolioPostById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const portfolioPost = await PortfolioPost.findById(req.params.id);
    if (!portfolioPost) {
      return next(new AppError('No portfolio post found with that id', 404));
    }

    (req.user as unknown as WorkerDoc).portfolioPosts = (
      req.user as unknown as WorkerDoc
    ).portfolioPosts.filter(
      (ppostId: any) => ppostId.toString() !== portfolioPost.id
    );
    await req.user.save({validateBeforeSave: false});

    for (const url of portfolioPost.images) {
      await uploadController.deleteFromCloudinary(url);
    }
    // await PortfolioPost.findByIdAndDelete(portfolioPost.id);
    await PortfolioPost.findByIdAndUpdate(
      req.params.id,
      { _deletedAt: Date.now() },
      { new: true }
    );
    //TODO delete likes associated with this post !  Likes.deleteMany({ post : portfolioPost.id})
    await Like.deleteMany({ postId: portfolioPost.id });

    res.status(200).json({
      status: 'success',
    });
  }
);
