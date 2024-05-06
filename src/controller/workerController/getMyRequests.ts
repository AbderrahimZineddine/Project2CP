import { MyRequest } from '../../controller/userController';
import { NextFunction, Response, application } from 'express';
import { Worker } from '../../models/Worker';
import { WorkerDoc } from '../../models/WorkerDoc';
import catchAsync from '../../utils/catchAsync';
import { Application } from '../../models/Application';
import AppError from '../../utils/appError';
import { Post } from '../../models/Post';

export const getMyRequests = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const posts = await Post.find({
      selectedWorkers: { $in: [req.user.id] },
    });

    const data = await Promise.all(
      posts.map(async (post) => {
        const applied = await Application.findOne({
          worker: req.user.id,
          post: post._id, // Assuming `savedPosts` contains objects with `_id` properties
        });
        const isSaved = (req.user as WorkerDoc).savedPosts.includes(post._id);

        return {
          post,
          application: {
            id: applied.id,
            applied: applied != null,
          },
          isSaved,
        };
      })
    );

    res.status(200).json({
      status: 'success',
      results: data.length,
      data,
    });
  }
);

export const deleteRequestById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError('No post found with id ' + req.params.id, 404));
    }

    if (post.selectedWorkers.includes(req.user.id)) {
      post.selectedWorkers = post.selectedWorkers.filter(
        (workerId: any) => workerId.toString() !== req.user.id
      );

      await post.save({ validateBeforeSave: false });
    }
    res.status(200).json({
      status: 'success',
      message: 'Request deleted successfully',
    });
  }
);
