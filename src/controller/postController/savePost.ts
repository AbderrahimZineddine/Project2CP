import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { Post } from '../../models/Post';
import AppError from '../../utils/appError';
import { WorkerDoc } from '../../models/WorkerDoc';

export const savePost = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError('No post found with id ' + req.params.id, 404));
    }
    const user = req.user as WorkerDoc;

    if (user.savedPosts) {
      if (user.savedPosts.includes(post.id)) {
        user.savedPosts = user.savedPosts.filter((p) => p != post.id);
        user.save({ validateBeforeSave: false });
        res.status(200).json({
          status: 'success',
          message: 'Post unsaved successfully',
        });
      } else {
        user.savedPosts.push(post.id);
        user.save({ validateBeforeSave: false });
        res.status(200).json({
          status: 'success',
          message: 'Post saved successfully',
        });
      }
    } else {
      user.savedPosts = [post.id];
      user.save({ validateBeforeSave: false });
      res.status(200).json({
        status: 'success',
        message: 'Post saved successfully',
      });
    }
  }
);
