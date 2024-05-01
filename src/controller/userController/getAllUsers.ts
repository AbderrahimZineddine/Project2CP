import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { User } from '../../models/User';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../handlerFactory';
import { Post } from '../../models/Post';
import { Review } from '../../models/Review';

export const getAllUsers = getAll(User);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    // query = query.find({ _deletedAt: null });
    if (!user) {
      return next(new AppError('no user found with that id', 404));
    }
    const { posts, reviews } = req.query;
    let postsData, reviewsData;
    if (posts) {
      postsData = await Post.find({ user: user.id });
    }
    if (reviews) {
      reviewsData = await Review.find({ user: user.id });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
        postsData,
        reviewsData,
      },
    });
  }
);

export const createUser = createOne(User);

export const updateUser = updateOne(User);

export const deleteUser = deleteOne(User);
