import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Deal } from '../../models/Deal';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Post } from '../../models/Post';
import { Application } from '../../models/Application';

export const ValidateDealInputs = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {


    const application = await Application.findById(req.params.id);
    if (!application) {
      return next(
        new AppError('There is no application with id : ' + req.params.id, 404)
      );
    }

    if (await Deal.findOne({ user: req.user.id, post: application.post })) {
      return next(new AppError('You already have a deal with this post!', 400));
    }

    req.application = application;
    next();
  }
);

export const createDeal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const deal = await Deal.create({
      userTitle: req.body.title,
      userDescription: req.body.description,
      user: req.user.id,
      worker: req.application.worker,
      post: req.application.post,
    });

    if (!deal) {
      return next(
        new AppError('Error creating your Deal! Please try again later.', 500)
      );
    }

    res.status(200).json({
      status: 'success',
      deal,
    });
  }
);
