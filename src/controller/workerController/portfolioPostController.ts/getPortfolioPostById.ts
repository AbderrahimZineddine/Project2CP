import { MyRequest } from '../../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../../utils/catchAsync';
import AppError from '../../../utils/appError';
import { PortfolioPost } from '../../../models/PortfolioPost';
import { Like } from '../../../models/Like';
import { WorkerDoc } from '../../../models/WorkerDoc';
import { Worker } from '../../../models/Worker';

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

export const getMyPortfolioPosts = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const skip = (page - 1) * limit;

    const slicedPortfolioPosts = (req.user as WorkerDoc).portfolioPosts.slice(
      skip,
      skip + limit
    );

    const data = [];
    for (const ppostId of slicedPortfolioPosts) {
      const like = await Like.findOne({
        userId: req.user.id,
        postId: ppostId,
      });
      data.push({
        portfolioPost: await PortfolioPost.findById(ppostId),
        isLiked: like != null,
      });
    }
    res.status(200).json({
      status: 'success',
      results: data.length,
      data,
    });
  }
);

export const getPortfolioPostsFromWorkerById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const worker: WorkerDoc = await Worker.findById(req.params.id);
    if (!worker) {
      return next(
        new AppError('No worker found with that id : ' + req.params.id, 404)
      );
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const skip = (page - 1) * limit;

    const slicedPortfolioPosts = worker.portfolioPosts.slice(
      skip,
      skip + limit
    );

    const data = [];
    for (const ppostId of slicedPortfolioPosts) {
      const like = await Like.findOne({
        userId: req.user.id,
        postId: ppostId,
      });
      data.push({
        portfolioPost: await PortfolioPost.findById(ppostId),
        isLiked: like != null,
      });
    }
    res.status(200).json({
      status: 'success',
      results: data.length,
      data,
    });
  }
);
