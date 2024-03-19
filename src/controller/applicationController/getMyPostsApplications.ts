import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { Application } from '../../models/Application';

export const getMyPostsApplications = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    //call checkPostOwner middleware
    const Applications = await Application.find({ post: req.post.id });

    res.status(200).json({
      status: 'success',
      Applications,
    });
  }
);


