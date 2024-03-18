import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Post } from '../../models/Post';

export const checkOwnerPost = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError('No post found with that id!', 404));
    }
    if (post.user != req.user.id) {
      return next(
        new AppError('You do not have the permission to update this post!', 404)
      );
    }
    req.post = post;
    next();
  }
);
