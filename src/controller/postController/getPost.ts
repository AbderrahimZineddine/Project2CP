import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Post } from '../../models/Post';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { getAll } from '../handlerFactory';

export const getPostById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError('No post found with this id', 500));
    }

    res.status(200).json({
      status: 'success',
      post,
    });
  }
);

export const getAllPosts = getAll(Post);

export const getMyPosts = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const posts = await Post.find({ user: req.user.id });

    res.status(200).json({
      status: 'success',
      posts,
    });
  }
);
