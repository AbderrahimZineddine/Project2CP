import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Post, PostDoc } from '../../models/Post';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { getAll } from '../handlerFactory';
import { Application } from '../../models/Application';
import { WorkerDoc } from '../../models/WorkerDoc';
import { Role } from '../../models/UserDoc';
import APIFeatures from '../../utils/APIFeatures';

export const getPostById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError('No post found with this id', 500));
    }

    if (req.user && req.user.currentRole === Role.Worker) {
      const applied = await Application.findOne({
        worker: req.user.id,
        post: post._id, // Assuming `savedPosts` contains objects with `_id` properties
      });
      const isSaved = (req.user as WorkerDoc).savedPosts.includes(post._id);
      res.status(200).json({
        status: 'success',
        post,
        applied: applied != null,
        isSaved,
      });
    } else {
      res.status(200).json({
        status: 'success',
        post,
      });
    }
  }
);

export const getAllPosts = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    let features;
    if (req.query.user) {
      const qUser = req.query.user;
      delete req.query.user;

      features = new APIFeatures(Post.find({ user: qUser}).populate({
        path: 'user',
        select: 'name profilePicture wilaya', // Select specific fields from the user model
      }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    } else {
      features = new APIFeatures(Post.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    }
    const doc = await features.query;

    if (req.user && req.user.currentRole === Role.Worker) {
      console.log('hi');
      const data = await Promise.all(
        doc.map(async (post: PostDoc) => {
          const applied = await Application.findOne({
            worker: req.user.id,
            post: post._id, // Assuming `savedPosts` contains objects with `_id` properties
          });
          const isSaved = (req.user as WorkerDoc).savedPosts.includes(post._id);

          return { post, applied: applied != null, isSaved };
        })
      );
      res.status(200).json({ status: 'success', results: data.length, data });
    } else {
      res
        .status(200)
        .json({ status: 'success', results: doc.length, data: doc });
    }
  }
);

export const getMyPosts = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.query.user = req.user.id;
    next();
  }
);

export const getPostsFromUserById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.query.user = req.params.id;
    next();
  }
);
