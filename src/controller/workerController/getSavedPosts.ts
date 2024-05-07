import { MyRequest } from '../../controller/userController';
import { NextFunction, Response } from 'express';
import { Worker } from '../../models/Worker';
import { WorkerDoc } from '../../models/WorkerDoc';
import catchAsync from '../../utils/catchAsync';
import { Application } from '../../models/Application';
import AppError from '../../utils/appError';

export const getWorkerSavedPostsById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const worker: WorkerDoc = await Worker.findById(req.params.id).populate({
      path: 'savedPosts',
    });

    if (!worker) {
      return next(
        new AppError('there no worker with id ' + req.params.id, 404)
      );
    }

    const data = await Promise.all(
      worker.savedPosts.map(async (post) => {
        const applied = await Application.findOne({
          worker: worker.id,
          post: post._id, // Assuming `savedPosts` contains objects with `_id` properties
        });
        return {
          post,
          application: {
            id: applied ? applied.id : null,
            applied: applied != null,
          },
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
