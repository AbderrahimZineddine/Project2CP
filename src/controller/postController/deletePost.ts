import uploadController from '../uploadController';
import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Post } from '../../models/Post';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

export const deletePostById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError('No portfolio post found with that id', 404));
    }
    for (const url of post.images) {
      await uploadController.deleteFromCloudinary(url);
    }
    await Post.findByIdAndDelete(post.id);

    res.status(200).json({
      status: 'success',
    });
  }
);
